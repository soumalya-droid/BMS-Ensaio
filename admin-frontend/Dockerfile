# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your project files
COPY . .

# Expose port (Vite dev default)
EXPOSE 5173

# Start the dev server with host 0.0.0.0 for external access
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
