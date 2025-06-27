# Wysa Frontend

A modern React/Next.js frontend application for Wysa's sleep onboarding system. This application provides a comprehensive user experience for sleep assessment, onboarding flow, and analytics dashboard.

## Features

### 🔐 Authentication
- User registration and login
- Secure JWT token-based authentication
- Protected routes and session management

### 🛏️ Sleep Onboarding Flow
- **Welcome Screen**: Friendly introduction with Wysa owl mascot
- **Screen 1**: Sleep struggle duration assessment
- **Screen 2**: Bedtime preference collection
- **Screen 3**: Wake-up time and sleep hours input
- **Screen 4**: Sleep hours confirmation with recommendations
- **Completion**: Desired sleep improvement goals selection

### 📊 Analytics Dashboard
- User onboarding completion statistics
- Detailed user journey tracking
- Screen-by-screen performance metrics
- Conversion funnel analysis
- Real-time data visualization

### 🎨 UI/UX Features
- Responsive design for all screen sizes
- Modern gradient backgrounds and animations
- Progress indicators throughout onboarding
- Loading states and error handling
- Logout functionality on all screens

## Tech Stack

- **Framework**: Next.js 15.3.4
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: React hooks
- **API Integration**: Fetch API with custom service layer
- **Authentication**: JWT tokens with localStorage

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (currently configured for AWS EC2)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wysa_front
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   Update the API base URL in `src/lib/api.ts`:
   ```typescript
   const API_BASE_URL = 'http://your-backend-url';
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open application**
   Navigate to `http://localhost:3002` (or the port shown in terminal)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── analytics/         # Analytics dashboard
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Login page
│   │   └── signup/        # Registration page
│   ├── dashboard/         # User dashboard
│   ├── onboarding/        # Onboarding flow
│   │   ├── welcome/       # Welcome screen
│   │   ├── screen1/       # Sleep struggle assessment
│   │   ├── screen2/       # Bedtime input
│   │   ├── screen3/       # Wake time input
│   │   ├── screen4/       # Sleep hours confirmation
│   │   └── complete/      # Goal selection
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   └── ui/                # Reusable UI components
│       ├── Button.tsx     # Button component
│       ├── Card.tsx       # Card component
│       └── Input.tsx      # Input component
└── lib/
    └── api.ts             # API service layer
```

## API Integration

The application integrates with a backend API that provides:

### Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Onboarding Endpoints
- `POST /api/onboarding/screen1` - Sleep struggle data
- `POST /api/onboarding/screen2` - Bedtime data
- `POST /api/onboarding/screen3` - Wake time data
- `POST /api/onboarding/screen4` - Sleep hours data
- `POST /api/onboarding/complete` - Final goals data

### User Management
- `GET /api/user/details` - Get user information

### Analytics
- `GET /api/stats/analytics` - Get comprehensive analytics data

## User Flow

1. **Landing** → Authentication (Login/Signup)
2. **New Users** → Welcome Screen → Onboarding Flow
3. **Returning Users** → Continue from last screen or Dashboard
4. **Completed Users** → Dashboard with Analytics access
5. **Analytics** → Comprehensive data visualization (for completed users)

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Style

- TypeScript for type safety
- Functional components with hooks
- Tailwind for styling
- Consistent naming conventions
- Clean, comment-free production code

## Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

3. **Environment Configuration**
   Update API URL for production environment in `src/lib/api.ts`

## Contributing

1. Follow existing code patterns
2. Use TypeScript for all new code
3. Implement responsive design
4. Add proper error handling
5. Test user flows thoroughly

## License

This project is part of the Wysa platform for sleep wellness and user onboarding.
