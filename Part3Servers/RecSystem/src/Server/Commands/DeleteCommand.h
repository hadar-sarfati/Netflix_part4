#ifndef DELETECOMMAND_H
#define DELETECOMMAND_H
#include "Icommand.h"
#include "../ProgramFlow/HandleUserInput.h"
#include "../ProgramFlow/ServerMenu.h"  // Class for managing server interactions
#include <iostream>
#include <string>
#include <vector>
#include <map>
using namespace std;

class DeleteCommand : public Icommand, public HandleUserInput {
private:
    ServerMenu* serverMenu;     ///< Pointer to the server menu for sending responses.
    static mutex addMovieMutex; // static mutex shared across all the threads

public:
    // Constructor for DeleteCommand
    DeleteCommand(ServerMenu* serverMenu);
    bool checkAllMovies (vector<unsigned long int> moviesToDelete, vector<unsigned long int> userMovies);
    map<unsigned long int, vector<unsigned long int>> deleteMovie(unsigned long int userId, vector<unsigned long int> moviesToDelete, map<unsigned long int, vector<unsigned long int>> userMovies);
    void execute(vector<string> allVector);
};


#endif // DELETECOMMAND_H