#include <cstdlib>
#include <exception>
#include "Server.hpp"
#include "WebSocketClientSource.hpp"
#include "common/log.hpp"

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
