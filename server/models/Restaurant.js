const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  cuisine: { type: String, required: true },
  category: {
    type: String,
    enum: ['Fine Dining', 'Casual', 'Fast Food', 'Cafe', 'Street Food', 'Buffet', 'Vegan', 'Seafood'],
    required: true
  },
  address: {
    street: String,
    city: { type: String, required: true },
    state: String,
    zip: String
  },
  phone: String,
  website: String,
  hours: {
    monday: String, tuesday: String, wednesday: String,
    thursday: String, friday: String, saturday: String, sunday: String
  },
  priceRange: { type: String, enum: ['$', '$$', '$$$', '$$$$'], required: true },
  image: { type: String, default: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800' },
  images: [String],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  tags: [String],
  features: {
    delivery: { type: Boolean, default: false },
    takeout: { type: Boolean, default: false },
    dineIn: { type: Boolean, default: true },
    reservations: { type: Boolean, default: false },
    outdoor: { type: Boolean, default: false },
    wifi: { type: Boolean, default: false },
    parking: { type: Boolean, default: false }
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

restaurantSchema.index({ location: '2dsphere' });
restaurantSchema.index({ name: 'text', description: 'text', cuisine: 'text', tags: 'text' });

module.exports = mongoose.model('Restaurant', restaurantSchema);
