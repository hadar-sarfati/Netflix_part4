# gather all .cpp files in the directory
file(GLOB SOURCES "*.cpp")

# create a library
add_library(DataBase ${SOURCES})

# Include the directory in which the header files are located
target_include_directories(DataBase PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
