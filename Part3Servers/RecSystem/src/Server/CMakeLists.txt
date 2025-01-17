# gather all .cpp files in the directory
file(GLOB SOURCES "*.cpp")

# add subdirectories for the commands and program flow
add_subdirectory(Commands)
add_subdirectory(ProgramFlow)

# create command library for server, including files in the current directory
add_library(Server ${SOURCES})

# link the command library with the commands and program flow libraries
target_link_libraries(Server PUBLIC Commands ProgramFlow)

# Include the directory in which the header files are located
target_include_directories(Server PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})