#include "WebSocketClientSource.hpp"

#include <websocketpp/connection.hpp>
#include <memory>


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
        std::shared_ptr<WebSocketClient> client(new WebSocketClient(conn));
        clients.push_back(client);
    });
}

void WebSocketClientSource::update() {
    LOG_TRACE(logger) << "Sending update packets to clients";
    std::stringstream serialized;
    arena->write_update_bytes(serialized);
    for (auto it = clients.begin(); it != clients.end(); it++) {
        (*it)->send_binary(serialized.str());
    }
}

std::string WebSocketClientSource::get_name() {
    return "WebSocket";
}
