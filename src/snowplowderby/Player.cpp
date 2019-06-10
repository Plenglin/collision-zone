#include "Player.hpp"

using namespace snowplowderby;

Player::Player(long id, b2Body* body) : id(id), body(body), user_data{USERDATA_TYPE_PLAYER, this} {
}

util::UserDataWrapper* Player::get_user_data() {
    return &user_data;
}

long Player::get_id() {
    return id;
}

bool Player::is_alive() {
    return alive;
}
