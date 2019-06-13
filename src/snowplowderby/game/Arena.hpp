#pragma once

#include <Box2D/Box2D.h>
#include <Box2D/Common/b2Math.h>
#include <list>
#include <ostream>
#include <random>
#include <unordered_map>

#include "Player.hpp"
#include "Wall.hpp"
#include "util/log.hpp"

#define UPDATE_PERIOD 50  // Milliseconds

namespace snowplowderby::game {

    class Arena {
        private:
            static std::default_random_engine random;
            static std::uniform_real_distribution<float> distribution;

            static util::Logger logger;
            b2World phys_world;
            std::unordered_map<short, PlayerPtr> players;
            std::list<PlayerPtr> new_players;
            std::list<Wall> walls;
            short next_player_id = 0;
        public:
            Arena();
            ~Arena();

            void create_random_wall();

            PlayerPtr create_player();
            void destroy_player(PlayerPtr player);

            void update();

            void write_initial_bytes(std::ostream& os);
            void write_update_bytes(std::ostream& os);
    };

    typedef std::shared_ptr<Arena> ArenaPtr;
}
