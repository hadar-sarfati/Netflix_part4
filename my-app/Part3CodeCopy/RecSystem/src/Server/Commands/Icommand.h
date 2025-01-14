#ifndef ICOMMAND_H
#define ICOMMAND_H
#include <string> 
#include <vector>
#include <mutex>
using namespace std;


// Abstract class Icommand with a pure virtual execute function
class Icommand {
public:
    virtual ~Icommand() = default; // Virtual destructor for interface
    virtual void execute(vector <string>) = 0;   // Pure virtual function to be implemented by derived classes
};

#endif // ICOMMAND_H
