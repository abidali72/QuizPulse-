const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/mcqs', require('./routes/mcqs'));
app.use('/api/quizzes', require('./routes/quizzes'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
    console.log(`🌐 Frontend should be at ${process.env.FRONTEND_URL}`);
    console.log('\n📝 Available endpoints:');
    console.log('  POST /api/auth/register - Register new user');
    console.log('  POST /api/auth/login - Login user');
    console.log('  GET  /api/auth/me - Get current user');
    console.log('  GET  /api/users/profile - Get user profile');
    console.log('  PUT  /api/users/profile - Update profile');
    console.log('  POST /api/users/upload-image - Upload profile image');
    console.log('  GET  /api/mcqs - Get all MCQs');
    console.log('  POST /api/mcqs - Create MCQ (admin)');
    console.log('  PUT  /api/mcqs/:id - Update MCQ (admin)');
    console.log('  DELETE /api/mcqs/:id - Delete MCQ (admin)');
    console.log('  POST /api/quizzes/submit - Submit quiz');
    console.log('  GET  /api/quizzes/history - Get quiz history');
    console.log('\n⚠️  Make sure MySQL is running and database is created!');
    console.log('   Run: mysql -u root -p < backend/schema.sql\n');
});
