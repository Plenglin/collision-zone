#include "Player.hpp"

using namespace snowplowderby;

Player::Player(short id, b2Body* body) : id(id), body(body), user_data{USERDATA_TYPE_PLAYER, this} {
}

util::UserDataWrapper* Player::get_user_data() {
    return &user_data;
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

io::s2c::Player Player::serialize() {
    auto pos = body->GetPosition();
    char flags = 0;
    if (is_alive()) {
        flags |= PLAYER_ALIVE_FLAG;
    }
    if (is_boosting()) {
        flags |= PLAYER_BOOSTING_FLAG;
    }
    return io::s2c::Player{
        get_id(),
        pos.x,
        pos.y,
        body->GetAngle(),
        flags
    };
}
