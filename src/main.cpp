#include "snowplowderby/server/Server.hpp"
#include "snowplowderby/websocket/WebSocketClientSource.hpp"
#include "util/log.hpp"

using namespace snowplowderby::server;
using namespace snowplowderby::websocket;

int main() {
    util::initialize_logging();
    Server server;
    server.add_client_source(ClientSourcePtr(new WebSocketClientSource(42069)));
    server.run();
    return 0;
}
