#pragma once

#include <Box2D/Box2D.h>

namespace util {
    struct UserDataWrapper {
        int type;
        void* data;
    };
}