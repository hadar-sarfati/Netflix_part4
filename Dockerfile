# FROM node:22

# COPY .. /usr/src/netflix
# WORKDIR /usr/src/netflix/web

# # Install npm dependencies
# RUN npm install

# ENV NODE_ENV=production

# ENTRYPOINT ["npm", "start"]
FROM node:22

COPY ./Part3Servers /usr/src/netflix
COPY ./my-app /usr/src/react

WORKDIR /usr/src/react

# set dev mode to false
# RUN echo "export const isDevMode = false;" > ./src/Constants/devMode.js

# install npm dependencies
RUN npm install

# build react app
RUN npm run build

# copy build files to web-server's public directory
# RUN mkdir -p /usr/src/react/public
RUN cp -r build/* /usr/src/react/public

WORKDIR /usr/src/netflix/web

# Install npm dependencies
RUN npm install

ENV NODE_ENV=production

ENTRYPOINT ["npm", "start"]


# FROM node:22

# COPY ./web-server /usr/source
# COPY ./react-client /usr/react

# WORKDIR /usr/react

# # set dev mode to false
# RUN echo "export const isDevMode = false;" > ./src/Constants/devMode.js

# # install npm dependencies
# RUN npm install

# # build react app
# RUN npm run build

# # copy build files to web-server's public directory
# RUN cp -r build/* /usr/source/public

# WORKDIR /usr/source

# # install npm dependencies
# RUN npm install

# ENV NODE_ENV=production

# ENTRYPOINT ["npm", "start"]