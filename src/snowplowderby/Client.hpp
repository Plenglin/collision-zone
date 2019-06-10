#pragma once

#include "Player.hpp"


namespace snowplowderby {

    class Client {
    private:
        Player* player;
    public:
        Client(/* args */);
        ~Client();

        void setPlayer(Player* player);
    };

}