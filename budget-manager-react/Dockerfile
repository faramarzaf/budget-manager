# Stage 1: Use an official Node.js runtime as the base image.
# 'alpine' is a lightweight version, making our image smaller.
FROM node:20-alpine

# Set the working directory inside the container to '/app'.
# All subsequent commands (COPY, RUN, CMD) will be run from this directory.
WORKDIR /app

# Copy the package.json and package-lock.json files first.
# This is a critical optimization. Docker caches layers. If these files
# haven't changed, Docker will use the cached 'npm install' layer from a
# previous build, making subsequent builds much faster.
COPY package*.json ./

# Run 'npm install' to download all the project dependencies
# defined in package.json into the container's node_modules folder.
RUN npm install

# Now, copy the rest of your application's source code (src, public, etc.)
# into the container.
COPY . .

# The React development server runs on port 3000 by default.
# The EXPOSE instruction documents which port the container will listen on.
EXPOSE 3000

# The default command to run when the container starts.
# This executes 'npm start', which launches the React development server.
CMD ["npm", "start"]