# Start from the latest GCC image
FROM gcc:latest

# Install CMake and other necessary tools
RUN apt-get update && apt-get install -y cmake g++ wget

# Set the working directory in the container
WORKDIR /usr/src/mytest

# Copy the entire src directory into the working directory
COPY src /usr/src/mytest/src
COPY src/TESTS /usr/src/mytest/src/TESTS

# Create a build directory
RUN mkdir build

# Change the working directory to the build directory
WORKDIR /usr/src/mytest/build

# Run CMake with the correct path to the CMakeLists.txt for tests
RUN cmake /usr/src/mytest/src/TESTS && make

# Run the tests after building
CMD ["./runTests"]
