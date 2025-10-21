# Mobile App Builder - Frontend

Next.js frontend for the Mobile App Builder application.

## Features

- 📱 **Mobile-First Design**: Optimized for coding from your phone
- 🤖 **AI-Powered**: Chat with Claude to generate code
- 📂 **File Management**: View and manage generated files
- 🚀 **Real-time Updates**: Instant feedback with optimistic UI updates
- 💬 **Rich Chat Interface**: Markdown rendering with syntax-highlighted code blocks

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query + Zustand
- **UI Components**: Custom components with lucide-react icons
- **Markdown**: react-markdown for Claude responses

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Backend API running (see `/backend` directory)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your backend API URL

# Start development server
npm run dev
```

The app will be available at http://localhost:3001

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

## Project Structure

```
frontend/
├── app/                      # Next.js app directory
│   ├── dashboard/            # Project dashboard
│   ├── projects/[id]/        # Project pages
│   │   ├── page.tsx          # Chat interface
│   │   └── files/page.tsx    # File browser
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing page
│   └── providers.tsx         # React Query provider
├── components/
│   ├── chat/                 # Chat interface components
│   ├── files/                # File browser components
│   ├── projects/             # Project list components
│   └── ui/                   # Reusable UI components
├── lib/
│   ├── api/                  # API client and endpoints
│   ├── types.ts              # TypeScript types
│   └── utils.ts              # Utility functions
└── public/                   # Static assets
```

## Key Components

### Chat Interface

- **ChatInterface**: Main chat container with message list and input
- **MessageList**: Virtualized list of messages with auto-scroll
- **Message**: Individual message with role-based styling
- **CodeBlock**: Syntax-highlighted code with copy functionality
- **PromptInput**: Textarea with auto-resize and keyboard shortcuts

### File Browser

- **FileTree**: Collapsible tree view of project files
- **FileViewer**: Code viewer with download functionality

### Project Management

- **ProjectList**: Grid of project cards
- **ProjectCard**: Individual project with metadata
- **CreateProjectButton**: Modal for creating new projects

## API Integration

The frontend communicates with the backend via REST API:

- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `POST /api/projects/:id/prompt` - Send prompt to Claude
- `GET /api/projects/:id/conversation` - Get conversation history
- `GET /api/projects/:id/files` - Get file tree
- `GET /api/projects/:id/files/*` - Read file content
- `POST /api/projects/:id/files` - Create/update file

## Mobile Optimization

- Touch-friendly tap targets (minimum 44x44px)
- Prevents zoom on iOS with proper font sizes
- Smooth scrolling with `-webkit-overflow-scrolling: touch`
- Responsive design with mobile-first breakpoints
- Optimized bundle size with code splitting

## Development

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables in Vercel dashboard
# - NEXT_PUBLIC_API_URL
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Server-side rendering for initial page load
- Optimistic UI updates for instant feedback
- React Query caching to minimize API calls
- Code splitting for smaller bundle sizes
- Image optimization with Next.js Image

## Contributing

1. Create a feature branch
2. Make your changes
3. Test on mobile devices
4. Submit a pull request

## License

MIT
