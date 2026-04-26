const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const upload = require('../middleware/upload');

// Register
router.post('/register', upload.single('profileImage'), async (req, res) => {
    try {
        const { fullName, email, password, gender, phoneNumber } = req.body;

        // Check if user exists
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Get profile image path
        const profileImage = req.file ? `/uploads/profiles/${req.file.filename}` : null;

        // Insert user
        const [result] = await db.query(
            'INSERT INTO users (full_name, email, password, gender, phone_number, profile_image) VALUES (?, ?, ?, ?, ?, ?)',
            [fullName, email, hashedPassword, gender, phoneNumber, profileImage]
        );

        // Generate token
        const token = jwt.sign(
            { userId: result.insertId, role: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: result.insertId,
                fullName,
                email,
                gender,
                phoneNumber,
                profileImage,
                role: 'user'
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Find user
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // Check role
        if (role && user.role !== role) {
            return res.status(401).json({ message: 'Invalid credentials for this role' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                fullName: user.full_name,
                email: user.email,
                gender: user.gender,
                phoneNumber: user.phone_number,
                profileImage: user.profile_image,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Get current user
router.get('/me', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [users] = await db.query('SELECT id, full_name, email, gender, phone_number, profile_image, role FROM users WHERE id = ?', [decoded.userId]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];
        res.json({
            id: user.id,
            fullName: user.full_name,
            email: user.email,
            gender: user.gender,
            phoneNumber: user.phone_number,
            profileImage: user.profile_image,
            role: user.role
        });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

module.exports = router;
