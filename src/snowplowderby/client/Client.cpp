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
    LOG_INFO(logger) << "Setting to state " << state;
    return state;
}

void Client::set_state(ClientState state) {
    this->state = state;
}
