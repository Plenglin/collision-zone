#include "Arena.hpp"

#include <Box2D/Box2D.h>

#include "Player.hpp"

using namespace snowplowderby;


util::Logger Arena::logger = util::get_logger("SPD-Arena");

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
}

PlayerPtr Arena::create_player() {
    LOG_INFO(logger) << "Creating player";

    b2BodyDef body_def;
    body_def.position.Set(0.0, 0.0);
    b2Body* body = phys_world.CreateBody(&body_def);

    b2FixtureDef fixture_def;
    b2PolygonShape box;
    box.SetAsBox(1.0, 1.0);
    fixture_def.shape = &box;
    body->CreateFixture(&fixture_def);

    PlayerPtr player(new Player(next_player_id++, body));
    body->SetUserData(player->get_user_data());

    players[player->get_id()] = player;

    return player;
}

void Arena::destroy_player(PlayerPtr player) {

}

Arena::~Arena() {
    
}

void Arena::update() {
    LOG_TRACE(logger) << "Updating arena";
    phys_world.Step(UPDATE_PERIOD / 1000., 6, 2);
}

void Arena::write_initial_bytes(std::ostream& os) {
    
}

void Arena::write_update_bytes(std::ostream& os) {
    unsigned short new_player_count = new_players.size();
    for (auto it = new_players.begin(); it != new_players.end(); it++) {
        (*it)->write_initial_bytes(os);
    }

    unsigned short player_count = players.size();
    os << player_count;
    for (auto it = players.begin(); it != players.end(); it++) {
        it->second->write_update_bytes(os);
    }
}
