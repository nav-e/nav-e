FROM node:6-slim

# Create application directory
WORKDIR /src

# Install dependencies
COPY package.json /src/package.json
RUN npm install

# Copy application into the build image
COPY . /src

# Create a volume into which the `npm run build` will build the application
VOLUME /src/build

# Map port 3000
EXPOSE 3000

# Start Application
CMD [ "npm", "start" ]
