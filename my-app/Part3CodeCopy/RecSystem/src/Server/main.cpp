#include <iostream>

#include "Server.h"

using namespace std;

/**
 * @brief Main function for running the server.
 * 
 * The main sets up and runs the server, which listens for client connections, accepts them,
 * and processes commands using classes like AddMovieCommand and GetCommand.
 * It handles multiple clients concurrently using threads.
 * 
 * @param argc Argument count passed to the program.
 * @param argv Argument values. Expects the server port as the second argument.
 * @return Returns 0 on success, or 1 if there is an error.
 */
int main(int argc, char* argv[]) {
    // Check if the correct number of arguments is provided
    if (argc != 2) {
        cerr << "Usage: " << argv[0] << " <port>" << endl;
        return 1;
    }

    // Parse the port number
    int port = stoi(argv[1]);

    // Create and set up the server
    Server server(port);

    // Run the server
    server.run();

    return 0;
}
