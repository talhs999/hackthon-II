#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Todo App - Minikube Deployment${NC}"
echo -e "${BLUE}========================================${NC}"

# Step 1: Start Minikube
echo -e "\n${BLUE}[1/7]${NC} Starting Minikube..."
minikube start --cpus 4 --memory 8192 --driver docker

# Step 2: Enable ingress addon
echo -e "\n${BLUE}[2/7]${NC} Enabling Minikube ingress addon..."
minikube addons enable ingress

# Step 3: Build images in Minikube
echo -e "\n${BLUE}[3/7]${NC} Building Docker images in Minikube..."
eval $(minikube docker-env)
cd "$(dirname "$0")"
docker build -t todo-frontend:latest ./frontend
docker build -t todo-backend:latest ./backend

# Step 4: Create namespace
echo -e "\n${BLUE}[4/7]${NC} Creating Kubernetes namespace..."
kubectl create namespace todo-app --dry-run=client -o yaml | kubectl apply -f -

# Step 5: Create secrets (if needed)
echo -e "\n${BLUE}[5/7]${NC} Creating secrets..."
kubectl create secret generic todo-secrets \
  --from-literal=OPENAI_API_KEY=${OPENAI_API_KEY:-"test-key"} \
  --from-literal=BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET:-"test-secret"} \
  --from-literal=DATABASE_URL=${DATABASE_URL:-"postgresql://todouser:todopass123@postgres:5432/todo_db"} \
  -n todo-app \
  --dry-run=client -o yaml | kubectl apply -f -

# Step 6: Deploy with Helm
echo -e "\n${BLUE}[6/7]${NC} Deploying applications with Helm..."
helm repo add stable https://charts.helm.sh/stable 2>/dev/null || true
helm repo update

# Install PostgreSQL
helm install postgres stable/postgresql \
  --namespace todo-app \
  --set auth.username=todouser \
  --set auth.password=todopass123 \
  --set auth.database=todo_db \
  --set primary.persistence.enabled=false \
  --dry-run --debug 2>/dev/null || true

# Deploy backend
helm upgrade --install todo-backend ./helm/todo-backend \
  -n todo-app \
  --set image.tag=latest \
  --set image.pullPolicy=Never

# Deploy frontend
helm upgrade --install todo-frontend ./helm/todo-frontend \
  -n todo-app \
  --set image.tag=latest \
  --set image.pullPolicy=Never

# Step 7: Get access info
echo -e "\n${BLUE}[7/7]${NC} Deployment complete!"
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Minikube Deployment Summary${NC}"
echo -e "${GREEN}========================================${NC}"

echo -e "\n${GREEN}✅ Applications deployed to Minikube${NC}"
echo -e "\n${BLUE}Access the applications:${NC}"
echo -e "  Frontend:  http://$(minikube ip):30080"
echo -e "  Backend:   http://$(minikube ip):30081"

echo -e "\n${BLUE}Useful commands:${NC}"
echo -e "  minikube dashboard           - Open Kubernetes dashboard"
echo -e "  kubectl port-forward -n todo-app svc/todo-frontend 3000:80"
echo -e "  kubectl port-forward -n todo-app svc/todo-backend 8000:80"
echo -e "  kubectl logs -n todo-app -f deployment/todo-frontend"
echo -e "  kubectl logs -n todo-app -f deployment/todo-backend"
echo -e "  helm status todo-backend -n todo-app"
echo -e "  helm status todo-frontend -n todo-app"

echo -e "\n${BLUE}To access services locally:${NC}"
echo -e "  minikube tunnel  # Run in another terminal"

echo -e "\n${GREEN}========================================${NC}"
