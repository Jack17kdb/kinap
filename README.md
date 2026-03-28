# Digital Lost & Found Online System

A full-stack web platform that helps campus communities report, search, and recover lost property. Students can post lost or found items, chat with each other in real time, and let the system's matching engine surface potential connections between reports — all within a verified, closed institutional network.

---

## Features

### For Students
- **Report Lost Items** — Describe what you lost, pick a category and campus location, and optionally attach a photo
- **Report Found Items** — Post what you found so the rightful owner can reach you
- **Smart Match Detection** — The system scores similarity between lost and found reports using a weighted algorithm (title 60%, description 40%) combined with location matching, and shows you ranked potential matches
- **Real-Time Chat** — Message item owners or finders directly through a built-in live chat. Supports text and image sharing. Online status is visible in real time
- **Advanced Search & Filtering** — Search across titles, descriptions, and locations. Filter by category, campus location, status (Lost / Found / Recovered), and date
- **Mark as Recovered** — Once you get your item back, mark it recovered and leave a star rating and review
- **Profile Management** — Upload a profile photo, update your details, or delete your account

### For Administrators
- **Admin Dashboard** — Live stats: total items, lost vs found breakdown, recovery rate
- **Hotspot Map** — Bar chart of campus locations where items go missing most frequently
- **User Management** — View, search, and manage all registered users
- **Content Moderation** — Review and delete any item post across the platform
- **Category & Location Management** — Add new item categories and campus locations without touching code

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Recharts, Framer Motion |
| Backend | Node.js, Express.js v5 |
| Database | MongoDB, Mongoose ODM |
| Authentication | JWT (HTTP-only cookies), bcryptjs |
| Real-Time | Socket.IO |
| Rate Limiting | express-rate-limit, rate-limit-redis, Redis |
| Security | Helmet, CORS, input sanitisation |
| Cloud Storage | Cloudinary |
| Email | Nodemailer (SMTP) |
| Matching Engine | string-similarity |
| Hosting | Render.com |

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB instance (local or Atlas)
- Redis instance (local or cloud)
- Cloudinary account
- SMTP credentials (Gmail, Mailgun, etc.)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/lost-and-found.git
cd lost-and-found
```

2. **Install all dependencies**

```bash
npm run build
```

This installs both backend and frontend dependencies and builds the React app.

3. **Set up environment variables**

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password

REDIS_URL=your_redis_url
```

4. **Seed initial data (optional)**

```bash
cd backend
npm run seed
```

To undo:

```bash
npm run unseed
```

5. **Run in development**

Backend:
```bash
cd backend
npm run dev
```

Frontend (in a separate terminal):
```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production

```bash
npm start
```

This serves the built React frontend from the Express server.

---

## Access Control

To grant admin access, update the user's `role` field in the database to `"admin"`.

---

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth, admin checks, rate limiting, logging
│   │   ├── models/          # Mongoose schemas (User, Item, Message, Review, Category, Location)
│   │   ├── routes/          # Express routers
│   │   ├── lib/             # DB connection, Socket.IO, Cloudinary, email service
│   │   └── utils/           # Token generation, code generation
│   ├── seed.js              # Seed script
│   └── unseed.js            # Unseed script
│
└── frontend/
    └── src/
        ├── components/      # Navbar, Chat, ChatBar, Contacts, Modals, Skeletons
        ├── pages/           # All student-facing pages
        │   └── admin/       # Admin dashboard pages
        ├── store/           # Zustand state management
        └── lib/             # Axios instance
```

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| GET | `/api/auth/verify-email` | Verify email with token |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| POST | `/api/auth/forgot-password` | Send reset email |
| POST | `/api/auth/reset-password` | Reset password |
| GET | `/api/item/items` | Get all items (with filters) |
| POST | `/api/item/create` | Post a found item |
| POST | `/api/item/lost` | Report a lost item |
| GET | `/api/item/:id` | Get item by ID |
| GET | `/api/item/:id/matches` | Get potential matches for an item |
| PUT | `/api/item/:id/status` | Update item status |
| DELETE | `/api/item/:id` | Delete item |
| GET | `/api/chat/:id` | Get messages with a user |
| POST | `/api/chat/send/:id` | Send a message |
| GET | `/api/review` | Get all reviews |
| POST | `/api/review` | Submit a review |
| GET | `/api/admin/users` | Admin: list all users |
| GET | `/api/admin/stats/items` | Admin: item statistics |
| GET | `/api/admin/stats/locations` | Admin: location hotspot data |

All routes except auth require a valid JWT cookie. Admin routes additionally require `role: "admin"`.
