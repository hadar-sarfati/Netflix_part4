#ifndef HELPMOVIECOMMAND_H
#define HELPMOVIECOMMAND_H

#include "Icommand.h"  // Include the Icommand interface
#include "../ProgramFlow/HandleUserInput.h"  // Class for handling user input
#include "../ProgramFlow/ServerMenu.h"
#include <string>       // For using std::string to handle string data
#include <vector>       // For using std::vector to handle command arguments

using namespace std;

// HelpMovieCommand class inherits from Icommand and implements the execute method
class HelpMovieCommand : public Icommand, public HandleUserInput {
private:
    ServerMenu* serverMenu;
    string helpSavedString;

public:
     HelpMovieCommand(ServerMenu* serverMenu);
    void execute(std::vector<std::string> allVector) override;
    
    void setHelpSavedString(string helpString); // Setter for the help string
    string getHelpSavedString(); // Getter for the help string
};

#endif // HELPMOVIECOMMAND_H
