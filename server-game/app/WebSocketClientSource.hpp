#pragma once

#include <memory>
#include <queue>
#include <thread>
#include <string>
#include <vector>

#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>

#include "WebSocketClient.hpp"
#include "ClientSource.hpp"
#include "common/log.hpp"

using namespace websocketpp;
using namespace snowplowderby::client;
typedef websocketpp::server<websocketpp::config::asio> WSPPServer;

namespace snowplowderby::websocket {
    
    class WebSocketClient;

    class WebSocketClientSource : public ClientSource {
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
