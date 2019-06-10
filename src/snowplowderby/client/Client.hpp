#pragma once

#include "snowplowderby/Arena.hpp"
#include "snowplowderby/Player.hpp"
#include "util/log.hpp"
#include <mutex>
#include <queue>

namespace snowplowderby::client {

    using namespace snowplowderby;

    class Client {
    private:
        static util::Logger logger;
    protected:
        Arena* arena = nullptr;
        Player* player = nullptr;
        std::mutex input_queue_lock;
        std::queue<void*> input_queue;
    public:
        Client();
        ~Client();

        void attach(Arena* arena, Player* player);
        virtual void send_periodic_update() = 0;
    };

}