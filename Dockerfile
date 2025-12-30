# syntax=docker/dockerfile:1

# Dockerfile for Vite React application
# Builds the app and serves it using nginx

ARG NODE_VERSION=20

################################################################################
# Build stage - Install dependencies and build the application
FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source files
COPY . .

# Build the application
RUN npm run build

################################################################################
# Production stage - Serve static files with nginx
FROM nginx:alpine AS final

# Copy custom nginx config for SPA routing
COPY --from=build /app/dist /usr/share/nginx/html

# Create nginx config for SPA routing (handles client-side routing)
RUN echo 'server { \
    listen 80; \
    listen [::]:80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
    try_files $uri $uri/ /index.html; \
    } \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { \
    expires 1y; \
    add_header Cache-Control "public, immutable"; \
    } \
    }' > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
