#include "Request.hpp"


using namespace snowplowderby::game::request;

Request::~Request() {
    
}

CreatePlayerRequest::CreatePlayerRequest(char player_class, std::string name, PlayerCreatedCallback callback = [](auto _){})
  : player_class(player_class), name(name), callback(callback) { }

void CreatePlayerRequest::fulfill(Arena* arena) {
    auto player = arena->create_player(player_class, name);
    callback(player);
}

DestroyPlayerRequest::DestroyPlayerRequest(PlayerPtr player, PlayerDestroyedCallback callback = []{})
  : player(player), callback(callback) { }

void DestroyPlayerRequest::fulfill(Arena* arena) {
    arena->destroy_player(player);
    callback();
}

