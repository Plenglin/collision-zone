#include "log.hpp"

namespace logging = boost::log;
namespace src = boost::log::sources;
namespace sinks = boost::log::sinks;
namespace keywords = boost::log::keywords;
namespace attrs = boost::log::attributes;


void util::initialize_logging() {
    logging::add_common_attributes();
    auto core = logging::core::get();
    core->add_global_attribute(LOGGING_TAG_ATTR_NAME, attrs::constant<std::string>(LOGGING_DEFAULT_TAG));
    logging::register_simple_formatter_factory<logging::trivial::severity_level, char>("Severity");

    logging::add_file_log(
        keywords::file_name = "log/%Y-%m-%d_%H-%M-%S_%4N.log",
        keywords::rotation_size = 10 * 1024 * 1024,
        keywords::format = "%TimeStamp% [%" LOGGING_TAG_ATTR_NAME "%] (%Severity%) %Message%"
    );

    logging::add_console_log(
        std::cout, 
        keywords::format = "[%" LOGGING_TAG_ATTR_NAME "%] (%Severity%) %Message%"
    );
}

util::Logger util::get_logger(std::string tag) {
    Logger logger;
    attrs::mutable_constant<std::string> tagAttr(tag);
    logger.add_attribute(LOGGING_TAG_ATTR_NAME, tagAttr);
    return logger;
}
