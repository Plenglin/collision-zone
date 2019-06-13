#include "ClientSource.hpp"

using namespace snowplowderby::game;
using namespace snowplowderby::client;

ClientSource::ClientSource() {
}

void ClientSource::set_arena(ArenaPtr arena) {
    this->arena = arena;
}
