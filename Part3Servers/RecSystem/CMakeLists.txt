# Minimum CMake version required
cmake_minimum_required(VERSION 3.10)

# Project name and C++ standard
project(NetflixApp)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# add subdirectories
add_subdirectory(src)

# Add the executable target
add_executable(netflix src/Server/Server.cpp)

# Link libraries to the executable, including pthread
target_link_libraries(netflix PRIVATE BaseClasses DataBase Server pthread)

# Create the 'data' directory inside the build directory
add_custom_command(TARGET netflix POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E make_directory ${CMAKE_BINARY_DIR}/data
)

# Copy the db_movies.txt file to the build/data directory
add_custom_command(TARGET netflix POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy
    ${CMAKE_SOURCE_DIR}/data/db_movies.txt
    ${CMAKE_BINARY_DIR}/data
)