# Phase 2: Full-Stack Backend Generation

> **Goal:** Enable generation of complete backends with APIs, databases, authentication, and automatic deployment

**Duration:** 6-8 weeks
**Priority:** HIGH
**Dependencies:** Phase 1 (nice to have, but can run in parallel)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Backend Framework Support](#backend-framework-support)
3. [Database Provisioning](#database-provisioning)
4. [Backend Code Generation](#backend-code-generation)
5. [Backend Deployment](#backend-deployment)
6. [Full-Stack Project Templates](#full-stack-project-templates)
7. [Implementation Plan](#implementation-plan)

---

## Overview

### The Vision

Currently, the tool can only generate frontend code (HTML, CSS, JS, React). Phase 2 transforms it into a **full-stack code generator** that can:

- Generate backend APIs (Express, FastAPI, NestJS, Go)
- Provision databases automatically (PostgreSQL, MongoDB, Redis)
- Set up authentication (JWT, OAuth, sessions)
- Deploy backends to cloud platforms
- Connect frontend to backend automatically

### Example Use Case: Dating Coach App

**User Prompt:**
```
"Create a dating coach iOS app with:
- FastAPI backend with PostgreSQL
- User authentication (JWT)
- Content library with dating advice
- AI chat using Claude API
- Semantic search over content
- Subscription payments with Stripe
- PWA frontend"
```

**Tool Generates:**
- ✅ FastAPI backend with all routes
- ✅ PostgreSQL database with schema
- ✅ User auth with JWT
- ✅ Claude API integration
- ✅ Content management endpoints
- ✅ Stripe payment integration
- ✅ React/Next.js PWA frontend
- ✅ Deploys everything and connects it

---

## Backend Framework Support

### Phase 2.1: Node.js/Express (Week 1-2)

**Priority: HIGH** - We already know this stack

**Detection Logic:**
```typescript
function detectBackendType(files: FileOperation[]): BackendType | null {
  const hasExpressFile = files.some(f =>
    f.path.includes('server.') || f.path.includes('app.')
  );

  const hasPackageJson = files.find(f => f.path === 'package.json');
  if (hasPackageJson && hasPackageJson.content.includes('express')) {
    return 'node-express';
  }

  return null;
}
```

**Generated Structure:**
```
backend/
├── server.js (or index.ts)
├── package.json
├── routes/
│   ├── auth.js
│   ├── users.js
│   └── api.js
├── models/
│   └── User.js
├── middleware/
│   ├── auth.js
│   └── validation.js
├── config/
│   └── database.js
└── .env
```

**Example Generated Code:**
```javascript
// server.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

### Phase 2.2: Python/FastAPI (Week 3-4)

**Priority: HIGH** - Great for AI/ML apps (like dating coach)

**Detection:**
```typescript
function detectPythonBackend(files: FileOperation[]): boolean {
  return files.some(f =>
    f.path === 'main.py' ||
    f.path === 'requirements.txt' ||
    f.content.includes('from fastapi import')
  );
}
```

**Generated Structure:**
```
backend/
├── main.py
├── requirements.txt
├── routers/
│   ├── auth.py
│   ├── users.py
│   └── api.py
├── models/
│   └── user.py
├── schemas/
│   └── user.py
├── core/
│   ├── config.py
│   ├── security.py
│   └── database.py
└── .env
```

**Example Generated Code:**
```python
# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, api

app = FastAPI(title="Dating Coach API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(api.router, prefix="/api", tags=["api"])

@app.get("/")
def read_root():
    return {"message": "API is running"}
```

---

### Phase 2.3: TypeScript/NestJS (Week 5)

**Priority: MEDIUM** - For enterprise apps

**Detection:**
```typescript
function detectNestJS(files: FileOperation[]): boolean {
  return files.some(f =>
    f.content.includes('@nestjs/') ||
    f.path === 'nest-cli.json'
  );
}
```

**Generated Structure:**
```
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   └── auth.service.ts
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   └── users.service.ts
│   └── database/
│       └── database.module.ts
├── package.json
└── tsconfig.json
```

---

### Phase 2.4: Go/Gin (Optional - Week 6)

**Priority: LOW** - For high-performance needs

Only if there's demand from users.

---

## Database Provisioning

### Automatic Database Detection & Provisioning

**Flow:**
```
1. Detect database need from code
2. Provision database via provider API
3. Inject connection string into env vars
4. Run migrations/setup scripts
5. Connect backend to database
```

---

### PostgreSQL (Railway)

**API Integration:**
```typescript
// services/railwayService.ts
export class RailwayService {
  async provisionPostgreSQL(projectId: string): Promise<DatabaseConfig> {
    // Use Railway API to create PostgreSQL service
    const response = await fetch('https://backboard.railway.app/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RAILWAY_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `
          mutation CreatePlugin($projectId: String!) {
            pluginCreate(input: {
              projectId: $projectId,
              name: "PostgreSQL"
            }) {
              id
              name
              variables {
                DATABASE_URL
                POSTGRES_USER
                POSTGRES_PASSWORD
                POSTGRES_DB
              }
            }
          }
        `,
        variables: { projectId }
      })
    });

    const { data } = await response.json();
    return {
      type: 'postgresql',
      connectionString: data.pluginCreate.variables.DATABASE_URL,
      credentials: {
        user: data.pluginCreate.variables.POSTGRES_USER,
        password: data.pluginCreate.variables.POSTGRES_PASSWORD,
        database: data.pluginCreate.variables.POSTGRES_DB
      }
    };
  }
}
```

**Migration Runner:**
```typescript
async function runMigrations(projectId: string, migrations: string[]) {
  const db = await getDatabaseConnection(projectId);

  for (const migration of migrations) {
    await db.query(migration);
    console.log(`✅ Migration applied: ${migration.slice(0, 50)}...`);
  }
}
```

---

### MongoDB Atlas

**API Integration:**
```typescript
export class MongoDBService {
  async provisionCluster(projectId: string): Promise<MongoDBConfig> {
    // Use MongoDB Atlas API
    const response = await fetch(
      'https://cloud.mongodb.com/api/atlas/v1.0/groups/{groupId}/clusters',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.MONGODB_ATLAS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `app-builder-${projectId}`,
          clusterType: 'REPLICASET',
          providerSettings: {
            providerName: 'AWS',
            regionName: 'US_EAST_1',
            instanceSizeName: 'M0' // Free tier
          }
        })
      }
    );

    const cluster = await response.json();
    return {
      type: 'mongodb',
      connectionString: cluster.connectionStrings.standardSrv,
      clusterId: cluster.id
    };
  }
}
```

---

### Redis (Upstash)

**For caching, sessions, queues:**

```typescript
export class RedisService {
  async provisionRedis(projectId: string): Promise<RedisConfig> {
    const response = await fetch('https://api.upstash.com/v2/redis/database', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.UPSTASH_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: `app-builder-${projectId}`,
        region: 'us-east-1',
        tls: true
      })
    });

    const redis = await response.json();
    return {
      type: 'redis',
      url: redis.endpoint,
      token: redis.rest_token
    };
  }
}
```

---

## Backend Code Generation

### Enhanced Claude Prompts

**System Prompt Template:**
```typescript
const BACKEND_SYSTEM_PROMPT = `
You are an expert full-stack developer. You can generate both frontend and backend code.

When generating backend code:
1. Use proper project structure
2. Include error handling and validation
3. Follow security best practices (input validation, SQL injection prevention, XSS protection)
4. Use environment variables for sensitive data
5. Include necessary dependencies in package.json/requirements.txt
6. Add comments for complex logic
7. Generate database migrations/schemas

For authentication:
- Use JWT for stateless auth
- Hash passwords with bcrypt
- Include refresh token logic
- Rate limit auth endpoints

For databases:
- Use parameterized queries (prevent SQL injection)
- Add indexes for performance
- Include migration scripts
- Handle connection pooling

Current project:
- Name: ${projectName}
- Type: ${projectType}
- Tech stack: ${techStack}
- Database: ${database}

File structure:
${fileTree}
`;
```

**Example Conversation:**

*User:* "Add user authentication with JWT to my Express app"

*Claude Response:*
```
I'll add JWT-based authentication to your Express app with user registration, login, and protected routes.

```FILE: backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword
    });

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  // ... login logic
});

module.exports = router;
```

```FILE: backend/middleware/auth.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };
```

I've added:
1. Registration endpoint with password hashing
2. Login endpoint with JWT generation
3. Auth middleware for protected routes
4. Input validation and error handling

To use: Add "jwt" and "bcrypt" to your dependencies, then set JWT_SECRET in .env
```

---

### Code Parsing & Extraction

**Enhanced Parser:**
```typescript
interface ParsedBackendCode {
  backend: {
    framework: 'express' | 'fastapi' | 'nestjs' | 'gin';
    files: FileOperation[];
    dependencies: string[];
    environmentVariables: string[];
    migrations?: string[];
  };
  frontend?: {
    files: FileOperation[];
  };
  database?: {
    type: 'postgresql' | 'mongodb' | 'redis';
    schema?: string;
    migrations?: string[];
  };
}

export function parseFullStackResponse(response: string): ParsedBackendCode {
  // Extract all ```FILE: blocks
  const fileBlocks = extractFileBlocks(response);

  // Categorize into backend vs frontend
  const backend = fileBlocks.filter(isBackendFile);
  const frontend = fileBlocks.filter(isFrontendFile);

  // Extract dependencies
  const packageJson = backend.find(f => f.path === 'package.json');
  const dependencies = packageJson ?
    Object.keys(JSON.parse(packageJson.content).dependencies) : [];

  // Extract env vars mentioned in code
  const envVars = extractEnvVars(backend);

  // Extract database migrations
  const migrations = extractMigrations(response);

  return {
    backend: {
      framework: detectFramework(backend),
      files: backend,
      dependencies,
      environmentVariables: envVars,
      migrations
    },
    frontend: { files: frontend },
    database: detectDatabase(response, migrations)
  };
}
```

---

## Backend Deployment

### Deployment Service (Enhanced)

```typescript
// services/backendDeploymentService.ts
export class BackendDeploymentService {
  async deployFullStack(
    projectId: string,
    parsedCode: ParsedBackendCode
  ): Promise<FullStackDeployment> {

    // 1. Provision database if needed
    let databaseConfig: DatabaseConfig | null = null;
    if (parsedCode.database) {
      databaseConfig = await this.provisionDatabase(
        projectId,
        parsedCode.database.type
      );

      // Run migrations
      if (parsedCode.database.migrations) {
        await this.runMigrations(databaseConfig, parsedCode.database.migrations);
      }
    }

    // 2. Deploy backend to Railway
    const backendUrl = await this.deployBackendToRailway(
      projectId,
      parsedCode.backend,
      databaseConfig
    );

    // 3. Deploy frontend to Vercel with backend URL
    const frontendUrl = await this.deployFrontendToVercel(
      projectId,
      parsedCode.frontend,
      { apiUrl: backendUrl }
    );

    // 4. Save deployment record
    await this.saveDeployment({
      projectId,
      backendUrl,
      frontendUrl,
      databaseConfig
    });

    return {
      backendUrl,
      frontendUrl,
      databaseUrl: databaseConfig?.connectionString
    };
  }

  private async deployBackendToRailway(
    projectId: string,
    backend: Backend,
    database: DatabaseConfig | null
  ): Promise<string> {
    // Create Railway service
    const service = await railway.createService({
      name: `${projectId}-api`,
      source: {
        type: 'upload',
        files: backend.files
      }
    });

    // Set environment variables
    const envVars = {
      NODE_ENV: 'production',
      PORT: 3000,
      ...database?.envVars,
      ...this.extractEnvVarsFromCode(backend.files)
    };

    await railway.setVariables(service.id, envVars);

    // Deploy
    await railway.deploy(service.id);

    return service.url;
  }
}
```

---

### Railway Service Creation via API

```typescript
async function createRailwayService(
  projectId: string,
  serviceName: string,
  files: FileOperation[]
): Promise<RailwayService> {

  // 1. Create temporary git repo or use direct upload
  const uploadUrl = await railway.getUploadUrl(projectId);

  // 2. Upload files
  await uploadFiles(uploadUrl, files);

  // 3. Create service
  const response = await fetch('https://backboard.railway.app/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RAILWAY_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: `
        mutation CreateService($input: ServiceCreateInput!) {
          serviceCreate(input: $input) {
            id
            name
            domains {
              domain
            }
          }
        }
      `,
      variables: {
        input: {
          projectId,
          name: serviceName,
          source: {
            repo: uploadUrl
          }
        }
      }
    })
  });

  const { data } = await response.json();
  return {
    id: data.serviceCreate.id,
    name: data.serviceCreate.name,
    url: `https://${data.serviceCreate.domains[0].domain}`
  };
}
```

---

## Full-Stack Project Templates

### Template 1: REST API + React

**Prompt:** "Create a blog app with Express backend and React frontend"

**Generates:**
- Express API with CRUD endpoints
- PostgreSQL database
- React frontend with routing
- Auth (JWT)
- Deployed: Backend (Railway) + Frontend (Vercel)

---

### Template 2: AI-Powered App

**Prompt:** "Create a dating coach app with AI chat"

**Generates:**
- FastAPI backend
- Claude API integration
- PostgreSQL for users + content
- Vector database (Pinecone) for semantic search
- JWT auth
- Stripe payments
- React PWA frontend
- Deployed: Backend (Railway) + Frontend (Vercel)

**Backend Structure:**
```
backend/
├── main.py
├── routers/
│   ├── auth.py        # JWT auth
│   ├── chat.py        # Claude AI chat
│   ├── content.py     # Content library
│   ├── search.py      # Semantic search
│   └── payments.py    # Stripe webhooks
├── models/
│   ├── user.py
│   └── content.py
├── services/
│   ├── claude.py      # Claude API wrapper
│   ├── pinecone.py    # Vector search
│   └── stripe.py      # Payment processing
└── core/
    ├── config.py
    ├── security.py
    └── database.py
```

---

### Template 3: Real-Time Chat

**Prompt:** "Create a real-time chat app with WebSockets"

**Generates:**
- Node.js + Socket.io backend
- Redis for pub/sub
- PostgreSQL for message history
- React frontend with WebSocket client
- Deployed: Backend (Railway) + Frontend (Vercel)

---

### Template 4: Next.js Full-Stack

**Prompt:** "Create a SaaS app with Next.js"

**Generates:**
- Next.js with API routes
- Prisma ORM + PostgreSQL
- tRPC for type-safe APIs
- NextAuth for authentication
- Stripe for billing
- All-in-one deployment to Vercel

---

## Implementation Plan

### Week 1-2: Node.js/Express Backend
- [ ] Backend detection logic
- [ ] Express code generation
- [ ] PostgreSQL provisioning (Railway)
- [ ] Migration runner
- [ ] Backend deployment to Railway
- [ ] Environment variable injection
- [ ] Test: Deploy Express + PostgreSQL app

### Week 3-4: Python/FastAPI Backend
- [ ] FastAPI detection
- [ ] FastAPI code generation
- [ ] Requirements.txt parsing
- [ ] PostgreSQL connection for Python
- [ ] Uvicorn deployment config
- [ ] Test: Deploy FastAPI + PostgreSQL app

### Week 5: Enhanced Features
- [ ] MongoDB provisioning (Atlas)
- [ ] Redis provisioning (Upstash)
- [ ] Authentication generation (JWT, OAuth)
- [ ] File upload support (S3/Cloudinary)
- [ ] Email service integration (SendGrid)

### Week 6: Integration & Testing
- [ ] Frontend-backend connection automation
- [ ] CORS configuration
- [ ] API key management UI
- [ ] Multi-service deployment
- [ ] End-to-end testing

### Week 7-8: Templates & Polish
- [ ] 5+ full-stack templates
- [ ] Documentation generation
- [ ] Error handling improvements
- [ ] Deployment status tracking
- [ ] User feedback implementation

---

## Success Criteria

✅ **Phase 2 Complete When:**
1. Can generate 3+ backend frameworks (Express, FastAPI, NestJS)
2. Can provision PostgreSQL, MongoDB, Redis automatically
3. Backend deployment success rate >95%
4. Generates authentication code (JWT)
5. Connects frontend to backend automatically
6. Environment variables managed properly
7. 5+ full-stack templates working
8. Deployment time <5 minutes
9. Database migrations run successfully
10. User can build dating coach app end-to-end

---

## Testing Plan

### Unit Tests
- Backend detection logic
- Code parsing
- Database provisioning
- Deployment scripts

### Integration Tests
- Full-stack deployment (Express + React)
- Full-stack deployment (FastAPI + Next.js)
- Database provisioning + migrations
- Multi-service coordination

### End-to-End Tests
- User prompt → Deployed full-stack app
- Authentication flow works
- Database connected
- API endpoints respond
- Frontend calls backend successfully

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Claude generates incorrect backend code | HIGH | Add validation, lint checks, test generation |
| Database provisioning fails | HIGH | Fallback to manual connection string input |
| Railway API changes | MEDIUM | Abstract provider interface, support multiple providers |
| Complex backend requirements | MEDIUM | Start simple, expand incrementally |
| Deployment failures | HIGH | Detailed logging, rollback capability |

---

## Resources

- [Railway API Docs](https://docs.railway.app/reference/api-reference)
- [MongoDB Atlas API](https://www.mongodb.com/docs/atlas/api/)
- [Upstash Redis API](https://docs.upstash.com/redis/api/api)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

*Last updated: 2025-01-20*
