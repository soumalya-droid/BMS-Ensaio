# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your project files
COPY . .

# Build the project
RUN npm run build

# Expose port (Vite preview default)
EXPOSE 4173

# Start the preview server with host 0.0.0.0 for external access
CMD ["npx", "vite", "preview", "--host", "0.0.0.0"]
