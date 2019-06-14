#include "WebSocketClient.hpp"
#include <rapidjson/document.h>
#include <rapidjson/rapidjson.h>

#include <string>
#include "util/log.hpp"


using namespace websocketpp;
using namespace snowplowderby::websocket;


util::Logger WebSocketClient::logger = util::get_logger("WSP-WebSocketClient");

WebSocketClient::WebSocketClient(std::shared_ptr<WSPPConnection> connection) : connection(connection) {
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
    char error[] = {'r', 0x01, 1, 0};
    if (!doc.IsObject()) {
        LOG_ERROR(logger) << "Received malformed transition request: it's not an object! " << string;
        send_binary_reliable(error);
        return;
    }
    if (!doc.HasMember("username") || !doc.HasMember("player_class")) {
        LOG_ERROR(logger) << "Received malformed transition request: missing fields! " << string;
        send_binary_reliable(error);
        return;
    }
    const rapidjson::Value& name_field = doc["username"];
    if (!name_field.IsString()) {
        LOG_ERROR(logger) << "Received non-object transition request: \"name_field\" is not a string!" << string;
        send_binary_reliable(error);
        return;
    }
    const rapidjson::Value& player_class_field = doc["player_class"];
    if (!player_class_field.IsInt()) {
        LOG_ERROR(logger) << "Received non-object transition request: \"player_class\" is not a integer!" << string;
        send_binary_reliable(error);
        return;
    }

    std::string name(name_field.GetString());
    char player_class = player_class_field.GetInt();

    player = arena->create_player(player_class, name);

    LOG_INFO(logger) << "Successfully created player " << player->get_id() << " with name " << name;
}

void WebSocketClient::send_binary_unreliable(std::string data) {
    connection->send("u" + data, frame::opcode::binary);
}

void WebSocketClient::send_binary_reliable(std::string data) {
    connection->send("r" + data, frame::opcode::binary);
}
