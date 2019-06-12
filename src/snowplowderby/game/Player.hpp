#pragma once

#include <Box2D/Box2D.h>
#include "util/physics.hpp"
#include <list>
#include <memory>
#include <ostream>

#include "snowplowderby/io/s2c.hpp"

#define USERDATA_TYPE_PLAYER 13498931
#define PLAYER_NAME_LENGTH_LIMIT 20

namespace snowplowderby {

    class Player {
    private:
        const short id;
        const char car_class = 0;
        b2Body* body;

        bool alive = true;

        util::UserDataWrapper user_data;
        char name[PLAYER_NAME_LENGTH_LIMIT] = {0};
    public:
        Player(short id, b2Body* body);

        short get_id();
        char get_car_class();
        bool is_alive();
        bool is_boosting();

        util::UserDataWrapper* get_user_data();

        void write_update_bytes(std::ostream& os);
        void write_initial_bytes(std::ostream& os);

    };

    typedef std::shared_ptr<Player> PlayerPtr;
}
