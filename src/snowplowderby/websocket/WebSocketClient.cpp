#include "WebSocketClient.hpp"
#include <rapidjson/document.h>
#include <rapidjson/rapidjson.h>

#include <string>
#include "util/log.hpp"


using namespace websocketpp;
using namespace snowplowderby::websocket;
using namespace snowplowderby::client;


util::Logger WebSocketClient::logger = util::get_logger("WSP-WebSocketClient");

WebSocketClient::WebSocketClient(WebSocketClientSource* parent, std::shared_ptr<WSPPConnection> connection) : parent(parent), connection(connection) {
    set_state(ClientState::SPECTATING);
    connection->set_message_handler([this](connection_hdl handle, WSPPConnection::message_ptr message) {
        auto handle_raw = handle.lock().get();
        auto payload = message->get_payload();
        LOG_TRACE(logger) << "Received message from " << handle_raw << ": " << payload;

        std::stringstream stream(payload);
        char type;
        stream >> type;

        if (type == 'r') {
            char cmd_type;
            stream >> cmd_type;
            if (cmd_type == 't') {
                try {
                    read_transition_request(payload.c_str() + 2);
                } catch (...) {
                    LOG_ERROR(logger) << "Error in reading transition request";
                }
                return;
            }
        }
    });

    //connection->send()
}

WebSocketClient::~WebSocketClient() {
    
}

void WebSocketClient::read_transition_request(const char* string) {
    LOG_DEBUG(logger) << "Parsing transition request: " << string;
    rapidjson::Document doc;
    doc.Parse(string);

    std::stringstream ss;
    char error[] = {0x01, 1, 0, 0};
    ss.write(error, 4);
    if (!doc.IsObject()) {
        LOG_ERROR(logger) << "Received malformed transition request: it's not an object! " << string;
        send_binary_reliable(ss.str());
        return;
    }
    if (!doc.HasMember("username") || !doc.HasMember("player_class")) {
        LOG_ERROR(logger) << "Received malformed transition request: missing fields! " << string;
        send_binary_reliable(ss.str());
        return;
    }
    const rapidjson::Value& name_field = doc["username"];
    if (!name_field.IsString()) {
        LOG_ERROR(logger) << "Received non-object transition request: \"name_field\" is not a string!" << string;
        send_binary_reliable(ss.str());
        return;
    }
    const rapidjson::Value& player_class_field = doc["player_class"];
    if (!player_class_field.IsInt()) {
        LOG_ERROR(logger) << "Received non-object transition request: \"player_class\" is not a integer!" << string;
        send_binary_reliable(ss.str());
        return;
    }

    std::string name(name_field.GetString());
    char player_class = player_class_field.GetInt();
    LOG_INFO(logger) << "Requesting to create player with name " << name;
    parent->request_create_player({this, name, player_class});
}

void WebSocketClient::send_binary_unreliable(std::string data) {
    connection->send("u" + data, frame::opcode::binary);
}

void WebSocketClient::send_binary_reliable(std::string data) {
    connection->send("r" + data, frame::opcode::binary);
}

void WebSocketClient::on_player_created(PlayerPtr player) {
    unsigned short id = player->get_id();
    LOG_INFO(logger) << "Received player " << id;
    this->player = player;
    set_state(ClientState::PLAYING);

    std::stringstream ss;
    char msg[] = {0x01, 0, (char)id, (char)(id >> 8)};
    std::string data(msg);
    ss.write(msg, 4);

    send_binary_reliable(ss.str());
}
