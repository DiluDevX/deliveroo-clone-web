# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.11.1

# Base image
FROM node:${NODE_VERSION}-alpine as base
WORKDIR /app

# Dependencies stage
FROM base as deps
COPY package.json package-lock.json ./
RUN npm ci

# Build stage
FROM deps as build
COPY tsconfig.json ./
COPY tsconfig.app.json ./
COPY tsconfig.node.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY public ./public
COPY src ./src
RUN npm run build

# Production stage
FROM nginx:alpine as final

# Install Doppler CLI as root
RUN apk add --no-cache curl gnupg \
    && curl -Ls https://cli.doppler.com/install.sh | sh

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Create nginx config for SPA routing
RUN echo 'server { \
    listen 80; \
    listen [::]:80; \
    server_name deliveroo.web.test.dilum.me; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
    try_files $uri $uri/ /index.html; \
    } \
    location ~* \\\\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { \
    expires 1y; \
    add_header Cache-Control "public, immutable"; \
    } \
    }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

# Start Doppler and nginx
CMD ["doppler", "run", "--project", "deliveroo-clone-web", "--config", "dev", "--", "nginx", "-g", "daemon off"]
