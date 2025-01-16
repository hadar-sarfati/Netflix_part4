#ifndef HANDLEUSERINPUT_H
#define HANDLEUSERINPUT_H

#include <vector>
#include <string>
using namespace std;

class HandleUserInput {
public:
    virtual ~HandleUserInput() = default;
    bool validateInput(const vector<string>& enters);
    vector<string> removeFirstItem(const vector<string>& original);

    // Function to print "404 not found"
    void printNotFound();

    // Function to print "400 bad request"
    void printBadRequest();
};

#endif // HANDLEUSERINPUT_H