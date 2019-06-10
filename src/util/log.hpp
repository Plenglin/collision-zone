#pragma once

#include <boost/log/attributes.hpp>
#include <boost/log/core/core.hpp>
#include <boost/log/sources/severity_logger.hpp>
#include <boost/log/trivial.hpp>
#include <boost/log/utility/setup/common_attributes.hpp>
#include <string>

#define LOGGING_TAG_ATTR_NAME "Tag"
#define LOGGING_DEFAULT_TAG "NO-TAG"

namespace util {

    namespace logging = boost::log;
    namespace src = boost::log::sources;
    namespace sinks = boost::log::sinks;
    namespace keywords = boost::log::keywords;
    namespace attrs = boost::log::attributes;

    void initialize_logging() {
        logging::add_common_attributes();
        auto core = logging::core::get();
        core->add_global_attribute(LOGGING_TAG_ATTR_NAME, attrs::constant<std::string>(LOGGING_DEFAULT_TAG));
    }

    src::severity_logger<logging::trivial::severity_level> getLogger(std::string tag) {
        src::severity_logger<logging::trivial::severity_level> logger;
        attrs::mutable_constant<std::string> tagAttr(tag);
        logger.add_attribute(LOGGING_TAG_ATTR_NAME, tagAttr);
        return logger;
    }
    
}
