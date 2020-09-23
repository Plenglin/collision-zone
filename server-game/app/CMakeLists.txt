find_package (Boost REQUIRED COMPONENTS log serialization)
include_directories (${Boost_INCLUDE_DIRS})

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
target_link_libraries(collision_zone_server
        collision_zone_game
        collision_zone_common
        ${Boost_LIBRARIES})
target_include_directories(collision_zone_server PRIVATE "..")