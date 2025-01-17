# gather all .cpp files in the directory
file(GLOB SOURCES "*.cpp")

# create a library
add_library(Commands ${SOURCES})

# Include the directory in which the header files are located
target_include_directories(Commands PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})

# Link the library Database with the library Database
target_link_libraries(Commands PUBLIC DataBase)