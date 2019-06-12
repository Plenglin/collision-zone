#include "snowplowderby/websocket/WebSocketClientSource.hpp"
#include "util/log.hpp"

using namespace snowplowderby::websocket;

int main() {
    util::initialize_logging();
    WebSocketClientSource wscc(42069);
    wscc.begin();
    return 0;
}
