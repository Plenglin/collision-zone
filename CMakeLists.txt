# Specify the minimum version for CMake

cmake_minimum_required(VERSION 3.10)

project(hello)
# Set the output folder where your program will be created
set(CMAKE_BINARY_DIR ${CMAKE_SOURCE_DIR}/bin)
set(EXECUTABLE_OUTPUT_PATH ${CMAKE_BINARY_DIR})
set(LIBRARY_OUTPUT_PATH ${CMAKE_BINARY_DIR})

set(Boost_USE_STATIC_LIBS ON) 
set(Boost_USE_MULTITHREADED ON)  
set(Boost_USE_STATIC_RUNTIME ON) 
find_package(Boost 1.62.0 COMPONENTS log) 
include_directories(${Boost_INCLUDE_DIRS})

include_directories("${PROJECT_SOURCE_DIR}/src")
include_directories("${PROJECT_SOURCE_DIR}/lib")

set(SOURCES   ${PROJECT_SOURCE_DIR}/src/util/log.cpp 
              ${PROJECT_SOURCE_DIR}/src/snowplowderby/Player.cpp 
              ${PROJECT_SOURCE_DIR}/src/snowplowderby/Client.cpp 
              ${PROJECT_SOURCE_DIR}/src/snowplowderby/Arena.cpp)

file(GLOB_RECURSE BOX2D_LIB
       ${PROJECT_SOURCE_DIR}/lib/Box2D/*.cpp
       ${PROJECT_SOURCE_DIR}/lib/Box2D/*.h)

add_executable(derby_gameserver ${PROJECT_SOURCE_DIR}/src/main.cpp ${SOURCES} ${BOX2D_LIB})
target_link_libraries(derby_gameserver ${Boost_LIBRARIES})
