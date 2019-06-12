#include "Server.hpp"
#include <chrono>

using namespace snowplowderby::server;

Server::Server() : arena(new Arena()) {
}

Server::~Server() {
}

void Server::run() {
    using namespace std::chrono;
    auto last_update = system_clock::now();
    while (true) {
        auto current_time = system_clock::now();
        arena->update();
        for (auto it = client_sources.begin(); it != client_sources.end(); it++) {
            (*it)->update();
        }
        std::this_thread::sleep_until(current_time + milliseconds(UPDATE_PERIOD));
    }
}

void Server::add_client_source(ClientSourcePtr client_source) {
    client_source->set_arena(arena);
    client_sources.push_back(client_source);
}
