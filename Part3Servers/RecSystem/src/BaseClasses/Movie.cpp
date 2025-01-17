#include "Movie.h"

using namespace std;

// Constructor implementation
Movie::Movie(unsigned long int id) : id(id) {}

// Getter implementation
unsigned long int Movie::getId() const {
    return id;
}