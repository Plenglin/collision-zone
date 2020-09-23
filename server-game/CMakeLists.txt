cmake_minimum_required(VERSION 3.17)
project(collision_zone_game_server)

set(CMAKE_CXX_STANDARD 17)

set(Boost_USE_STATIC_LIBS ON)
set(Boost_USE_MULTITHREADED ON)
set(Boost_USE_STATIC_RUNTIME ON)


add_subdirectory(box2d)
add_subdirectory(common)
add_subdirectory(game)
add_subdirectory(app)

