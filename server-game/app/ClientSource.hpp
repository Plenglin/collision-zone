#pragma once

#include <memory>
#include <string>

#include "game/Arena.hpp"


namespace snowplowderby::client {

    using namespace snowplowderby::game;
    class ClientSource {
    protected:
        ArenaPtr arena;
    public:
        ClientSource();
        void set_arena(ArenaPtr arena);

        virtual std::string get_name() = 0;
        
        virtual void initialize() = 0;
        virtual void update() = 0;
    };

    typedef std::shared_ptr<ClientSource> ClientSourcePtr;

}