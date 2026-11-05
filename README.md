# Customer History & Follow-up Management System

Full-stack MERN application for small-business customer records, interactions, follow-ups, bookings, and communication consent.

## Prerequisites
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection

## Setup
```powershell
cd crm
npm run install:all
Copy-Item backend\.env.example backend\.env
```
Update `MONGODB_URI` in `backend/.env`, then run:
```powershell
npm run dev
```
Open `http://localhost:5173`.

## API
- `GET,POST /api/customers`
- `GET,PUT,DELETE /api/customers/:id`
- `GET,POST /api/interactions`
- `GET,PUT,DELETE /api/interactions/:id`
- `GET,POST /api/followups`
- `GET /api/followups/overdue`
- `PATCH /api/followups/:id/status`
- `GET,POST /api/bookings`
- `PUT,DELETE /api/bookings/:id`
- `PATCH /api/bookings/:id/cancel`
- `GET /api/dashboard`

Errors return `{ "success": false, "message": "..." }`. Booking overlap uses `newStart < existingEnd && newEnd > existingStart`; cancelled bookings do not conflict.

## MongoDB sample data
Two example customers are included in `backend/sampleData.json`. Create them using MongoDB Compass or Postman as separate `POST /api/customers` requests.
