# QuizPulse - Full-Stack MCQ Platform

## Complete Full-Stack Application

This is a fully animated Online MCQ Platform with user authentication, profile management, admin

 panel, and MySQL database integration.

## Features

### User Features
- ✅ User Registration (name, email, password, gender, phone, profile image)
- ✅ User Login with JWT authentication
- ✅ User Profile page (view/edit profile, upload image)
- ✅ Take MCQ quizzes
- ✅ View quiz history and results
- ✅ Retake quizzes anytime

### Admin Features
- ✅ Admin login
- ✅ Add new MCQs
- ✅ Edit existing MCQs
- ✅ Delete MCQs
- ✅ View all MCQs

### Technical Features
- ✅ MySQL database for data persistence
- ✅ JWT authentication
- ✅ File upload for profile images
- ✅ RESTful API
- ✅ Fully animated UI with Framer Motion
- ✅ Dark/Light mode
- ✅ Responsive design

## Setup Instructions

### Prerequisites
- Node.js installed
- MySQL installed and running

### Step 1: Setup MySQL Database

1. Start MySQL server
2. Run the database schema:

```bash
mysql -u root -p < backend/schema.sql
```

This creates:
- Database: `mcq_platform`
- Tables: `users`, `mcqs`, `quiz_attempts`
- Default admin user and sample MCQs

### Step 2: Configure Backend

1. Navigate to backend folder:
```bash
cd backend
```

2. Update `.env` file if needed (default is localhost):
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=mcq_platform
```

3. Install dependencies:
```bash
npm install
```

4. Start backend server:
```bash
npm run dev
```

Server runs on: **http://localhost:5000**

### Step 3: Run Frontend

1. In a new terminal, from project root:
```bash
npm run dev
```

Frontend runs on: **http://localhost:5173**

## Default Credentials

### Admin Account
- Email: `admin@mcq.com`
- Password: `admin123`

### Test User (after registration)
- Register your own account at `/register`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/upload-image` - Upload profile image

### MCQs
- `GET /api/mcqs` - Get all MCQs
- `POST /api/mcqs` - Create MCQ (admin)
- `PUT /api/mcqs/:id` - Update MCQ (admin)
- `DELETE /api/mcqs/:id` - Delete MCQ (admin)

### Quizzes
- `POST /api/quizzes/submit` - Submit quiz
- `GET /api/quizzes/history` - Get history

## Database Schema

### users table
```sql
- id (PRIMARY KEY)
- full_name
- email (UNIQUE)
- password (hashed)
- gender
- phone_number
- profile_image
- role (user/admin)
- created_at
```

### mcqs table
```sql
- id (PRIMARY KEY)
- question
- option_a, option_b, option_c, option_d
- correct_answer (0-3)
- category
- created_by (FOREIGN KEY -> users)
- created_at
```

### quiz_attempts table
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY -> users)
- score
- total_questions
- answers (JSON)
- completed_at
```

## File Structure

```
wonder/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── mcqs.js
│   │   └── quizzes.js
│   ├── uploads/
│   │   └── profiles/
│   ├── .env
│   ├── package.json
│   ├── schema.sql
│   └── server.js
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── ...
└── package.json
```

## Troubleshooting

### MySQL Connection Error
- Make sure MySQL is running
- Check credentials in `backend/.env`
- Verify database exists: `SHOW DATABASES;`

### Port Already in Use
- Backend port 5000: Change PORT in `.env`
- Frontend port 5173: Vite will auto-increment

### File Upload Issues
- Check `backend/uploads/profiles/` exists
- Verify write permissions

## Tech Stack

**Frontend:**
- React 19
- Vite
- Tailwind CSS v4
- Framer Motion
- React Router
- Axios

**Backend:**
- Node.js
- Express
- MySQL
- JWT
- Multer
- bcrypt

## All rights reserved by Muka

© 2025 MCQ Platform - All rights reserved by Muka
