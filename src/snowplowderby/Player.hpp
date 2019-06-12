#pragma once

#include <Box2D/Box2D.h>
#include "util/physics.hpp"
#include <list>

#include "snowplowderby/io/s2c.hpp"

#define USERDATA_TYPE_PLAYER 13498931

namespace snowplowderby {

    class Player {
    private:
        const short id;
        b2Body* body;

        bool alive = true;

        util::UserDataWrapper user_data;
    public:
        Player(short id, b2Body* body);

        short get_id();
        bool is_alive();
        bool is_boosting();

        util::UserDataWrapper* get_user_data();
        io::s2c::Player serialize();
    };

}
