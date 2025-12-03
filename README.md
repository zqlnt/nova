# Nova - E-Learning Platform

An AI-powered personalized education platform built with Next.js, TypeScript, and Tailwind CSS.

## Features

### Student Portal
- **Dashboard**: View learning progress, continue lessons, and identify weak areas
- **Chat with Nova**: Interactive AI learning companion for instant help
- **Settings**: Personalize learning preferences and profile

### Teacher Portal
- **Dashboard**: Monitor all classes and student progress at a glance
- **Class Management**: View detailed class statistics and student performance
- **Student Analytics**: Deep dive into individual student progress and patterns
- **Ask Nova**: Get AI-powered insights about students and teaching strategies
- **Settings**: Manage account and notification preferences

## Design

- **Modern Glassmorphism UI**: iOS-inspired liquid glass components
- **Animated Background**: Pink and blue glowing orbs creating a dynamic atmosphere
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Light Mode**: Clean, professional interface optimized for extended use

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Pattern**: Glassmorphism / Frosted Glass

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory:
```bash
# Claude API
ANTHROPIC_API_KEY=your_claude_api_key

# Firebase (these are already configured, but you can override)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAJSr7LsZEIU0wZ1KfsLXH-F5xSgvfebjg
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=nova-f3764.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nova-f3764
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=nova-f3764.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=700426428836
NEXT_PUBLIC_FIREBASE_APP_ID=1:700426428836:web:60f00c8c7ce6c4f611e131
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-MDPB7BGQH7
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

5. Create an account or sign in at `/login` or `/signup`

## Project Structure

```
nova/
├── app/                          # Next.js app directory
│   ├── student/                  # Student portal routes
│   │   ├── dashboard/
│   │   ├── chat/
│   │   └── settings/
│   ├── teacher/                  # Teacher portal routes
│   │   ├── dashboard/
│   │   ├── classes/[classId]/
│   │   ├── students/[studentId]/
│   │   └── settings/
│   ├── globals.css              # Global styles and glass utilities
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                   # Reusable components
│   ├── Layout.tsx               # Main layout wrapper with nav/sidebar
│   ├── Card.tsx                 # Glass card component
│   ├── Button.tsx               # Button component with variants
│   ├── Badge.tsx                # Badge component
│   ├── ChatMessageList.tsx      # Chat message display
│   └── ChatInput.tsx            # Chat input field
├── lib/                         # Utilities and helpers
│   └── mockData.ts             # Mock data for development
└── public/                      # Static assets
```

## Current Status

This is a functional implementation with:
- ✅ Complete UI/UX design with glassmorphism styling
- ✅ All student and teacher pages
- ✅ **Firebase Authentication** (Email/Password + Google Sign-In)
- ✅ **Claude AI Integration** for Nova chat
- ✅ Real-time chat with AI assistant
- ✅ Responsive layout
- ✅ Right sidebar chat panel
- ✅ Protected routes

### Not Yet Implemented
- Database persistence (user profiles, progress)
- Real-time collaboration features
- File uploads
- Advanced analytics
- Progress tracking persistence

## Routes

### Public
- `/` - Landing page with portal selection
- `/login` - Sign in page
- `/signup` - Create account page

### Student Routes (Protected)
- `/student/dashboard` - Student dashboard with progress overview
- `/student/chat` - Full-page chat with Nova AI
- `/student/settings` - Student profile settings

### Teacher Routes (Protected)
- `/teacher/dashboard` - Teacher dashboard with class overview
- `/teacher/classes/[classId]` - Detailed class view with student progress
- `/teacher/students/[studentId]` - Individual student analytics
- `/teacher/settings` - Teacher account settings

### API Routes
- `/api/chat` - POST endpoint for Claude AI chat integration

## Features

### 🔐 Authentication
- Email/password authentication via Firebase
- Google Sign-In integration
- Protected routes for student and teacher portals
- Persistent sessions

### 🤖 AI Chat (Nova)
- Real-time chat with Claude 3.5 Sonnet
- Context-aware responses
- Subject-specific assistance
- Available in right sidebar on all pages
- Dedicated chat page for focused learning

### 🎨 UI/UX
- Clean, professional glassmorphism design
- iOS-style system blue (#007AFF) accent color
- Subtle animated background orbs
- Responsive design for all devices
- Custom subtle scrollbars
- Educational imagery and iconography

## Development Notes

- Student and teacher data is currently mocked in `lib/mockData.ts`
- Progress tracking is visual only (not persisted)
- Settings changes don't persist to database yet
- Logo loaded from external URL (Unsplash for demo images)

## Next Steps

1. Implement authentication (e.g., NextAuth.js)
2. Set up backend API (e.g., tRPC, REST, or GraphQL)
3. Integrate AI/LLM for Nova chat functionality
4. Add database (e.g., PostgreSQL with Prisma)
5. Implement real-time features (e.g., WebSockets)
6. Add comprehensive testing
7. Deploy to production

## License

Private project - All rights reserved

