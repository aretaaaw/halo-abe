// Shared user storage for session management
// In production, use a real database!

export const users = new Map();

// Add some test users for demo
if (process.env.NODE_ENV !== 'production') {
  const bcrypt = require('bcryptjs');
  // Don't pre-populate in production
}

export default function handler(req, res) {
  res.status(405).json({ error: 'Method not allowed' });
}
