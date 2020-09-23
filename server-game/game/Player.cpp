#include "Player.hpp"

#include "util.hpp"

using namespace snowplowderby::game;

Player::Player(short id, char car_class, std::string name, b2Body* body) : id(id), car_class(car_class), name(name), body(body), user_data{USERDATA_TYPE_PLAYER, this} {
}

util::UserDataWrapper* Player::get_user_data() {
    return &user_data;
}

char Player::get_car_class() {
    return car_class;
}

short Player::get_id() {
    return id;
}

b2Body* Player::get_body() {
    return body;
}

bool Player::is_alive() {
    return alive;
}

bool Player::is_boosting() {
    return false;
}

void Player::write_creation_event(std::ostream& os) {
    char event_type = 32;
    os.write(&event_type, 2);
    write_initial_bytes(os);
}

void Player::write_initial_bytes(std::ostream& os) {
    write_update_bytes(os);

    os.write(reinterpret_cast<const char*>(&id), 2);
    os.write(&car_class, 1);
    os << name;
    os.write(&util::terminator, 1);
}

void Player::write_update_bytes(std::ostream& os) {
    auto pos = body->GetPosition();
    auto vel = body->GetLinearVelocity();
    auto angle = body->GetAngle();
    char flags = 0;
    if (is_alive()) {
        flags |= PLAYER_ALIVE_FLAG;
    }
    if (is_boosting()) {
        flags |= PLAYER_BOOSTING_FLAG;
    }
    os.write(reinterpret_cast<const char*>(&id), 2);
    os.write(reinterpret_cast<const char*>(&pos.x), 4);
    os.write(reinterpret_cast<const char*>(&pos.y), 4);
    os.write(reinterpret_cast<const char*>(&angle), 4);
    os.write(reinterpret_cast<const char*>(&vel.x), 2);
    os.write(reinterpret_cast<const char*>(&vel.y), 2);
    os.write(&flags, 2);
}
