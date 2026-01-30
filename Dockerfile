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
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY public ./public
COPY src ./src
RUN npm run build

# Production stage
FROM nginx:alpine as final

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: Copy custom Nginx config (SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Install Doppler CLI if you need secrets
RUN apk add --no-cache curl gnupg \
    && curl -Ls https://cli.doppler.com/install.sh | sh

EXPOSE 80

# Start Doppler and Nginx
CMD ["doppler", "run", "--project", "deliveroo-clone-web", "--config", "dev", "--", "nginx", "-g", "daemon off;"]
