cmake_minimum_required(VERSION 3.14)
project(MovieUserTests)

# Set C++ standard to C++14 as GoogleTest requires it
set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Fetch GoogleTest from GitHub (ensures you always get the latest version)
include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
)

# For Windows: Prevent overriding the parent project's compiler/linker settings
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

# Include the /src directory for headers
include_directories(${CMAKE_SOURCE_DIR}/src)


# # Add all .cpp files from the specified directory
# file(GLOB TEST_SOURCES
#     "../Server/Commands/AddMovieCommand.cpp"
#     "../Server/Commands/HelpMovieCommand.cpp"
#     "../Server/Commands/GetCommand.cpp"      
#     "../DataBase/DataBase.cpp"               
#     "../ProgramFlow/HandleUserInput.cpp"            
#     "../Server/ProgramFlow/*.cpp"
#     test.cpp     
# )

# # Add executable using the collected source files
# add_executable(runTests ${TEST_SOURCES})

# Add your test files (e.g., Movie and User tests)
add_executable(runTests
    ../Server/Commands/AddMovieCommand.cpp
    ../Server/Commands/HelpMovieCommand.cpp
    ../Server/Commands/GetCommand.cpp      
    ../Server/Commands/DeleteCommand.cpp   
    ../DataBase/DataBase.cpp            
    ../Server/ProgramFlow/HandleUserInput.cpp
    ../Server/ProgramFlow/ServerMenu.cpp    
    ../Server/Server.cpp
    ../Server/ProgramFlow/App.cpp        
    test.cpp   
)

# Link the GoogleTest libraries
target_link_libraries(runTests gtest_main)
