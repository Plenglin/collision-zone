#define PLAYER_ALIVE_FLAG 1
#define PLAYER_BOOSTING_FLAG 2

namespace snowplowderby::io::s2c {
    struct Player {
        long id;
        float x;
        float y;
        float angle;
        char flags;
    };

    struct InitialPayload {
        //int wall_count;
        //WallData* walls;
    };
} 
