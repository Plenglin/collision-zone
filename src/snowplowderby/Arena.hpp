#pragma once

#include <Box2D/Box2D.h>
#include <Box2D/Common/b2Math.h>
#include <unordered_map>
#include <ostream>

#include "Player.hpp"
#include "util/log.hpp"

#define TIME_STEP 0.05

namespace snowplowderby {

    class Arena {
        private:
            static util::Logger logger;
            b2World phys_world;
            std::unordered_map<short, Player*> players;
            //std::vector
            short next_player_id = 0;
        public:
            Arena();
            ~Arena();

            Player* create_player();
            void destroy_player(Player* player);

            void update();

            template <typename Writer>
            void serialize_initial(Writer& writer) const {
                writer.StartObject();

                writer.String("players");
                for (auto it = players.begin(); it != players.end(); it++) {
                    it->second->serialize_initial(writer);
                }
                writer.EndObject();
            }

            void write_update_bytes(std::ostream& os);
    };

    typedef std::shared_ptr<Arena> ArenaPtr;
}
