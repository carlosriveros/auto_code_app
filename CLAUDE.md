# CLAUDE.md - Master Reference for AI Agents

> **START HERE!** This is the master reference document for any AI agent working on this project.
> Read this first, then navigate to specific docs as needed.

---

## Project Overview

**Mobile AI App Builder** - A web-based platform that allows users to build and deploy complete web applications using natural language prompts on mobile devices.

- **Current Status**: Phase 1 MVP complete and deployed
- **Tech Stack**: Next.js (frontend) + Express/TypeScript (backend) + PostgreSQL + Claude AI
- **Deployed**:
  - Frontend: Vercel
  - Backend: Railway (https://mobile-app-builder-production.up.railway.app)
  - User projects: Deployed to Vercel via API

---

## Architecture Summary

```
┌─────────────────────────────────────────────────────┐
│  USER'S BROWSER (Mobile/Desktop)                    │
│  Frontend: Next.js PWA on Vercel                    │
│  Location: /Users/carlos_riveros/Projects/app/frontend
└────────────────────┬────────────────────────────────┘
                     │ HTTPS REST API
┌────────────────────▼────────────────────────────────┐
│  BACKEND API                                         │
│  Express + TypeScript on Railway                    │
│  Location: /Users/carlos_riveros/Projects/app/backend
│  ├─ PostgreSQL Database (Railway)                   │
│  ├─ Railway Volume at /data/projects/               │
│  └─ Claude API Integration                          │
└────────────────────┬────────────────────────────────┘
                     │ Programmatic Deployment
┌────────────────────▼────────────────────────────────┐
│  USER-CREATED PROJECTS                              │
│  Stored: Railway Volume (/data/projects/{id}/)     │
│  Deployed: Vercel (via API)                        │
│  Each project gets unique Vercel URL                │
└─────────────────────────────────────────────────────┘
```

---

## Quick Reference

### Local Development

```bash
# Backend (from /backend/)
npm run dev          # http://localhost:3000

# Frontend (from /frontend/)
npm run dev          # http://localhost:3001
```

### Deployment

```bash
# Backend to Railway
cd backend
railway up --service mobile-app-builder --environment production --detach

# Frontend to Vercel
cd frontend
vercel --prod

# Push to GitHub (triggers no auto-deploy, manual only)
git add -A
git commit -m "Your message"
git push origin main
```

### Key Environment Variables

**Backend (.env and Railway):**
- `DATABASE_URL` - PostgreSQL connection string
- `CLAUDE_API_KEY` - Anthropic API key for Claude
- `VERCEL_TOKEN` - For deploying user projects
- `GITHUB_TOKEN` - GitHub personal access token
- `VOLUME_PATH` - `/data` on Railway, `./data` locally

**Frontend (.env.local):**
- `NEXT_PUBLIC_API_URL` - Backend API URL

---

## Repository Structure

```
/Users/carlos_riveros/Projects/app/
├── CLAUDE.md                      # THIS FILE - Start here!
├── ARCHITECTURE.md                # Detailed technical architecture
├── VISION.md                      # Long-term product vision
├── ROADMAP.md                     # Product roadmap and phases
├── PROGRESS.md                    # Current progress status
├── IMPLEMENTATION_PLAN.md         # Step-by-step implementation guide
│
├── backend/                       # Express API (Git submodule)
│   ├── src/
│   │   ├── index.ts               # Entry point
│   │   ├── config/                # Database, env config
│   │   ├── routes/                # API endpoints
│   │   │   ├── projects.ts        # Project CRUD
│   │   │   ├── prompts.ts         # Claude prompt handling
│   │   │   ├── files.ts           # File operations
│   │   │   └── deploy.ts          # Vercel deployment
│   │   ├── services/
│   │   │   ├── claudeService.ts   # Claude API wrapper
│   │   │   ├── fileService.ts     # Railway Volume file ops
│   │   │   ├── projectService.ts  # Project management
│   │   │   ├── conversationService.ts # Chat history
│   │   │   └── deploymentService.ts   # Vercel deployment
│   │   ├── utils/
│   │   │   └── codeParser.ts      # Parse FILE: blocks from Claude
│   │   └── db/
│   │       ├── migrations/        # Database migrations
│   │       └── seed.ts            # Seed data
│   ├── README.md                  # Backend-specific docs
│   ├── DEPLOYMENT.md              # Railway deployment guide
│   └── package.json
│
├── frontend/                      # Next.js PWA
│   ├── app/                       # Next.js App Router
│   │   ├── page.tsx               # Home page
│   │   ├── dashboard/             # Project list
│   │   └── projects/[id]/         # Project chat interface
│   ├── components/
│   │   ├── chat/                  # Chat interface components
│   │   ├── files/                 # File browser
│   │   ├── projects/              # Project cards
│   │   └── layout/                # Nav, header, etc.
│   ├── lib/
│   │   └── api/                   # API client for backend
│   ├── public/
│   │   ├── manifest.json          # PWA manifest
│   │   └── icons/                 # App icons (to be generated)
│   └── README.md
│
└── docs/                          # Additional documentation
    ├── PHASE_1_MOBILE_PWA.md
    ├── PHASE_2_BACKEND_GENERATION.md
    ├── PHASE_3_ADVANCED_FEATURES.md
    ├── COMPETITIVE_ANALYSIS.md
    └── TECHNICAL_ARCHITECTURE_CTO.md
```

---

## Deployment Setup

### GitHub Configuration

**Repository**: https://github.com/carlosriveros/auto_code_app

**Important**: This project uses separate Git accounts:
- **Personal account** (`carloseriveros@gmail.com`) for `~/Projects/` directory
- **Work account** (`carlos.riveros@airbnb.com`) for other directories
- Authentication: Personal Access Token (stored securely)

**Current status**:
- Main branch: `main`
- Remote: `origin` → https://github.com/carlosriveros/auto_code_app.git
- Deployment: Manual via CLI (no GitHub Actions)

### Railway Deployment (Backend)

**Project**: mobile-app-builder
**Service**: mobile-app-builder
**Environment**: production
**URL**: https://mobile-app-builder-production.up.railway.app

**How it works**:
- Deploy via Railway CLI: `railway up --service mobile-app-builder --environment production --detach`
- No GitHub integration - deploys directly from local code
- Has persistent volume mounted at `/data` for storing user project files
- PostgreSQL database attached (managed by Railway)

**Environment Variables** (set in Railway dashboard):
- `VERCEL_TOKEN` - For deploying user projects to Vercel
- `CLAUDE_API_KEY` - For AI code generation
- `DATABASE_URL` - Auto-set by Railway
- See `backend/DEPLOYMENT.md` for full list

### Vercel Deployment (Frontend)

**How it works**:
- Deploy via Vercel CLI: `vercel --prod`
- No GitHub integration - deploys directly from local code
- Connected to Railway backend via `NEXT_PUBLIC_API_URL`

**User Projects**:
- Each user-created project is deployed to Vercel programmatically
- Backend reads files from Railway Volume
- Backend calls Vercel API to deploy
- Each project gets unique URL like: `app-builder-{project-id}-xyz.vercel.app`

---

## Critical Information

### File Operations Flow

When user asks AI to make changes:

1. User sends prompt → Frontend → Backend `/api/projects/:id/prompt`
2. Backend calls Claude API with conversation context
3. Claude returns response with code in `FILE:` format:
   ```
   ```FILE: src/App.tsx
   [code content]
   ```
   ```
4. Backend parses response using `codeParser.ts` (regex: `/```FILE:\s*([^\n]+)\n([\s\S]*?)```/g`)
5. Files written to Railway Volume at `/data/projects/{projectId}/`
6. Response sent to frontend with `fileOperations` array
7. Frontend refreshes file list

### Deployment Flow

When user clicks "Deploy" button:

1. Frontend → Backend `/api/projects/:id/deploy`
2. Backend reads ALL files from `/data/projects/{projectId}/`
3. Backend calls Vercel API with files
4. Vercel creates deployment
5. Backend stores deployment URL in database
6. Frontend shows success with live URL

### Known Issues & Solutions

**Issue**: Message disappears after sending prompt
- **Cause**: Frontend error handler reverts messages on any error
- **Status**: Backend works fine, frontend needs better error handling
- **Workaround**: Check Files tab - changes are saved even if message disappears

**Issue**: Changes don't show in deployed preview
- **Solution**: Click Deploy button again - this forces Vercel to read latest files
- **Root Cause**: Timing issue resolved by re-deployment

---

## Common Tasks

### Add New API Endpoint

1. Create route in `backend/src/routes/`
2. Add service logic in `backend/src/services/`
3. Register route in `backend/src/index.ts`
4. Update API client in `frontend/lib/api/`
5. Deploy backend: `railway up`

### Modify Database Schema

1. Create new migration in `backend/src/db/migrations/`
2. Run locally: `npm run db:migrate`
3. Deploy backend: `railway up`
4. Run on Railway: `railway run npm run db:migrate`

### Add Frontend Component

1. Create component in `frontend/components/`
2. Import in appropriate page
3. Test locally: `npm run dev`
4. Deploy: `vercel --prod`

### Debug Deployment Issues

```bash
# Check Railway logs
railway logs --service mobile-app-builder --environment production --lines 100

# Check build logs
railway logs --service mobile-app-builder --environment production --build

# Check specific project deployment
# Look in Railway logs for lines like:
# "📂 Found X files for deployment"
# "📄 Reading file: path (size)"
# "✅ Deployed project to Vercel: [URL]"
```

---

## Documentation Map

**Where to find specific information:**

### Architecture & Design
- `ARCHITECTURE.md` - Complete technical architecture, database schema, API docs
- `docs/TECHNICAL_ARCHITECTURE_CTO.md` - CTO-level overview

### Product & Vision
- `VISION.md` - Long-term vision, features, business model
- `ROADMAP.md` - Product roadmap with phases
- `PROGRESS.md` - Current progress and status
- `docs/COMPETITIVE_ANALYSIS.md` - Competition analysis

### Implementation
- `IMPLEMENTATION_PLAN.md` - Step-by-step implementation guide
- `backend/README.md` - Backend setup and structure
- `frontend/README.md` - Frontend setup (if exists)
- `backend/DEPLOYMENT.md` - Railway deployment guide

### Phase-Specific
- `docs/PHASE_1_MOBILE_PWA.md` - PWA implementation details
- `docs/PHASE_2_BACKEND_GENERATION.md` - Backend generation features
- `docs/PHASE_3_ADVANCED_FEATURES.md` - Advanced features roadmap
- `docs/PHASE_6_MOBILE_APP_GENERATION.md` - Mobile app generation

### Other
- `docs/AUTONOMOUS_AI_AGENCY.md` - AI agency concepts
- `docs/NICHE_COMPETITORS.md` - Niche competitor analysis

---

## Development Workflow

### Starting a new session

1. Read this file (CLAUDE.md)
2. Check `PROGRESS.md` for current status
3. Check `ROADMAP.md` for next priorities
4. Start local dev servers
5. Make changes
6. Test locally
7. Deploy when ready

### Making changes

1. **Always read the file first** before editing
2. Use Edit tool for existing files (preferred over Write)
3. Test locally before deploying
4. Check logs after deployment
5. Update documentation if needed

### Committing changes

1. Stage changes: `git add -A`
2. Commit: `git commit -m "Description"`
3. Push: `git push origin main`
4. Note: No auto-deployment configured

---

## Key Technologies

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (Railway managed)
- **Storage**: Railway Persistent Volumes
- **AI**: Anthropic Claude 3.5 Sonnet
- **Hosting**:
  - Frontend: Vercel
  - Backend: Railway
  - User projects: Vercel (via API)
- **Tools**: Railway CLI, Vercel CLI, GitHub

---

## Contact & Credentials

**Owner**: Carlos Riveros
- **Email (Personal)**: carloseriveros@gmail.com
- **Email (Work)**: carlos.riveros@airbnb.com
- **GitHub**: carlosriveros / carlos-riveros_airbnb

**Services**:
- Railway: Logged in as carloseriveros@gmail.com
- GitHub: Using personal token for this project
- Vercel: Has token in Railway env vars

---

## Quick Troubleshooting

### Backend not starting
```bash
cd backend
npm install
npm run dev
# Check DATABASE_URL and CLAUDE_API_KEY in .env
```

### Frontend not connecting to backend
```bash
cd frontend
# Check NEXT_PUBLIC_API_URL in .env.local
# Should be http://localhost:3000 (local) or Railway URL (prod)
```

### Deployment fails
```bash
# Check Railway logs
railway logs --service mobile-app-builder --environment production

# Common issues:
# - Environment variables not set
# - Build errors (check TypeScript compilation)
# - Database connection issues
```

### Git push issues
```bash
# Using wrong account?
git config user.email  # Should be carloseriveros@gmail.com in this project

# Authentication issues?
# Use personal access token stored in git credentials
# Or set remote URL with token:
# git remote set-url origin https://[TOKEN]@github.com/carlosriveros/auto_code_app.git
```

---

## Next Steps

Check `ROADMAP.md` and `PROGRESS.md` for current priorities and next features to implement.

**Current Phase**: Phase 1 (PWA Features)
**Next**: App icons generation, iOS/Android testing

---

**Last Updated**: 2025-01-21
**Version**: 1.0
