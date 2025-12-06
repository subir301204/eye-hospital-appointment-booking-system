# Eye Hospital Appointment Booking System

## Project Structure
- **backend**: Node.js/Express server with MySQL connection.
- **frontend**: Vite + React application.

## How to Run

### 1. Database Setup
Ensure you have MySQL installed and running.
The database configuration is in `backend/config/db.js`.
Default settings:
- Host: localhost
- User: root
- Password: (empty)
- Database: eye_hospital

### 2. Start Backend
Open a terminal:
```bash
cd backend
npm start
```
Runs on: `http://localhost:3000`

### 3. Start Frontend
Open a **new** terminal:
```bash
cd frontend
npm run dev
```
Runs on: `http://localhost:5173`
