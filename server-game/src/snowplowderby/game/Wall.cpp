#include "Wall.hpp"


using namespace snowplowderby::game;

b2Body* Wall::create_body(b2World* world) {
    b2BodyDef body_def;
    body_def.position.Set(x, y);
    body_def.angle = angle;
    body_def.type = b2_staticBody;
    b2Body* body = world->CreateBody(&body_def);

    b2FixtureDef fixture_def;
    b2PolygonShape box;
    box.SetAsBox(width / 2, height / 2);
    
    fixture_def.shape = &box;
    body->CreateFixture(&fixture_def);

    return body;
}

void Wall::write_initial_bytes(std::ostream& os) {
    os.write(reinterpret_cast<const char*>(&x), 4);
    os.write(reinterpret_cast<const char*>(&y), 4);
    os.write(reinterpret_cast<const char*>(&width), 4);
    os.write(reinterpret_cast<const char*>(&height), 4);
    os.write(reinterpret_cast<const char*>(&angle), 4);
}
