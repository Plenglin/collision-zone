# Specify the minimum version for CMake

cmake_minimum_required(VERSION 3.10)

# Project's name

project(hello)
# Set the output folder where your program will be created
set(CMAKE_BINARY_DIR ${CMAKE_SOURCE_DIR}/bin)
set(EXECUTABLE_OUTPUT_PATH ${CMAKE_BINARY_DIR})
set(LIBRARY_OUTPUT_PATH ${CMAKE_BINARY_DIR})

# The following folder will be included
include_directories("${PROJECT_SOURCE_DIR}/src")
include_directories("${PROJECT_SOURCE_DIR}/lib")

set(SOURCES 
        ${PROJECT_SOURCE_DIR}/src/main.cpp 
        ${PROJECT_SOURCE_DIR}/src/Player.cpp)

add_executable(derby_gameserver ${SOURCES})
target_include_directories(derby_gameserver PRIVATE ${PROJECT_SOURCE_DIR}/src/)
