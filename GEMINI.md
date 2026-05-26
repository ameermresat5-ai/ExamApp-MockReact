# ExamApp Mock React - Project Instructions

This document provides a comprehensive overview of the **ExamApp Mock React** project, including its architecture, development conventions, and key commands.

## Project Overview

**ExamApp Mock React** is a client-side React application designed for managing exams. It simulates a full-stack environment by using mock data and service classes to mimic database and API behavior without a real backend server.

### Main Technologies
- **React 18**: Used for building the user interface with functional components and hooks.
- **Vite**: The build tool and development server.
- **Vanilla CSS**: Used for styling.
- **ESLint**: For code quality and consistency.
- **Local Storage**: Used via `MockDbService` to persist data across sessions.

### Architecture
The project follows a modular, service-oriented architecture:
- **Services Layer (OOP)**: Logic for data management, authentication, and business rules is encapsulated in classes (e.g., `AuthService`, `ExamService`). These are exported as singletons.
- **UI Layer (Functional Components)**: React components are responsible for rendering the UI and handling user interactions, communicating with the services layer for data.
- **State-Based Routing**: Navigation is handled via state in `App.jsx` (no external routing library like `react-router-dom` is used).

---

## Building and Running

### Key Commands
- **Install Dependencies**: `npm install`
- **Development Server**: `npm run dev` (starts the app at `http://localhost:5173`)
- **Build for Production**: `npm run build`
- **Linting**: `npm run lint`
- **Preview Production Build**: `npm run preview`

---

## Development Conventions

### Service Pattern
- Services should be implemented as classes and exported as singletons.
- They should handle all "business logic" and data persistence.
- Example: `src/services/AuthService.js`

### Component Structure
- Use functional components with hooks.
- Keep components focused on UI; delegate complex logic to services.
- Components are organized by role (`teacher`, `student`, `auth`, `common`).

### Routing
- Navigation is managed by the `currentPage` state in `App.jsx`.
- When adding a new page, update the `renderPage` logic in `App.jsx` and the `NavigationMenu.jsx`.

### Mock Data & Persistence
- Initial data is stored in `src/data/mockData.js`.
- Persistence is handled by `MockDbService` which synchronizes with `localStorage` via `StorageService`.

### Git Workflow
- **Branching**: Use a `dev` branch for integration. Create `feature/*` branches for specific modules.
- **Commits**: Make modular, feature-based commits.

---

## Project Structure Highlights

- `src/components/`: Reusable UI components organized by domain.
- `src/services/`: Core logic and mock database interaction.
- `src/data/`: Static mock data for initialization.
- `src/pages/`: Top-level page components.
- `App.jsx`: The central hub for state, routing, and user session management.
- `PROJECT_EXPLANATION.txt`: Detailed functional requirements and project background.
- `DIAGRAMS.txt`: UML-like diagrams for services and component hierarchy.

---

## Key Entities

### User
- `id`, `name`, `email`, `password`, `role` ("teacher" or "student")

### Exam
- `id`, `title`, `description`, `status` ("draft", "published", "closed"), `teacherId`, `questions`

### Question
- `id`, `text`, `options` (array of strings), `correctAnswer` (index or text)

### Submission
- `id`, `examId`, `examTitle`, `studentId`, `answers`, `grade`, `totalQuestions`, `submittedAt`
