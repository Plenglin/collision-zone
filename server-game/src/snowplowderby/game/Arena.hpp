#pragma once

#include <Box2D/Box2D.h>
#include <Box2D/Common/b2Math.h>
#include <vector>
#include <queue>
#include <mutex>
#include <ostream>
#include <random>
#include <unordered_map>

#include "Player.hpp"
#include "Wall.hpp"
#include "Request.hpp"
#include "util/log.hpp"

#define UPDATE_PERIOD 50  // Milliseconds

namespace snowplowderby::game {

    namespace request {
        class Request;
    }

    class Arena {
        private:
            static std::default_random_engine random;
            static std::uniform_real_distribution<float> distribution;
            static std::uniform_real_distribution<float> wall_pos_distribution;

            static util::Logger logger;
            b2World phys_world;
            std::unordered_map<short, PlayerPtr> players;
            std::vector<PlayerPtr> new_players;
            std::vector<Wall> walls;
            short next_player_id = 0;

            std::mutex requests_mutex;
            std::queue<request::Request*> requests;

            void fulfill_requests();
        public:
            Arena();
            ~Arena();

            void create_random_wall();

            PlayerPtr create_player(char car_class, std::string name);
            void destroy_player(PlayerPtr player);

            void update();

            void write_initial_bytes(std::ostream& os);
            void write_update_bytes(std::ostream& os);
    
            void clear_event_buffers();

            std::vector<PlayerPtr> get_new_players();

            /**
             * Submit a request to this arena. The lifetime of this object is managed by the Arena.
             * The request will be deleted upon fulfillment.
             */
            void submit_request(request::Request* request);
    };

    typedef std::shared_ptr<Arena> ArenaPtr;
}
