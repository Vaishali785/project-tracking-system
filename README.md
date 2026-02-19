# Project Tracking System

A full-stack web application for managing and tracking projects with advanced filtering, URL persistence, and a clean, professional user interface.

> **Note:** In addition to the core requirements, I implemented a few small UX and architecture improvements to demonstrate how I approach maintainability and user experience, while intentionally keeping the scope limited.

---

## 📋 Table of Contents

- Features
- Tech Stack
- Setup & Installation
- Enhancements Beyond Requirements
- Architecture & Design Decisions
- API Documentation
- Trade-offs & Rationale
- Known Limitations
- Assignment Requirements vs Implementation
- AI Disclosure
- Out of Scope (Intentional)

---

## ✨ Features

### Core Requirements (Assignment)

✅ **Backend API (Node.js + Express + SQLite)**

- Create, Read, Update (status), Delete projects
- Input validation (required fields, date logic, status values)
- Status transition rules enforced
- Filtering, searching, and sorting
- Soft delete implementation

✅ **Frontend (React + Vite)**

- Dashboard with project table
- Create project modal with validation
- Project detail view with status updates
- Combined filters (status + search + sort)
- Loading, empty, and error states handled

---

### ⚡ Enhancements Beyond Requirements

#### 1. **Search Debouncing**

> **Problem:** Every keystroke triggered an API call
> **Solution:** 500ms delay before API call

- Reduces API calls by ~80%
- Prevents server overload
- Smoother user experience
- **Implementation:** `useRef` + `setTimeout` pattern

#### 2. **URL State Persistence**

**Problem:** Filters lost on page refresh
**Solution:** Sync filters to URL query parameters

- Shareable filtered views
- Browser back/forward support
- Bookmark-friendly URLs
- Survives page refresh
- **Example:** `/?status=active&search=website&sortBy=startDate`

#### 3. **Success Feedback (Toast Notifications)**

**Problem:** No confirmation that actions succeeded
**Solution:** Toast notifications for all actions

- ✓ Project created successfully
- ✓ Status updated
- ✓ Project deleted successfully
- Auto-dismiss after 3 seconds
- Non-intrusive positioning

#### 4. **Active Filter Indicators**

**Problem:** Users couldn't see active filters at a glance
**Solution:** Visual badge system

- Color-coded badges for each filter
- Click × to remove individual filter
- Proper formatting ("On Hold" not "on_hold")
- Clean, professional layout
- Persists on page refresh (reads from URL state)

#### 5. **Real-time Project Count**

**Problem:** No context about dataset size
**Solution:** Live count display

- Updates with filter changes
- Shows "X projects" / "1 project"
- Positioned for optimal UX
- Hidden during loading/error states

#### 6. **Duplicate Prevention**

**Problem:** Could create identical projects
**Solution:** Backend validation

- Prevents duplicate (name + client) combinations
- Case-insensitive comparison
- Clear error messaging
- Allows same name for different clients

#### 7. **Input Sanitization for Search Queries**

**Problem:** Special characters (`_`, `%`) affected LIKE-based searches  
**Solution:** Escaped SQL wildcards and validated input length

- Escape SQL wildcards in backend
- Trim whitespace in frontend
- Minimum 2-character search requirement
- Specific error messages for invalid input

#### 8. **Search Validation with User Feedback**

**Problem:** Empty/whitespace searches called API but showed nothing
**Solution:** Client-side validation with error display

- Red border on invalid input
- Specific error messages:
  - "Search cannot be empty or contain only spaces"
  - "Search must be at least 2 characters"
- Auto-dismiss after 10 seconds
- Clears on valid input

#### 9. **Custom Hooks for Separation of Concerns**

To keep components readable and focused, some repeated logic (filters, data fetching, and UI feedback) was extracted into small custom hooks. This was done without introducing additional libraries and while keeping the overall architecture simple.

#### 10. **Enhanced Modal UX**

**Features added:**

- Click outside to close (intuitive)
- ESC key to close (accessibility)
- Loading state for detail fetch
- Delete confirmation prompt

---

## 🛠 Tech Stack

### Frontend

- **React 18** - UI library with hooks
- **Vite** - Fast build tool (5x faster than CRA)
- **JavaScript (ES6+)** - Modern syntax
- **CSS-in-JS** - Inline styles for isolation
- **Fetch API** - HTTP requests
- **Custom Hooks** - Reusable logic extraction

### Backend

- **Node.js** - JavaScript runtime
- **Express 4** - Minimalist web framework
- **SQLite** (better-sqlite3) - Embedded database
- **CORS** - Cross-origin support
- **ES Modules** - Modern import/export

### Architecture Patterns

- **Layered Backend** - Routes → Controllers → Services → Database
- **React Hooks** - Local state and side-effect management
- **Centralized API Layer** - Single source for HTTP calls
- **Component Composition** - Reusable UI components

---

## 🚀 Setup & Installation

### Prerequisites

- Node.js v20+ ([Download](https://nodejs.org))
- npm (comes with Node.js)

### Backend Setup

```bash
cd project-tracking-backend
npm install
npm run seed    # Optional: Add 5 sample projects
npm start       # Runs on http://localhost:5001
```

### Frontend Setup

```bash
cd project-tracking-frontend
npm install
npm run dev     # Runs on http://localhost:3000
```

**Open:** [http://localhost:3000](http://localhost:3000)

---

## 🏗 Architecture & Design Decisions

### 📁 Project Structure

```
project-tracking-system/
├── backend/
│   ├── src/
│   │   ├── database/
│   │   │   ├── db.js
│   │   │   └── seed.js
│   │   ├── services/
│   │   │   └── projectService.js
│   │   ├── controllers/
│   │   │   └── projectController.js
│   │   ├── routes/
│   │   │   └── projectRoutes.js
│   │   ├── middleware/
│   │   │   └── cors.js
│   │   └── server.js
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── projects.js
│   │   ├── hooks/
│   │   │   ├── useFilters.js
│   │   │   ├── useProjects.js
│   │   │   ├── useToast.js
│   │   │   └── useProjectDetail.js
│   │   ├── components/
│   │   │   ├── Filters.jsx
│   │   │   ├── ProjectList.jsx
│   │   │   ├── ProjectForm.jsx
│   │   │   ├── ProjectDetail.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   └── Toast.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
│
└── README.md

```

---

### Backend Architecture (Layered Pattern)

```
Request Flow:

HTTP Request
    ↓
Routes (URL mapping)
    ↓
Controllers (Request handling)
    ↓
Services (Business logic & validation)
    ↓
Database (SQL queries)
    ↓
Response
```

**Why this pattern?**

- ✅ Separation of concerns
- ✅ Easy to test each layer
- ✅ Can swap database without touching controllers
- ✅ Business rules centralized in services
- ✅ Routes stay thin and readable

**Example: Create Project Flow**

1. **Route:** `POST /projects` → calls `projectController.createProject`
2. **Controller:** Extracts `req.body`, calls service
3. **Service:** Validates data, checks duplicates, calls database
4. **Database:** Executes SQL INSERT, returns new project
5. **Response:** Controller sends 201 with project JSON

---

### API Design Decisions

#### Centralized API Layer

```javascript
// src/api/projects.js
export async function fetchProjects(filters) { ... }
export async function createProject(data) { ... }
```

**Why not custom hooks for API calls?**

- State already managed in parent hook (`useProjects`)
- API layer just returns promises
- Easier to test and mock
- No unnecessary re-renders
- **Trade-off:** Less "React-y" but more practical for this scale

---

## 📡 API Documentation

### Base URL

```
http://localhost:5001
```

### Endpoints

#### **POST** `/projects` - Create Project

```json
// Request
{
  "name": "Website Redesign",
  "clientName": "Tech Corp",
  "status": "active",        // Optional (defaults to 'active')
  "startDate": "2024-01-15",
  "endDate": "2024-03-30"    // Optional
}

// Response (201 Created)
{
  "id": 1,
  "name": "Website Redesign",
  "clientName": "Tech Corp",
  "status": "active",
  "startDate": "2024-01-15",
  "endDate": "2024-03-30",
  "isDeleted": 0,
  "createdAt": "2024-02-18 10:30:00",
  "updatedAt": "2024-02-18 10:30:00"
}

// Error (400 Bad Request)
{
  "error": "Name is required, End date must be after start date"
}
```

#### **GET** `/projects` - List Projects

```
GET /projects?status=active&search=website&sortBy=createdAt
```

**Query Parameters:**

- `status` - Filter by: `active`, `on_hold`, `completed`
- `search` - Search in name or clientName (min 2 chars)
- `sortBy` - Sort by: `createdAt` (default), `startDate`

#### **GET** `/projects/:id` - Get Single Project

```
GET /projects/1

// Response (200 OK)
{ ...project object... }

// Error (404 Not Found)
{ "error": "Project not found" }
```

#### **PATCH** `/projects/:id/status` - Update Status

```json
// Request
{
  "status": "completed"
}

// Status Transition Rules:
// ✓ active → on_hold, completed
// ✓ on_hold → active, completed
// ✗ completed → NO TRANSITIONS

// Error (400 Bad Request)
{
  "error": "Cannot transition from 'completed' to 'active'"
}
```

#### **DELETE** `/projects/:id` - Delete Project (Soft)

```
DELETE /projects/1

// Response (200 OK)
{
  "success": true,
  "message": "Project deleted successfully"
}
```

---

## ⚖️ Trade-offs & Rationale

### 1. SQLite vs PostgreSQL

**Choice:** SQLite  
**Why:**

- ✅ Zero configuration
- ✅ File-based (easy backup)
- ✅ Perfect for learning and assignments
- ✅ Sufficient for <1000 projects

**Trade-off:**

- ❌ Not suitable for high-concurrency production
- ❌ No network access (must run on same machine)

---

### 2. Inline Styles vs CSS Files

**Choice:** Inline styles  
**Why:**

- ✅ Component isolation
- ✅ No class name conflicts
- ✅ Easy to see styles next to elements
- ✅ No CSS specificity issues

**Trade-off:**

- ❌ Harder to share common styles
- ❌ Slightly verbose for repeated patterns
- ❌ No pseudo-selectors (`:hover` in JS)

---

### 3. No State Management Library (Redux/Zustand)

**Choice:** Props + Custom Hooks  
**Why:**

- ✅ Simple enough for prop drilling
- ✅ Less boilerplate
- ✅ Easier to learn and understand
- ✅ No external dependencies

**Trade-off:**

- ❌ Props passed through multiple levels
- ❌ No time-travel debugging
- ❌ Manual optimization needed for re-renders

---

### 4. Synchronous SQLite Library (better-sqlite3)

**Choice:** better-sqlite3 (synchronous)  
**Why:**

- ✅ Simpler code (no promises everywhere)
- ✅ Easier to learn for beginners
- ✅ More predictable for small apps

**Trade-off:**

- ❌ Blocks event loop during queries
- ❌ Not suitable for slow queries

---

### 5. Debounce Delay = 500ms

**Choice:** 500ms delay for search  
**Why:**

- ✅ Fast enough to feel responsive
- ✅ Slow enough to batch keystrokes
- ✅ Industry standard for typeahead

**Trade-off:**

- ❌ Could feel slow for very fast typers
- ❌ Slight delay before results appear

---

### 6. URL State Persistence

**Choice:** Query parameters for filters  
**Why:**

- ✅ Shareable URLs
- ✅ Browser back/forward support
- ✅ Bookmark-friendly
- ✅ Standard web pattern

**Trade-off:**

- ❌ Slightly more complex state management
- ❌ URLs can get long with many filters

---

## 🎯 Enhancements Summary

If continuing this project:

1. Add pagination for large project lists
2. Add project editing (not just status)
3. Add date range filters
4. Add project search by date
5. Add loading skeleton instead of text
6. Add animations for modals
7. Add keyboard shortcuts
8. Add bulk actions (delete multiple)
9. Export projects to CSV
10. Add dark mode

## Assignment Requirements vs Implementation

| Requirement    | Status      | Enhancement                                           |
| -------------- | ----------- | ----------------------------------------------------- |
| Backend API    | ✅ Complete | + Duplicate prevention, input sanitization            |
| Frontend UI    | ✅ Complete | + Toast notifications, modal UX improvements          |
| Filters        | ✅ Complete | + Debouncing, URL persistence, active indicators      |
| Validation     | ✅ Complete | + Client + server validation, specific error messages |
| State handling | ✅ Complete | + Custom hooks, clean architecture                    |
| -              | -           | + Project count display                               |
| -              | -           | + Search with auto-dismiss errors                     |
| -              | -           | + Browser navigation support                          |

---

## 📝 AI Usage Disclosure

**AI Tools Used:** Claude AI

### Areas Where AI Was Used

- **Backend:** Initial scaffolding, reference for basic CRUD patterns, and validation logic examples
- **Frontend:** Component structure suggestions, basic hook patterns, and repetitive UI logic
- **Debugging:** Small refactor suggestions during development

### Backend & SQL Context

I am primarily a frontend-focused developer. For the backend and SQL portions of this assignment, AI tools were used as a reference while implementing logic that I understand and can explain. The backend was intentionally kept simple, focusing on correctness and clarity rather than advanced optimization.

All database queries and backend logic were scoped strictly to the assignment requirements.

### Modifications & Rejections

- Simplified AI-suggested logic to avoid over-engineering
- Rewrote parts of backend validation for clarity and correctness
- Rejected unnecessary abstractions and additional libraries suggested by AI
- Adjusted error handling, UX behavior, and API responses manually

### Understanding Level

**Fully Understand:**

- Frontend state management using React hooks
- API request/response flow between frontend and backend
- Backend routing and controller logic
- Validation rules and business constraints
- Overall system architecture and data flow

**Partially Understand (at a working level):**

- SQLite query behavior and limitations beyond basic CRUD
- Backend persistence considerations outside the scope of this assignment

### Review & Ownership

All AI-assisted code was reviewed line by line, modified where necessary, and simplified to align with the assignment constraints. I am comfortable explaining the design decisions, data flow, and core logic of the implementation during the review.

---

## Out of Scope (Intentional)

- Authentication and authorization
- Pagination (kept dataset small as per assignment scope)
- Editing full project details beyond status
- Deployment and CI/CD setup
- Full mobile responsive design (desktop-optimized UI)

---
