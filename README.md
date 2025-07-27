# App Auth React

A modern React authentication demo application built with TypeScript, Vite, and a comprehensive design system.

## Demo - [malcorehardcore698.github.io/app-auth-react](https://malcorehardcore698.github.io/app-auth-react/)

## 🛠 Tech Stack

### Core
- **React** 19.1.0 - UI library
- **TypeScript** 5.8.3 - Type safety
- **Vite** 5.0.0 - Build tool and dev server
- **React Router DOM** 7.7.0 - Client-side
- **SCSS** - CSS preprocessing with modern API
- **Framer Motion** 12.23.9 - Animations
- **Zod** 4.0.5 - Schema validation
- **Vitest** 3.2.4 - Unit testing framework
- **Testing Library** - React testing utilities
- **Storybook** 9.0.18 - Component documentation

## 📁 Project Architecture

The project follows a feature-based architecture with clear separation of concerns:

```
src/
├── app/                   # Application core
│   ├── app.tsx            # Main app component
│   └── routes/            # Routing configuration
├── features/              # Feature modules
│   └── auth/              # Authentication features
│       ├── login-form/
│       ├── register-form/
│       ├── forgot-password-form/
│       ├── password-field/
│       └── logout-button/
├── pages/                 # Page components
│   ├── auth/              # Authentication page
│   └── welcome/           # Welcome page
├── services/              # Business logic
│   ├── auth/              # Authentication service
│   ├── internalization/   # i18n support
│   └── theming/           # Theme management
├── shared/                # Shared utilities
│   ├── api/               # API clients and storage
│   ├── constants/         # App constants
│   ├── styles/            # Global styles and variables
│   ├── types/             # TypeScript types
│   └── ui/                # Reusable UI components
└── test/                  # Test configuration
```

### Key Architectural Patterns

- **Feature-Based Organization** - Features are self-contained modules
- **Layered Architecture** - Clear separation between UI, business logic, and data
- **Context + Hooks** - React Context for global state with custom hooks
- **Mock-First Development** - Mock API with fallback for real endpoints
- **Type-Safe Forms** - Custom form hook with TypeScript integration

## 🎨 Design System

The project includes a comprehensive design system with:

### UI Components
- **Button** - Multiple variants (primary, secondary, outline, ghost, danger)
- **TextField** - Text input with validation and icons
- **Form** - Form wrapper with validation
- **Loader** - Loading indicators in multiple sizes
- **Placeholder** - Empty states and error messages

### Component Features
- **Accessibility** - ARIA labels, keyboard navigation
- **Responsive** - Mobile-first design
- **Theming** - CSS custom properties
- **Documentation** - Storybook stories for all components

## 📱 Pages & Routes

- **/** - Root redirect (to /auth or /welcome based on auth state)
- **/auth** - Authentication page (login/register/forgot password)
- **/welcome** - Protected welcome page with user info

### Route Protection
- **Protected Routes** - Redirect to /auth if not authenticated
- **Guest Routes** - Redirect to /welcome if already authenticated
- **Loading States** - Show loader during authentication checks

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- Yarn or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd app-auth-react

# Install dependencies
yarn install
# or
npm install
```

### Development

```bash
# Start development server
yarn dev
# or
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
# Build for production
yarn build
# or
npm run build

# Preview production build
yarn preview
# or
npm run preview
```

## 🧪 Testing

### Unit Tests

```bash
# Run tests
yarn test
# or
npm test

# Run tests with UI
yarn test:ui
# or
npm run test:ui

# Run tests once
yarn test:run
# or
npm run test:run

# Generate coverage report
yarn test:coverage
# or
npm run test:coverage
```

## 📚 Storybook

```bash
# Start Storybook
yarn storybook
# or
npm run storybook

# Build Storybook
yarn build-storybook
# or
npm run build-storybook
```

Storybook will be available at `http://localhost:6006`

## 🔧 Code Quality

### Linting

```bash
# Lint JavaScript/TypeScript
yarn lint
# or
npm run lint

# Lint CSS/SCSS
yarn lint:css
# or
npm run lint:css

# Fix CSS/SCSS issues
yarn lint:css:fix
# or
npm run lint:css:fix
```

## 🔒 Authentication Flow

The app uses a mock authentication system that simulates real API behavior:

1. **Registration** - Creates user account with validation
2. **Login** - Authenticates with email/password
3. **Token Storage** - Stores JWT in localStorage
4. **Auto-Login** - Checks for valid token on app start
5. **Protected Routes** - Redirects based on authentication state
6. **Logout** - Clears token and redirects to auth page

### Mock Users
The app includes pre-seeded mock users for development. Check `src/shared/api/storages/mock-user-storage.ts` for available accounts.

## 🌟 Key Features Explanation

### Form Management
- Custom `useForm` hook with TypeScript integration
- Real-time validation with Zod schemas
- Error handling and display
- Loading states during submission

### Responsive Design
- Mobile-first CSS approach
- Flexible grid system
- Touch-friendly interactive elements
- Smooth animations and transitions

### Component Library
- Fully documented in Storybook
- Accessibility compliant
- Consistent design tokens
- Reusable and composable

## 🚀 Deployment and CI/CD

### GitHub Pages
The application is automatically deployed to GitHub Pages on push to the main branch.

### Local Development
```bash
# Development
yarn dev

# Production build
yarn build

# Preview local build
yarn preview

# Preview with production settings
yarn preview:prod
```

## 📄 License

This project is for educational purposes only.

---

_This is a demonstration project showcasing modern React development practices with TypeScript, comprehensive testing, and a complete design system._
