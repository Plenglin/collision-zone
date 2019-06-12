#pragma once

#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>
#include <vector>
#include <memory>
#include <thread>

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
        std::thread* websocket_thread;

        void set_up_handlers();
    public:
        WebSocketClientSource(int port);
        ~WebSocketClientSource();

        std::string get_name() override;
        void initialize() override;
        void update() override;
    };

}
