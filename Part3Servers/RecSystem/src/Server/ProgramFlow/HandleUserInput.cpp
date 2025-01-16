#include "HandleUserInput.h"
#include <string>
#include <iostream>

using namespace std;

vector<string> HandleUserInput::removeFirstItem(const vector<string>& original) {
    vector<string> newVector = original;
    if (!newVector.empty()) {
        newVector.erase(newVector.begin()); // Remove the first element
    }
    return newVector;
}

bool HandleUserInput::validateInput(const vector<string>& enters) {
    // Ensure the vector is not empty
    if (enters.empty()) {
        return false;
    }
    if (enters.size() < 2) {
        return false;
    }
    // Check if all strings in the vector are numeric
    for (const auto& str : enters) {
        for (char c : str) {
            if (!isdigit(c)) { // Check if the character is not a digit
                return false;
            }
        }
    }
    return true; // All inputs are numeric
}
