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

    // Check if user exists
    const existing = await users.findOne({ username: username.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create user
    const result = await users.insertOne({
      username,
      username_lower: username.toLowerCase(),
      password: hash,
      createdAt: new Date()
    });

    // Create session token (JWT would be better in production)
    const userId = result.insertedId.toString();

    res.setHeader('Set-Cookie', `sessionId=${userId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=1209600`);
    
    return res.status(201).json({
      message: 'registered',
      user: { id: userId, username }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
}
