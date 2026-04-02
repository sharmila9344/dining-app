# 🍽️ DineGuide — MERN Stack Dining Guide

A full-featured restaurant discovery platform built with MongoDB, Express, React, and Node.js — with an integrated AI-powered chatbot (DineBot).

## 📋 Project Overview

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Axios, CSS |
| Backend | Node.js, Express.js, express-validator |
| Database | MongoDB + Mongoose ODM |
| Auth | JWT + bcryptjs |
| Chatbot | Anthropic Claude API (fallback: rule-based) |
| Deployment | Vercel (frontend) + Render (backend) + MongoDB Atlas |

## 🏗️ Project Structure

```
dining-guide/
├── client/src/
│   ├── components/
│   │   ├── Navbar.js          # Responsive nav with auth state
│   │   ├── Footer.js          # Site footer
│   │   ├── ChatBot.js         # AI-powered DineBot widget
│   │   └── RestaurantCard.js  # Restaurant card component
│   ├── context/
│   │   └── AuthContext.js     # Global auth (Context API + JWT)
│   ├── pages/
│   │   ├── Home.js            # Landing page
│   │   ├── Restaurants.js     # Browse/filter/search
│   │   ├── RestaurantDetail.js  # Detail + reviews
│   │   ├── Login.js           # Login with validation
│   │   ├── Register.js        # Register with password strength
│   │   ├── Profile.js         # User profile + favorites
│   │   └── AddRestaurant.js   # 4-step wizard form
│   └── App.js
│
└── server/
    ├── models/
    │   ├── User.js            # User schema (bcrypt)
    │   ├── Restaurant.js      # Restaurant schema (geo + text)
    │   └── Review.js          # Review schema (auto-rating)
    ├── routes/
    │   ├── auth.js            # Auth endpoints
    │   ├── restaurants.js     # CRUD + search
    │   ├── reviews.js         # Review CRUD
    │   └── chat.js            # Claude chatbot endpoint
    ├── middleware/auth.js      # JWT middleware
    └── index.js               # Express entry
```

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm run install-all
```

### 2. Configure server/.env
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dining-guide
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:3000
ANTHROPIC_API_KEY=your_key_here
```

### 3. Configure client/.env
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Run both servers
```bash
npm run dev
```

Visit http://localhost:3000 — sample data seeds automatically on first visit.

## ☁️ Free Deployment

### MongoDB Atlas (Database)
1. Create free M0 cluster at mongodb.com/atlas
2. Get connection URI: `mongodb+srv://user:pass@cluster.mongodb.net/dining-guide`

### Render (Backend — Free)
1. New Web Service → connect GitHub repo
2. Root Directory: `server` | Start: `npm start`
3. Add env vars: MONGODB_URI, JWT_SECRET, CLIENT_URL, ANTHROPIC_API_KEY, NODE_ENV=production

### Vercel (Frontend — Free)
1. New Project → import GitHub repo
2. Root Directory: `client` | Framework: Create React App
3. Add env: `REACT_APP_API_URL=https://your-render-app.onrender.com/api`

## 🌐 API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | — | Register user |
| POST | /api/auth/login | — | Login + JWT |
| GET | /api/auth/me | ✓ | Current user |
| POST | /api/auth/favorites/:id | ✓ | Toggle favorite |
| GET | /api/restaurants | — | List with filters |
| GET | /api/restaurants/featured | — | Top rated |
| GET | /api/restaurants/:id | — | Single restaurant |
| POST | /api/restaurants | ✓ | Create restaurant |
| PUT | /api/restaurants/:id | ✓ | Update |
| DELETE | /api/restaurants/:id | ✓ | Delete |
| GET | /api/reviews/restaurant/:id | — | Restaurant reviews |
| POST | /api/reviews | ✓ | Submit review |
| DELETE | /api/reviews/:id | ✓ | Delete review |
| POST | /api/chat | — | DineBot chatbot |

## 🤖 DineBot
- With API key: Uses claude-sonnet-4-20250514 for intelligent responses
- Without key: Falls back to rule-based engine (Italian, sushi, vegan, budget, etc.)
- Maintains chat history (last 10 messages)
- Quick-reply chips on first open
- Get key at: console.anthropic.com

## 📦 Tech Stack
MongoDB + Express + React + Node.js (MERN)
JWT auth · bcryptjs · Mongoose · Axios · React Router v6 · Anthropic Claude
