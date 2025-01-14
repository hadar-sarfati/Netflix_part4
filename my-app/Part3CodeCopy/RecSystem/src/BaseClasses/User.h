#ifndef USER_H
#define USER_H

class User {
private:
    unsigned long int id; // Unique identifier for the user

public:
    // Constructor
    User(unsigned long int id);

    // Getter for the ID
    unsigned long int getId() const;

};

#endif // USER_H
