#pragma once

#include <websocketpp/config/asio_no_tls.hpp>

#include <websocketpp/connection.hpp>
#include <websocketpp/server.hpp>
#include "snowplowderby/client/Client.hpp"
#include "util/log.hpp"

using namespace snowplowderby::client;
using namespace websocketpp;


namespace snowplowderby::websocket {
    using WSPPConnection = websocketpp::connection<websocketpp::config::asio>;
    
    class WebSocketClient : public Client {
    private:
        static util::Logger logger;
        std::shared_ptr<WSPPConnection> connection;
    public:
        WebSocketClient(std::shared_ptr<WSPPConnection> connection);
        ~WebSocketClient();
        void send_periodic_update() override;
    };

}
