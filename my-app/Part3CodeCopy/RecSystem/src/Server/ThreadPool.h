#ifndef THREADPOOL_H
#define THREADPOOL_H

#include <iostream>
#include <vector>
#include <queue>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <functional>
using namespace std;
class Server;


class ThreadPool {
public:
    // Constructor: Initializes the pool with a given number of threads + Server Instance
    ThreadPool(size_t numThreads, Server* serverInstance);

    // Destructor: Cleans up threads and resources
    ~ThreadPool();

    // Adds a new task (client socket) to the queue
    void addTask(int clientSocket);

private:
    // Worker thread function that handles client requests
    void workerFunction();

    // Reference to the Server instance
    Server* server;

    // Thread pool to manage worker threads
    vector<std::thread> workers;

    // Task queue to store client sockets
    queue<int> tasks;

    // Synchronization variables
    mutex queueMutex;
    condition_variable condition;

    // Flag to stop the worker threads
    bool stop;
};

#endif
