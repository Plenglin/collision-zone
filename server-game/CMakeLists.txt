
cmake_minimum_required(VERSION 3.10)

project(hello)

set(CMAKE_CXX_COMPILER "/usr/bin/clang++")
set(CMAKE_CXX_FLAGS "-Wall -std=c++17 ")
set(CMAKE_CXX_FLAGS_DEBUG "-g -O0")
set(CMAKE_CXX_FLAGS_RELEASE "-g -O3")

set(CMAKE_BINARY_DIR ${CMAKE_SOURCE_DIR}/bin)
set(EXECUTABLE_OUTPUT_PATH ${CMAKE_BINARY_DIR})
set(LIBRARY_OUTPUT_PATH ${CMAKE_BINARY_DIR})

set(Boost_USE_STATIC_LIBS ON) 
set(Boost_USE_MULTITHREADED ON)  
set(Boost_USE_STATIC_RUNTIME ON) 
find_package(Boost 1.62.0 COMPONENTS 
       log 
       serialization
) 
include_directories(${Boost_INCLUDE_DIRS})

include_directories("${PROJECT_SOURCE_DIR}/src")
include_directories("${PROJECT_SOURCE_DIR}/lib")

set(CMAKE_BUILD_TYPE Debug)

# All files that are not entry points
set(SOURCES 
       ${PROJECT_SOURCE_DIR}/src/util/log.cpp 
       ${PROJECT_SOURCE_DIR}/src/util/physics.cpp 
       ${PROJECT_SOURCE_DIR}/src/snowplowderby/game/Arena.cpp
       ${PROJECT_SOURCE_DIR}/src/snowplowderby/game/Player.cpp 
       ${PROJECT_SOURCE_DIR}/src/snowplowderby/game/Wall.cpp 
       ${PROJECT_SOURCE_DIR}/src/snowplowderby/game/Request.cpp 
       ${PROJECT_SOURCE_DIR}/src/snowplowderby/client/Client.cpp 
       ${PROJECT_SOURCE_DIR}/src/snowplowderby/client/ClientSource.cpp 
       ${PROJECT_SOURCE_DIR}/src/snowplowderby/event/Event.cpp 
       ${PROJECT_SOURCE_DIR}/src/snowplowderby/server/Server.cpp 
       ${PROJECT_SOURCE_DIR}/src/snowplowderby/websocket/WebSocketClient.cpp 
       ${PROJECT_SOURCE_DIR}/src/snowplowderby/websocket/WebSocketClientSource.cpp 
)

set(HEADERS 
       ${PROJECT_SOURCE_DIR}/src/util/log.hpp 
       ${PROJECT_SOURCE_DIR}/src/util/physics.hpp 
       ${PROJECT_SOURCE_DIR}/src/snowplowderby/game/Arena.hpp
       ${PROJECT_SOURCE_DIR}/src/snowplowderby/game/Player.hpp 
       ${PROJECT_SOURCE_DIR}/src/snowplowderby/game/Wall.hpp 
       ${PROJECT_SOURCE_DIR}/src/snowplowderby/game/Request.hpp 
       ${PROJECT_SOURCE_DIR}/src/snowplowderby/client/Client.hpp 
       ${PROJECT_SOURCE_DIR}/src/snowplowderby/client/ClientSource.hpp 
       ${PROJECT_SOURCE_DIR}/src/snowplowderby/event/Event.hpp 
       ${PROJECT_SOURCE_DIR}/src/snowplowderby/server/Server.hpp 
       ${PROJECT_SOURCE_DIR}/src/snowplowderby/websocket/WebSocketClient.hpp 
       ${PROJECT_SOURCE_DIR}/src/snowplowderby/websocket/WebSocketClientSource.hpp 
)

file(GLOB_RECURSE BOX2D_LIB
       ${PROJECT_SOURCE_DIR}/lib/Box2D/*.cpp
       ${PROJECT_SOURCE_DIR}/lib/Box2D/*.h)

add_executable(derby_gameserver ${PROJECT_SOURCE_DIR}/src/main.cpp ${SOURCES} ${HEADERS} ${BOX2D_LIB})
target_link_libraries(derby_gameserver ${Boost_LIBRARIES})
