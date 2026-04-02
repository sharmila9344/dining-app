const express = require('express');
const Review = require('../models/Review');
const { auth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// GET reviews for a restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const reviews = await Review.find({ restaurant: req.params.restaurantId })
      .populate('user', 'name avatar')
      .sort(sort).skip((page - 1) * limit).limit(parseInt(limit));
    const total = await Review.countDocuments({ restaurant: req.params.restaurantId });
    res.json({ reviews, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create review
router.post('/', auth, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('title').trim().notEmpty().withMessage('Title required'),
  body('content').trim().isLength({ min: 10 }).withMessage('Review must be at least 10 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const existing = await Review.findOne({ restaurant: req.body.restaurant, user: req.user._id });
    if (existing) return res.status(400).json({ message: 'You have already reviewed this restaurant' });

    const review = await Review.create({ ...req.body, user: req.user._id });
    await review.populate('user', 'name avatar');
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE review
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!review) return res.status(404).json({ message: 'Review not found or unauthorized' });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST mark helpful
router.post('/:id/helpful', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    const idx = review.helpful.indexOf(req.user._id);
    if (idx === -1) review.helpful.push(req.user._id);
    else review.helpful.splice(idx, 1);
    await review.save();
    res.json({ helpfulCount: review.helpful.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
