# Use a Node.js base image
FROM node:20-alpine AS development

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

# Stage for production build
FROM node:20-alpine AS production

WORKDIR /app

# Copy built application from development stage
COPY --from=development /app/node_modules ./node_modules
COPY --from=development /app/dist ./dist
COPY --from=development /app/package*.json ./

# Expose the port your NestJS app listens on (e.g., 3000)
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]