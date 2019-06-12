#pragma once

#include "snowplowderby/Arena.hpp"
#include "snowplowderby/Player.hpp"
#include "util/log.hpp"
#include <mutex>
#include <queue>

namespace snowplowderby::client {

    using namespace snowplowderby;

    enum ClientState {
        UNINITIALIZED, SPECTATING, PLAYING
    };

    class Client {
    private:
        static util::Logger logger;
    protected:
        ArenaPtr arena;
        Player* player;
        std::mutex input_queue_lock;
        std::queue<void*> input_queue;
        ClientState state;
    public:
        Client();
        ~Client();

        ClientState get_state();
        void attach(ArenaPtr arena, Player* player);
        virtual void send_periodic_update() = 0;
    };

}