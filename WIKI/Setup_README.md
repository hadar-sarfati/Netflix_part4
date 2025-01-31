# Getting Started

Here we will explain how to set up the docker for the project, and then run it - Web and Android App.

### Prerequisites
- **C++17 or later**: The program is built using C++17 or a later version.
- **Docker**: Docker is required to build and run the application in a containerized environment.
- **CMake**: If you're interested in runninig locally, CMake is required.
- **Node.js (v16+)**: For running the Node.js server. Comes with npm.
- **MongoDB**: Required for storing the data of the Node.js server.
- **Android Studio**: Required for running the android app.

## Docker

First, inside `Part3Servers`, make sure you have the config folder with these files:
*The config folder is on github, but I'm writing this just in case for precaution*

`.env.local`:
```bash
CONNECTION_STRING=mongodb://localhost:27017/mydatabase
PORT=3001
MRS_IP='localhost'
MRS_PORT=8080
JWT_SECRET=my-super-secret-key-123456789
```

`.env.production`:

```bash
CONNECTION_STRING="mongodb://mongo:27017/netflix-db"
PORT=3000
MRS_IP="server"
MRS_PORT=19845
JWT_SECRET=my-super-secret-key-123456789
```

### Running With Docker

*Note: When running with docker please make sure you don't have a pre-existing build folder.*

Run the following command to build the Docker containers:

```bash
docker-compose build
```

Now, run the following command:

```bash
docker-compose run --rm --name server server 19845
```

In a **new terminal**, run the following command:

```bash
docker-compose -f docker-compose.yml run --rm --name web-server --service-ports web-server
```

A worthy note for you Docker users:
Using volumes means even between building the Docker multiple times the same data will be stored in the volume.
Only if you intetionally want to delete the database you used and start fresh, use:
```bash
docker volume rm netflix_part3_mongo_data
```
This will delete your volume.

## Using the Website

After the docker is running, you can just go to:

```bash
http://localhost:3000
```

and run the website.

## Using the Android App

After the docker is running, open your android studio with our android project.
Open the `strings.xml` file, and adjust the port to 3000 in the addresses. The ip address should be of your own computer.

It should look like this (pay attention the IP address will be changed according to your pc):


Now you can plug an android phone or use the emulator, and run! The app will start and you can enjoy it.

## Running Locally

Incase you're intrested in running locally, please pay attention more carefully of the prerequisites.

Open your VS Code with our project.

In the first terminal, run:

```bash
cd Part3Servers/RecSystem
mkdir build && cd build
cmake ..
make
./netflix 8080
```

This will run the recommendations server.

In the second terminal, run:

```bash
cd Part3Servers
npm run start-local
```

Now, only if you're interested in running the website, go ahead and in a third terminal, run:

```bash
npm start
```

this will launch our website.

If you're interested in running the Android app, the first two terminals should run, and on android studio you should:
Load our project.
Then go to `strings.xml`, and make sure that the port is `3001`.
The IP address should be the same as eariler.
Now you can run the app through android studio normally.

**Enjoy ShowTime!**