#include "GetCommand.h"
#include "../../DataBase/DataBase.h"   // Custom DataBase class header
#include "Icommand.h"   // Interface for commands
#include <iostream>
#include <fstream>
#include <sstream>
#include <stdexcept>
#include <algorithm>
#include <set>
using namespace std;

GetCommand::GetCommand(ServerMenu* serverMenu) 
    : serverMenu(serverMenu) {
    // Constructor for GetCommand, but initialization will happen later
}

// Function gets a movie and a vector of movies and checks if the movie is in the vector
bool GetCommand::watchedMovie(unsigned long int thisMovie, const vector<unsigned long int>& movies) {
    for(auto movie : movies){
        if(movie == thisMovie){
            return true;
        }
    }
    return false;
}

//Function finds all users that watched the input movie, aside from the user to which the relevance is made
vector<unsigned long int> GetCommand::findSimilar() {
    vector<unsigned long int> similarUsers;
    // iterating through all users to find the similar users
    for (auto user : this->userMovies) {
        if (user.first != this->userId) {
            //if the user watched the movie, add him to the similar users vector
            if (watchedMovie(this->movieId, user.second)) {
                similarUsers.insert(similarUsers.end(), {user.first});
            }
        }
    }
    return similarUsers;
}

// Function calculates the weights of the users - how many common movies does each have with our user and returns 
// a vector of the users and their weights
vector<pair<unsigned long int, unsigned long int>> GetCommand::calcWeights() {
    vector<pair<unsigned long int, unsigned long int>> userWeights;
    vector<unsigned long int> similarUsers = findSimilar();
    for (auto user : similarUsers) {
        unsigned long int weight = 0;
        // We go through each of the similar users' movie list and add 1 to the weight for every common movie with our user
        for (auto movie : this->userMovies[user]) {
            if (user != this->userId && find(this->userMovies[this->userId].begin(), this->userMovies[this->userId].end(),
                 movie) != this->userMovies[this->userId].end()) {
                weight++;
            }
        }
        userWeights.push_back({user, weight});
    }
    return userWeights;
}

vector<pair<unsigned long int, unsigned long int>> GetCommand::getWeights(){
    return calcWeights();
}

// Function finds the movies that the similar users watched and returns a map of (movieId: (user, weight)...)
void GetCommand::movieUsersWeights(const vector<pair<unsigned long int, unsigned long int>>& userWeights) {
    vector<unsigned long int> similarUsers = findSimilar();
    // Running through all the similar users and their movies, to check:
    for (auto user : similarUsers) {
        for (auto movie : this->userMovies[user]) {
            // If the movie is not the recommended movie and our input user hadn't watched it yet,
            if (movie != this->movieId && !watchedMovie(movie, this->userMovies[this->userId])) {
                // and the similar user watched it:
                if (watchedMovie(movie, this->userMovies[user])) {
                    // We find the corresponding weight for the user int the userWeights vector
                    for (const auto& weight : userWeights) {
                        if (weight.first == user) {
                            // and we add the user and his weight to the RecommendMovieCommandBasis map
                            this->recommendationBasis[movie].push_back({user, weight.second});
                        }
                    }
                } else {
                    this->recommendationBasis[movie];
                }
            }
        }
    }
}

// Public method to access findSimilar (for testing purposes)
vector<unsigned long int> GetCommand::getSimilarUsers() {
    return findSimilar();
}

std::map<unsigned long int, std::vector<unsigned long int>> GetCommand::getUserMovies() const { return userMovies; }

// Function calculates the RecommendMovieCommands for the user
string GetCommand::recommend(const vector<pair<unsigned long int, unsigned long int>>& userWeights) {
    vector<pair<unsigned long int, unsigned long int>> recommendedMovies;
    movieUsersWeights(calcWeights());

    // Calculating the relevance for each movie by summing up the weights for all users that watched each movie
    for (const auto& [movie, users] : this->recommendationBasis) {
        unsigned long int relevance = 0;
        for (const auto& user : users) {
            relevance += user.second;
        }
        recommendedMovies.push_back({movie, relevance});
    }

    // Sorting the recommended movies based on the relevance - the second value of the pair
    sort(recommendedMovies.begin(), recommendedMovies.end(), [](const pair<unsigned long int, unsigned long int>& a, const pair<unsigned long int, unsigned long int>& b) {
        return a.second > b.second;
    });

    // Creating a string to send to the client - the first line is the status code and the second line is the 
    // recommended movies, like we did before
    string recommendedMoviesString;
    for (const auto& movie : recommendedMovies) {
        recommendedMoviesString += to_string(movie.first) + " ";
    }
    recommendedMoviesString += "\n";
    return recommendedMoviesString;
}

void GetCommand::execute(vector<string> allVector) {
    // Remove the first element from the vector (e.g., command name)
    vector<string> enters = removeFirstItem(allVector);

    // Validate the input data
    if (!validateInput(enters) || enters.size() != 2) {
        this->serverMenu->sendResponse("400 Bad Request");
        return;
    }

    // Parse the user ID and movie IDs from the input
    this->userId = stoul(enters[0]); // Convert the first element to an integer (user ID)
    this->movieId = stoul(enters[1]); // Convert the second element to an integer (movie ID)
    
    // Create a DataBase object to manage file operations
    DataBase db;

    // Load the current user-movie data from the file
    db.loadDataFromFile("./data/db_movies.txt");
    this->userMovies = db.getUsersMovies();
    if (this->userMovies.find(userId) == this->userMovies.end()) {
            this->serverMenu->sendResponse("404 Not Found"); // User does not exist
            return;
    }
    this->messageToClient = "200 Ok\n\n";
    this->recommendationBasis = {};
    // Call the recommend() function to give the recommendation based on the file contents
    this->messageToClient += recommend(getWeights());
    
    this->serverMenu->sendResponse(messageToClient);
}

