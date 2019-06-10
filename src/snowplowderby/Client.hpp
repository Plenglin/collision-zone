#pragma once

#include "Arena.hpp"
#include "Player.hpp"
#include "util/log.hpp"


namespace snowplowderby {

    class Client {
    private:
        static util::Logger logger;
        Arena* arena;
        Player* player;
    public:
        Client(/* args */);
        ~Client();

        void attach(Arena* arena, Player* player);
        virtual void sendToClient() = 0;
    };

}