# Full-Stack Note-Taking Application

A modern, responsive, full-stack note-taking application built with **React**, **Node.js**, **Express**, and **MongoDB**. Users can sign up using **email + OTP**, create and delete notes, and manage their account securely with **JWT authentication**.  

- backend deploy url : https://note-app-backend-aa2h.onrender.com
- frontend deploy url : https://note-app-frontend-a64y.onrender.com

## Features
- User registration and login via **Email + OTP**  
- Login via **Google OAuth 2.0**  
- JWT-based authentication for secure API access  
- Create, view, and delete personal notes  
- Responsive, mobile-friendly design matching the provided assets  
- Proper form validation with descriptive error messages for invalid inputs or OTP failures  

## Technology Stack

**Frontend:**  
- React.js  
- Axios (for API calls)  
- React Router  
- CSS / Tailwind (or custom styles from the provided assets)  

**Backend:**  
- Node.js & Express  
- MongoDB & Mongoose  
- JWT for authentication  

## Project Structure
- frontend
- backend

- clone the repository
  
## frontend setup
- cd frontend
- npm  i
- make a .env file in root
- VITE_API_BASE_URL=http://localhost:5000

## backend setup
- cd backend
- npm i
# .env in root and add these below configurations
## MongoDB Connection
- MONGODB_URL="........................."

## JWT Configuration  
- JWT_SECRET=notes-app-super-secret-jwt-key-2024
- JWT_EXPIRES_IN=7d

## Server Configuration
- PORT=5000
- NODE_ENV=development

## Email Configuration (for OTP)
- EMAIL_HOST=smtp.gmail.com
- EMAIL_PORT=587
- EMAIL_USER=your-mail
- EMAIL_PASS=..........

## Frontend URL
- CLIENT_URL=http://localhost:5173


