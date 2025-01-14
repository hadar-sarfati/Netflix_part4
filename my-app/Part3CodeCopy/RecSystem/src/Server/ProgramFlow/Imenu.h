#ifndef IMENU_H
#define IMENU_H

#include <vector>  // Include the vector header
#include <string>
using namespace std;

// Define the abstract Imenu class
class Imenu {
public:
    // Pure virtual function nextCommand returns a vector
    virtual vector<string> nextCommand() = 0;  // Example with int type, change it based on your needs
};

#endif // IMENU_H
