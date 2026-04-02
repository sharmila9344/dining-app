const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true, trim: true, maxlength: 100 },
  content: { type: String, required: true, minlength: 10, maxlength: 1000 },
  foodRating: { type: Number, min: 1, max: 5 },
  serviceRating: { type: Number, min: 1, max: 5 },
  ambianceRating: { type: Number, min: 1, max: 5 },
  valueRating: { type: Number, min: 1, max: 5 },
  images: [String],
  helpful: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

// Update restaurant rating after review save
reviewSchema.post('save', async function() {
  const Restaurant = mongoose.model('Restaurant');
  const Review = this.constructor;
  const stats = await Review.aggregate([
    { $match: { restaurant: this.restaurant } },
    { $group: { _id: '$restaurant', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  if (stats.length > 0) {
    await Restaurant.findByIdAndUpdate(this.restaurant, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count
    });
  }
});

module.exports = mongoose.model('Review', reviewSchema);
