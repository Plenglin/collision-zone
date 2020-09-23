set (Boost_USE_STATIC_LIBS OFF)
find_package (Boost REQUIRED COMPONENTS log)
include_directories (${Boost_INCLUDE_DIRS})

add_library(collision_zone_common
        log.cpp
        log.hpp)
target_link_libraries(collision_zone_common ${Boost_LIBRARIES})