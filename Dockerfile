#  Dockerfile for Netguru Backend

FROM node:14-alpine

# Create App Directory
WORKDIR /usr/src/app

# Install Dependencies
COPY package*.json ./

RUN npm install

# Copy app source code
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
