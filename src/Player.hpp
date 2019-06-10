#pragma once

#include <Box2D/Box2D.h>

namespace snowplowderby {

    class Player {
    private:
        b2Body* body;
    public:
        Player(b2Body* body);
    };

}
