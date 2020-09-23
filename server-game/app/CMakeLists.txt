add_executable(collision_zone_server
        Client.cpp
        Client.hpp
        ClientSource.cpp
        ClientSource.hpp
        Server.cpp
        Server.hpp
        WebSocketClient.cpp
        WebSocketClient.hpp
        WebSocketClientSource.cpp
        WebSocketClientSource.hpp
        constants.hpp
        main.cpp)
target_link_libraries(collision_zone_server collision_zone_game collision_zone_common)
target_include_directories(collision_zone_server PRIVATE "..")