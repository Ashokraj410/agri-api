# Agri Clinic Management System

## Project Overview
A multi-location agricultural clinic management system with role-based access control for admin and location-specific sales persons.

## Recent Changes
- **2025-11-05**: Complete Agri Clinic system implemented
  - Backend API with JWT authentication and role-based access
  - Frontend with React, Redux, and all 5 pages per location
  - Environment-based configuration for security
  - Error handling for unauthorized access

## User Preferences
- Frontend: HTML, CSS, JavaScript, React, Redux
- Backend: Python (Flask)
- Database: In-memory storage for MVP (PostgreSQL planned for future)

## Project Architecture
### Backend (Python Flask)
- Authentication with JWT tokens
- Role-based access control (Admin vs Sales Person)
- RESTful API endpoints
- Location: `/backend`

### Frontend (React + Redux + Vite)
- React SPA with Redux state management
- React Router for navigation
- Axios for API calls
- Location: `/frontend`

### User Roles
1. **Admin**
   - Username: Dev410978
   - Password: raj978410
   - Access: All three clinic locations

2. **Sales Persons** (3 total, one per location)
   - Username: Dev410978 (same for all)
   - Passwords: jayankondam, devamangalam, ariyalur
   - Access: Only their specific clinic location

### Clinic Locations
1. Devamangalam
2. Jayankondam
3. Ariyalur

### Features per Location (5 Pages)
1. **Billing Page**: Invoice generation with farmer details
2. **Stock Details**: Product in/out transactions
3. **Farmer Details**: Billing history with name, phone, village
4. **Pending Payments**: Track dues with payment date recording
5. **Daily Expenses**: Opening amount, total sales, company payments, other expenses

## Environment Variables
- **SESSION_SECRET**: Required for JWT token signing (already configured in Replit)
- **VITE_API_URL**: Optional, defaults to http://localhost:5001/api for development

## Running the Application
1. Backend runs on port 5001 (http://localhost:5001)
2. Frontend runs on port 5000 (http://localhost:5000)
3. Both workflows start automatically

## Security Notes
- JWT tokens are used for authentication
- Role-based access prevents sales persons from accessing other locations
- Admin has access to all three clinic locations
- For production: Move user credentials to database with password hashing

## Future Enhancements
- PostgreSQL database for persistent storage
- Password hashing and secure credential management
- Data export (Excel/PDF) for reports
- Search and filtering capabilities
- Analytics and charts for sales trends
