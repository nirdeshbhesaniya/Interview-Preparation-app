# Interview AI - Copilot Instructions

## Architecture Overview

This is a MERN-based AI interview preparation platform with a React frontend, Express backend, and MongoDB. The app generates AI-powered interview Q&A using Google Gemini API, featuring rich markdown rendering, global chatbot, and code execution capabilities.

**Key Components:**
- **Frontend**: React + Vite + Tailwind CSS + Framer Motion
- **Backend**: Express.js with structured routes in `/Routes/`
- **AI Engine**: Google Gemini API (`backend/utils/gemini.js`)
- **Database**: MongoDB with Mongoose schemas in `/Models/`
- **Global State**: React Context for user management (`frontend/src/context/`)

## Development Workflows

### Local Development
```bash
# Backend (port 5000)
cd backend && npm run dev

# Frontend (port 5173)  
cd frontend && npm run dev
```

### Environment Configuration
- Backend: Create `.env` with `MONGODB_URI`, `GEMINI_API_KEY`, `CLOUDINARY_*` vars
- Frontend: Toggle between local/production API in `src/utils/apiPaths.js` (line 2)

### Build & Deploy
```bash
cd frontend && npm run build  # Creates dist/ folder
```
Production deployed on Render with environment variables configured.

## Project-Specific Patterns

### AI Integration Pattern
All AI features use the centralized `backend/utils/gemini.js`:
```javascript
// Standard AI call pattern
const aiResponse = await generateInterviewQuestions(title, tag, experience, desc);
// Returns structured Q&A with answerParts: [{ type: 'text'|'code', content: string }]
```

### API Structure
- **Centralized paths**: All API endpoints defined in `frontend/src/utils/apiPaths.js`
- **Route organization**: Backend routes grouped by feature (`/Routes/authRoutes.js`, `/Routes/interview.js`, etc.)
- **Standard responses**: APIs return `{ success: boolean, message?: string, data?: any }`

### Database Schema Convention
- **Interview Model**: Uses `answerParts` array for rich content (text/code blocks)
- **User sessions**: Tracked via `sessionId` (UUID) + `creatorEmail`
- **Soft deletion**: Uses OTP verification for delete operations

### Frontend State Management
- **User Context**: Global user state in `src/context/UserContext.jsx`
- **Chatbot Hook**: Reusable chatbot logic in `src/hooks/useChatbot.js`
- **Protected Routes**: Wrapper component in `src/components/layouts/ProtectedRoute.jsx`

### UI/UX Patterns
- **Responsive Design**: Mobile-first with Tailwind breakpoints
- **Dark Mode**: Class-based (`dark:`) with manual toggle
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Toast Notifications**: React Hot Toast with custom styling
- **Markdown Rendering**: ReactMarkdown + syntax highlighting for AI responses

### Component Architecture
- **Layout System**: `MainLayout.jsx` for authenticated pages with header
- **Global Components**: Chatbot accessible across all routes via App.jsx
- **Page Structure**: `/pages/` organized by feature areas (Auth, Home, InterviewPrep)

### Code Execution Feature
- Monaco Editor integration in `/pages/Home/Codebase.jsx`
- Compile API endpoint: `POST /api/compile` with language support
- Real-time code execution with output display

### Chatbot Implementation
- **Global Access**: Floating button available on all pages
- **Context-Aware**: Sends 'interview_preparation' context to Gemini
- **Rich UI**: Minimizable, responsive with quick-start questions
- **State Persistence**: Maintains conversation history during session

## Key Files to Understand

- `backend/server.js` - Main server setup and route registration
- `frontend/src/App.jsx` - Route configuration and global components
- `backend/utils/gemini.js` - All AI integration logic
- `frontend/src/utils/apiPaths.js` - Centralized API endpoint definitions
- `backend/Models/Interview.js` - Core data structure for interview sessions
- `frontend/src/pages/InterviewPrep/InterviewPrep.jsx` - Main interview interface (565 lines)

## Common Tasks

### Adding New AI Features
1. Extend `backend/utils/gemini.js` with new functions
2. Add API route in appropriate `/Routes/` file
3. Update `frontend/src/utils/apiPaths.js` with new endpoint
4. Implement frontend hook or component logic

### Styling Guidelines
- Use Tailwind utility classes with responsive prefixes (`sm:`, `md:`, `lg:`)
- Dark mode variants with `dark:` prefix
- Gradients for primary actions: `from-orange-500 via-red-500 to-pink-500`
- Framer Motion for animations with spring physics

### Database Operations
- All models use timestamps: `{ timestamps: true }`
- UUIDs for session identification: `const sessionId = uuidv4()`
- Email-based user association for multi-tenancy
