#ifndef CONSOLEMENU_H
#define CONSOLEMENU_H

#include "Imenu.h"   // Interface for menu functionality
#include <vector>    // For using std::vector
#include <string>    // For using std::string

using namespace std;

// The ConsoleMenu class implements the Imenu interface
// and provides a console-based menu for user interaction
class ConsoleMenu : public Imenu {
public:
    // Constructor
    // Initializes a ConsoleMenu object
    ConsoleMenu();

    // Method to read and return the next command as a vector of strings
    // Splits the user input into parts based on spaces
    vector<string> nextCommand();
};

#endif // CONSOLEMENU_H
