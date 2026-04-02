const express = require('express');
const Restaurant = require('../models/Restaurant');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET all restaurants with filters
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { search, category, cuisine, priceRange, rating, city, page = 1, limit = 12, sort = '-createdAt' } = req.query;
    const query = { isActive: true };

    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (cuisine) query.cuisine = new RegExp(cuisine, 'i');
    if (priceRange) query.priceRange = priceRange;
    if (rating) query.rating = { $gte: parseFloat(rating) };
    if (city) query['address.city'] = new RegExp(city, 'i');

    const total = await Restaurant.countDocuments(query);
    const restaurants = await Restaurant.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    res.json({ restaurants, total, pages: Math.ceil(total / limit), currentPage: parseInt(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET featured restaurants
router.get('/featured', async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isActive: true, rating: { $gte: 4 } })
      .sort('-rating').limit(6).lean();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single restaurant
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('createdBy', 'name');
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create restaurant (auth required)
router.post('/', auth, async (req, res) => {
  try {
    const restaurant = await Restaurant.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update restaurant
router.put('/:id', auth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body, { new: true, runValidators: true }
    );
    if (!restaurant) return res.status(404).json({ message: 'Not found or unauthorized' });
    res.json(restaurant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE restaurant
router.delete('/:id', auth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!restaurant) return res.status(404).json({ message: 'Not found or unauthorized' });
    res.json({ message: 'Restaurant deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Seed sample data (for development)
router.post('/seed/sample', async (req, res) => {
  try {
    const count = await Restaurant.countDocuments();
    if (count > 0) return res.json({ message: 'Data already seeded' });
    const sampleData = [
      {
        name: 'The Golden Fork', description: 'Award-winning fine dining with French-inspired cuisine in an elegant setting.', cuisine: 'French',
        category: 'Fine Dining', address: { street: '123 Main St', city: 'New York', state: 'NY', zip: '10001' },
        priceRange: '$$$$', rating: 4.8, reviewCount: 234, phone: '(212) 555-0101',
        features: { delivery: false, takeout: false, dineIn: true, reservations: true, outdoor: true, wifi: true, parking: true },
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', tags: ['romantic', 'award-winning', 'wine-bar']
      },
      {
        name: 'Sakura Sushi', description: 'Authentic Japanese sushi bar with the freshest fish flown in daily from Tokyo.', cuisine: 'Japanese',
        category: 'Fine Dining', address: { street: '456 Oak Ave', city: 'New York', state: 'NY', zip: '10002' },
        priceRange: '$$$', rating: 4.7, reviewCount: 189, phone: '(212) 555-0202',
        features: { delivery: true, takeout: true, dineIn: true, reservations: true, outdoor: false, wifi: true, parking: false },
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800', tags: ['sushi', 'fresh', 'authentic']
      },
      {
        name: 'Mama Rosa\'s', description: 'Family-style Italian trattoria serving homemade pasta and wood-fired pizzas since 1985.', cuisine: 'Italian',
        category: 'Casual', address: { street: '789 Elm St', city: 'Brooklyn', state: 'NY', zip: '11201' },
        priceRange: '$$', rating: 4.5, reviewCount: 312, phone: '(718) 555-0303',
        features: { delivery: true, takeout: true, dineIn: true, reservations: false, outdoor: true, wifi: false, parking: true },
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', tags: ['pizza', 'pasta', 'family-friendly']
      },
      {
        name: 'Spice Garden', description: 'Vibrant Indian restaurant specializing in regional specialties and classic tandoor dishes.', cuisine: 'Indian',
        category: 'Casual', address: { street: '321 Park Blvd', city: 'Queens', state: 'NY', zip: '11354' },
        priceRange: '$$', rating: 4.4, reviewCount: 156, phone: '(718) 555-0404',
        features: { delivery: true, takeout: true, dineIn: true, reservations: false, outdoor: false, wifi: true, parking: false },
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800', tags: ['spicy', 'vegetarian-friendly', 'tandoor']
      },
      {
        name: 'Green Leaf Cafe', description: 'Plant-based cafe offering creative vegan dishes, cold-pressed juices, and organic coffee.', cuisine: 'Vegan',
        category: 'Vegan', address: { street: '654 Green Way', city: 'Manhattan', state: 'NY', zip: '10003' },
        priceRange: '$$', rating: 4.6, reviewCount: 98, phone: '(212) 555-0505',
        features: { delivery: true, takeout: true, dineIn: true, reservations: false, outdoor: true, wifi: true, parking: false },
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800', tags: ['vegan', 'healthy', 'organic', 'gluten-free']
      },
      {
        name: 'The Burger Joint', description: 'Gourmet burgers made with locally sourced beef, topped with artisan ingredients.', cuisine: 'American',
        category: 'Casual', address: { street: '987 Broadway', city: 'Manhattan', state: 'NY', zip: '10004' },
        priceRange: '$', rating: 4.3, reviewCount: 445, phone: '(212) 555-0606',
        features: { delivery: true, takeout: true, dineIn: true, reservations: false, outdoor: false, wifi: true, parking: false },
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800', tags: ['burgers', 'casual', 'local']
      }
    ];
    await Restaurant.insertMany(sampleData);
    res.json({ message: `Seeded ${sampleData.length} restaurants` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
