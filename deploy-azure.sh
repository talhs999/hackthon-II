#!/bin/bash

# Azure AKS Deployment Script for Todo App
# Prerequisites: az CLI installed and authenticated

set -e

RESOURCE_GROUP="todo-app-rg"
CLUSTER_NAME="todo-app-aks"
LOCATION="eastus"
NODE_COUNT=2
VM_SIZE="Standard_B2s"

echo "═══════════════════════════════════════════════════════════════"
echo "🚀 Deploying Todo App to Azure AKS"
echo "═══════════════════════════════════════════════════════════════"

# Create resource group
echo "📦 Creating resource group..."
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION

# Create AKS cluster
echo "🔧 Creating AKS cluster..."
az aks create \
  --resource-group $RESOURCE_GROUP \
  --name $CLUSTER_NAME \
  --node-count $NODE_COUNT \
  --vm-set-type VirtualMachineScaleSets \
  --load-balancer-sku standard \
  --enable-managed-identity \
  --network-plugin azure \
  --node-vm-size $VM_SIZE

# Get credentials
echo "🔐 Getting cluster credentials..."
az aks get-credentials \
  --resource-group $RESOURCE_GROUP \
  --name $CLUSTER_NAME

# Create namespace
echo "📂 Creating namespace..."
kubectl create namespace todo-app || true

# Add Helm repos
echo "📚 Adding Helm repositories..."
helm repo add stable https://charts.helm.sh/stable
helm repo add dapr https://dapr.github.io/helm-charts
helm repo update

# Install Dapr
echo "🔄 Installing Dapr..."
helm install dapr dapr/dapr \
  --namespace dapr-system \
  --create-namespace \
  --set global.ha.enabled=true

# Deploy PostgreSQL
echo "🗄️ Deploying PostgreSQL..."
helm install postgres stable/postgresql \
  --namespace todo-app \
  --set auth.username=todouser \
  --set auth.password=todopass123 \
  --set auth.database=todo_db \
  --set primary.persistence.size=10Gi

# Deploy Kafka
echo "📨 Deploying Kafka..."
helm install kafka ./helm/kafka -n todo-app

# Deploy backend
echo "🔙 Deploying backend..."
helm install todo-backend ./helm/todo-backend -n todo-app

# Deploy frontend
echo "🎨 Deploying frontend..."
helm install todo-frontend ./helm/todo-frontend -n todo-app

# Wait for deployments
echo "⏳ Waiting for deployments..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/instance=todo-backend -n todo-app --timeout=300s
kubectl wait --for=condition=ready pod -l app.kubernetes.io/instance=todo-frontend -n todo-app --timeout=300s

# Get service info
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "✅ Deployment Complete!"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "📊 Cluster Information:"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  Cluster Name: $CLUSTER_NAME"
echo "  Location: $LOCATION"
echo ""
echo "🔗 Access Applications:"
FRONTEND_IP=$(kubectl get svc -n todo-app todo-frontend -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "pending")
BACKEND_IP=$(kubectl get svc -n todo-app todo-backend -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "pending")

echo "  Frontend: http://$FRONTEND_IP:80"
echo "  Backend: http://$BACKEND_IP:80"
echo ""
echo "📝 Useful Commands:"
echo "  kubectl get pods -n todo-app"
echo "  kubectl logs -n todo-app -f deployment/todo-backend"
echo "  helm status todo-backend -n todo-app"
echo ""
echo "🧹 To cleanup:"
echo "  az group delete --name $RESOURCE_GROUP"
