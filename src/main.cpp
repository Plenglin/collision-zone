#include <cstdlib>
#include <exception>
#include "snowplowderby/server/Server.hpp"
#include "snowplowderby/websocket/WebSocketClientSource.hpp"
#include "util/log.hpp"

using namespace snowplowderby::server;
using namespace snowplowderby::websocket;

void terminate_handler() {
    std::cerr << "terminate due to error" << std::endl;
    std::abort();
}

int main() {
    std::set_terminate(terminate_handler);

    util::initialize_logging();
    Server server;
    server.add_client_source(ClientSourcePtr(new WebSocketClientSource(42069)));
    server.run();
    return 0;
}
