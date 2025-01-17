#ifndef APP_H
#define APP_H

#include <map>       // For using std::map
#include <string>    // For using std::string
#include "../Commands/Icommand.h" // Interface for commands
#include "ServerMenu.h"    // Interface for menu functionality

using namespace std;

// The App class coordinates the interaction between a menu system and a set of commands
class App {
private:
    ServerMenu* menu; // Pointer to a menu interface for user interaction
    map<string, Icommand*> commands; // Map of command names to command objects

public:
    // Constructor
    // Initializes the App with a menu and a map of commands
    App(ServerMenu* menu, map<string, Icommand*> commands);

    // Run method
    // Starts the application loop to process user commands
    void run();
};

#endif // APP_H
