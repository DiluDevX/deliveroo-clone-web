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

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Start Doppler and nginx
CMD ["doppler", "run", "--project", "deliveroo-clone-web", "--config", "dev", "--", "nginx", "-g", "daemon off"]
