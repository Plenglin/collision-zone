#include "Arena.hpp"
#include <Box2D/Box2D.h>

using namespace snowplowderby;

Arena::Arena() : physWorld(b2Vec2_zero) {
}

Player* Arena::createPlayer() {
    b2BodyDef bodyDef;
    bodyDef.position.Set(0.0, 0.0);
    b2Body* body = physWorld.CreateBody(&bodyDef);

    b2FixtureDef fixtureDef;
    b2PolygonShape box;
    box.SetAsBox(1.0, 1.0);
    fixtureDef.shape = &box;
    body->CreateFixture(&fixtureDef);

    Player* player = new Player(body);

    players.push_back(player);

    return player;
}

Arena::~Arena() {
    for (auto it = players.begin(); it != players.end(); it++) {
        delete *it;
    }
}
