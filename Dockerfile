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

EXPOSE 80

# Start Doppler and nginx
CMD ["doppler", "run", "--project", "deliveroo-clone-web", "--config", "dev", "--", "nginx", "-g", "daemon off"]
