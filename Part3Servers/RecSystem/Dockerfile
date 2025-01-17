# Use the GCC base image
FROM gcc:latest

# Install CMake
RUN apt-get update && apt-get install -y cmake

# Set the working directory inside the container
WORKDIR /usr/src/netflix

# Copy the project files into the container
COPY . .

# Create a build directory and build the project using CMake
RUN mkdir build && cd build && \
    cmake .. && \
    make

# Set the working directory to the build directory
WORKDIR /usr/src/netflix/build

# Copy the data directory (e.g., db_movies.txt) to the build directory
RUN cp -r ../data .


# Use ENTRYPOINT for runtime arguments
ENTRYPOINT ["./netflix"]
