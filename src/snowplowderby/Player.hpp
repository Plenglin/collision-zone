#pragma once

#include <Box2D/Box2D.h>
#include "util/physics.hpp"
#include <list>

#define USERDATA_TYPE_PLAYER 13498931

namespace snowplowderby {

    class Player {
    private:
        const long id;
        b2Body* body;

        bool alive = true;

        util::UserDataWrapper user_data;
    public:
        Player(long id, b2Body* body);
        
        long get_id();
        bool is_alive();

        util::UserDataWrapper* get_user_data();
    };

}
