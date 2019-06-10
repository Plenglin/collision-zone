#include "Client.hpp"


using namespace snowplowderby::client;
using namespace boost::log::trivial;

util::Logger Client::logger = util::get_logger("Client");

Client::Client() {
}

Client::~Client() {
}

void Client::attach(Arena* arena, Player* player) {
    this->arena = arena;
    this->player = player;
}
