#ifndef ADDMOVIECOMMAND_H
#define ADDMOVIECOMMAND_H

#include "Icommand.h"  // Base class for commands
#include "../ProgramFlow/HandleUserInput.h"  // Class for handling user input validation
#include "../ProgramFlow/ServerMenu.h"  // Class for managing server interactions
#include <string>      // For using std::string
#include <vector>      // For using std::vector

using namespace std;

/**
 * @class AddMovieCommand
 * 
 * @brief Represents a command to add or update movies for a user in the system.
 * 
 * This class inherits from Icommand and HandleUserInput. It is responsible for 
 * handling commands related to adding new users with their movie lists or updating 
 * existing users' movie lists. It communicates with the `ServerMenu` to send 
 * appropriate responses and uses the `DataBase` to store user-movie associations.
 */
class AddMovieCommand : public Icommand, public HandleUserInput {
private:
    ServerMenu* serverMenu; ///< Pointer to the server menu for sending responses.
    static mutex addMovieMutex; // static mutex shared across all the threads

public:
    /**
     * @brief Constructor for the AddMovieCommand class.
     * 
     * @param serverMenu A pointer to the ServerMenu object that manages server communication.
     */
    AddMovieCommand(ServerMenu* serverMenu);

    /**
     * @brief Executes the add movie command.
     * 
     * This method processes the provided input to either add a new user with their movies 
     * ("post" command) or update an existing user's movie list ("patch" command). It validates 
     * the input, interacts with the database to make changes, and sends appropriate responses 
     * via the `ServerMenu`.
     * 
     * @param allVector A vector of strings containing the command type, user ID, 
     *                  and movie IDs to add or update.
     */
    void execute(std::vector<std::string> allVector) override;
};

#endif // ADDMOVIECOMMAND_H
