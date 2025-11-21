# MERN Job Portal AI (Combined)

This archive contains two folders:
- `server/` - Express/MongoDB backend
- `client/` - Vite + React frontend

## Setup (Server)
1. cd server
2. cp .env.example .env   # fill MONGO_URI, JWT_SECRET, OPENAI_API_KEY(optional)
3. npm install
4. npm run seed   # optional, adds sample data
5. npm run dev

## Setup (Client)
1. cd client
2. npm install
3. npm run dev

Client proxies `/api` to the server (see vite.config.js).
