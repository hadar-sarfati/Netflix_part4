#include "Server.h"
#include "ThreadPool.h"
#include <cstring>
#include <string.h>
#include "ProgramFlow/App.h"
#include "ProgramFlow/ServerMenu.h"
#include "Commands/AddMovieCommand.h"
#include "Commands/GetCommand.h"
#include "Commands/DeleteCommand.h"
#include "Commands/HelpMovieCommand.h"

#define NUM_THREADS 8

using namespace std;

/**
 * @brief Server Constructor: Setting up the server with the given port.
 *
 * @param port The port number on which the server will listen.
 */
Server::Server(int port) : port(port), server_fd(-1) {
    // At first the server is not running
    isRunning.store(false);

    // Initialize the server (create, bind, and listen)
    setupServer();

    // Initializing a new thread pool to take care of NUM_THREADS (the number of clients)
    threadPool = new ThreadPool(NUM_THREADS, this); 
}

/**
 * @brief Setting up the server: creates a socket, binds it, and starts listening.
 */
void Server::setupServer() {
    // Create the server socket
    if ((server_fd = socket(AF_INET, SOCK_STREAM, 0)) == 0) {
        perror("Socket creation failed");
        exit(EXIT_FAILURE);
    }

    // Configure the server address
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(port);

    // Bind the socket to the specified port
    if (bind(server_fd, (struct sockaddr*)&address, sizeof(address)) < 0) {
        perror("Bind failed");
        close(server_fd);
        exit(EXIT_FAILURE);
    }

    // Start listening for incoming connections (1 connection at a time)
    if (listen(server_fd, 5) < 0) { 
        perror("Listen failed");
        close(server_fd);
        exit(EXIT_FAILURE);
    }
}

/**
 * @brief Runs the server: accepts and handles multiple client connections using threads.
 */
void Server::run() {
    // Size of the socket address structure
    socklen_t addrlen = sizeof(address);

    // Set the server's running status to true (atomic operation)
    isRunning.store(true);

    // The server loop runs as long as isRunning is true
    while (isRunning.load()) {
        // Clearing the file descriptor set (for select) and adding the server socket to it
        fd_set readfds;
        FD_ZERO(&readfds);
        FD_SET(server_fd, &readfds);

        // Set timeout for select to avoid blocking indefinitely (1 second)
        struct timeval timeout;
        timeout.tv_sec = 1;
        timeout.tv_usec = 0;

        // Select periodically checks for new activity with a timeout, so 'accept' will not be blocking
        int activity = select(server_fd + 1, &readfds, nullptr, nullptr, &timeout);
        
        // Check for errors in the 'select' call
        if (activity < 0) {
            perror("select error");
            continue;
        }

        // Check if the server socket has activity
        if (FD_ISSET(server_fd, &readfds)) {
            // Accept a new client connection
            int client_socket = accept(server_fd, (struct sockaddr*)&address, &addrlen);
            if (client_socket < 0) {
                // If failed skip to wait for next client connection
                perror("Accept failed");
                continue;
            }

            // Adding the clientSocket to the ThreadPool queue - it will be handled by an available thread.
            threadPool->addTask(client_socket);
        }
    }
}

/**
 * @brief Stops the server: updates the atomic isRunning that stops the server loop.
 */
void Server::stop() {
    isRunning.store(false);
}


/**
 * @brief Server Destructor: Cleans up the server socket.
 */
Server::~Server() {
    if (server_fd != -1) {
        close(server_fd);
    }
    // Update the server's isRunning status
    isRunning.store(false);
    delete threadPool;
}

/**
 * @brief getStatus: Returns whether the surver is running or not.
 * @return true if running, false otherwise.
 */
bool Server::getStatus() {
    return isRunning;
}


/**
 * @brief Handles client connections: runs the App with commands.
 *
 * @param client_socket The socket file descriptor for the connected client.
 */
void Server::handleClient(int client_socket) {
    // Instantiate the ServerMenu for the current client
    ServerMenu menu(client_socket);

    // Map of available commands and their respective handlers
    map<string, Icommand*> commands;
    commands["POST"] = new AddMovieCommand(&menu);  // post movie command
    commands["PATCH"] = new AddMovieCommand(&menu); // Patch command (same handler as post)
    commands["GET"] = new GetCommand(&menu);             // Get command
    commands["DELETE"] = new DeleteCommand(&menu);       // Delete command
    commands["help"] = new HelpMovieCommand(&menu); // Help command

    // Create an App instance to manage the application logic
    App app(&menu, commands);

    // Run the application
    app.run();

    // Close the client socket after use
    close(client_socket);

    // Clean up allocated command handlers
    for (auto& [_, command] : commands) {
        delete command;
    }
}


