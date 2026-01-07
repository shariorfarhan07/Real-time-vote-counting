# Docker Setup for Real-Time Voting Application

This document explains how to run the Real-Time Voting application using Docker Compose.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Quick Start

1. **Build and start all services:**
   ```bash
   docker-compose up -d --build
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f
   ```

3. **Stop all services:**
   ```bash
   docker-compose down
   ```

4. **Stop and remove volumes:**
   ```bash
   docker-compose down -v
   ```

## Access the Application

- **Frontend (Voting Page):** http://localhost:5555
- **Backend API:** http://localhost:5556
- **WebSocket Server:** ws://localhost:5556

## Services

### Backend Service
- **Port:** 5556
- **Container:** voting-backend
- **Technology:** Node.js with Express and WebSocket

### Frontend Service
- **Port:** 5555
- **Container:** voting-frontend
- **Technology:** React app served via Nginx

## Environment Variables

### Backend
- `PORT`: Server port (default: 5556)

### Frontend
- `REACT_APP_WS_URL`: WebSocket URL (default: ws://localhost:5556)

To customize, edit the `docker-compose.yml` file.

## Development vs Production

### Development
For development, you can mount volumes to enable hot-reload:

```yaml
volumes:
  - ./backend:/app
  - /app/node_modules
```

### Production
The current setup is optimized for production with:
- Multi-stage builds for smaller images
- Nginx for serving static files
- Health checks for service monitoring
- Automatic restarts on failure

## Troubleshooting

### Check service status
```bash
docker-compose ps
```

### View logs for a specific service
```bash
docker-compose logs backend
docker-compose logs frontend
```

### Rebuild a specific service
```bash
docker-compose build backend
docker-compose build frontend
```

### Restart a specific service
```bash
docker-compose restart backend
docker-compose restart frontend
```

### Access container shell
```bash
docker-compose exec backend sh
docker-compose exec frontend sh
```

## Network

All services are connected via a bridge network (`voting-network`) allowing them to communicate with each other using service names.

## Health Checks

Both services include health checks:
- **Backend:** Checks `/api/state` endpoint
- **Frontend:** Checks nginx server response

## Notes

- The frontend WebSocket URL is set during build time. If you need to change it, rebuild the frontend service.
- For production deployments, consider using environment-specific configurations.
- The backend state is stored in memory and will reset when the container restarts.

