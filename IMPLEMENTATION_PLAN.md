# Implementation Plan: Mobile AI App Builder

## Overview
This document breaks down the project into phases with clear tasks for **You** (the developer) and **Claude** (me).

---

## Pre-Development Setup

### Phase 0: Accounts & API Keys Setup

#### 👤 YOUR TASKS:

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up (free to start)
   - Add payment method (required even for free tier)
   - Get $5 free credits

2. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub (recommended)
   - Free tier is sufficient for MVP

3. **Get Claude API Key**
   - Go to https://console.anthropic.com
   - Create account / sign in
   - Navigate to API Keys
   - Create new key
   - **Save it securely** (you'll need it later)

4. **Create GitHub Account** (if you don't have one)
   - Go to https://github.com
   - Sign up
   - Create a personal access token:
     - Settings → Developer settings → Personal access tokens
     - Generate new token (classic)
     - Scopes: `repo` (full control)
   - **Save the token**

5. **Optional: Get Vercel API Token** (for deployment automation)
   - Vercel Dashboard → Settings → Tokens
   - Create new token
   - **Save it**

#### 🤖 CLAUDE'S TASKS:
- None yet (waiting for your setup)

#### ✅ COMPLETION CHECKLIST:
- [ ] Railway account created
- [ ] Vercel account created
- [ ] Claude API key obtained
- [ ] GitHub account + personal access token
- [ ] (Optional) Vercel API token

---

## Phase 1: Backend Foundation

### 1.1 Project Structure Setup

#### 🤖 CLAUDE'S TASKS:
1. Create backend directory structure
2. Initialize Node.js project (`package.json`)
3. Set up TypeScript configuration
4. Create basic Express server
5. Add development dependencies (nodemon, ts-node)
6. Create `.gitignore`
7. Create `.env.example` template

#### 👤 YOUR TASKS:
1. Review the generated structure
2. Run `npm install` in the backend directory
3. Create `.env` file from `.env.example`
4. Add your Claude API key to `.env`
5. Test the server locally: `npm run dev`

#### 📦 DELIVERABLES:
```
backend/
├── src/
│   ├── index.ts
│   └── config/
├── package.json
├── tsconfig.json
├── .env.example
└── .gitignore
```

---

### 1.2 Database Setup

#### 👤 YOUR TASKS:
1. **Set up local PostgreSQL** (choose one method):

   **Option A: Use Railway Postgres (easiest)**
   - Railway Dashboard → New Project → Add PostgreSQL
   - Copy the `DATABASE_URL` connection string
   - Add to your `.env` file

   **Option B: Local Postgres**
   ```bash
   # macOS (Homebrew)
   brew install postgresql@15
   brew services start postgresql@15
   createdb app_builder_dev

   # Your DATABASE_URL will be:
   # postgresql://localhost:5432/app_builder_dev
   ```

2. Add `DATABASE_URL` to your `.env`

#### 🤖 CLAUDE'S TASKS:
1. Create database migration files (SQL)
2. Set up database connection module
3. Create database initialization script
4. Add database models/types
5. Create seed data script (optional)

#### 👤 YOUR TASKS (after Claude's work):
1. Run migrations: `npm run db:migrate`
2. Verify tables were created
3. (Optional) Run seed script: `npm run db:seed`

#### 📦 DELIVERABLES:
```
backend/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Project.ts
│   │   └── Conversation.ts
│   └── db/
│       ├── migrations/
│       │   └── 001_initial_schema.sql
│       └── seed.ts
```

---

### 1.3 Claude API Integration

#### 🤖 CLAUDE'S TASKS:
1. Install Anthropic SDK
2. Create Claude service wrapper
3. Implement conversation context management
4. Create code parser (extract file operations from responses)
5. Add error handling for API failures
6. Create system prompt template
7. Add unit tests for parser

#### 👤 YOUR TASKS:
1. Verify your Claude API key works
2. Test the service: `npm run test:claude`
3. Review token usage in Anthropic console
4. Set token limits if needed

#### 📦 DELIVERABLES:
```
backend/
├── src/
│   ├── services/
│   │   ├── claudeService.ts
│   │   └── conversationService.ts
│   ├── utils/
│   │   └── codeParser.ts
│   └── __tests__/
│       └── codeParser.test.ts
```

---

### 1.4 File System Operations

#### 🤖 CLAUDE'S TASKS:
1. Create file service for Railway Volume operations
2. Implement file CRUD operations
3. Add file tree generator
4. Add path validation (security)
5. Implement file size limits
6. Add file type validation
7. Create temp directory management

#### 👤 YOUR TASKS:
1. Create the `/data` directory locally for testing
2. Test file operations: `npm run test:files`
3. Verify file permissions are correct

#### 📦 DELIVERABLES:
```
backend/
├── src/
│   ├── services/
│   │   └── fileService.ts
│   └── utils/
│       └── pathValidator.ts
```

---

### 1.5 API Routes & Middleware

#### 🤖 CLAUDE'S TASKS:
1. Create authentication middleware (JWT)
2. Create validation middleware (Zod schemas)
3. Create error handler middleware
4. Implement all API routes:
   - Auth routes
   - Project routes
   - Prompt routes
   - File routes
   - Deploy routes (stub for now)
5. Add request logging
6. Add rate limiting

#### 👤 YOUR TASKS:
1. Test each endpoint with Postman/Insomnia/curl
2. Create a test user account
3. Create a test project
4. Send a test prompt
5. Verify files are created

#### 📦 DELIVERABLES:
```
backend/
├── src/
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── projects.ts
│   │   ├── prompts.ts
│   │   ├── files.ts
│   │   └── deploy.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   ├── errorHandler.ts
│   │   └── rateLimiter.ts
│   └── schemas/
│       └── validation.ts
```

---

### 1.6 Railway Deployment

#### 🤖 CLAUDE'S TASKS:
1. Create `railway.json` config
2. Create Dockerfile (optional backup)
3. Add health check endpoint
4. Create deployment README
5. Add production environment variables list

#### 👤 YOUR TASKS:
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Initialize project: `railway init`
4. Add volume:
   - Railway Dashboard → Your Service → Variables → Add Volume
   - Mount path: `/data`
5. Set environment variables:
   ```bash
   railway variables set CLAUDE_API_KEY=your_key
   railway variables set DATABASE_URL=your_db_url
   railway variables set JWT_SECRET=random_secret
   railway variables set NODE_ENV=production
   ```
6. Deploy: `railway up`
7. Check logs: `railway logs`
8. Get your API URL (e.g., `https://your-app.up.railway.app`)

#### 📦 DELIVERABLES:
```
backend/
├── railway.json
├── Dockerfile (optional)
└── DEPLOYMENT.md
```

#### ✅ PHASE 1 COMPLETION:
- [x] Backend runs locally
- [x] Database migrations completed
- [x] Claude integration working
- [x] File operations working
- [x] All API endpoints tested
- [x] Deployed to Railway successfully
- [x] Can create project and send prompt via API

**PHASE 1 COMPLETED ON:** 2025-10-20

**Production URLs:**
- Backend API: https://mobile-app-builder-production.up.railway.app
- PostgreSQL: ballast.proxy.rlwy.net:18980

**Environment Variables Set:**
```
NODE_ENV=production
PORT=3000
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=tekO0kHdZHCmXocCRvVMQUaVZF7fqz+SIgugBTUBT+s=
CLAUDE_API_KEY=(user's key)
VOLUME_PATH=/data
MAX_PROJECT_SIZE_MB=100
MAX_FILE_SIZE_MB=10
MAX_FILES_PER_PROJECT=500
```

**Tested Endpoints:**
- ✅ GET /health - Service health check
- ✅ GET /api/projects - List all projects
- ✅ POST /api/projects - Create new project
- ✅ GET /api/projects/:id - Get project details
- ✅ POST /api/projects/:id/files - Create/update file
- ✅ GET /api/projects/:id/files - Get file tree
- ✅ GET /api/projects/:id/files/* - Read file content
- ✅ DELETE /api/projects/:id/files/* - Delete file

**Database Schema:**
- users table (id, email, password_hash, claude_api_key, timestamps)
- projects table (id, user_id, name, description, tech_stack, deploy_url, status, timestamps)
- conversations table (id, project_id, messages, total_tokens, timestamps)
- deployments table (id, project_id, deploy_url, status, logs, deployed_at)

**Test User:**
- ID: 00000000-0000-0000-0000-000000000001
- Email: test@example.com
- Password: test123456

---

## Phase 2: Frontend Development

**PHASE 2 STATUS:** In Progress
**STARTED ON:** 2025-10-20

### Frontend Architecture Overview

**Tech Stack:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Query for API state management
- Zustand for client state
- Monaco Editor for code viewing
- React Markdown for rendering Claude responses

**Key Design Principles:**
1. **Mobile-First**: Primary use case is coding from phone
2. **Progressive Enhancement**: Works on slow connections
3. **Optimistic Updates**: Instant feedback, sync in background
4. **Offline-Ready**: Cache projects and recent conversations
5. **Touch-Optimized**: Large tap targets, swipe gestures

**Page Structure:**
```
/ (landing page)
/dashboard (project list)
/projects/[id] (chat interface - main screen)
/projects/[id]/files (file browser)
/projects/[id]/settings (project settings)
/profile (user settings, API key management)
```

**Component Architecture:**
```
app/
├── (marketing)/
│   └── page.tsx              # Landing page
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── dashboard/
│   └── page.tsx              # Project list
└── projects/
    └── [id]/
        ├── layout.tsx        # Project layout with nav
        ├── page.tsx          # Chat interface (default)
        ├── files/page.tsx    # File browser
        └── settings/page.tsx

components/
├── ui/                       # shadcn components
├── layout/
│   ├── Navbar.tsx
│   ├── MobileNav.tsx
│   └── ProjectNav.tsx
├── chat/
│   ├── ChatInterface.tsx     # Main chat container
│   ├── MessageList.tsx       # Virtualized message list
│   ├── Message.tsx           # Single message
│   ├── PromptInput.tsx       # Mobile-optimized input
│   ├── FileChangeCard.tsx    # Shows file modifications
│   └── CodeBlock.tsx         # Syntax highlighted code
├── files/
│   ├── FileTree.tsx          # Collapsible tree view
│   ├── FileViewer.tsx        # Read-only Monaco editor
│   ├── FilePreview.tsx       # Quick preview modal
│   └── DownloadButton.tsx
├── projects/
│   ├── ProjectCard.tsx
│   ├── ProjectList.tsx
│   ├── CreateProjectModal.tsx
│   └── ProjectSettings.tsx
└── deploy/
    ├── DeployButton.tsx
    ├── DeploymentStatus.tsx
    └── DeploymentHistory.tsx

lib/
├── api/
│   ├── client.ts             # Axios client with auth
│   ├── projects.ts           # Project API calls
│   ├── prompts.ts            # Chat API calls
│   ├── files.ts              # File API calls
│   └── deploy.ts             # Deploy API calls
├── stores/
│   ├── authStore.ts          # Zustand auth state
│   └── chatStore.ts          # Zustand chat state
└── hooks/
    ├── useAuth.ts
    ├── useProjects.ts
    ├── useChat.ts
    └── useFiles.ts
```

**API Integration Strategy:**
- React Query for server state (projects, files)
- Optimistic updates for instant UI feedback
- Automatic retries with exponential backoff
- Request deduplication
- Stale-while-revalidate caching

**Mobile Optimizations:**
- Virtual scrolling for long message lists
- Lazy load Monaco editor only when viewing files
- Image optimization with Next.js Image
- Minimize JavaScript bundle size
- Service worker for offline support (Phase 4)

### 2.1 Next.js Project Setup

#### 🤖 CLAUDE'S TASKS:
1. Initialize Next.js project with TypeScript
2. Configure Tailwind CSS
3. Install and configure shadcn/ui
4. Set up project structure
5. Create layout components
6. Add mobile navigation
7. Configure environment variables

#### 👤 YOUR TASKS:
1. Navigate to project root
2. Run the setup commands I provide
3. Install dependencies: `npm install`
4. Create `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```
5. Start dev server: `npm run dev`
6. Open http://localhost:3001 in browser

#### 📦 DELIVERABLES:
```
frontend/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── MobileNav.tsx
│   └── ui/ (shadcn components)
├── lib/
│   └── utils.ts
├── tailwind.config.js
└── next.config.js
```

---

### 2.2 Authentication UI

#### 🤖 CLAUDE'S TASKS:
1. Create login page
2. Create register page
3. Create auth context/hooks
4. Create API client with auth
5. Add protected route wrapper
6. Add logout functionality

#### 👤 YOUR TASKS:
1. Test registration flow
2. Test login flow
3. Verify JWT token is stored
4. Test protected routes redirect
5. Test logout

#### 📦 DELIVERABLES:
```
frontend/
├── app/
│   └── (auth)/
│       ├── login/page.tsx
│       └── register/page.tsx
├── components/
│   └── auth/
│       ├── LoginForm.tsx
│       └── RegisterForm.tsx
└── lib/
    ├── api.ts
    └── auth.ts
```

---

### 2.3 Project Dashboard

#### 🤖 CLAUDE'S TASKS:
1. Create dashboard page
2. Create project list component
3. Create project card component
4. Create "new project" modal
5. Add project actions (delete, rename)
6. Add empty state
7. Add loading states

#### 👤 YOUR TASKS:
1. Login to your test account
2. Create 2-3 test projects via UI
3. Test delete functionality
4. Test mobile responsiveness
5. Take screenshots for feedback

#### 📦 DELIVERABLES:
```
frontend/
├── app/
│   └── dashboard/
│       └── page.tsx
└── components/
    └── projects/
        ├── ProjectList.tsx
        ├── ProjectCard.tsx
        └── CreateProjectModal.tsx
```

---

### 2.4 Chat Interface

#### 🤖 CLAUDE'S TASKS:
1. Create chat page
2. Create message list component
3. Create prompt input component
4. Create streaming message component
5. Add syntax highlighting for code
6. Add file change indicators
7. Add quick actions (Deploy, View Files)
8. Add mobile-optimized layout

#### 👤 YOUR TASKS:
1. Open a test project
2. Send prompts:
   - "Build a simple React counter app"
   - "Add a dark mode toggle"
   - "Add unit tests"
3. Verify streaming works
4. Verify code blocks render correctly
5. Test on mobile (Chrome DevTools device mode)

#### 📦 DELIVERABLES:
```
frontend/
├── app/
│   └── projects/
│       └── [id]/
│           └── page.tsx
└── components/
    └── chat/
        ├── ChatInterface.tsx
        ├── MessageList.tsx
        ├── Message.tsx
        ├── PromptInput.tsx
        └── CodeBlock.tsx
```

---

### 2.5 File Browser

#### 🤖 CLAUDE'S TASKS:
1. Create files page
2. Create file tree component
3. Create code viewer with syntax highlighting
4. Add file actions (download, delete)
5. Add mobile drawer for file tree
6. Add breadcrumb navigation

#### 👤 YOUR TASKS:
1. Navigate to Files tab
2. Browse the generated file tree
3. Click on files to view code
4. Test download functionality
5. Test on mobile

#### 📦 DELIVERABLES:
```
frontend/
├── app/
│   └── projects/
│       └── [id]/
│           └── files/
│               └── page.tsx
└── components/
    └── files/
        ├── FileTree.tsx
        ├── CodeViewer.tsx
        └── FileActions.tsx
```

---

### 2.6 Vercel Deployment

#### 🤖 CLAUDE'S TASKS:
1. Create `vercel.json` config
2. Update API URL for production
3. Create deployment guide
4. Add environment variable documentation

#### 👤 YOUR TASKS:
1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel`
4. Set environment variables:
   - Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL=https://your-railway-app.up.railway.app`
5. Redeploy: `vercel --prod`
6. Test on mobile device (real phone)
7. Share URL with friends for feedback

#### ✅ PHASE 2 COMPLETION:
- [ ] Frontend runs locally
- [ ] Authentication working
- [ ] Dashboard displays projects
- [ ] Chat interface working
- [ ] File browser working
- [ ] Deployed to Vercel
- [ ] Tested on mobile device
- [ ] End-to-end flow works (create project → chat → view files)

---

## Phase 3: Deployment Pipeline

### 3.1 GitHub Integration

#### 👤 YOUR TASKS:
1. Create GitHub personal access token (if not done)
2. Add token to Railway environment variables:
   ```bash
   railway variables set GITHUB_TOKEN=your_token
   ```

#### 🤖 CLAUDE'S TASKS:
1. Install Octokit (GitHub SDK)
2. Create GitHub service
3. Implement repo creation
4. Implement file push to repo
5. Add error handling

#### 📦 DELIVERABLES:
```
backend/
└── src/
    └── services/
        └── githubService.ts
```

---

### 3.2 Vercel Deployment Integration

#### 👤 YOUR TASKS:
1. Get Vercel API token (if not done)
2. Add to Railway:
   ```bash
   railway variables set VERCEL_TOKEN=your_token
   ```

#### 🤖 CLAUDE'S TASKS:
1. Install Vercel SDK
2. Create deploy service
3. Implement Vercel deployment
4. Add deployment status polling
5. Save deployment records to DB
6. Create deployment UI components

#### 👤 YOUR TASKS (after implementation):
1. Click "Deploy" button in UI
2. Wait for deployment to complete
3. Click the generated URL
4. Verify your app is live!
5. Test with different projects

#### 📦 DELIVERABLES:
```
backend/
└── src/
    └── services/
        └── deployService.ts

frontend/
└── components/
    └── deploy/
        ├── DeployButton.tsx
        └── DeploymentStatus.tsx
```

#### ✅ PHASE 3 COMPLETION:
- [ ] Can deploy generated apps to Vercel
- [ ] Deployment status tracked
- [ ] Live URLs returned to user
- [ ] Tested multiple deployments

---

## Phase 4: Polish & Testing

### 4.1 Error Handling & UX

#### 🤖 CLAUDE'S TASKS:
1. Add error boundaries to frontend
2. Improve error messages
3. Add retry logic for failed requests
4. Add toast notifications
5. Add loading skeletons
6. Add empty states
7. Add confirmation dialogs

#### 👤 YOUR TASKS:
1. Intentionally cause errors (disconnect internet, etc.)
2. Verify error messages are helpful
3. Test retry functionality
4. Get feedback from 2-3 users

---

### 4.2 Documentation

#### 🤖 CLAUDE'S TASKS:
1. Write comprehensive README
2. Create user guide
3. Create API documentation
4. Add inline code comments
5. Create troubleshooting guide

#### 👤 YOUR TASKS:
1. Review documentation for accuracy
2. Test setup instructions on a fresh machine (or ask a friend)
3. Add FAQ based on questions you receive

#### 📦 DELIVERABLES:
```
README.md
USER_GUIDE.md
API_DOCS.md
TROUBLESHOOTING.md
```

---

### 4.3 Performance Optimization

#### 🤖 CLAUDE'S TASKS:
1. Add database indexes
2. Implement caching (file trees, etc.)
3. Optimize API response sizes
4. Add compression
5. Optimize frontend bundle size
6. Add lazy loading

#### 👤 YOUR TASKS:
1. Run Lighthouse audit
2. Test with slow 3G connection
3. Measure API response times
4. Check Railway metrics
5. Optimize if needed

---

## Phase 5: MVP Launch

### 5.1 Pre-Launch Checklist

#### 👤 YOUR TASKS:
- [ ] Set up custom domain (optional)
- [ ] Configure Railway and Vercel for production
- [ ] Set rate limits appropriately
- [ ] Set up error monitoring (Sentry, optional)
- [ ] Set up analytics (Plausible, optional)
- [ ] Create landing page content
- [ ] Prepare demo video/screenshots
- [ ] Test entire flow 3 times end-to-end
- [ ] Have 3 friends test it
- [ ] Fix critical bugs found in testing

---

### 5.2 Launch

#### 👤 YOUR TASKS:
1. **Soft Launch:**
   - Share with close friends/community
   - Post on Twitter/X with demo
   - Post on Reddit (r/SideProject, r/webdev)
   - Post on Hacker News "Show HN"
   - Post on IndieHackers

2. **Collect Feedback:**
   - Set up feedback form
   - Monitor for errors
   - Track usage patterns

3. **Iterate:**
   - Fix bugs quickly
   - Add most-requested features
   - Improve documentation based on questions

---

## Decision Points

Before we start coding, please decide:

### 1. Authentication Strategy
- **Option A:** Simple email/password (easier, faster)
- **Option B:** OAuth with Google/GitHub (better UX, more setup)
- **Recommendation:** Option A for MVP

### 2. API Key Management
- **Option A:** Users bring their own Claude API keys (no cost to you)
- **Option B:** You provide Claude API (easier for users, costs you money)
- **Recommendation:** Option A for MVP, Option B when monetizing

### 3. Deployment Targets
- **Option A:** Only Vercel (simpler)
- **Option B:** Vercel + Netlify (more options)
- **Recommendation:** Option A for MVP

### 4. Preview Mode
- **Option A:** Always deploy to Vercel (no preview on Railway)
- **Option B:** Preview on Railway, then deploy to Vercel
- **Recommendation:** Option A (simpler)

### 5. File Limits
- Max file size: **10 MB** per file
- Max project size: **100 MB** total
- Max files per project: **500 files**
- Sound good?

---

## Time Estimates

| Phase | Estimated Time (with Claude's help) |
|-------|-------------------------------------|
| Phase 0: Setup | 1-2 hours |
| Phase 1: Backend | 2-3 days |
| Phase 2: Frontend | 2-3 days |
| Phase 3: Deployment | 1-2 days |
| Phase 4: Polish | 1-2 days |
| **Total MVP** | **1-2 weeks** |

---

## Cost Breakdown (Monthly)

| Item | Cost |
|------|------|
| Railway (Hobby) | $5 |
| Claude API (light usage) | $5-20 |
| Vercel (Free) | $0 |
| Domain (optional) | $1/mo |
| **Total** | **$11-26/mo** |

---

## What's Next?

Reply with:

1. **Your decisions** on the 5 decision points above
2. **Confirmation** you've completed Phase 0 (or tell me what you need help with)
3. **Ready to start?** I'll begin with Phase 1.1 (Backend project structure)

Or if you have questions about any phase, let me know!
