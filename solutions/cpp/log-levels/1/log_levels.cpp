#include <string>

namespace log_line {
std::string message(std::string line) {
    int index = static_cast<int>(line.find(":")) + 2;
    return line.substr(index);
    // return the message
}

std::string log_level(std::string line) {
    std::string result;
    if(static_cast<int>(line.find("ERROR")) == 1) result = "ERROR";
    else if(static_cast<int>(line.find("INFO")) == 1) result = "INFO";
    else result = "WARNING";
    
    return result;
    // return the log level
}

std::string reformat(std::string line) {
    // return the reformatted message
    std::string result;
    if(static_cast<int>(line.find("ERROR")) == 1) result = "ERROR";
    else if(static_cast<int>(line.find("INFO")) == 1) result = "INFO";
    else result = "WARNING";

    int index = static_cast<int>(line.find(":")) + 2;
    std::string final = line.substr(index) + " " + "(" + result + ")";

    return final;
}
}  // namespace log_line
