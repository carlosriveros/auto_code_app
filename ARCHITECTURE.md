# Mobile AI App Builder - Architecture Document

## Overview
A web-based platform that allows users to build applications through natural language prompts on their mobile devices. The system uses Claude AI to generate code, stores it on Railway infrastructure, and can deploy the generated apps to production.

---

## System Architecture

```
┌─────────────────────────────────────────────┐
│          Mobile Browser / Desktop           │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │   Frontend (Next.js)                  │ │
│  │   - Chat Interface                    │ │
│  │   - File Browser                      │ │
│  │   - Project Dashboard                 │ │
│  │   Deployed on: Vercel                 │ │
│  └─────────────────┬─────────────────────┘ │
└────────────────────┼───────────────────────┘
                     │ HTTPS REST API
┌────────────────────▼───────────────────────┐
│   Backend API (Node.js/Express)            │
│   Deployed on: Railway                     │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │  API Layer                          │  │
│  │  - Authentication                   │  │
│  │  - Project Management               │  │
│  │  - Prompt Processing                │  │
│  │  - File Operations                  │  │
│  │  - Deployment Pipeline              │  │
│  └────────┬────────────────────┬───────┘  │
│           │                    │           │
│  ┌────────▼────────┐  ┌────────▼────────┐ │
│  │  Claude API     │  │  PostgreSQL     │ │
│  │  Integration    │  │  Database       │ │
│  └─────────────────┘  └─────────────────┘ │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │  Railway Volume (/data)             │  │
│  │  /projects/:id/                     │  │
│  │    ├─ src/                          │  │
│  │    ├─ package.json                  │  │
│  │    └─ ... generated code            │  │
│  └─────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
                     │
        ┌────────────┴─────────────┐
        │                          │
┌───────▼────────┐      ┌─────────▼──────────┐
│  Vercel API    │      │  Preview Runtime   │
│  (Deploy apps) │      │  (Test on Railway) │
└────────────────┘      └────────────────────┘
```

---

## Backend Architecture

### Technology Stack
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (Railway managed)
- **Storage**: Railway Volumes
- **AI Integration**: Anthropic Claude API
- **Hosting**: Railway.app

### Project Structure

```
backend/
├── src/
│   ├── index.ts                 # Entry point
│   ├── config/
│   │   ├── database.ts          # PostgreSQL connection
│   │   ├── claude.ts            # Claude API config
│   │   └── env.ts               # Environment variables
│   ├── middleware/
│   │   ├── auth.ts              # JWT authentication
│   │   ├── errorHandler.ts     # Global error handling
│   │   └── validation.ts        # Request validation
│   ├── routes/
│   │   ├── projects.ts          # Project CRUD
│   │   ├── prompts.ts           # Prompt submission
│   │   ├── files.ts             # File operations
│   │   └── deploy.ts            # Deployment triggers
│   ├── services/
│   │   ├── claudeService.ts     # Claude API wrapper
│   │   ├── fileService.ts       # File system operations
│   │   ├── projectService.ts    # Project management
│   │   ├── conversationService.ts # Chat history
│   │   └── deployService.ts     # Deployment logic
│   ├── models/
│   │   ├── User.ts              # User model
│   │   ├── Project.ts           # Project model
│   │   └── Conversation.ts      # Conversation model
│   └── utils/
│       ├── codeParser.ts        # Parse Claude responses
│       └── logger.ts            # Logging utility
├── package.json
├── tsconfig.json
├── railway.json                  # Railway config
└── README.md
```

### Database Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  claude_api_key TEXT,  -- Optional: user's own API key
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  tech_stack JSONB,  -- e.g., {"framework": "react", "styling": "tailwind"}
  deploy_url TEXT,
  status VARCHAR(50) DEFAULT 'active',  -- active, deployed, archived
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  messages JSONB NOT NULL,  -- Array of {role, content, timestamp}
  total_tokens INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Deployments table
CREATE TABLE deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  deploy_url TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',  -- pending, success, failed
  logs TEXT,
  deployed_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_conversations_project_id ON conversations(project_id);
CREATE INDEX idx_deployments_project_id ON deployments(project_id);
```

### API Endpoints

#### Authentication
```
POST   /api/auth/register        # Create new account
POST   /api/auth/login           # Login
POST   /api/auth/logout          # Logout
GET    /api/auth/me              # Get current user
```

#### Projects
```
GET    /api/projects             # List user's projects
POST   /api/projects             # Create new project
GET    /api/projects/:id         # Get project details
PATCH  /api/projects/:id         # Update project
DELETE /api/projects/:id         # Delete project
```

#### Prompts (Claude Interaction)
```
POST   /api/projects/:id/prompt  # Send prompt to Claude
GET    /api/projects/:id/history # Get conversation history
```

#### Files
```
GET    /api/projects/:id/files         # List all files (tree structure)
GET    /api/projects/:id/files/*path   # Read specific file
POST   /api/projects/:id/files         # Create/update file manually
DELETE /api/projects/:id/files/*path   # Delete file
```

#### Deployments
```
POST   /api/projects/:id/deploy        # Trigger deployment
GET    /api/projects/:id/deployments   # Get deployment history
GET    /api/deployments/:id/logs       # Get deployment logs
```

### Core Services

#### 1. Claude Service (`services/claudeService.ts`)

**Responsibilities:**
- Manage Claude API communication
- Handle conversation context
- Parse tool calls from Claude responses
- Extract file operations from responses

**Key Methods:**
```typescript
class ClaudeService {
  async sendPrompt(
    projectId: string,
    message: string,
    conversationHistory: Message[]
  ): Promise<ClaudeResponse>

  async parseFileOperations(
    response: ClaudeResponse
  ): Promise<FileOperation[]>

  async streamResponse(
    projectId: string,
    message: string
  ): AsyncGenerator<string>
}
```

**System Prompt Template:**
```
You are an AI coding assistant helping to build a [PROJECT_TYPE] application.

Current project structure:
[FILE_TREE]

Previous conversation:
[CONVERSATION_HISTORY]

When you generate code:
1. Provide complete, working files
2. Include necessary imports and dependencies
3. Follow best practices for [TECH_STACK]
4. Explain significant changes

Use this format for file operations:
```FILE: src/App.js
[code here]
```
```

#### 2. File Service (`services/fileService.ts`)

**Responsibilities:**
- CRUD operations on Railway Volume
- Generate file trees
- Validate file paths
- Handle file permissions

**Volume Structure:**
```
/data/
└── projects/
    ├── {project-id-1}/
    │   ├── package.json
    │   ├── src/
    │   │   ├── App.tsx
    │   │   └── index.tsx
    │   └── public/
    └── {project-id-2}/
        └── ...
```

**Key Methods:**
```typescript
class FileService {
  async writeFile(
    projectId: string,
    filePath: string,
    content: string
  ): Promise<void>

  async readFile(
    projectId: string,
    filePath: string
  ): Promise<string>

  async getFileTree(
    projectId: string
  ): Promise<FileNode[]>

  async deleteProject(
    projectId: string
  ): Promise<void>
}
```

#### 3. Deploy Service (`services/deployService.ts`)

**Responsibilities:**
- Push code to GitHub
- Trigger Vercel/Netlify deployments
- Monitor deployment status
- Store deployment metadata

**Key Methods:**
```typescript
class DeployService {
  async deployToVercel(
    projectId: string
  ): Promise<DeploymentResult>

  async getDeploymentStatus(
    deploymentId: string
  ): Promise<DeploymentStatus>

  async createGitHubRepo(
    projectId: string
  ): Promise<string>
}
```

### Environment Variables

```env
# Server
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Claude API
CLAUDE_API_KEY=sk-ant-...

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Storage
VOLUME_PATH=/data
MAX_PROJECT_SIZE=100MB

# Deployment
VERCEL_TOKEN=...
GITHUB_TOKEN=...

# Optional
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=15m
```

### Error Handling

**Standard Error Response:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Project name is required",
    "details": {
      "field": "name",
      "constraint": "required"
    }
  }
}
```

**Error Codes:**
- `AUTH_ERROR` - Authentication failures
- `VALIDATION_ERROR` - Request validation failures
- `NOT_FOUND` - Resource not found
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `CLAUDE_API_ERROR` - Claude API failures
- `FILE_SYSTEM_ERROR` - File operation failures
- `DEPLOY_ERROR` - Deployment failures

---

## Frontend Architecture

### Technology Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context + SWR for data fetching
- **Real-time**: Server-Sent Events (SSE) for streaming
- **Hosting**: Vercel

### Project Structure

```
frontend/
├── app/
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx             # Projects list
│   └── projects/
│       └── [id]/
│           ├── page.tsx         # Chat interface
│           ├── files/
│           │   └── page.tsx     # File browser
│           └── deployments/
│               └── page.tsx     # Deployment history
├── components/
│   ├── chat/
│   │   ├── ChatInterface.tsx    # Main chat UI
│   │   ├── MessageList.tsx      # Message display
│   │   ├── PromptInput.tsx      # Input field
│   │   └── StreamingMessage.tsx # Real-time responses
│   ├── files/
│   │   ├── FileTree.tsx         # Folder structure
│   │   ├── CodeViewer.tsx       # Syntax-highlighted code
│   │   └── FileActions.tsx      # Download, delete, etc.
│   ├── projects/
│   │   ├── ProjectCard.tsx      # Project preview card
│   │   ├── CreateProject.tsx    # New project form
│   │   └── ProjectSettings.tsx  # Project configuration
│   ├── layout/
│   │   ├── Navbar.tsx           # Top navigation
│   │   ├── Sidebar.tsx          # Side navigation (desktop)
│   │   └── MobileNav.tsx        # Bottom nav (mobile)
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── api.ts                   # API client
│   ├── auth.ts                  # Auth utilities
│   └── hooks/
│       ├── useProjects.ts       # Project data hooks
│       ├── useChat.ts           # Chat logic hooks
│       └── useFiles.ts          # File operations hooks
├── public/
├── package.json
├── tailwind.config.js
└── next.config.js
```

### Key Pages & Features

#### 1. Landing Page (`app/page.tsx`)
- Hero section with value proposition
- Demo video/GIF
- CTA: "Start Building"
- Pricing (if applicable)

#### 2. Dashboard (`app/dashboard/page.tsx`)
**Mobile-first grid:**
```
┌─────────────────────────────┐
│  Your Projects (5)    [+]   │
├─────────────────────────────┤
│ ┌─────────┐ ┌─────────┐    │
│ │ Todo    │ │ Blog    │    │
│ │ App     │ │ Site    │    │
│ │ React   │ │ Next.js │    │
│ │ 2d ago  │ │ 5d ago  │    │
│ └─────────┘ └─────────┘    │
│ ┌─────────┐                │
│ │ API     │                │
│ │ Express │                │
│ │ 1w ago  │                │
│ └─────────┘                │
└─────────────────────────────┘
```

#### 3. Chat Interface (`app/projects/[id]/page.tsx`)

**Mobile Layout:**
```
┌─────────────────────────────┐
│ ← Todo App        ⋮ [Menu] │ ← Header
├─────────────────────────────┤
│                             │
│  You: Build a todo app      │
│  with dark mode             │
│                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━   │
│                             │
│  Claude: I'll create a      │
│  React todo app with dark   │
│  mode. Here's what I'll...  │
│                             │
│  📄 src/App.tsx             │
│  📄 src/TodoList.tsx        │
│  📄 src/DarkMode.tsx        │
│                             │
│  [View Files] [Deploy]      │
│                             │
│                             │ ← Chat history
│                             │
│                             │
├─────────────────────────────┤
│ Type a message...      [→]  │ ← Input (fixed bottom)
└─────────────────────────────┘
```

**Features:**
- Message streaming (typewriter effect)
- Code blocks with syntax highlighting
- File change indicators
- Quick actions (View Files, Deploy, Undo)
- Context-aware suggestions

#### 4. File Browser (`app/projects/[id]/files/page.tsx`)

**Mobile Layout:**
```
┌─────────────────────────────┐
│ ← Files                     │
├─────────────────────────────┤
│ 📁 src/                     │
│   📄 App.tsx           3 KB │
│   📄 TodoList.tsx      2 KB │
│   📄 index.tsx         1 KB │
│ 📁 public/                  │
│   🖼️  logo.png         12KB │
│ 📄 package.json        1 KB │
│ 📄 README.md           2 KB │
└─────────────────────────────┘
     ↓ Tap file
┌─────────────────────────────┐
│ ← App.tsx        [⋮] Menu  │
├─────────────────────────────┤
│ 1  import React from...     │
│ 2                           │
│ 3  function App() {         │
│ 4    return (               │
│ 5      <div>                │
│ 6        <h1>Todo</h1>      │
│ 7      </div>               │
│ ...                         │
│                             │
│ [Download] [Delete] [Edit]  │
└─────────────────────────────┘
```

### State Management

**Project Context:**
```typescript
interface ProjectContextType {
  project: Project | null;
  conversations: Message[];
  files: FileNode[];
  isLoading: boolean;

  sendPrompt: (message: string) => Promise<void>;
  refreshFiles: () => Promise<void>;
  deploy: () => Promise<DeploymentResult>;
}
```

**API Client (`lib/api.ts`):**
```typescript
class ApiClient {
  private baseURL: string;
  private token: string | null;

  async post<T>(endpoint: string, data: any): Promise<T>
  async get<T>(endpoint: string): Promise<T>
  async stream(endpoint: string, data: any): ReadableStream
}
```

### Mobile Optimizations

**Touch Interactions:**
- Swipe to reveal actions
- Pull to refresh
- Long press for context menu

**Performance:**
- Code splitting per route
- Lazy load file content
- Virtual scrolling for large file lists
- Progressive image loading

**Responsive Design:**
```css
/* Mobile-first breakpoints */
sm: 640px   /* Large phones */
md: 768px   /* Tablets */
lg: 1024px  /* Small laptops */
xl: 1280px  /* Desktops */
```

**PWA Features (Optional):**
- Offline support for viewing cached projects
- Install prompt
- Push notifications for deployment status

---

## Data Flow Examples

### 1. Send Prompt Flow

```
[User types message in chat]
        ↓
[Frontend: POST /api/projects/:id/prompt]
        ↓
[Backend: Validate request]
        ↓
[Backend: Load conversation history from DB]
        ↓
[Backend: Call Claude API with context]
        ↓
[Claude: Generate response with file operations]
        ↓
[Backend: Parse response, extract file changes]
        ↓
[Backend: Write files to Railway Volume]
        ↓
[Backend: Save conversation to DB]
        ↓
[Backend: Return response to frontend]
        ↓
[Frontend: Display message + file changes]
```

### 2. Deploy Flow

```
[User clicks "Deploy" button]
        ↓
[Frontend: POST /api/projects/:id/deploy]
        ↓
[Backend: Read project files from Volume]
        ↓
[Backend: Create/update GitHub repo]
        ↓
[Backend: Trigger Vercel deployment]
        ↓
[Backend: Poll deployment status]
        ↓
[Backend: Save deployment record to DB]
        ↓
[Backend: Return deployment URL]
        ↓
[Frontend: Show success message + live URL]
```

---

## Security Considerations

### Authentication
- JWT tokens with HTTP-only cookies
- Token refresh mechanism
- Rate limiting per user

### API Security
- CORS configuration (whitelist frontend domain)
- Request validation (Zod schemas)
- SQL injection prevention (parameterized queries)
- File path validation (prevent directory traversal)

### File System
- Isolate projects in separate directories
- Limit file sizes (max 10MB per file)
- Limit total project size (max 100MB)
- Scan for malicious code (optional)

### Deployment
- Sandbox preview environments
- Environment variable encryption
- Secure credential storage

---

## Scalability Considerations

### Current MVP (Single Railway Instance)
- 100 concurrent users
- 1000 projects
- 5GB storage

### Future Scaling

**Horizontal Scaling:**
- Multiple Railway instances behind load balancer
- Session affinity for WebSocket connections

**Storage Scaling:**
- Move to S3/R2 when >50GB needed
- Implement CDN for file serving

**Database Scaling:**
- Read replicas for file tree queries
- Connection pooling
- Query optimization

**Caching:**
- Redis for session storage
- Cache file trees
- Cache Claude responses (optional)

---

## Monitoring & Logging

### Metrics to Track
- API response times
- Claude API latency
- Deployment success rate
- Active users
- Storage usage per user
- Error rates by endpoint

### Logging Strategy
```typescript
logger.info('Prompt received', {
  projectId,
  userId,
  messageLength: message.length,
  timestamp: new Date()
});

logger.error('Claude API error', {
  projectId,
  error: err.message,
  statusCode: err.status
});
```

### Alerts
- High error rate (>5% of requests)
- Claude API failures
- Storage capacity >80%
- Deployment failures

---

## Deployment Strategy

### Railway (Backend)
```json
// railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Vercel (Frontend)
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

### CI/CD Pipeline
```
GitHub Push
    ↓
[Run Tests]
    ↓
[Build]
    ↓
[Deploy to Railway/Vercel]
    ↓
[Run E2E Tests]
    ↓
[Notify on Slack]
```

---

## Future Enhancements

### Phase 2
- [ ] Real-time collaboration (multiple users)
- [ ] Git integration (commits, branches)
- [ ] Template marketplace
- [ ] AI code review

### Phase 3
- [ ] VS Code extension
- [ ] Mobile native apps (React Native)
- [ ] Team workspaces
- [ ] Advanced deployment options (Docker, Kubernetes)

### Phase 4
- [ ] Monetization (premium tiers)
- [ ] White-label solution
- [ ] Enterprise features (SSO, audit logs)

---

## Tech Stack Summary

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend Framework | Next.js 14 | SSR, App Router, excellent DX |
| Frontend UI | Tailwind + shadcn/ui | Rapid mobile-first development |
| Backend Runtime | Node.js + Express | Fast, well-documented, TS support |
| Database | PostgreSQL | Relational data, JSONB for flexibility |
| AI Provider | Anthropic Claude | Best for code generation, long context |
| Storage | Railway Volumes | Simple, persistent, affordable |
| Backend Hosting | Railway | Easy deployment, managed services |
| Frontend Hosting | Vercel | Next.js optimized, edge network |
| Deployment Target | Vercel/Netlify | Free tier, auto-deploy from Git |

---

## Getting Started (Development)

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Claude API key
- Railway account
- Vercel account

### Local Development

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Configure DATABASE_URL, CLAUDE_API_KEY
npm run dev  # Starts on :3000
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Configure NEXT_PUBLIC_API_URL
npm run dev  # Starts on :3001
```

### First Deployment

**Railway:**
```bash
cd backend
railway login
railway init
railway up
railway variables set CLAUDE_API_KEY=...
railway open
```

**Vercel:**
```bash
cd frontend
vercel login
vercel
# Follow prompts
```

---

## Cost Estimate (Monthly)

| Service | Plan | Cost |
|---------|------|------|
| Railway (Backend + DB + Volume) | Hobby | $5-10 |
| Claude API | Pay-as-you-go | $10-50* |
| Vercel (Frontend) | Free | $0 |
| Domain (Optional) | - | $12/yr |
| **Total** | | **$15-60/mo** |

*Depends on usage (tokens consumed)

---

## Questions to Address

1. **Authentication**: Simple email/password or OAuth (Google, GitHub)?
2. **Billing**: Will users bring their own Claude API keys or use yours?
3. **File Limits**: Max project size? Max files per project?
4. **Deployment**: Auto-deploy on every change or manual trigger?
5. **Preview**: Serve apps from Railway or always deploy to Vercel?

---

This architecture provides a solid foundation for the MVP while remaining flexible for future enhancements. The mobile-first approach ensures a great UX on phones, while the Railway + Vercel stack keeps infrastructure simple and cost-effective.
