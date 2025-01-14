#ifndef DATABASE_H
#define DATABASE_H

#include <map>          // For using std::map to store user IDs and their movies
#include <vector>       // For using std::vector to store movie IDs
#include <string>       // For using std::string to handle file names
#include <mutex>

using namespace std;

// DataBase class handles reading, writing, and updating user data with associated movie lists
class DataBase {
private:
    // Map to store user IDs and their associated list of movie IDs
    map<unsigned long int, vector<unsigned long int>> userMovies;

public:
    // Default constructor (no need to define it, as it's implicitly generated)
    DataBase() = default;

    // Method to read data from a file and store it in the userMovies map
    // The file format is expected to have user IDs followed by movie IDs on each line
    void loadDataFromFile(const string& filename);

    // Method to add a user and their movies to the file
    // The data is written at the end of the file
    void addUserToFile(unsigned long int userId, const vector<unsigned long int>& movies, const string& filename);

    // Method to retrieve the map of users and their associated movies
    map<unsigned long int, vector<unsigned long int>> getUsersMovies() const;

    // Method to overwrite the file with the current userMovies map data
    // This will erase the existing content and write all user data from the map
    void overwriteFileWithMap(const map<unsigned long int, vector<unsigned long int>>& usersMovies, const string& filename);
};

#endif // DATABASE_H
