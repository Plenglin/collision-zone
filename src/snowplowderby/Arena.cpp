#include "Arena.hpp"
#include <Box2D/Box2D.h>

using namespace snowplowderby;

Arena::Arena() : phys_world(b2Vec2_zero) {
}

Player* Arena::create_player() {
    b2BodyDef body_def;
    body_def.position.Set(0.0, 0.0);
    b2Body* body = phys_world.CreateBody(&body_def);

    b2FixtureDef fixture_def;
    b2PolygonShape box;
    box.SetAsBox(1.0, 1.0);
    fixture_def.shape = &box;
    body->CreateFixture(&fixture_def);

    Player* player = new Player(body);

    players.push_back(player);

    return player;
}

Arena::~Arena() {
    for (auto it = players.begin(); it != players.end(); it++) {
        delete *it;
    }
}

void Arena::update() {
    phys_world.Step(TIME_STEP, 6, 2);
}
