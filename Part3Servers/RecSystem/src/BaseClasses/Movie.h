#ifndef MOVIE_H
#define MOVIE_H

class Movie {
private:
    unsigned long int id; // Unique identifier for the user

public:
    // Constructor
    Movie(unsigned long int id);

    // Getter for the ID
    unsigned long int getId() const;

};

#endif  