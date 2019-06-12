#pragma once

#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>
#include <vector>
#include <memory>

#include "WebSocketClient.hpp"
#include "snowplowderby/client/ClientSource.hpp"
#include "util/log.hpp"

using namespace websocketpp;
typedef websocketpp::server<websocketpp::config::asio> WSPPServer;

namespace snowplowderby::websocket {
    class WebSocketClientSource : public snowplowderby::client::ClientSource {
    private:
        static util::Logger logger;
        WSPPServer server;
        int port;
        std::vector<std::shared_ptr<WebSocketClient>> clients;

        void set_up_handlers();
    public:
        WebSocketClientSource(int port);
        ~WebSocketClientSource();

        void begin();
        void update() override;
    };

}
