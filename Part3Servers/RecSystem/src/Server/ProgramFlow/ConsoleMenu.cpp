#include "ConsoleMenu.h"  // Header file for ConsoleMenu class
#include <iostream>       // For std::cin and std::getline
#include <sstream>        // For std::stringstream
#include <vector>         // For std::vector
#include <string>         // For std::string
#include <cctype>         // For isprint() and isspace()

// Constructor for ConsoleMenu
ConsoleMenu::ConsoleMenu() {
    // No specific initialization required
}

// Method to read the next command from the user and split it into parts
vector<string> ConsoleMenu::nextCommand() {
    // Read the full line of input from the user
    string input;
    getline(cin, input);

    // Check if the input contains any invalid characters
    // Valid characters: printable characters and whitespace
    for (char c : input) {
        if (!isspace(c) && !isprint(c)) {
            // Return an empty vector if invalid characters are found
            return {};
        }
    }

    // Use a stringstream to split the input into words
    stringstream ss(input);
    vector<string> commandParts;
    string word;

    // Extract words from the input and store them in the vector
    while (ss >> word) {
        commandParts.push_back(word);
    }

    // Return the vector containing the split command
    return commandParts;
}
