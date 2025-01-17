#include "ServerMenu.h"  // Header file for ServerMenu class
#include <iostream>       // For std::cin and std::getline
#include <sstream>        // For std::stringstream
#include <vector>         // For std::vector
#include <string>         // For std::string
#include <cctype>         // For isprint() and isspace()
#include <sys/socket.h>   // For socket communication functions
#include <unistd.h>       // For read and write system calls
using namespace std;
// Constructor for ServerMenu
// Initializes the ServerMenu with the provided client socket
//
// @param socket The client socket to communicate with the connected client
ServerMenu::ServerMenu(int socket) : client_socket(socket) {}

// Method to read the next command from the user and split it into parts
//
// Reads data from the client socket and splits the input into individual words (command parts).
// The input is assumed to be space-separated. If no data is read (i.e., client disconnects),
// it returns an empty vector.
//
// @return A vector of strings containing the parts of the command, or an empty vector if no data was read
vector<string> ServerMenu::nextCommand() {
    string input;         // Dynamically resizable buffer
    char buffer[1024];    // Temporary chunk buffer
    int bytes_read;

     // Read data from the socket in a loop
    while ((bytes_read = read(client_socket, buffer, sizeof(buffer))) > 0) {
        input.append(buffer, bytes_read); // Append the chunk to the input string

        // Check for an end-of-command marker (e.g., newline)
        if (input.find('\n') != string::npos) {
            break;
        }
    }

    // If no data was read or an error occurred, return an empty vector
    if (input.empty()) {
        return {};
    }

    stringstream ss(input);  // Use stringstream to split the string into words
    vector<string> commandParts;
    string word;

    // Split the string into words and add them to the commandParts vector
    while (ss >> word) {
        commandParts.push_back(word);
    }

    return commandParts;  // Return the vector of command parts
}

// Sends a response back to the client
//
// This method sends a response message back to the client through the socket. 
// It ensures the response is properly sent by converting the string to a C-string before sending it.
//
// @param response The response message to be sent to the client
void ServerMenu::sendResponse(const string& response) {
    send(client_socket, response.c_str(), response.length(), 0);  // Send the response to the client
}
