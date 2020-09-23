#pragma once

#include <functional>

#include "Player.hpp"
#include "Arena.hpp"

namespace snowplowderby::game {
    class Arena;
}

namespace snowplowderby::game::request {

    class Request {
    public:
        virtual ~Request();
        virtual void fulfill(Arena* arena) = 0;
    };
    
    typedef std::function<void(PlayerPtr)> PlayerCreatedCallback;
    class CreatePlayerRequest : public Request {
    private:
        char player_class;
        std::string name;
        PlayerCreatedCallback callback;
    public:
        CreatePlayerRequest(char player_class, std::string name, PlayerCreatedCallback callback);

        void fulfill(Arena* arena) override;
    };

    typedef std::function<void()> PlayerDestroyedCallback;
    class DestroyPlayerRequest : public Request {
    private:
        PlayerPtr player;
        PlayerDestroyedCallback callback;
    public:
        DestroyPlayerRequest(PlayerPtr player, PlayerDestroyedCallback callback);
        void fulfill(Arena* arena) override;
    };
    
}
