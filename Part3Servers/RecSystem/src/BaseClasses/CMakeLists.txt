# Gather all .cpp files in the directory
file(GLOB SOURCES "*.cpp")

# create a libary
add_library(BaseClasses ${SOURCES})

# Include the directory in which the header files are located
target_include_directories(BaseClasses PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})