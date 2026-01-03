#!/bin/bash

# GCP GKE Deployment Script for Todo App
# Prerequisites: gcloud CLI installed and authenticated

set -e

PROJECT_ID=$(gcloud config get-value project)
CLUSTER_NAME="todo-app-gke"
ZONE="us-central1-a"
NUM_NODES=2
MACHINE_TYPE="n1-standard-2"

echo "═══════════════════════════════════════════════════════════════"
echo "🚀 Deploying Todo App to GCP GKE"
echo "═══════════════════════════════════════════════════════════════"

# Create GKE cluster
echo "🔧 Creating GKE cluster..."
gcloud container clusters create $CLUSTER_NAME \
  --zone $ZONE \
  --num-nodes $NUM_NODES \
  --machine-type $MACHINE_TYPE \
  --enable-stackdriver-kubernetes \
  --addons HorizontalPodAutoscaling,HttpLoadBalancing,GcePersistentDiskCsiDriver

# Get credentials
echo "🔐 Getting cluster credentials..."
gcloud container clusters get-credentials $CLUSTER_NAME --zone $ZONE

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
  --set auth.database=todo_db

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

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "✅ Deployment Complete!"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "📊 Cluster Information:"
echo "  Project ID: $PROJECT_ID"
echo "  Cluster Name: $CLUSTER_NAME"
echo "  Zone: $ZONE"
echo ""
echo "🔗 Access Applications:"
echo "  kubectl get svc -n todo-app"
echo ""
echo "📝 Useful Commands:"
echo "  gcloud container clusters list"
echo "  kubectl get pods -n todo-app"
echo "  kubectl logs -n todo-app -f deployment/todo-backend"
echo ""
echo "🧹 To cleanup:"
echo "  gcloud container clusters delete $CLUSTER_NAME --zone $ZONE"
