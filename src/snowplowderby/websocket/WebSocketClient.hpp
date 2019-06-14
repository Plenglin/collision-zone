#pragma once

#include <websocketpp/config/asio_no_tls.hpp>

#include <rapidjson/document.h>
#include <rapidjson/rapidjson.h>
#include <websocketpp/connection.hpp>
#include <websocketpp/server.hpp>

#include "snowplowderby/client/Client.hpp"
#include "snowplowderby/game/Player.hpp"
#include "util/log.hpp"
#include "WebSocketClientSource.hpp"

using namespace snowplowderby::game;
using namespace snowplowderby::client;
using namespace websocketpp;


namespace snowplowderby::websocket {
    using WSPPConnection = websocketpp::connection<websocketpp::config::asio>;
    
    class WebSocketClientSource;

    class WebSocketClient : public Client {
    private:
        static util::Logger logger;
        std::shared_ptr<WSPPConnection> connection;

        WebSocketClientSource* parent;
        void handle_message_spectating(connection_hdl handle, WSPPConnection::message_ptr message);
        void read_transition_request(const char* string);
    protected:
        void set_state(ClientState state);
    public:
        WebSocketClient(WebSocketClientSource* parent, std::shared_ptr<WSPPConnection> connection);
        ~WebSocketClient();
        
        void send_binary_unreliable(std::string data);
        void send_binary_reliable(std::string data);

        void on_player_created(PlayerPtr player);
    };

}
