# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Build argument for WebSocket URL (optional - leave empty for auto-detection)
ARG REACT_APP_WS_URL=""
ENV REACT_APP_WS_URL=$REACT_APP_WS_URL

# Build the React app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 5555

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

