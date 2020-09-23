#pragma once

#include <memory>
#include <thread>
#include <list>

#include "Client.hpp"
#include "ClientSource.hpp"
#include "game/Arena.hpp"

#include "common/log.hpp"


using namespace snowplowderby;
using namespace snowplowderby::client;

namespace snowplowderby::server {
    class Server {
    private:
        static util::Logger logger;
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


