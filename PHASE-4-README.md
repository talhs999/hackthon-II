# Phase 4: Local Kubernetes Deployment

**Status:** ✅ COMPLETE

## Overview

Phase 4 implements containerization and local Kubernetes deployment for the Todo Chatbot application using Docker, Docker Compose, and Minikube with Helm Charts.

## What's Included

### 1. Docker Containerization ✅
- **Frontend Dockerfile**: Multi-stage Next.js build optimized for production
- **Backend Dockerfile**: Multi-stage Python FastAPI with health checks
- **.dockerignore files**: Optimized build context for both services

### 2. Docker Compose ✅
- Complete local development environment with:
  - PostgreSQL database
  - FastAPI backend with auto-reload
  - Next.js frontend with hot reloading
  - Health checks for all services
  - Volume mounts for development

### 3. Helm Charts ✅
- **Frontend Helm Chart**: Next.js deployment with:
  - Configurable replicas
  - Service and ingress
  - Auto-scaling (2-5 replicas)
  - Resource limits
  - Health probes

- **Backend Helm Chart**: FastAPI deployment with:
  - Database connectivity
  - Secrets management
  - Service and ingress
  - Auto-scaling
  - Health checks

### 4. Minikube Deployment Script ✅
- Automated deployment script (`minikube-deploy.sh`)
- Handles:
  - Minikube initialization
  - Ingress enablement
  - Docker image building
  - Namespace creation
  - Helm deployments

## Prerequisites

### Required Software
```bash
# Check if installed
docker --version          # v20.10+
docker-compose --version  # v2.0+
minikube version         # v1.28+
kubectl version          # v1.26+
helm version             # v3.10+
```

### System Requirements
- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Disk**: 20GB+ free space
- **Docker Desktop**: Enabled with WSL2 integration

## Quick Start

### 1. Local Development with Docker Compose

```bash
cd /home/talha/hackathon-2

# Build and start all services
docker-compose up -d

# Check logs
docker-compose logs -f frontend
docker-compose logs -f backend

# Access applications
Frontend:  http://localhost:3000
Backend:   http://localhost:8000

# Stop services
docker-compose down
```

### 2. Minikube Deployment

```bash
cd /home/talha/hackathon-2

# Run deployment script
./minikube-deploy.sh

# Monitor deployment
kubectl get pods -n todo-app
kubectl get svc -n todo-app

# View logs
kubectl logs -n todo-app -f deployment/todo-frontend
kubectl logs -n todo-app -f deployment/todo-backend

# Access dashboard
minikube dashboard
```

### 3. Manual Helm Deployment

```bash
# Start Minikube
minikube start --cpus 4 --memory 8192

# Build images
eval $(minikube docker-env)
docker build -t todo-frontend:latest ./frontend
docker build -t todo-backend:latest ./backend

# Create namespace
kubectl create namespace todo-app

# Deploy backend
helm install todo-backend ./helm/todo-backend \
  -n todo-app \
  --set image.pullPolicy=Never

# Deploy frontend
helm install todo-frontend ./helm/todo-frontend \
  -n todo-app \
  --set image.pullPolicy=Never

# Check deployment status
helm status todo-backend -n todo-app
helm status todo-frontend -n todo-app
```

## Directory Structure

```
hackathon-2/
├── frontend/
│   └── Dockerfile                 # Next.js multi-stage build
├── backend/
│   └── Dockerfile                 # FastAPI multi-stage build
├── helm/
│   ├── todo-frontend/
│   │   ├── Chart.yaml            # Frontend chart metadata
│   │   ├── values.yaml           # Frontend configuration
│   │   └── templates/            # Deployment, service, helpers
│   └── todo-backend/
│       ├── Chart.yaml            # Backend chart metadata
│       ├── values.yaml           # Backend configuration
│       └── templates/            # Deployment, service, secret
├── docker-compose.yml             # Local development stack
├── minikube-deploy.sh            # Automated Minikube deployment
└── PHASE-4-README.md             # This file
```

## Configuration

### Environment Variables

Create `.env` file in project root:

```bash
# Backend
OPENAI_API_KEY=your-key-here
BETTER_AUTH_SECRET=your-secret-here
DATABASE_URL=postgresql://todouser:todopass123@postgres:5432/todo_db

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Helm Values

Customize deployments by modifying:
- `helm/todo-frontend/values.yaml`
- `helm/todo-backend/values.yaml`

Key options:
```yaml
replicaCount: 2              # Number of replicas
resources:
  limits:
    cpu: 500m               # CPU limit
    memory: 512Mi          # Memory limit
autoscaling:
  enabled: true            # Enable auto-scaling
  minReplicas: 2
  maxReplicas: 5
```

## Useful Commands

### Docker Compose

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild images
docker-compose build --no-cache

# Execute command in container
docker-compose exec backend bash
```

### Kubernetes

```bash
# Get resources
kubectl get pods -n todo-app
kubectl get svc -n todo-app
kubectl get ing -n todo-app

# View logs
kubectl logs -n todo-app -f deployment/todo-frontend
kubectl logs -n todo-app -f deployment/todo-backend

# Port forward (access locally)
kubectl port-forward -n todo-app svc/todo-frontend 3000:80
kubectl port-forward -n todo-app svc/todo-backend 8000:80

# Describe resource
kubectl describe pod -n todo-app <pod-name>

# Execute command
kubectl exec -n todo-app <pod-name> -it -- bash

# Delete deployment
kubectl delete -n todo-app deployment todo-frontend
kubectl delete -n todo-app deployment todo-backend
```

### Helm

```bash
# List releases
helm list -n todo-app

# Get values
helm get values todo-backend -n todo-app

# Upgrade release
helm upgrade todo-backend ./helm/todo-backend -n todo-app

# Rollback release
helm rollback todo-backend 1 -n todo-app

# Delete release
helm uninstall todo-backend -n todo-app
```

### Minikube

```bash
# Start Minikube
minikube start --cpus 4 --memory 8192

# Stop Minikube
minikube stop

# Delete Minikube
minikube delete

# Get Minikube IP
minikube ip

# SSH into Minikube
minikube ssh

# Open dashboard
minikube dashboard

# Enable addon
minikube addons enable ingress

# Tunnel for NodePort access
minikube tunnel
```

## Troubleshooting

### Docker Issues

**Problem**: Docker daemon not running
```bash
# Solution: Start Docker Desktop from Applications
# Or use WSL integration: Enable in Docker Desktop settings
```

**Problem**: Port already in use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Kubernetes Issues

**Problem**: Pods not starting
```bash
# Check pod status
kubectl describe pod -n todo-app <pod-name>

# Check events
kubectl get events -n todo-app

# Check resource requests
kubectl top nodes
kubectl top pods -n todo-app
```

**Problem**: ImagePullBackOff
```bash
# Solution: Build images in Minikube context
eval $(minikube docker-env)
docker build -t todo-backend:latest ./backend
```

**Problem**: Service not accessible
```bash
# Check service
kubectl get svc -n todo-app

# Check ingress
kubectl get ing -n todo-app

# Enable port forward
kubectl port-forward -n todo-app svc/todo-frontend 3000:80
```

### Helm Issues

**Problem**: Release already exists
```bash
# Delete and reinstall
helm uninstall todo-backend -n todo-app
helm install todo-backend ./helm/todo-backend -n todo-app
```

**Problem**: Template rendering errors
```bash
# Validate chart
helm lint ./helm/todo-backend

# Debug template
helm template todo-backend ./helm/todo-backend -n todo-app
```

## Performance Optimization

### Resource Limits
Adjust in `helm/*/values.yaml`:
```yaml
resources:
  limits:
    cpu: 1000m        # Increase for more CPU
    memory: 1Gi       # Increase for more memory
  requests:
    cpu: 500m
    memory: 512Mi
```

### Auto-scaling
Configure in `helm/*/values.yaml`:
```yaml
autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10           # Increase limit
  targetCPUUtilizationPercentage: 70  # Lower for more aggressive scaling
```

### Database Connection Pooling
Backend database configuration for production:
```bash
# In DATABASE_URL
postgresql://user:pass@host:5432/db?max_connections=20
```

## Security Considerations

### For Development (Minikube)
✅ Current setup is suitable for local development

### For Production (Next Phase)
⚠️ Before deploying to cloud:
1. Use sealed secrets or external secret management
2. Enable RBAC
3. Configure network policies
4. Use resource quotas
5. Enable pod security policies
6. Use private image registries
7. Enable audit logging

## Next Steps (Phase 5)

Phase 5 will add:
- ✨ Advanced features (recurring tasks, due dates, reminders)
- 📨 Kafka event streaming
- 🔄 Dapr for distributed application runtime
- ☁️ Cloud deployment (Azure/GCP/Oracle)
- 🔐 Production-grade security

## Support & Resources

- **Minikube Docs**: https://minikube.sigs.k8s.io/
- **Helm Docs**: https://helm.sh/docs/
- **Kubernetes Docs**: https://kubernetes.io/docs/
- **Docker Docs**: https://docs.docker.com/

---

**Last Updated**: January 3, 2026
**Phase Status**: ✅ COMPLETE
**Next Phase**: Phase 5 - Advanced Cloud Deployment
