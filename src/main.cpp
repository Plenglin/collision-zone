#include "snowplowderby/websocket/WebSocketListener.hpp"
#include "util/log.hpp"

using namespace snowplowderby::websocket;

int main() {
    util::initialize_logging();
    WebSocketListener listener(42069);
    listener.begin();
    return 0;
}
