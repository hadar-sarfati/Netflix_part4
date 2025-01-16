#include "Icommand.h"
#include "../../DataBase/DataBase.h"
#include "AddMovieCommand.h"
#include "../ProgramFlow/ServerMenu.h"
#include <string>
#include <set>
#include <vector>
#include <iostream>
#include <cctype> // for isdigit
using namespace std;

// Define the static mutex (acceisble for all threads)
mutex AddMovieCommand::addMovieMutex;

/**
 * Constructor for AddMovieCommand.
 * 
 * @param serverMenu A pointer to the ServerMenu object that handles the communication.
 */
AddMovieCommand::AddMovieCommand(ServerMenu* serverMenu)
    : serverMenu(serverMenu) {
    // Constructor implementation
}

/**
 * Executes the AddMovieCommand based on the input vector.
 * Handles two types of commands:
 *  - "post": Adds a new user with their associated movies.
 *  - "patch": Updates an existing user's movie list.
 * Handled by a mutex lock, to ensure adding users locks other threads access.
 * 
 * @param allVector A vector of strings containing the command type, user ID, 
 *                  and movie IDs to add/update.
 */
void AddMovieCommand::execute(vector<string> allVector) {
    // Lock the mutex to ensure mutual exclusion
    lock_guard<mutex> lock(addMovieMutex);

    string commandType = allVector[0]; // Extract the command type
    vector<string> enters = removeFirstItem(allVector); // Remove the command name

    // Validate input
    if (!validateInput(enters)) {
        serverMenu->sendResponse("400 Bad Request"); // Invalid input
        return;
    }

    // Convert the user ID from string to unsigned long int
    unsigned long int userId = stoul(enters[0]);
    vector<unsigned long int> newMovies;

    // Convert movie IDs from strings to unsigned long ints
    for (size_t i = 1; i < enters.size(); ++i) {
        newMovies.push_back(stoul(enters[i]));
    }

    DataBase db; // Create a DataBase instance
    db.loadDataFromFile("./data/db_movies.txt"); // Load existing data from the file
    map<unsigned long int, vector<unsigned long int>> userMovies = db.getUsersMovies();

    if (commandType == "POST") {
        // Handle "post" command: Create a new user with their movies
        if (userMovies.find(userId) != userMovies.end()) {
            serverMenu->sendResponse("404 Not Found"); // User already exists
            return;
        }

        userMovies[userId] = newMovies; // Add the new user and their movies
        serverMenu->sendResponse("201 Created"); // Success response
    } else if (commandType == "PATCH") {
        // Handle "patch" command: Update an existing user's movie list
        if (userMovies.find(userId) == userMovies.end()) {
            serverMenu->sendResponse("404 Not Found"); // User does not exist
            return;
        }

        // Merge existing movies with new ones, avoiding duplicates
        set<unsigned long int> movieSet(userMovies[userId].begin(), userMovies[userId].end());
        movieSet.insert(newMovies.begin(), newMovies.end());
        userMovies[userId] = vector<unsigned long int>(movieSet.begin(), movieSet.end());
        serverMenu->sendResponse("204 No Content"); // Success response with no content
    } else {
        serverMenu->sendResponse("400 Bad Request"); // Invalid command type
        return;
    }

    // Save the updated data back to the file
    db.overwriteFileWithMap(userMovies, "./data/db_movies.txt");
}
