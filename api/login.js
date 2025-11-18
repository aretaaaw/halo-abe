import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const mongoUri = process.env.MONGODB_URI;
let client;

async function connectDB() {
  if (!mongoUri) {
    throw new Error('MONGODB_URI not set');
  }
  if (client && client.topology && client.topology.isConnected()) {
    return client;
  }
  client = new MongoClient(mongoUri);
  await client.connect();
  return client;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const db = (await connectDB()).db('halo_abe');
    const users = db.collection('users');

    // Find user
    const user = await users.findOne({ username_lower: username.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create session token
    const userId = user._id.toString();
    
    res.setHeader('Set-Cookie', `sessionId=${userId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=1209600`);
    
    return res.status(200).json({
      message: 'logged in',
      user: { id: userId, username: user.username }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
}
