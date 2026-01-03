# 🚀 Todo Chatbot - Hackathon Project

A full-stack Todo application with AI-powered chatbot, built with modern technologies and deployed on Kubernetes.

## 📋 Project Status

- **Phase 1-2**: ✅ COMPLETE - Web Application with authentication
- **Phase 3**: ✅ COMPLETE - Chatbot with AI learning and animations
- **Phase 4**: ✅ COMPLETE - Local Kubernetes deployment
- **Phase 5**: ⏳ IN PROGRESS - Advanced features + Cloud deployment

## 🏗️ Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Frontend  │         │   Backend   │         │  Database   │
│  Next.js    │◄───────►│  FastAPI    │◄───────►│  Neon DB    │
│             │         │             │         │             │
└─────────────┘         └─────────────┘         └─────────────┘
      │                        │
      │                        ▼
      │                  ┌─────────────┐
      │                  │   Chatbot   │
      └─────────────────►│   Service   │
                         │  (MCP Tools)│
                         └─────────────┘
```

## 📁 Project Structure

```
hackathon-2/
├── frontend/                   # Next.js application
│   ├── Dockerfile             # Production-ready Docker image
│   ├── app/                   # App Router pages
│   ├── components/            # React components
│   └── lib/                   # Utilities and API client
├── backend/                    # FastAPI application
│   ├── Dockerfile             # Python multi-stage build
│   ├── main.py                # FastAPI application
│   ├── routes/                # API endpoints
│   ├── models/                # Database models
│   └── openai_agent.py        # AI chatbot engine
├── helm/                       # Kubernetes Helm charts
│   ├── todo-frontend/         # Frontend chart
│   └── todo-backend/          # Backend chart
├── docker-compose.yml         # Local dev environment
├── minikube-deploy.sh         # Automated K8s deployment
├── PHASE-4-README.md          # Phase 4 documentation
└── README.md                  # This file
```

## 🚀 Quick Start

### Option 1: Docker Compose (Local Development)

```bash
cd /home/talha/hackathon-2

# Start all services
docker-compose up -d

# Access applications
# Frontend:  http://localhost:3000
# Backend:   http://localhost:8000
```

### Option 2: Minikube Deployment

```bash
cd /home/talha/hackathon-2

# Run automated deployment script
./minikube-deploy.sh

# Access applications via Minikube
minikube tunnel  # In another terminal

# Visit: http://localhost:3000
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Advanced animations
- **Better Auth** - Authentication

### Backend
- **FastAPI** - Modern Python web framework
- **SQLModel** - ORM with type hints
- **Neon PostgreSQL** - Cloud database
- **OpenAI API** - AI/Chatbot capabilities
- **MCP** - Model Context Protocol integration

### Infrastructure
- **Docker** - Containerization
- **Kubernetes/Minikube** - Orchestration
- **Helm** - Package management
- **GitHub Actions** - CI/CD (Phase 5)

## ✨ Features

### Phase 1-2: Core Features
✅ User authentication with Better Auth
✅ Task CRUD operations (Create, Read, Update, Delete)
✅ Real-time task synchronization
✅ Responsive UI design

### Phase 3: Chatbot & Animations
✅ AI-powered chatbot with learning
✅ Sticky chatbot button on dashboard
✅ Sidebar chat panel with message history
✅ Fingerprint lock animation
✅ Smooth animations (Framer Motion)
✅ Multiple theme support (Light, Dark, Normal, Blue)
✅ Real-time date/time display
✅ Custom footer with credits

### Phase 4: Kubernetes Deployment
✅ Docker containerization for frontend & backend
✅ Docker Compose for local development
✅ Helm charts with auto-scaling
✅ Minikube deployment automation
✅ Health checks and resource limits
✅ Ingress configuration
✅ Multi-replica deployments

### Phase 5: Advanced Features (Coming Soon)
⏳ Recurring tasks with auto-generation
⏳ Due dates and smart reminders
⏳ Kafka event streaming
⏳ Dapr distributed application runtime
⏳ Cloud deployment (Azure/GCP/Oracle)

## 📚 Documentation

- **[Phase 4 Documentation](./PHASE-4-README.md)** - Kubernetes & Docker setup
- **[Quick Start Guide](./QUICK-START.md)** - Getting started
- **[Backend Documentation](./backend/CLAUDE.md)** - API details
- **[Frontend Documentation](./frontend/CLAUDE.md)** - UI development

## 🔐 Environment Variables

Create `.env` file in the project root:

```bash
# Backend
OPENAI_API_KEY=your-openai-key
BETTER_AUTH_SECRET=your-auth-secret
DATABASE_URL=postgresql://user:pass@localhost:5432/todo_db

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📖 Commands Reference

### Docker Compose

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f frontend

# Stop services
docker-compose down

# Rebuild images
docker-compose build --no-cache
```

### Kubernetes

```bash
# Get pods
kubectl get pods -n todo-app

# View logs
kubectl logs -n todo-app -f deployment/todo-frontend

# Port forward
kubectl port-forward -n todo-app svc/todo-frontend 3000:80

# Delete deployment
kubectl delete deployment todo-frontend -n todo-app
```

### Helm

```bash
# Install release
helm install todo-backend ./helm/todo-backend -n todo-app

# Upgrade release
helm upgrade todo-backend ./helm/todo-backend -n todo-app

# Uninstall release
helm uninstall todo-backend -n todo-app

# Check status
helm status todo-backend -n todo-app
```

### Minikube

```bash
# Start cluster
minikube start --cpus 4 --memory 8192

# Stop cluster
minikube stop

# Open dashboard
minikube dashboard

# Get cluster IP
minikube ip

# Access services
minikube tunnel
```

## 🧪 Testing

### Frontend
```bash
cd frontend
npm test                 # Run tests
npm run build           # Production build
npm run lint            # ESLint check
```

### Backend
```bash
cd backend
python -m pytest        # Run tests
python main.py         # Run development server
black .                # Format code
flake8 .              # Linting
```

## 🚢 Deployment

### Local (Docker Compose)
✅ Ready to use - `docker-compose up -d`

### Local (Minikube)
✅ Ready to use - `./minikube-deploy.sh`

### Cloud (Phase 5)
⏳ Coming soon with Azure/GCP/Oracle support

## 📊 Performance Metrics

- **Frontend**: Optimized Next.js with static generation
- **Backend**: FastAPI async operations with connection pooling
- **Database**: Neon PostgreSQL with optimized queries
- **Docker**: Multi-stage builds for minimal image size

## 🔒 Security

- JWT authentication with Better Auth
- Environment variable management
- HTTPS ready (ingress configuration)
- Database credential management
- API rate limiting (configurable)

## 🐛 Troubleshooting

### Docker Issues
See [Phase 4 README - Troubleshooting](./PHASE-4-README.md#troubleshooting)

### Kubernetes Issues
See [Phase 4 README - Troubleshooting](./PHASE-4-README.md#troubleshooting)

### Common Problems
- **Port already in use**: `lsof -i :3000` and `kill -9 <PID>`
- **Docker daemon not running**: Start Docker Desktop
- **Minikube pods not starting**: Check resources with `minikube status`

## 📝 Contributing

This is a hackathon project. Contributions are welcome!

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

## 📄 License

MIT License - See LICENSE file for details

## 👤 Author

**Talha Khan**
- Email: talha@example.com
- GitHub: [@TalhaKhan](https://github.com)

## 🙏 Acknowledgments

- **Panaversity** - Hackathon organizers
- **Anthropic** - Claude AI & Claude Code
- **OpenAI** - ChatGPT API
- **Better Auth** - Authentication library
- **Framer Motion** - Animation library

## 📞 Support & Resources

- [Kubernetes Docs](https://kubernetes.io/docs/)
- [Helm Docs](https://helm.sh/docs/)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Next.js Docs](https://nextjs.org/docs/)
- [Docker Docs](https://docs.docker.com/)

---

**Last Updated**: January 3, 2026  
**Status**: Phase 4 ✅ | Phase 5 ⏳

Made with ❤️ for the Panaversity Hackathon
