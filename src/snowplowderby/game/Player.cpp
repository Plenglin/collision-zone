#include "Player.hpp"

using namespace snowplowderby;

Player::Player(short id, b2Body* body) : id(id), body(body), user_data{USERDATA_TYPE_PLAYER, this} {
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

bool Player::is_alive() {
    return alive;
}

bool Player::is_boosting() {
    return false;
}

void Player::write_initial_bytes(std::ostream& os) {
    os.write(reinterpret_cast<const char*>(&id), 2);
    os.write(reinterpret_cast<const char*>(&car_class), 1);
    for (int i = 0; i < PLAYER_NAME_LENGTH_LIMIT; i++) {
        os << name[i];
    }
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
    os.write(reinterpret_cast<const char*>(&flags), 2);
}
