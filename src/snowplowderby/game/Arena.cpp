#include "Arena.hpp"

#include <Box2D/Box2D.h>
#include <random>
#include <ctgmath>
#include <mutex>
#include <thread>

#include "Player.hpp"

using namespace snowplowderby::game;


util::Logger Arena::logger = util::get_logger("SPD-Arena");
std::default_random_engine Arena::random;
std::uniform_real_distribution<float> Arena::distribution(0.0, 1.0);
std::uniform_real_distribution<float> Arena::wall_pos_distribution(-50, 50);

class ContactListener : public b2ContactListener {
private:
    Arena* arena;
public:
    ContactListener(Arena* arena) : arena(arena) {}
    
    void BeginContact(b2Contact* contact) {
        auto fixture_a = contact->GetFixtureA();
        auto fixture_b = contact->GetFixtureB();
        auto userdata_a = static_cast<util::UserDataWrapper*>(fixture_a->GetUserData());
        auto userdata_b = static_cast<util::UserDataWrapper*>(fixture_b->GetUserData());

        if (userdata_a == nullptr || userdata_b == nullptr) {
            return;
        }
    }
};

Arena::Arena() : phys_world(b2Vec2_zero) {
    ContactListener* contact_listener = new ContactListener(this);
    phys_world.SetContactListener(contact_listener);

    for (int i = 0; i < 50; i++) {
        create_random_wall();
    }
}

void Arena::create_random_wall() {
    float x = wall_pos_distribution(random);
    float y = wall_pos_distribution(random);
    float w = 3 * distribution(random);
    float h = 5 * distribution(random);
    float a = distribution(random) * M_PI;
    Wall wall = {x, y, w, h, a};

    wall.create_body(&phys_world);
    walls.push_back(wall);
}

PlayerPtr Arena::create_player(char car_class, std::string name) {
    b2BodyDef body_def;
    body_def.position.Set(0.0, 0.0);
    b2Body* body = phys_world.CreateBody(&body_def);

    b2FixtureDef fixture_def;
    b2PolygonShape box;
    box.SetAsBox(1.0, 1.0);
    fixture_def.shape = &box;
    body->CreateFixture(&fixture_def);

    short id = next_player_id++;
    PlayerPtr player(new Player(id, car_class, name, body));
    body->SetUserData(player->get_user_data());

    players[id] = player;
    new_players.push_back(player);

    LOG_INFO(logger) << "Created player with id " << id;
    return player;
}

void Arena::destroy_player(PlayerPtr player) {
    phys_world.DestroyBody(player->get_body());
    players.erase(player->get_id());
}

Arena::~Arena() {
    
}

void Arena::clear_event_buffers() {
    new_players.clear();
}

void Arena::update() {
    LOG_TRACE(logger) << "Updating arena";
    fulfill_requests();
    phys_world.Step(UPDATE_PERIOD / 1000., 6, 2);
}

void Arena::write_initial_bytes(std::ostream& os) {
    unsigned int wall_count = walls.size();
    os.write(reinterpret_cast<const char*>(&wall_count), 2);
    for (auto it = walls.begin(); it != walls.end(); it++) {
        it->write_initial_bytes(os);
    }

    unsigned short player_count = players.size();
    os.write(reinterpret_cast<const char*>(&player_count), 2);
    for (auto it = players.begin(); it != players.end(); it++) {
        it->second->write_initial_bytes(os);
    }
}

void Arena::write_update_bytes(std::ostream& os) {
    unsigned short new_player_count = new_players.size();
    os.write(reinterpret_cast<const char*>(&new_player_count), 2);
    for (auto it = new_players.begin(); it != new_players.end(); it++) {
        (*it)->write_initial_bytes(os);
    }

    unsigned short player_count = players.size();
    os.write(reinterpret_cast<const char*>(&player_count), 2);
    for (auto it = players.begin(); it != players.end(); it++) {
        it->second->write_update_bytes(os);
    }
}

void Arena::submit_request(request::Request* request) {
    LOG_DEBUG(logger) << "Received request " << request << " from thread " << std::this_thread::get_id();
    std::lock_guard <std::mutex> lock(requests_mutex);
    requests.push(request);
}

void Arena::fulfill_requests() {
    std::lock_guard<std::mutex> lock(requests_mutex);
    while (requests.size() > 0) {
        auto request = requests.front();
        LOG_DEBUG(logger) << "Fulfilling request " << request;
        requests.pop();
        request->fulfill(this);
        delete request;
    }
}

std::vector<PlayerPtr> Arena::get_new_players() {
    return new_players;
}
