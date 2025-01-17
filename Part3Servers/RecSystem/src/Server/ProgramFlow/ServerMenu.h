#ifndef SERVER_MENU_H
#define SERVER_MENU_H

#include "Imenu.h"  // Base class for menu functionality
#include <vector>    // For std::vector
#include <string>    // For std::string
using namespace std;
// ServerMenu class definition
//
// @brief The ServerMenu class handles communication with a client by reading commands 
// from the client socket and sending responses back. It implements the Imenu interface.
class ServerMenu : public Imenu {
private:
    int client_socket;  ///< Socket used for communication with the client

public:
    /**
     * @brief Constructor for the ServerMenu class.
     * 
     * Initializes the ServerMenu instance with the given socket for communication.
     * 
     * @param socket The client socket to be used for communication with the client.
     */
    ServerMenu(int socket);

    /**
     * @brief Reads the next command from the client.
     * 
     * Reads data from the client socket, splits the input into individual command parts, 
     * and returns them as a vector of strings. If no data is read (e.g., client disconnects), 
     * it returns an empty vector.
     * 
     * @return A vector of strings containing the parts of the command.
     */
    vector<string> nextCommand();

    /**
     * @brief Sends a response back to the client.
     * 
     * Sends a response message to the client via the socket. The response is sent as a 
     * C-string, ensuring proper transmission of the string data.
     * 
     * @param response The response message to send to the client.
     */
    void sendResponse(const string& response);
};

#endif // SERVER_MENU_H
