#include "WebSocketClientSource.hpp"

#include <websocketpp/connection.hpp>
#include <memory>

#include "snowplowderby/constants.hpp"
#include "snowplowderby/game/Arena.hpp"
#include "util/util.hpp"


using namespace websocketpp;
using namespace snowplowderby::websocket;
using websocketpp::lib::bind;

util::Logger WebSocketClientSource::logger = util::get_logger("SPD-WebSocketClientSource");

WebSocketClientSource::WebSocketClientSource(int port) : port(port), websocket_thread(nullptr) {
    
}

WebSocketClientSource::~WebSocketClientSource() {
    delete websocket_thread;
}

void WebSocketClientSource::initialize() {
    LOG_INFO(logger) << "Initializing websocket server";
    server.init_asio();
    set_up_handlers();
    server.listen(port);
    server.clear_access_channels(websocketpp::log::alevel::frame_header | websocketpp::log::alevel::frame_payload);
    server.start_accept();
    websocket_thread = new std::thread([this](){
        LOG_INFO(logger) << "Websocket thread started";
        server.run();
    });
}

void WebSocketClientSource::set_up_handlers() {
    LOG_DEBUG(logger) << "Setting up handlers";
    server.set_open_handler([this](connection_hdl handle) {
        LOG_INFO(logger) << "A new connection was made with handle: " << handle.lock().get();
        auto conn = server.get_con_from_hdl(handle);
        std::shared_ptr<WebSocketClient> client(new WebSocketClient(arena, this, conn));
        clients.push_back(client);

        std::stringstream initial_payload;
        initial_payload << SERVER_VERSION;
        initial_payload.write(&util::terminator, 1);
        arena->write_initial_bytes(initial_payload);
        client->send_binary_reliable(initial_payload.str());
    });
}

void WebSocketClientSource::update() {  
    LOG_TRACE(logger) << "Sending update packets to clients";

    // Send new player events if necessary
    auto new_players = arena->get_new_players();
    const unsigned short new_player_count = new_players.size();
    if (new_player_count > 0) {
        std::stringstream new_players_payload;
        const char buffer[] = {EVENT_CODE_PLAYER_JOIN, (char) new_player_count, (char) (new_player_count >> 8)};

        new_players_payload.write(buffer, 3);
        for (auto it = new_players.begin(); it != new_players.end(); it++) {
            (*it)->write_initial_bytes(new_players_payload);
        }
        for (auto it = clients.begin(); it != clients.end(); it++) {
            (*it)->send_binary_reliable(new_players_payload.str());
        }
    }

    // Send the standard update payload
    std::stringstream update_payload;
    arena->write_update_bytes(update_payload);
    for (auto it = clients.begin(); it != clients.end(); it++) {
        (*it)->send_binary_unreliable(update_payload.str());
    }
}

std::string WebSocketClientSource::get_name() {
    return "WebSocket";
}
