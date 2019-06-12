#pragma once

#include <Box2D/Box2D.h>
#include "util/physics.hpp"
#include <list>
#include <memory>
#include <ostream>

#include "snowplowderby/io/s2c.hpp"

#define USERDATA_TYPE_PLAYER 13498931

namespace snowplowderby {

    class Player {
    private:
        const short id;
        b2Body* body;

        bool alive = true;

        util::UserDataWrapper user_data;
        std::string name;
    public:
        Player(short id, b2Body* body);

        short get_id();
        bool is_alive();
        bool is_boosting();

        util::UserDataWrapper* get_user_data();

        void write_update_bytes(std::ostream& os);

        template <typename Writer>
        void serialize_initial(Writer& writer) const {
            writer.StartObject();

            writer.String("id");
            writer.Int(id);

            writer.String("name");
            writer.String(name);

            writer.EndObject();
        }
    };

    typedef std::shared_ptr<Player> PlayerPtr;
}
