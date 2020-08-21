#include <Box2D/Box2D.h>
#include <ostream>


namespace snowplowderby::game {

    struct Wall {
        float x;
        float y;
        float width;
        float height;
        float angle;

        b2Body* create_body(b2World* world);
        void write_initial_bytes(std::ostream& os);
    };

}