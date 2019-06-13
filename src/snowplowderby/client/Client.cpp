#include "Client.hpp"


using namespace snowplowderby::game;
using namespace snowplowderby::client;
using namespace boost::log::trivial;

util::Logger Client::logger = util::get_logger("Client");

Client::Client() : state(UNINITIALIZED) {
}

Client::~Client() {
}

void Client::attach(ArenaPtr arena) {
    this->arena = arena;
}

void Client::attach(PlayerPtr player) {
    this->player = player;
}

ClientState Client::get_state() {
    return state;
}
