# Stage 1: Build React/Vite app
FROM node:20 AS builder

WORKDIR /app

# Copy package file (avoiding Windows-locked package-lock.json)
COPY package.json ./
RUN npm install --include=optional

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve using lightweight Nginx
FROM nginx:alpine

# Copy built static files from Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx proxy configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
