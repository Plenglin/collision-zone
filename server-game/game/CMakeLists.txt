add_library(collision_zone_game
        Event.cpp
        Event.hpp
        Arena.cpp
        Arena.hpp
        Player.cpp
        Player.hpp
        Request.cpp
        Request.hpp
        Wall.cpp
        Wall.hpp
        physics.cpp
        physics.hpp
        util.hpp)
target_link_libraries(collision_zone_game collision_zone_common)
target_include_directories(collision_zone_game PRIVATE "..")
