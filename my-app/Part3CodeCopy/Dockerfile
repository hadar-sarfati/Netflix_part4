FROM node:22

COPY .. /usr/src/netflix
WORKDIR /usr/src/netflix/web

# Install npm dependencies
RUN npm install

ENV NODE_ENV=production

ENTRYPOINT ["npm", "start"]