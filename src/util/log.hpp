#pragma once

#include <boost/log/attributes.hpp>
#include <boost/log/core.hpp>
#include <boost/log/core/core.hpp>
#include <boost/log/expressions.hpp>
#include <boost/log/sinks.hpp>
#include <boost/log/sinks/text_file_backend.hpp>
#include <boost/log/sources/severity_logger.hpp>
#include <boost/log/trivial.hpp>
#include <boost/log/utility/setup/common_attributes.hpp>
#include <boost/log/utility/setup/console.hpp>
#include <boost/log/utility/setup/file.hpp>
#include <boost/log/utility/setup/formatter_parser.hpp>
#include <string>
#include <iostream>

#define LOGGING_TAG_ATTR_NAME "Tag"
#define LOGGING_DEFAULT_TAG "NO-TAG"

using namespace boost::log::trivial;

#define LOG_TRACE(logger)  BOOST_LOG_SEV(logger, trace)
#define LOG_DEBUG(logger)  BOOST_LOG_SEV(logger, debug)
#define LOG_INFO(logger)   BOOST_LOG_SEV(logger, info)
#define LOG_WARN(logger)   BOOST_LOG_SEV(logger, warning)
#define LOG_ERROR(logger)  BOOST_LOG_SEV(logger, error)
#define LOG_FATAL(logger)  BOOST_LOG_SEV(logger, fatal)

namespace util {

    typedef boost::log::sources::severity_logger<severity_level> Logger;

    void initialize_logging();
    Logger getLogger(std::string tag);
    
}
