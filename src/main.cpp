#include <iostream>

#include "snowplowderby/Arena.hpp"
#include "Box2D/Box2D.h"
#include "util/log.hpp"
#include "websocketpp/server.hpp"

using namespace snowplowderby;

int main() {
    Arena arena;

    util::initialize_logging();
    auto log = util::getLogger("Main");
LOG_TRACE(log) << "asdf";
LOG_DEBUG(log) << "asdf";
LOG_INFO(log) << "asdf";
LOG_WARN(log) << "asdf";
LOG_ERROR(log) << "asdf";
LOG_FATAL(log) << "asdf";
    return 0;
}
