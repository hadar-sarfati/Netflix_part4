#include "ThreadPool.h"
#include "Server.h"


/**
 * @brief ThreadPool Constructor: Receives a number of threads and a server instance.
 */
ThreadPool::ThreadPool(size_t numThreads, Server* serverInstance) : stop(false), server(serverInstance) {
    // Create and launch worker threads
    for (size_t i = 0; i < numThreads; ++i) {
        // Each thread runs the workerFunction, which processes tasks from the task queue
        workers.emplace_back([this]() { workerFunction(); });
    }
}

/**
 * @brief ThreadPool Desstructor: Stops worker threads and waits for all threads to stop.
 */
ThreadPool::~ThreadPool() {
    {
        // Locking the queue to access safely (to ensure no new tasks are added)
        unique_lock<mutex> lock(queueMutex);
        stop = true; // Indicator for the ThreadPool to stop
    }

    // Notify all threads to wake up and check the stop condition
    condition.notify_all();

    // Wait for all worker threads to finish processing
    for (thread &worker : workers) {
        if (worker.joinable()) {
            worker.join();
        }
    }
}

/**
 * @brief addTask: adding a clientSocket to the queue, in order for a thread to use it.
 */
void ThreadPool::addTask(int clientSocket) {
    {
        // Using a mutex to ensure the queue is managed properly
        unique_lock<mutex> lock(queueMutex);
        tasks.push(clientSocket);
    }
    condition.notify_one();
}

/**
 * @brief workerFunction: The function executed by each worker thread in the pool.
 * The function waits for new client sockets to be added to the queue.
 * Once a task (client socket) is available, it is handled using the Server's handleClient function.
 */
void ThreadPool::workerFunction() {
    while (true) {
        int clientSocket;

        // Locking the mutex to access the queue safely
        {
            unique_lock<mutex> lock(queueMutex);

            // Wait for a new available task or for the stop flag to be set
            condition.wait(lock, [this]() { return stop || !tasks.empty(); });

             // If stop is true and the task queue is empty, exit the loop (end the thread)
            if (stop && tasks.empty()) {
                return;
            }
            // Get the next clientSocket from the task queue
            clientSocket = tasks.front();
            // Remove the clientSocket from the queue
            tasks.pop();
        }

        // Handle the client request by calling handleClient from the Server
        server->handleClient(clientSocket);
    }
}
