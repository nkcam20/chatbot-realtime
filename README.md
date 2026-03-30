# 📱 TeleChat — Real-time Messaging (Telegram Clone)

TeleChat is a high-fidelity, full-stack Telegram clone built with the MERN stack (MongoDB, Express, React, Node.js). It features real-time messaging, secure JWT authentication, and a modern, premium UI inspired by Telegram.

## ✨ Features

- 👤 **Secure Authentication**: JWT-based user signup and login.
- 💬 **Real-time Messaging**: Instant message delivery using Socket.IO.
- 📱 **Premium UI**: Crafted with React, Tailwind CSS, and Shadcn UI.
- ☁️ **Cloud Database**: Integrated with MongoDB Atlas for persistent storage.
- 🚀 **Deployment Ready**: Optimized for Vercel, Render, or Railway.

## 🏗️ Project Structure

- **`backend/`**: Node.js Express server with Socket.IO and Mongoose.
- **`src/`**: React frontend with Vite, Tailwind CSS, and Framer Motion.
- **`public/`**: Static assets and icons.
- **`dist/`**: Production-ready frontend build.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (for cloud database)

### 2. Environment Variables (.env)
Create a `.env` file in the root directory and add:
```text
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_secret
```

### 3. Install & Run Locally
```bash
# Install root and backend dependencies
npm install

# Run both frontend and backend concurrently
npm run dev:full
```

## 🌍 Deployment

### Vercel (Option A)
1. Import this repository to Vercel.
2. Add `MONGODB_URI` and `JWT_SECRET` in Environment Variables.
3. Vercel will automatically build the frontend and serve the backend from `backend/index.js`.

### Railway / Render
1. Connect your GitHub repository.
2. Ensure the start command is `node backend/index.js`.
3. Add your Environment Variables.

## 🛠️ Technology Stack
- **Frontend**: React, Vite, Tailwind CSS, Shadcn UI, Socket.io-client.
- **Backend**: Node.js, Express, Socket.io, Mongoose, JWT.
- **Database**: MongoDB Atlas.

---
Built by Antigravity AI Coding Assistant.
