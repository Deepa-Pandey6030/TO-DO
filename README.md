# TaskFlow

TaskFlow is a full-stack task management app — organize your work, track priorities and categories, and see your progress at a glance. Built with the MERN stack (MongoDB, Express, React, Node) plus JWT authentication and Upstash-backed rate limiting.

> "Organize your work. Get things done."

## Features

- **Authentication** — register/login with email + password, passwords hashed with bcrypt, sessions handled via JWT (7-day expiry).
- **Task management** — create, read, update, and delete tasks, each scoped to the logged-in user.
  - Status: `TODO`, `IN_PROGRESS`, `COMPLETED`
  - Priority: `LOW`, `MEDIUM`, `HIGH`
  - Category: `Personal`, `Work`, `Study`, `Placement`, `Other`
  - Optional due dates
  - Quick status-only updates (e.g. checking a task off) without a full edit
- **Search, filter & sort** — filter tasks by status/priority/category, search by title or description, sort by newest, oldest, or due date.
- **Dashboard & analytics** — aggregated stats (totals, completion rate, breakdown by status/priority/category) powered by a MongoDB aggregation pipeline.
- **Important view** — a dedicated page for high-priority tasks.
- **Profile page** — view the logged-in user's account details.
- **Light/dark theme** — toggle persisted via a theme context.
- **Responsive app shell** — collapsible sidebar navigation with a mobile hamburger menu.
- **Rate limiting** — all API requests are throttled (100 requests / 60s) using Upstash Redis to protect the backend from abuse.

## Tech Stack

**Frontend**
- React 19 + Vite 7
- React Router v6
- Tailwind CSS + DaisyUI
- Axios (with an auth-token request interceptor)
- Lucide React (icons)
- React Hot Toast (notifications)

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- JSON Web Tokens (`jsonwebtoken`) for auth
- bcryptjs for password hashing
- Upstash Redis + `@upstash/ratelimit` for API rate limiting
- CORS, dotenv, cookie-parser

## Project Structure

```
TO-DO/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js            # MongoDB connection
│   │   │   └── upstash.js       # Redis rate-limiter client
│   │   ├── controllers/
│   │   │   ├── authControllers.js
│   │   │   └── tasksController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js  # JWT verification
│   │   │   └── rateLimiter.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Task.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── tasksRoutes.js
│   │   ├── utils/
│   │   │   └── generateToken.js
│   │   └── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/         # TaskCard, TaskForm, TaskFilters, StatsCard, ThemeToggle, ProtectedRoute
│   │   ├── context/             # AuthContext, ThemeContext
│   │   ├── layouts/
│   │   │   └── AppLayout.jsx    # Sidebar shell for all protected pages
│   │   ├── lib/                 # axios instance, shared utils/constants
│   │   ├── pages/                # Landing, Login, Register, Dashboard, Tasks, TaskDetail, CreateTask, Important, Analytics, Profile
│   │   ├── services/             # authService, taskService (API calls)
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── package.json                 # Root build/start scripts for deployment
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- An [Upstash](https://upstash.com/) Redis database (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/Deepa-Pandey6030/TO-DO.git
cd TO-DO
```

### 2. Configure environment variables

Create a `.env` file inside `backend/`:

```env
PORT=5001
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

### 3. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Run in development

```bash
# Terminal 1 — backend (http://localhost:5001)
cd backend
npm run dev

# Terminal 2 — frontend (http://localhost:5173)
cd frontend
npm run dev
```

The frontend proxies API calls to `http://localhost:5001/api` in development.

### 5. Build for production

From the project root:

```bash
npm run build   # installs deps and builds the frontend
npm start       # starts the backend, which also serves the built frontend
```

When `NODE_ENV=production`, the Express server serves the compiled `frontend/dist` and handles client-side routing via a catch-all route — so the whole app can be deployed as a single Node service (e.g. on Render or Railway).

## API Overview

All `/api/tasks` routes require a `Bearer <token>` header (obtained from login/register) and are automatically scoped to the authenticated user.

### Auth — `/api/auth`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Create a new account |
| POST | `/login` | Log in and receive a JWT |
| GET | `/me` | Get the current authenticated user *(protected)* |

### Tasks — `/api/tasks`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List tasks (supports `status`, `priority`, `category`, `search`, `sort` query params) |
| GET | `/stats` | Aggregated task statistics (totals, completion rate, breakdowns) |
| GET | `/:id` | Get a single task |
| POST | `/` | Create a task |
| PUT | `/:id` | Update a task |
| PATCH | `/:id/status` | Update only a task's status |
| DELETE | `/:id` | Delete a task |

## License

ISC
