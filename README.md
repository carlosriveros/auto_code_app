# Mobile AI App Builder

> Build and deploy complete web applications using natural language prompts on your mobile device.

[![Status](https://img.shields.io/badge/status-MVP-green)]()
[![Frontend](https://img.shields.io/badge/frontend-Vercel-black)]()
[![Backend](https://img.shields.io/badge/backend-Railway-purple)]()

## Overview

A mobile-first PWA that lets you build full-stack web applications by chatting with Claude AI. Generate code, manage files, and deploy to production - all from your phone.

**Live Demo**: [Coming soon]

---

## Quick Start

### For AI Agents

**START HERE** → Read [`CLAUDE.md`](./CLAUDE.md) for complete project overview and reference.

### For Developers

#### Prerequisites
- Node.js 20+
- PostgreSQL
- Claude API key
- Railway account
- Vercel account

#### Local Development

```bash
# Clone the repo
git clone https://github.com/carlosriveros/auto_code_app.git
cd auto_code_app

# Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev  # http://localhost:3000

# Setup frontend (in new terminal)
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with backend URL
npm run dev  # http://localhost:3001
```

---

## Features

- Chat with Claude AI to generate code
- File management and code viewer
- Project management (create, edit, delete)
- One-click deployment to Vercel
- Conversation history tracking
- Mobile-optimized PWA interface

---

## Documentation

### Core Documents (Start Here)
- **[CLAUDE.md](./CLAUDE.md)** - Master reference for AI agents
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical architecture
- **[VISION.md](./VISION.md)** - Product vision and roadmap
- **[ROADMAP.md](./ROADMAP.md)** - Development phases
- **[PROGRESS.md](./PROGRESS.md)** - Current status

### Implementation
- **[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)** - Step-by-step guide
- **[backend/README.md](./backend/README.md)** - Backend docs
- **[backend/DEPLOYMENT.md](./backend/DEPLOYMENT.md)** - Railway deployment
- **[docs/](./docs/)** - Phase-specific documentation

---

## Tech Stack

**Frontend**
- Next.js 15 (App Router)
- React + TypeScript
- Tailwind CSS + shadcn/ui
- PWA (Progressive Web App)

**Backend**
- Node.js + Express
- TypeScript
- PostgreSQL
- Claude API (Anthropic)

**Infrastructure**
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway
- **Database**: PostgreSQL (Railway)
- **File Storage**: Railway Volumes
- **Deployments**: Vercel API

---

## Project Structure

```
├── CLAUDE.md                 # Master reference (START HERE!)
├── ARCHITECTURE.md           # Technical architecture
├── VISION.md                 # Product vision
├── ROADMAP.md               # Development roadmap
├── PROGRESS.md              # Current status
│
├── backend/                 # Express API
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── config/          # Configuration
│   │   └── db/              # Database
│   └── README.md
│
├── frontend/                # Next.js PWA
│   ├── app/                 # Next.js pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities
│   └── public/              # Static assets
│
└── docs/                    # Additional docs
    ├── PHASE_1_MOBILE_PWA.md
    ├── PHASE_2_BACKEND_GENERATION.md
    └── ...
```

---

## Deployment

### Backend (Railway)

```bash
cd backend
railway up --service mobile-app-builder --environment production --detach
```

### Frontend (Vercel)

```bash
cd frontend
vercel --prod
```

See [backend/DEPLOYMENT.md](./backend/DEPLOYMENT.md) for detailed deployment instructions.

---

## Development Workflow

1. Read [CLAUDE.md](./CLAUDE.md) for project overview
2. Check [PROGRESS.md](./PROGRESS.md) for current status
3. Review [ROADMAP.md](./ROADMAP.md) for priorities
4. Make changes locally
5. Test thoroughly
6. Deploy when ready
7. Update documentation

---

## API Endpoints

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Prompts (Claude AI)
- `POST /api/projects/:id/prompt` - Send prompt to Claude
- `GET /api/projects/:id/history` - Get conversation history

### Files
- `GET /api/projects/:id/files` - List files
- `GET /api/projects/:id/files/*` - Read file
- `POST /api/projects/:id/files` - Create/update file
- `DELETE /api/projects/:id/files/*` - Delete file

### Deployment
- `POST /api/projects/:id/deploy` - Deploy to Vercel
- `GET /api/projects/:id/deployment/latest` - Get latest deployment

See [ARCHITECTURE.md](./ARCHITECTURE.md) for complete API documentation.

---

## Environment Variables

### Backend

```env
DATABASE_URL=postgresql://...
CLAUDE_API_KEY=sk-ant-...
VERCEL_TOKEN=...
GITHUB_TOKEN=ghp_...
VOLUME_PATH=/data
JWT_SECRET=...
```

### Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## Contributing

This is currently a solo project. Contributions welcome after Phase 1 launch.

---

## Roadmap

- [x] **Phase 1**: PWA Foundation (Current)
- [ ] **Phase 2**: Backend Generation
- [ ] **Phase 3**: Advanced Features
- [ ] **Phase 4**: Templates & Starters
- [ ] **Phase 5**: Database Studio
- [ ] **Phase 6**: Mobile App Generation

See [ROADMAP.md](./ROADMAP.md) for detailed timeline.

---

## License

[To be determined]

---

## Contact

**Carlos Riveros**
- Email: carloseriveros@gmail.com
- GitHub: [@carlosriveros](https://github.com/carlosriveros)

---

**For AI Agents**: Please read [CLAUDE.md](./CLAUDE.md) for complete project reference.
