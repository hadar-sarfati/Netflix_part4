#include "App.h"                   // Application class header
#include "Imenu.h"                 // Interface for menu functionality
#include "ServerMenu.h"             // ServerMenu class for server interactions
#include "../Commands/Icommand.h"              // Interface for commands
#include "../Commands/AddMovieCommand.h"       // AddMovieCommand implementation
#include "../Commands/HelpMovieCommand.h"      // HelpMovieCommand implementation
#include "../Commands/GetCommand.h"            // GetCommand implementation
#include "../Commands/DeleteCommand.h"         // DeleteCommand implementation
#include "ConsoleMenu.h"           // Console-based menu system
#include <string>                  // For using std::string
#include <vector>                  // For using std::vector
#include <map>                     // For using std::map
#include <iostream>                // For using std::cout and std::endl
using namespace std;

// Constructor implementation
// Initializes the App with a menu and a map of commands
App::App(ServerMenu* menu, map<string, Icommand*> commands)
    : menu(menu), commands(commands) {}

// Main application loop
void App::run() {
    while (true) {
        // Get the next command input from the menu
        vector<string> task = menu->nextCommand();

        // Skip iteration if no input is provided (important to BREAK, not to continue)
        if (task.empty()) {
            break;
        }

        // Find the command in the map by its name
        auto it = commands.find(task[0]);
        if (it != commands.end()) {
            // Execute the command if found
            it->second->execute(task);
        } else {
            // Skip iteration if the command is not found
            menu->sendResponse("400 Bad Request");
            continue;
        }
    }
}

