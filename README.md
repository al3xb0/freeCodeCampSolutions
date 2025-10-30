# freeCodeCamp Information Security Projects

A full stack JavaScript project bundle implementing multiple microservices as solutions for freeCodeCamp certification tasks. Each service includes backend (Node.js/Express/MongoDB) and modern frontend (React/Vite) integration.

## Available Services

1. **Issue Tracker** — Track and manage project issues with create, update, and status features.
2. **Unit Converter** — Convert values between units of length, weight, and volume.
3. **Personal Library** — Create books, comment on books, view and manage library collection.
4. **Stock Price Checker** — Fetch live stock prices, like stocks by IP, compare relative likes.
5. **Anonymous Message Board** — Create threads, post replies, delete/report posts with password protection, similar to classic imageboards.

## Running the Project

- Install dependencies in each microservice and in `/frontend`:
  - `cd services/issue-tracker && npm install`
  - `cd services/unit-converter && npm install`
  - `cd services/personal-library && npm install`
  - `cd services/stock-price-checker && npm install`
  - `cd services/anonymous-message-board && npm install`
  - `cd frontend && npm install`
- Ensure MongoDB is running and `.env` files for each service contain valid DB connection strings.
- Start all backend microservices at once with:
  - `cd services && npm run start:all`
- Launch the frontend:
  - `cd frontend && npm run dev`
- Access all services through the Home UI at `http://localhost:5173` (or your Vite port).

## Technologies Used

- Node.js, Express, MongoDB (Mongoose)
- React (Vite), axios
- Mocha + Supertest (backend testing)
- Security/auth: bcryptjs, helmet, CORS

## API Endpoints
Each microservice exposes a REST API (full endpoints in source code). Features include password-protected thread/reply deletion, proxying, likes per-IP, etc.

## Proxy Configuration (Dev)
Frontend `/vite.config.js` proxies all `/api/*` routes to their respective backend service ports.

## License
Unlicensed (free for personal/student use; see LICENSE if present).
