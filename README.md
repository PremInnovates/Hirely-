# Hirely — Freelancer Hiring Platform

Hirely is a MERN freelancer marketplace with separate business-owner and freelancer experiences. The refreshed React frontend uses a premium, responsive SaaS design and connects to the existing Express REST API.

## Stack
- Frontend: React 18, Vite, React Router, Axios, Tailwind CSS, React Icons, react-hot-toast
- Backend: Node.js, Express, MongoDB, Mongoose, JWT
- API base URL: `http://localhost:5000/api` by default 

## Run locally (Windows CMD)

### 1. Backend
```cmd
cd server
npm install
copy .env.example .env
```
Set `MONGO_URI` and a strong `JWT_SECRET` in `server\.env`, then run:
```cmd
npm run dev
```
Check `http://localhost:5000/api/health`.

### 2. Frontend (second CMD window)
```cmd
cd client
npm install
copy .env.example .env
npm run dev
```
Open `http://localhost:5173`.

If `client\.env` already exists, do not overwrite it. The frontend uses `VITE_API_URL` if set, otherwise `http://localhost:5000/api`.

## Frontend screens
- Marketing landing page
- Login and registration with role selection
- Live dashboard using `/api/dashboard`
- Freelancer directory and freelancer profile details
- Project search, project detail, and project creation for business owners
- Hiring requests, freelancer accept/decline, owner cancellation, and contract creation
- Contract list and milestone progress management
- Messages, notifications, saved talent, and profile editing

## Notes
- The UI uses the real API response data; it does not seed fake dashboard counts.
- Backend authorization remains the source of truth for permissions.
- The backend does not currently expose a freelancer-initiated application endpoint; the implemented flow is business owner sends a hiring request and freelancer accepts or declines.
- No real payment processing is included.
