const express = require('express');
const router = express.Router();

// POST /api/chat — Dining assistant chatbot powered by Claude
router.post('/', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    if (!ANTHROPIC_API_KEY) {
      // Fallback: rule-based responses if no API key
      return res.json({ reply: getFallbackResponse(message) });
    }

    const systemPrompt = `You are DineBot, a friendly and knowledgeable dining assistant for the Dining Guide website. 
You help users discover restaurants, suggest dishes, recommend cuisines based on preferences, 
provide dining etiquette tips, explain menu items, and answer questions about food and restaurants.
Keep responses concise (2-3 sentences max unless detail is needed), friendly, and helpful.
If asked about specific restaurants on the platform, suggest users browse our restaurant listings.`;

    const messages = [
      ...history.slice(-10).map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: systemPrompt,
        messages
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'AI service error');
    }

    const data = await response.json();
    const reply = data.content[0]?.text || 'I\'m having trouble responding right now. Please try again!';
    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.json({ reply: getFallbackResponse(req.body.message || '') });
  }
});

function getFallbackResponse(message) {
  const msg = message.toLowerCase();
  if (msg.includes('recommend') || msg.includes('suggest')) return "I'd recommend exploring our featured restaurants section! You can filter by cuisine, price range, and ratings to find the perfect spot for you. 🍽️";
  if (msg.includes('italian') || msg.includes('pizza') || msg.includes('pasta')) return "Italian food lovers are in luck! We have wonderful Italian restaurants with homemade pasta and wood-fired pizzas. Check our 'Casual' category for cozy trattorias! 🍕";
  if (msg.includes('sushi') || msg.includes('japanese')) return "We have authentic Japanese restaurants with fresh sushi and traditional dishes. Look for ones with 4+ star ratings for the best experience! 🍣";
  if (msg.includes('vegan') || msg.includes('vegetarian')) return "Great choice! Filter by the 'Vegan' category to find plant-based restaurants in your area. Many also offer gluten-free options! 🥗";
  if (msg.includes('fine dining') || msg.includes('romantic')) return "For a romantic evening, check out our 'Fine Dining' category. Restaurants with $$$ or $$$$ price ranges often offer the most elegant experiences. Remember to make reservations! 🥂";
  if (msg.includes('cheap') || msg.includes('budget') || msg.includes('affordable')) return "Budget-friendly options are marked with '$' in our price filter! Fast food and casual dining categories have great affordable choices without sacrificing quality. 💰";
  if (msg.includes('delivery')) return "Many of our listed restaurants offer delivery! Use the filter options on the restaurant page to show only restaurants with delivery available. 🚗";
  if (msg.includes('reservation')) return "For restaurants that accept reservations, look for the 'Reservations' badge on restaurant cards. Fine dining establishments typically require advance booking, especially on weekends! 📅";
  return "Hello! I'm DineBot, your dining assistant. I can help you find restaurants, suggest cuisines, or answer any food-related questions. What are you in the mood for today? 🍴";
}

module.exports = router;
