# Use official Node.js image
FROM node:20

# Set work dir
WORKDIR /

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Expose port and run
EXPOSE 3000
CMD ["node", "index.mjs"]

