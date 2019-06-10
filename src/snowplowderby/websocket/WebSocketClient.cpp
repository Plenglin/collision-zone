#include "WebSocketClient.hpp"

using namespace websocketpp;
using namespace snowplowderby::websocket;


util::Logger WebSocketClient::logger = util::get_logger("WSP-WebSocketClient");

WebSocketClient::WebSocketClient(std::shared_ptr<WSPPConnection> connection) : connection(connection) {
    connection->set_message_handler([this](connection_hdl handle, WSPPConnection::message_ptr message) {
        auto handle_raw = handle.lock().get();
        auto payload = message->get_payload();
        LOG_TRACE(logger) << "Received message from " << handle_raw << ": " << payload;
    });
}

WebSocketClient::~WebSocketClient() {
    
}

void WebSocketClient::send_periodic_update() {
    //message_buffer::
    //connection->send()
}
