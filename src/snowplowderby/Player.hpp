#pragma once

#include <Box2D/Box2D.h>
#include "util/physics.hpp"

#define USERDATA_TYPE_PLAYER 13498931

namespace snowplowderby {

    class Player {
    private:
        b2Body* body;
        util::UserDataWrapper user_data;
    public:
        Player(b2Body* body);
        inline util::UserDataWrapper* get_user_data();
    };

}
