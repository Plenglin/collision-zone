#include <iostream>

#include "Arena.hpp"
#include "Box2D/Box2D.h"
#include "util/log.hpp"
#include "websocketpp/server.hpp"

using namespace snowplowderby;

int main() {
    Arena arena;
    using namespace boost::log::trivial;

    util::initialize_logging();
    auto log = util::getLogger("Main");
    BOOST_LOG_SEV(log, info) << "asdf";

    return 0;
}
