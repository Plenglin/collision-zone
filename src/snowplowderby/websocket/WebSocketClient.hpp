#pragma once

#include <websocketpp/config/asio_no_tls.hpp>

#include <rapidjson/document.h>
#include <rapidjson/rapidjson.h>
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

        void read_transition_request(const char* string);

       public:
        WebSocketClient(std::shared_ptr<WSPPConnection> connection);
        ~WebSocketClient();
        void send_binary_unreliable(std::string data);
        void send_binary_reliable(std::string data);
    };

}
