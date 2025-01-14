#ifndef GETCOMMAND_H
#define GETCOMMAND_H

#include "Icommand.h"  // Base class for commands
#include "../ProgramFlow/HandleUserInput.h"  // Class for handling user input
#include "../ProgramFlow/ServerMenu.h"  // Class for managing server interactions
#include <map>
#include <vector>
#include <string>
#include <set>
#include <utility>
using namespace std;


class GetCommand : public Icommand, public HandleUserInput {
private:
    unsigned long int userId;                                           // User ID to whom the recommendation is made
    unsigned long int movieId;                                          // Movie ID for the recommendation
    string messageToClient;                                             // Message to send to the client
    ServerMenu* serverMenu; ///< Pointer to the server menu for sending responses.
    map<unsigned long int, vector<unsigned long int>> userMovies;                     // Map storing user-to-movie relationships
    map<unsigned long int, vector<pair<unsigned long int, unsigned long int>>> recommendationBasis; // Map storing the basis for recommendations

    

    // Helper function: Finds similar users who watched the target movie
    vector<unsigned long int> findSimilar();

    // Helper function: Calculates the weights of users based on common movies
    vector<pair<unsigned long int, unsigned long int>> calcWeights();

    // Helper function: Identifies movies watched by similar users
    void movieUsersWeights(const vector<pair<unsigned long int, unsigned long int>>& userWeights);

public:
    // Constructor: Initializes userId, movieId, and loads userMovies from the database
    GetCommand(ServerMenu* serverMenu);

    std::map<unsigned long int, std::vector<unsigned long int>> getUserMovies() const;

    // Helper function: Checks if a specific movie exists in a user's movie list
    bool watchedMovie(unsigned long int thisMovie, const vector<unsigned long int>& movies);

    // Public method to access findSimilar (for testing purposes)
    vector<unsigned long int> getSimilarUsers();

    // Getter function: Returns the weights of similar users
    vector<pair<unsigned long int, unsigned long int>> getWeights();
    
    // Function: Provides movie recommendations
    string recommend(const vector<pair<unsigned long int, unsigned long int>>& userWeights);

    void execute(vector<string> allVector);
};

#endif // GETCOMMAND_H