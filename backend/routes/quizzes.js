const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { auth } = require('../middleware/auth');

// Submit quiz attempt
router.post('/submit', auth, async (req, res) => {
    try {
        const { score, totalQuestions, answers } = req.body;

        const [result] = await db.query(
            'INSERT INTO quiz_attempts (user_id, score, total_questions, answers) VALUES (?, ?, ?, ?)',
            [req.userId, score, totalQuestions, JSON.stringify(answers)]
        );

        res.status(201).json({
            message: 'Quiz submitted successfully',
            attemptId: result.insertId,
            score,
            totalQuestions
        });
    } catch (error) {
        console.error('Submit quiz error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user quiz history
router.get('/history', auth, async (req, res) => {
    try {
        const [attempts] = await db.query(
            'SELECT id, score, total_questions, completed_at FROM quiz_attempts WHERE user_id = ? ORDER BY completed_at DESC',
            [req.userId]
        );

        const formattedAttempts = attempts.map(attempt => ({
            id: attempt.id,
            score: attempt.score,
            totalQuestions: attempt.total_questions,
            percentage: ((attempt.score / attempt.total_questions) * 100).toFixed(1),
            completedAt: attempt.completed_at
        }));

        res.json(formattedAttempts);
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get quiz attempt details
router.get('/attempt/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        const [attempts] = await db.query(
            'SELECT * FROM quiz_attempts WHERE id = ? AND user_id = ?',
            [id, req.userId]
        );

        if (attempts.length === 0) {
            return res.status(404).json({ message: 'Quiz attempt not found' });
        }

        const attempt = attempts[0];
        res.json({
            id: attempt.id,
            score: attempt.score,
            totalQuestions: attempt.total_questions,
            answers: JSON.parse(attempt.answers),
            completedAt: attempt.completed_at
        });
    } catch (error) {
        console.error('Get attempt error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
