const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const Review = require('./models/Review');
const MONGO_URI = process.env.MONGODB_URI;

const restaurants = [
  { name: 'The Golden Fork', description: 'Award-winning fine dining with French-inspired cuisine.', cuisine: 'French', category: 'Fine Dining', address: { street: '123 Fifth Ave', city: 'New York', state: 'NY', zip: '10001' }, priceRange: '$$$$', rating: 4.8, reviewCount: 234, phone: '(212) 555-0101', features: { delivery: false, takeout: false, dineIn: true, reservations: true, outdoor: true, wifi: true, parking: true }, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', tags: ['romantic', 'award-winning'] },
  { name: 'Sakura Sushi', description: 'Authentic Japanese sushi bar with the freshest fish.', cuisine: 'Japanese', category: 'Fine Dining', address: { street: '456 Oak Ave', city: 'Manhattan', state: 'NY', zip: '10002' }, priceRange: '$$$', rating: 4.7, reviewCount: 189, phone: '(212) 555-0202', features: { delivery: true, takeout: true, dineIn: true, reservations: true, outdoor: false, wifi: true, parking: false }, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800', tags: ['sushi', 'authentic'] },
  { name: "Mama Rosa's Trattoria", description: 'Family-style Italian trattoria with homemade pasta.', cuisine: 'Italian', category: 'Casual', address: { street: '789 Elm St', city: 'Brooklyn', state: 'NY', zip: '11201' }, priceRange: '$$', rating: 4.5, reviewCount: 312, phone: '(718) 555-0303', features: { delivery: true, takeout: true, dineIn: true, reservations: false, outdoor: true, wifi: false, parking: true }, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', tags: ['pizza', 'pasta'] },
  { name: 'Spice Garden', description: 'Vibrant Indian restaurant with tandoor specialties.', cuisine: 'Indian', category: 'Casual', address: { street: '321 Park Blvd', city: 'Queens', state: 'NY', zip: '11354' }, priceRange: '$$', rating: 4.4, reviewCount: 156, phone: '(718) 555-0404', features: { delivery: true, takeout: true, dineIn: true, reservations: false, outdoor: false, wifi: true, parking: false }, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800', tags: ['spicy', 'curry'] },
  { name: 'Green Leaf Cafe', description: 'Plant-based cafe with creative vegan dishes.', cuisine: 'Vegan', category: 'Vegan', address: { street: '654 Green Way', city: 'Manhattan', state: 'NY', zip: '10003' }, priceRange: '$$', rating: 4.6, reviewCount: 98, phone: '(212) 555-0505', features: { delivery: true, takeout: true, dineIn: true, reservations: false, outdoor: true, wifi: true, parking: false }, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800', tags: ['vegan', 'healthy'] },
  { name: 'The Burger Joint', description: 'Gourmet burgers with locally sourced grass-fed beef.', cuisine: 'American', category: 'Casual', address: { street: '987 Broadway', city: 'Manhattan', state: 'NY', zip: '10004' }, priceRange: '$', rating: 4.3, reviewCount: 445, phone: '(212) 555-0606', features: { delivery: true, takeout: true, dineIn: true, reservations: false, outdoor: false, wifi: true, parking: false }, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800', tags: ['burgers', 'casual'] },
  { name: "Ocean's Catch", description: 'Dock-to-table seafood with the freshest catches daily.', cuisine: 'Seafood', category: 'Seafood', address: { street: '55 Harbour Dr', city: 'Staten Island', state: 'NY', zip: '10301' }, priceRange: '$$$', rating: 4.5, reviewCount: 201, phone: '(718) 555-0707', features: { delivery: false, takeout: true, dineIn: true, reservations: true, outdoor: true, wifi: false, parking: true }, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800', tags: ['seafood', 'lobster'] },
  { name: 'Morning Brew Cafe', description: 'Cozy cafe with specialty coffees and artisanal pastries.', cuisine: 'Cafe', category: 'Cafe', address: { street: '12 Maple Lane', city: 'Brooklyn', state: 'NY', zip: '11215' }, priceRange: '$', rating: 4.4, reviewCount: 287, phone: '(718) 555-0808', features: { delivery: false, takeout: true, dineIn: true, reservations: false, outdoor: true, wifi: true, parking: false }, image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800', tags: ['coffee', 'brunch'] },
  { name: 'Dragon Palace', description: 'Authentic Cantonese dim sum and Chinese cuisine.', cuisine: 'Chinese', category: 'Casual', address: { street: '88 Canal St', city: 'Manhattan', state: 'NY', zip: '10013' }, priceRange: '$$', rating: 4.3, reviewCount: 378, phone: '(212) 555-0909', features: { delivery: true, takeout: true, dineIn: true, reservations: true, outdoor: false, wifi: false, parking: false }, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800', tags: ['dim-sum', 'cantonese'] },
  { name: 'El Rancho Mexican Grill', description: 'Authentic Mexican street food with handmade tortillas.', cuisine: 'Mexican', category: 'Casual', address: { street: '234 Sunset Blvd', city: 'Bronx', state: 'NY', zip: '10451' }, priceRange: '$', rating: 4.6, reviewCount: 532, phone: '(718) 555-1010', features: { delivery: true, takeout: true, dineIn: true, reservations: false, outdoor: true, wifi: false, parking: true }, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800', tags: ['tacos', 'authentic'] },
  { name: 'The Grand Buffet', description: 'All-you-can-eat with live cooking stations and 200 dishes.', cuisine: 'International', category: 'Buffet', address: { street: '500 Convention Center Dr', city: 'Manhattan', state: 'NY', zip: '10019' }, priceRange: '$$$', rating: 4.1, reviewCount: 623, phone: '(212) 555-1111', features: { delivery: false, takeout: false, dineIn: true, reservations: true, outdoor: false, wifi: true, parking: true }, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', tags: ['buffet', 'international'] },
  { name: 'Thai Orchid', description: 'Authentic Thai curries and pad thai by Bangkok-born chef.', cuisine: 'Thai', category: 'Casual', address: { street: '77 Orchid St', city: 'Queens', state: 'NY', zip: '11101' }, priceRange: '$$', rating: 4.7, reviewCount: 142, phone: '(718) 555-1212', features: { delivery: true, takeout: true, dineIn: true, reservations: false, outdoor: false, wifi: true, parking: false }, image: 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800', tags: ['thai', 'curry'] },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB');

    await Restaurant.deleteMany({});
    await Review.deleteMany({});
    console.log('🗑️  Cleared existing data');

    let testUser = await User.findOne({ email: 'demo@dineguide.com' });
    if (!testUser) {
      testUser = await User.create({
        name: 'Demo User',
        email: 'demo@dineguide.com',
        password: 'Demo1234'
      });
      console.log('👤 Created demo user');
    }

    const created = await Restaurant.insertMany(
      restaurants.map(r => ({
  ...r,
  createdBy: testUser._id,
  location: {
    type: "Point",
    coordinates: [77.5946, 12.9716] // [longitude, latitude]
  }
}))
    );
    console.log(`🍽️  Inserted ${created.length} restaurants`);

    const sampleReviews = [
      { title: 'Absolutely incredible!', content: 'Best dining experience I have had in years. The chef personally came to greet us and the wine pairing was outstanding.', rating: 5, user: testUser._id, restaurant: created[0]._id },
      { title: 'Freshest sushi in NYC', content: 'The omakase experience is worth every penny. Each piece was a revelation. Truly world-class.', rating: 5, user: testUser._id, restaurant: created[1]._id },
      { title: "Like eating at Nonna's house", content: "The pasta is made fresh every morning. You can taste the love in every bite. The tiramisu is the best outside of Italy.", rating: 5, user: testUser._id, restaurant: created[2]._id },
    ];

    for (const review of sampleReviews) {
      await Review.create(review);
    }
    console.log(`⭐  Added ${sampleReviews.length} reviews`);

    console.log('\n✨ Database seeded successfully!');
    console.log('📧 Demo login: demo@dineguide.com');
    console.log('🔑 Demo password: Demo1234');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();