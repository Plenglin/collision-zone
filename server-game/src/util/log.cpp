#include "log.hpp"

namespace logging = boost::log;
namespace trivial = boost::log::trivial;
namespace src = boost::log::sources;
namespace sinks = boost::log::sinks;
namespace keywords = boost::log::keywords;
namespace attrs = boost::log::attributes;


void util::initialize_logging() {
    logging::add_common_attributes();
    auto core = logging::core::get();
    core->add_global_attribute(LOGGING_TAG_ATTR_NAME, attrs::constant<std::string>(LOGGING_DEFAULT_TAG));
    logging::register_simple_formatter_factory<trivial::severity_level, char>("Severity");

    auto file_sink = logging::add_file_log(
        keywords::file_name = "log/%Y-%m-%d_%H-%M-%S_%4N.log",
        keywords::rotation_size = 10 * 1024 * 1024,
        keywords::format = "%TimeStamp% [%" LOGGING_TAG_ATTR_NAME "%] (%Severity%) %Message%",
        keywords::auto_flush = true);
    file_sink->set_filter(trivial::severity >= trivial::debug);

    auto console_sink = logging::add_console_log(
        std::cout,
        keywords::format = "[%" LOGGING_TAG_ATTR_NAME "%] (%Severity%) %Message%");
    console_sink->set_filter(trivial::severity >= trivial::info);
}

util::Logger util::get_logger(std::string tag) {
    Logger logger;
    attrs::mutable_constant<std::string> tagAttr(tag);
    logger.add_attribute(LOGGING_TAG_ATTR_NAME, tagAttr);
    return logger;
}
