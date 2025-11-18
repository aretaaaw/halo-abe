import { MongoClient, ObjectId } from 'mongodb';

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
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get session from cookie
    const cookies = req.headers.cookie || '';
    const sessionMatch = cookies.match(/sessionId=([^;]+)/);
    
    if (!sessionMatch || !sessionMatch[1]) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const userId = sessionMatch[1];

    // Validate ObjectId
    if (!ObjectId.isValid(userId)) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    const db = (await connectDB()).db('halo_abe');
    const users = db.collection('users');

    const user = await users.findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      id: user._id.toString(),
      username: user.username,
      createdAt: user.createdAt
    });

  } catch (error) {
    console.error('Me endpoint error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
}
