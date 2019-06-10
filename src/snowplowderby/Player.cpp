#include "Player.hpp"

using namespace snowplowderby;

Player::Player(b2Body* body) : body(body), user_data{USERDATA_TYPE_PLAYER, this} {
}

inline util::UserDataWrapper* Player::get_user_data() {
    return &user_data;
}

