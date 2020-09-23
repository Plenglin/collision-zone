#pragma once

#include "game/Arena.hpp"
#include "game/Player.hpp"
#include "common/log.hpp"
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
        ClientState state;
    protected:
        ArenaPtr arena;
        PlayerPtr player;
        std::mutex input_queue_lock;
        std::queue<void*> input_queue;

        virtual void set_state(ClientState state);
    public:
        Client(ArenaPtr arena);
        ~Client();

        ClientState get_state();
        void attach(ArenaPtr arena);
        void attach(PlayerPtr player);
    };

    typedef std::shared_ptr<Client> ClientPtr;

}