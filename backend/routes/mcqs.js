const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { auth, adminAuth } = require('../middleware/auth');

// Get all MCQs
router.get('/', async (req, res) => {
    try {
        const [mcqs] = await db.query('SELECT * FROM mcqs ORDER BY id');

        const formattedMCQs = mcqs.map(mcq => ({
            id: mcq.id,
            question: mcq.question,
            options: [mcq.option_a, mcq.option_b, mcq.option_c, mcq.option_d],
            correctAnswer: mcq.correct_answer,
            category: mcq.category
        }));

        res.json(formattedMCQs);
    } catch (error) {
        console.error('Get MCQs error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create MCQ (admin only)
router.post('/', adminAuth, async (req, res) => {
    try {
        const { question, options, correctAnswer, category } = req.body;

        const [result] = await db.query(
            'INSERT INTO mcqs (question, option_a, option_b, option_c, option_d, correct_answer, category, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [question, options[0], options[1], options[2], options[3], correctAnswer, category, req.userId]
        );

        res.status(201).json({
            message: 'MCQ created successfully',
            id: result.insertId
        });
    } catch (error) {
        console.error('Create MCQ error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update MCQ (admin only)
router.put('/:id', adminAuth, async (req, res) => {
    try {
        const { question, options, correctAnswer, category } = req.body;
        const { id } = req.params;

        await db.query(
            'UPDATE mcqs SET question = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_answer = ?, category = ? WHERE id = ?',
            [question, options[0], options[1], options[2], options[3], correctAnswer, category, id]
        );

        res.json({ message: 'MCQ updated successfully' });
    } catch (error) {
        console.error('Update MCQ error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete MCQ (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM mcqs WHERE id = ?', [id]);
        res.json({ message: 'MCQ deleted successfully' });
    } catch (error) {
        console.error('Delete MCQ error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
