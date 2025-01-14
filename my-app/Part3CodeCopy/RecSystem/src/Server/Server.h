#ifndef SERVER_H
#define SERVER_H
#include <string>
#include <map>
#include <vector>
#include <thread>
#include <atomic>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include "ThreadPool.h"
using namespace std;

class Server {
private:
    int port;                     // Port on which the server will listen
    int server_fd;                // Server socket file descriptor
    struct sockaddr_in address;   // Server address struct
    atomic<bool> isRunning;       // Atomic bool to indicate running status
    ThreadPool* threadPool;       // Pointer to the ThreadPool object

public:
    // Constructor for Server
    Server(int port);
    // Destructor for Server
    ~Server();
    // Sets up the server: creates, binds, and listens
    void setupServer();
    // Runs the server to accept client connections
    void run();
    // Function to stop the server
    void stop();
    // Get the status of the server - running or not
    bool getStatus();
    // Function to be passed to a thread to communicate with the client
    static void handleClient(int client_socket);

};

#endif // SERVER_H