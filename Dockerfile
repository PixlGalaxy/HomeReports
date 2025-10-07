
# Build Frontend (React + Vite)

FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Build Backend (FastAPI)

FROM python:3.12-slim AS backend
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./
COPY --from=frontend-build /frontend/dist /app/static


# Final Image with Nginx + Backend

FROM nginx:1.27-alpine

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy static files from frontend build
COPY --from=frontend-build /frontend/dist /usr/share/nginx/html

# Copy backend code and dependencies
COPY --from=backend /app /app

# Install Python runtime
RUN apk add --no-cache python3 py3-pip && pip install fastapi uvicorn httpx pyyaml python-multipart

WORKDIR /app
EXPOSE 80

# Run both FastAPI (on port 8000) and Nginx (on port 80)
CMD sh -c "uvicorn app:app --host 0.0.0.0 --port 8000 & nginx -g 'daemon off;'"
