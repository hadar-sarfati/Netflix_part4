#include "Icommand.h"       // For the Icommand interface
#include "HelpMovieCommand.h"
#include <string>           // For std::string to handle string data
#include <vector>           // For using std::vector to handle command arguments

using namespace std;

// Constructor for HelpMovieCommand
HelpMovieCommand::HelpMovieCommand(ServerMenu* serverMenu)
    : serverMenu(serverMenu) {}

// Method to execute the 'help' command
void HelpMovieCommand::execute(vector<string> allVector) {
    if (allVector.size() == 1 && allVector[0] == "help") {
        // Create the help message as a single string
        string helpMessage =
            "200 Ok\n\n"
            "DELETE, arguments: [userid] [movieid1] [movieid2] ...\n"
            "GET, arguments: [userid] [movieid]\n"
            "PATCH, arguments: [userid] [movieid1] [movieid2] ...\n"
            "POST, arguments: [userid] [movieid1] [movieid2] ...\n"
            "help";

        setHelpSavedString(helpMessage);

        // Send the help message to the client
        serverMenu->sendResponse(helpMessage);
    } else {
        // Send a "400 Bad Request" response to the client if the input is invalid
        serverMenu->sendResponse("400 Bad Request");
    }
}

void HelpMovieCommand::setHelpSavedString(string helpString) {
    helpSavedString = helpString;
}

string HelpMovieCommand::getHelpSavedString() {
    return helpSavedString;
}
