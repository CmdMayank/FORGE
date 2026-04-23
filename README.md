# FORGE — Rank-Based Freelance Marketplace

> *"Forge your legacy in code."*

FORGE is a full-stack freelance marketplace where a developer's **rank** determines the projects they can access. Instead of competing on bids alone, developers climb a structured tier system — from **Apprentice** to **Principal** — by completing projects, earning reviews, and accumulating Rank Points. Clients post projects with a minimum rank requirement, ensuring they always hire at the right level of expertise.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Features](#features)
5. [Rank System](#rank-system)
6. [API Reference](#api-reference)
7. [Data Models](#data-models)
8. [Getting Started](#getting-started)
9. [Environment Variables](#environment-variables)
10. [Pages & Routes](#pages--routes)
11. [Key UI Components](#key-ui-components)

---

## Overview

FORGE solves a core problem in freelancing: clients can't easily gauge developer quality, and skilled developers get lost in a sea of low-cost bids. FORGE enforces a **rank-gated system**:

- Developers start at **Apprentice** and earn Rank Points by completing projects.
- Each project has a **required minimum rank** — developers below that rank simply cannot apply.
- Clients get quality-filtered proposals. Developers get fair, merit-based access to better work.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 8 | Build tool & dev server |
| React Router v7 | Client-side routing |
| Axios | HTTP client |
| Framer Motion | Declarative animations |
| GSAP | Advanced scroll & timeline animations |
| Lucide React | Icon library |
| React Hot Toast | Notifications |
| CSS Modules | Scoped component styling |
| clsx | Conditional class names |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| bcryptjs | Password hashing |
| JSON Web Tokens (JWT) | Authentication |
| express-validator | Request validation |
| Multer | File uploads (avatars) |
| Morgan | HTTP request logging |
| dotenv | Environment config |
| nodemon | Dev auto-restart |

---

## Project Structure

```
forge/
├── client/                     # React frontend (Vite)
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   └── src/
│       ├── assets/             # Static images
│       ├── components/
│       │   ├── auth/           # ProtectedRoute
│       │   ├── dashboard/      # RankTracker, StatsCard
│       │   ├── layout/         # Navbar, Footer
│       │   ├── profile/        # ReviewCard
│       │   ├── projects/       # ProjectCard, FilterPanel, ProposalForm, ProposalItem
│       │   └── ui/             # Reusable UI primitives
│       ├── context/            # AuthContext (global auth state)
│       ├── hooks/              # useAuth, useDebounce
│       ├── pages/              # Full page components
│       ├── services/           # Axios API service layer
│       ├── styles/             # Global CSS
│       └── utils/              # formatters, rankUtils
│
└── Server/                     # Express backend
    ├── server.js               # Entry point
    └── src/
        ├── app.js              # Express app setup, middleware, routes
        ├── config/
        │   └── db.js           # MongoDB connection
        ├── middleware/
        │   ├── auth.js         # JWT protect, requireRole, generateToken
        │   └── errorHandler.js # Global error handler
        ├── models/
        │   ├── User.js
        │   ├── Project.js
        │   └── Review.js
        ├── routes/
        │   ├── auth.js
        │   ├── projects.js
        │   ├── users.js
        │   └── reviews.js
        └── utils/
            └── rankCalculator.js  # Rank scoring logic
```

---

## Features

### For Developers
- Register with a `developer` role and start at **Apprentice** rank
- Browse and filter open projects by category, rank, budget, and complexity
- Submit proposals (cover letter, bid amount, estimated days) — only if your rank qualifies
- Track rank progress, score, completed projects, and success rate on the Dashboard
- View a personal profile with stats and received reviews
- Compete on the global Leaderboard ranked by score

### For Clients
- Register with a `client` role
- Post projects with title, description, budget range, required rank, category, complexity, and skills
- Review incoming proposals and accept or reject them
- Mark projects as complete, which automatically triggers a review and updates the developer's rank score
- Edit or delete open projects

### General
- JWT-based authentication with 30-day token expiry
- Role-based access control (`developer` / `client`) enforced on both frontend and backend
- Animated landing page with GSAP scroll triggers and Framer Motion transitions
- Fully responsive layout with CSS Modules scoped styling
- Toast notifications for all user actions
- 404 Not Found page

---

## Rank System

The rank system is the core mechanic of FORGE. Every developer has a `rankScore` that determines their tier.

### Rank Tiers

| Rank | Min Score | Color |
|---|---|---|
| Apprentice | 0 | Gray |
| Junior | 50 | Green |
| Mid | 200 | Blue |
| Senior | 500 | Purple |
| Lead | 1,200 | Amber |
| Architect | 2,500 | Red |
| Principal | 5,000 | Gold |

### Scoring Formula

When a client marks a project complete, the developer earns points:

```
Score = Base (50) + Complexity Bonus + Rating Bonus
```

| Complexity | Bonus |
|---|---|
| Low | +0 |
| Medium | +25 |
| High | +75 |
| Expert | +150 |

| Rating | Bonus |
|---|---|
| 5 stars | +30 |
| 4 stars | +15 |
| 1–3 stars | +0 |

### Rank Gating

A developer can only apply to a project if their rank index is **≥** the project's required rank index. This is enforced server-side via the `canApply()` utility.

---

## API Reference

Base URL: `http://localhost:5000/api`

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a new user |
| POST | `/login` | Public | Login and receive JWT |
| GET | `/me` | Bearer Token | Get current user |

### Users — `/api/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/leaderboard` | Public | Top 10 developers by rank score |
| GET | `/:id` | Public | Get user profile + rank progress |
| PUT | `/:id` | Bearer Token (own) | Update profile (bio, skills, avatar, etc.) |

### Projects — `/api/projects`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/` | Public | — | List projects with filters & pagination |
| GET | `/:id` | Public | — | Get single project (increments views) |
| POST | `/` | Bearer Token | client | Create a new project |
| PUT | `/:id` | Bearer Token | client | Edit an open project |
| DELETE | `/:id` | Bearer Token | client | Delete an open project |
| POST | `/:id/proposals` | Bearer Token | developer | Submit a proposal (rank-gated) |
| PUT | `/:id/proposals/:pid` | Bearer Token | client | Accept or reject a proposal |
| PUT | `/:id/complete` | Bearer Token | client | Mark project complete + trigger rank update |

**Query params for `GET /api/projects`:**
`status`, `category`, `requiredRank`, `minBudget`, `maxBudget`, `complexity`, `search`, `sort`, `page`, `limit`

### Reviews — `/api/reviews`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | Bearer Token | Submit a review for a completed project |
| GET | `/user/:id` | Public | Get all reviews for a user + average rating |

---

## Data Models

### User
```
name, email, password (hashed), role (developer|client),
rank, rankScore, bio, skills[], githubUrl, portfolioUrl,
completedProjects, successRate, totalEarnings, avatar, createdAt
```

### Project
```
title, description, client (ref), assignedDeveloper (ref),
requiredRank, skills[], budget { min, max }, timeline (days),
status (open|in_progress|completed|cancelled),
proposals[], category, complexity, views, completedAt, createdAt
```

### Proposal (embedded in Project)
```
developer (ref), coverLetter, bidAmount, estimatedDays,
status (pending|accepted|rejected), submittedAt
```

### Review
```
project (ref), reviewer (ref), reviewee (ref),
rating (1–5), comment, type (client_to_dev|dev_to_client), createdAt
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone the repo
```bash
git clone <repo-url>
cd forge
```

### 2. Setup the Server
```bash
cd Server
npm install
```

Create a `.env` file (see [Environment Variables](#environment-variables)), then:
```bash
npm run dev
```
Server runs on `http://localhost:5000`

### 3. Setup the Client
```bash
cd client
npm install
npm run dev
```
Client runs on `http://localhost:5173`

---

## Environment Variables

### Server (`Server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/forge_db
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=30d
NODE_ENV=development
```

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Pages & Routes

| Path | Page | Access |
|---|---|---|
| `/` | Home | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/projects` | Projects listing | Public |
| `/projects/:id` | Project detail | Public |
| `/profile/:id` | User profile | Public |
| `/leaderboard` | Leaderboard | Public |
| `/dashboard` | Developer/Client dashboard | Protected |
| `/post-project` | Post a new project | Protected (client only) |

---

## Key UI Components

| Component | Description |
|---|---|
| `RankBadge` | Displays a colored rank label |
| `ProgressRing` | SVG ring showing rank progress % |
| `RankTracker` | Dashboard widget with score, next rank, and progress |
| `StatsCard` | Metric card for dashboard stats |
| `ProjectCard` | Project listing card with rank badge, budget, skills |
| `FilterPanel` | Sidebar filters for the projects page |
| `ProposalForm` | Modal form for submitting a proposal |
| `ProposalItem` | Single proposal row with accept/reject actions |
| `ReviewCard` | Displays a review with star rating |
| `StarRating` | Interactive or display-only star rating |
| `StatusChip` | Colored chip for project status |
| `SkillTag` | Pill tag for skills |
| `TagInput` | Input for adding/removing skill tags |
| `Button` | Styled button with variants (primary, secondary, ghost) |
| `Input` | Styled form input |
| `Modal` | Accessible overlay modal |
| `Loader` | Loading spinner |
