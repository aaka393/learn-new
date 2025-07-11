# Step 1: Build the Vite app
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Vite app
RUN npm run build

# Step 2: Serve the app with Nginx
FROM nginx:stable-alpine

# Copy the built files from the previous step to the Nginx web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration to handle API proxying
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]