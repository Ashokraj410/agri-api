# Agri Clinic Management System

## Project Overview
A multi-location agricultural clinic management system with role-based access control for admin and location-specific sales persons.

## Recent Changes
- **2025-11-05**: Initial project setup with Python Flask backend and React + Redux frontend

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
