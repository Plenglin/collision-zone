#pragma once

#include <memory>
#include <mutex>
#include <queue>
#include <thread>
#include <string>
#include <vector>

#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>

#include "WebSocketClient.hpp"
#include "snowplowderby/client/ClientSource.hpp"
#include "util/log.hpp"

using namespace websocketpp;
using namespace snowplowderby::client;
typedef websocketpp::server<websocketpp::config::asio> WSPPServer;

namespace snowplowderby::websocket {
    
    class WebSocketClient;

    struct CreatePlayerRequest {
        WebSocketClient* requestor;
        std::string name;
        char player_class;
    };

    class WebSocketClientSource : public ClientSource {
    private:
        static util::Logger logger;
        WSPPServer server;
        int port;
        std::vector<std::shared_ptr<WebSocketClient>> clients;
        std::thread* websocket_thread;

        std::mutex create_player_requests_mutex;
        std::queue<CreatePlayerRequest> create_player_requests;

        void set_up_handlers();
        void fulfill_player_create_requests();
    public:
        WebSocketClientSource(int port);
        ~WebSocketClientSource();

        std::string get_name() override;
        void initialize() override;
        void update() override;

        void request_create_player(CreatePlayerRequest request);
    };

}
