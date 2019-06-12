#pragma once

#include <memory>

#include "snowplowderby/Arena.hpp"

namespace snowplowderby::client {
    
    class ClientSource {
    private:
        ArenaPtr arena;
    public:
        ClientSource();
        void set_arena(ArenaPtr arena);
    };

}