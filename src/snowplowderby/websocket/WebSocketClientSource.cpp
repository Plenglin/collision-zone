#include "WebSocketClientSource.hpp"

#include <websocketpp/connection.hpp>
#include <memory>


using namespace websocketpp;
using namespace snowplowderby::websocket;
using websocketpp::lib::bind;

util::Logger WebSocketClientSource::logger = util::get_logger("SPD-WebSocketClientSource");

WebSocketClientSource::WebSocketClientSource(int port) : port(port) {
    
}

WebSocketClientSource::~WebSocketClientSource() {

}

void WebSocketClientSource::begin() {
    LOG_INFO(logger) << "Beginning";
    server.init_asio();
    set_up_handlers();
    server.listen(port);
    server.start_accept();
    server.run();
}

void WebSocketClientSource::set_up_handlers() {
    server.set_open_handler([this](connection_hdl handle) {
        LOG_INFO(logger) << "A new connection was made with handle: " << handle.lock().get();
        auto conn = server.get_con_from_hdl(handle);
        std::shared_ptr<WebSocketClient> client(new WebSocketClient(conn));
        clients.push_back(client);
    });
}

void WebSocketClientSource::update() {
    
}
