#include <boost/archive/iterators/base64_from_binary.hpp>
#include <boost/archive/iterators/insert_linebreaks.hpp>
#include <boost/archive/iterators/ostream_iterator.hpp>
#include <boost/archive/iterators/transform_width.hpp>
#include <sstream>
#include <string>

namespace util {
    typedef base64_from_binary<
        transform_width<
            const char *,
            6,
            8> >
        base64_text;
}