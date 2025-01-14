#include <iostream>     // For standard input/output (cerr)
#include <fstream>      // For file operations (ifstream, ofstream)
#include <sstream>      // For stringstream (istringstream)
#include <map>          // For using std::map
#include <algorithm>    // For using std::all_of
#include <vector>       // For using std::vector
#include <string>       // For using std::string
#include "DataBase.h"   // Custom DataBase class header

using namespace std;

// Method to load data from a file and populate the userMovies map
void DataBase::loadDataFromFile(const string& filename) {
    ifstream file(filename);  // Open file for reading
    if (!file) {              // If the file cannot be opened, print error and return
        cerr << "Error opening file!" << endl;
        return;
    }

    string line;
    // Read each line from the file
    while (getline(file, line)) {

        // If the line is empty or consists only of spaces/tabs/newlines, close the file and return
        if (line.empty() || std::all_of(line.begin(), line.end(), ::isspace)) {
        file.close();
        return;
        }

        istringstream stream(line);  // Use istringstream to parse the line

        unsigned long int userId;
        stream >> userId;  // Extract user ID

        vector<unsigned long int> movies;
        unsigned long int movieId;
        // Extract movie IDs from the rest of the line
        while (stream >> movieId) {
            movies.push_back(movieId);  // Add each movie ID to the movies vector
        }

        userMovies[userId] = movies;  // Map user ID to their movie list
    }
    file.close();  // Close the file after reading
}

// Method to add a new user to the file by appending their data
void DataBase::addUserToFile(unsigned long int userId, const vector<unsigned long int>& movies, const string& filename) {
    ofstream file(filename, ios::app);  // Open file for appending
    if (!file) {                        // If the file cannot be opened, print error and return
        cerr << "Error opening file!" << endl;
        return;
    }


    file << userId;  // Write user ID to the file
    for (unsigned long int movieId : movies) {  // Write each movie ID associated with the user
        file << " " << movieId;
    }
    file << endl;  // Write a newline at the end
    file.close();  // Close the file after writing
}

// Method to get the map of users and their associated movies
map<unsigned long int, vector<unsigned long int>> DataBase::getUsersMovies() const {
    return userMovies;  // Return the map containing user IDs and their movies
}

// Method to overwrite the file with the latest userMovies map
void DataBase::overwriteFileWithMap(const map<unsigned long int, vector<unsigned long int>>& usersMovies, const string& filename) {
    ofstream file(filename);  // Open file for overwriting
    if (!file) {              // If the file cannot be opened, print error and return
        cerr << "Error opening file!" << endl;
        return;
    }

    // Write each user's ID and associated movie list to the file
    for (const auto& entry : usersMovies) {
        file << entry.first;  // Write user ID
        for (unsigned long int movieId : entry.second) {  // Write each movie ID associated with the user
            file << " " << movieId;
        }
        file << endl;  // Write a newline at the end of each user's data
    }
    file.close();  // Close the file after writing
}
