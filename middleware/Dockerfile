# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Make port 4001 available to the world outside this container
EXPOSE 4001

# Define the command to run the app
CMD [ "npm", "start" ]
