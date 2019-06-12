#pragma once

#include <memory>
#include <thread>
#include <list>

#include "snowplowderby/client/Client.hpp"
#include "snowplowderby/client/ClientSource.hpp"
#include "snowplowderby/game/Arena.hpp"

using namespace snowplowderby;
using namespace snowplowderby::client;

namespace snowplowderby::server {
    class Server {
    private:
        ArenaPtr arena;
        std::list<ClientSourcePtr> client_sources;
        std::list<ClientPtr> clients;
    public:
        Server();
        ~Server();
        void add_client_source(ClientSourcePtr client_source);
        void run();
    };
}


