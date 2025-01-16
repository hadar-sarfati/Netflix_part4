#include "DeleteCommand.h"
#include "../../DataBase/DataBase.h"
#include "../ProgramFlow/ServerMenu.h"
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <map>
using namespace std;

// Define the static mutex (acceisble for all threads)
mutex DeleteCommand::addMovieMutex;

DeleteCommand::DeleteCommand(ServerMenu* serverMenu)
    : serverMenu(serverMenu) {
    // Constructor for DeleteCommand
}

bool DeleteCommand::checkAllMovies(vector<unsigned long int> moviesToDelete, vector<unsigned long int> userMovies) {
    // Check if all movies to delete are in the user's movie list
    for (const auto &movie : moviesToDelete) {
        if (find(userMovies.begin(), userMovies.end(), movie) == userMovies.end()) {
            return false;
        }
    }
    return true;
}

// Function to delete the movies for the userID specified by the user
map<unsigned long int, vector<unsigned long int>> DeleteCommand::deleteMovie(unsigned long int userId, vector<unsigned long int> moviesToDelete, map<unsigned long int, vector<unsigned long int>> userMovies) {
    // Check if the key (the userID) exists - if not, return "404 Not Found"
    if (userMovies.find(userId) != userMovies.end()) {
        // Access the movie vector for the user 
        auto &vec = userMovies[userId];
        if (!checkAllMovies(moviesToDelete, vec)) {
            this->serverMenu->sendResponse("404 Not Found");
            return userMovies;
        }
        // Remove each movie specified by the user
        for (const auto &movie : moviesToDelete) {
            // If the movie is found in the vector, remove it - otherwise, return "404 Not Found"
            if (find(vec.begin(), vec.end(), movie) != vec.end()) {
                vec.erase(remove(vec.begin(), vec.end(), movie), vec.end());
                userMovies[userId] = vec;
            } else {
                this->serverMenu->sendResponse("404 Not Found");
                return userMovies;
            }
        }
        // If the movie was successfully deleted, return "204 No Content"
        this->serverMenu->sendResponse("204 No Content");
    } else {
        this->serverMenu->sendResponse("404 Not Found");
    }
    return userMovies;
}

void DeleteCommand::execute(vector<string> allVector) {
    // Lock the mutex to ensure mutual exclusion
    lock_guard<mutex> lock(addMovieMutex);

    // Remove the first element from the vector (e.g., command name)
    vector<string> enters = removeFirstItem(allVector);

    // Validate the input data
    if (!validateInput(enters)) {
        this->serverMenu->sendResponse("400 Bad Request");
        return;
    }

    // Parse the user ID and movie IDs from the input and convert the first element to an unsigned long int (user ID)
    unsigned long int userId = stoul(enters[0]); 
    vector<unsigned long int> moviesToDelete;

    // Convert the remaining strings to unsigned long integers (movie IDs)
    for (size_t i = 1; i < enters.size(); ++i) {
        moviesToDelete.push_back(stoul(enters[i]));
    }

    // Create a DataBase object to manage file operations
    DataBase db;

    // Load the current user-movie data from the file
    db.loadDataFromFile("./data/db_movies.txt");
    // Get the map of users and their movies from the database
    map<unsigned long int, vector<unsigned long int>> userMovies = db.getUsersMovies();

    // Call the deleteMovie function to delete the movies that the user inputted and overwrite the file with the updated map
    userMovies = deleteMovie(userId, moviesToDelete, userMovies);
    db.overwriteFileWithMap(userMovies, "./data/db_movies.txt");
}