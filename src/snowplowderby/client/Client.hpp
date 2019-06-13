#pragma once

#include "snowplowderby/game/Arena.hpp"
#include "snowplowderby/game/Player.hpp"
#include "util/log.hpp"
#include <mutex>
#include <queue>
#include <memory>

using namespace snowplowderby;
using namespace snowplowderby::game;

namespace snowplowderby::client {

    enum ClientState {
        UNINITIALIZED, SPECTATING, PLAYING
    };

    class Client {
    private:
        static util::Logger logger;
    protected:
        ArenaPtr arena;
        PlayerPtr player;
        std::mutex input_queue_lock;
        std::queue<void*> input_queue;
        ClientState state;
    public:
        Client();
        ~Client();

        ClientState get_state();
        void attach(ArenaPtr arena);
        void attach(PlayerPtr player);
    };

    typedef std::shared_ptr<Client> ClientPtr;

}