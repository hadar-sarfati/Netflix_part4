#include <gtest/gtest.h>
#include "../Server/Commands/AddMovieCommand.h"
#include "../Server/ProgramFlow/HandleUserInput.h"
#include "../Server/Commands/HelpMovieCommand.h"
#include "../Server/Commands/GetCommand.h"
#include "../Server/ProgramFlow/ServerMenu.h"
#include "../DataBase/DataBase.h"
#include "../Server/Commands/DeleteCommand.h"
#include "../Server/Server.h"
#include "../Server/ProgramFlow/App.h"
#include <sstream>
#include <iostream>
#include <vector>
#include <thread>
#include <chrono>


// post Commnad Test
TEST(PostAndPatchTest, Sanity_ValidateInput) {
    int dummy_socket = -1; // Placeholder value for testing
    ServerMenu menu(dummy_socket);
    AddMovieCommand addMovieCommand(&menu);
    std::vector<std::string> validInput = {"123", "456", "789"};
    EXPECT_TRUE(addMovieCommand.validateInput(validInput));
}

// patch Commnad Test
TEST(PostAndPatchTest, Negative_ValidateInputNonNumeric) {
    int dummy_socket = -1; // Placeholder value for testing
    ServerMenu menu(dummy_socket);
    AddMovieCommand addMovieCommand(&menu);
    std::vector<std::string> invalidInput = {"123", "abc", "456"};
    EXPECT_FALSE(addMovieCommand.validateInput(invalidInput));
}

// poat Commnad Test
TEST(PostAndPatchTest, Boundary_RemoveFirstItemSingleElement) {
    int dummy_socket = -1; // Placeholder value for testing
    ServerMenu menu(dummy_socket);
    AddMovieCommand addMovieCommand(&menu);
    std::vector<std::string> singleElement = {"onlyElement"};
    auto result = addMovieCommand.removeFirstItem(singleElement);
    EXPECT_TRUE(result.empty());
}

// tests to get command
// Test to check if a movie is in the watched list
TEST(GetMovieCommandTest, Sanity_WatchedMovie_True) {
    int dummy_socket = -1; // Placeholder value for testing
    ServerMenu menu(dummy_socket);
    GetCommand getCommand(&menu);
    vector<unsigned long int> movies = {1, 2, 3};
    EXPECT_TRUE(getCommand.watchedMovie(1, movies)); // Movie 1 is in the list
}

// // Test to check if a movie is not in the watched list
TEST(GetMovieCommandTest, Sanity_WatchedMovie_False) {
    int dummy_socket = -1; // Placeholder value for testing
    ServerMenu menu(dummy_socket);
    GetCommand getCommand(&menu);
    vector<unsigned long int> movies = {2, 3, 4};
    EXPECT_FALSE(getCommand.watchedMovie(1, movies)); // Movie 1 is not in the list
}

TEST(DeleteMovieCommandTest, Sanity_ValidateInput) {
    int dummy_socket = -1; // Placeholder value for testing
    ServerMenu menu(dummy_socket);
    DeleteCommand deleteCommand(&menu);

    std::vector<std::string> validInput = {"1", "100", "101", "102"};
    EXPECT_TRUE(deleteCommand.validateInput(validInput));
}

TEST(DeleteMovieCommandTest, Negative_ValidateInputNonNumeric) {
    int dummy_socket = -1; // Placeholder value for testing
    ServerMenu menu(dummy_socket);
    DeleteCommand deleteCommand(&menu);

    std::vector<std::string> invalidInput = {"13", "abc", "31"};
    EXPECT_FALSE(deleteCommand.validateInput(invalidInput));
}

TEST(DeleteMovieCommandTest, Boundary_RemoveFirstItemSingleElement) {
    int dummy_socket = -1; // Placeholder value for testing
    ServerMenu menu(dummy_socket);
    DeleteCommand deleteCommand(&menu);

    std::vector<std::string> singleElement = {"onlyElement"};
    auto result = deleteCommand.removeFirstItem(singleElement);
    EXPECT_TRUE(result.empty());
}

// Test to help command
TEST(HelpMovieCommandTest, Execute) {
    int dummy_socket = -1; // Placeholder value for testing - not testing sockets currently
    ServerMenu menu(dummy_socket);
    HelpMovieCommand helpCommand(&menu);
    
    vector<string> args = { "help" };
    helpCommand.execute(args);  // This way we ensure help was correctly called

    std::string expectedOutput =
        "200 Ok\n\n"
        "DELETE, arguments: [userid] [movieid1] [movieid2] ...\n"
        "GET, arguments: [userid] [movieid]\n"
        "PATCH, arguments: [userid] [movieid1] [movieid2] ...\n"
        "POST, arguments: [userid] [movieid1] [movieid2] ...\n"
        "help";

    std::string output = helpCommand.getHelpSavedString();
    EXPECT_EQ(output, expectedOutput);
}

TEST(ServerTest, isServerRunning) {
    int port = 8080;
    Server server(port);
    
    // Start the server in a separate thread to avoid blocking the test
    std::thread server_thread([&server]() {
        server.run();  // Run the server
    });

    // Give the server some time to start up
    std::this_thread::sleep_for(std::chrono::seconds(1));

    // Test if the server is running
    EXPECT_TRUE(server.getStatus());

    // Stop the server after the test
    server.stop();

    // Give the server a moment to process the stop signal
    std::this_thread::sleep_for(std::chrono::seconds(1));

    // Verify that the server has stopped
    EXPECT_FALSE(server.getStatus());

    // Join the server thread to ensure it finishes before test completion
    server_thread.join();
}

// Helper function to stop the server after a delay (2 seconds in this case)
// void stopServerAfterDelay(Server& server, int delay_ms) {
//     std::this_thread::sleep_for(std::chrono::milliseconds(delay_ms));
//     server.stop(); // This will stop the server
// }

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);  // Initialize GoogleTest
    return RUN_ALL_TESTS();  // Run all the test cases
}