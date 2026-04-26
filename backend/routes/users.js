const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, full_name, email, gender, phone_number, profile_image, created_at FROM users WHERE id = ?',
            [req.userId]
        );

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
            createdAt: user.created_at
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { fullName, gender, phoneNumber } = req.body;

        await db.query(
            'UPDATE users SET full_name = ?, gender = ?, phone_number = ? WHERE id = ?',
            [fullName, gender, phoneNumber, req.userId]
        );

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Upload profile image
router.post('/upload-image', auth, upload.single('profileImage'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const profileImage = `/uploads/profiles/${req.file.filename}`;

        await db.query('UPDATE users SET profile_image = ? WHERE id = ?', [profileImage, req.userId]);

        res.json({
            message: 'Profile image uploaded successfully',
            profileImage
        });
    } catch (error) {
        console.error('Upload image error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
