const path = require('path');
const dotenvResult = require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const express = require("express");
const cors = require("cors");
const session = require('express-session');
const bcrypt = require('bcryptjs');

// ===== Simplified User Store (in-memory for now) =====
const users = new Map();

// ===== Task Storage (in-memory for now - per user) =====
// Structure: Map<userId, Array<taskObjects>>
const tasks = new Map();

const app = express();

// Trust proxy for session cookies
app.set('trust proxy', 1);

app.use(cors({
  origin: "http://localhost:8080",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type"],
  maxAge: 86400
}));
app.use(express.json());

// ===== Session Setup (in-memory store for dev) =====
const sessionSecret = process.env.SESSION_SECRET || 'dev_secret_key_change_in_production';
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true, // CHANGED: true to ensure session created immediately
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 14, // 14 days
    httpOnly: true,
    secure: false, // localhost tidak perlu https
    sameSite: 'lax',
    path: '/',
    domain: undefined // let browser auto-detect
  }
}));

// ===== Request Logger =====
app.use((req, res, next) => {
  const sid = req.session && req.session.userId ? String(req.session.userId).slice(0,6) : '-';
  console.log(new Date().toISOString(), req.method, req.path, 'sessionId=', sid, 'cookie=' + (req.headers.cookie ? 'YES' : 'NO'));
  next();
});

// ===== Serve Static Assets BEFORE Auth =====
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use('/login', express.static(path.resolve(__dirname, '..', 'login')));

// Don't cache pages - always check auth
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// Protect pages under /pages — require authentication to view
const pagesDir = path.resolve(__dirname, '..', 'pages');
app.use('/pages', (req, res, next) => {
  // keep registration page public so a new user can sign up
  if (req.path === '/register.html') return next();
  // require auth for all other pages
  if (!req.session || !req.session.userId) {
    return res.redirect('/login/login.html');
  }
  next();
}, express.static(pagesDir));

// ===== API: Register =====
app.post('/api/register', async (req, res) => {
  try {
    console.log('Register attempt:', req.body);
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'username and password required' });
    }
    
    if (users.has(username.toLowerCase())) {
      return res.status(409).json({ error: 'username already taken' });
    }
    
    const hash = await bcrypt.hash(password, 10);
    const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    
    users.set(username.toLowerCase(), { 
      userId, 
      username, 
      password: hash, 
      createdAt: new Date() 
    });
    
    req.session.userId = userId;
    console.log('✓ User registered:', username, 'ID:', userId);
    
    req.session.save((err) => {
      if (err) {
        console.error('Session save error on register:', err);
        return res.status(500).json({ error: 'session error' });
      }
      res.json({ 
        message: 'registered', 
        user: { id: userId, username } 
      });
    });
  } catch (err) {
    console.error('❌ Register error:', err.message, err.stack);
    res.status(500).json({ error: err.message || 'internal error' });
  }
});

// ===== API: Login =====
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    
    const user = users.get(username.toLowerCase());
    if (!user) return res.status(401).json({ error: 'invalid credentials' });
    
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });
    
    req.session.userId = user.userId;
    console.log('✓ User logged in:', username, 'ID:', user.userId);
    
    req.session.save((err) => {
      if (err) {
        console.error('Session save error on login:', err);
        return res.status(500).json({ error: 'session error' });
      }
      res.json({ message: 'logged in', user: { id: user.userId, username: user.username } });
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'internal error' });
  }
});

// ===== API: Logout =====
app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) console.error('session destroy error', err);
    res.clearCookie('connect.sid');
    res.json({ message: 'logged out' });
  });
});

// ===== API: Get Current User =====
app.get('/api/me', (req, res) => {
  console.log('[/api/me] Session check - userId:', req.session?.userId || 'NONE');
  
  if (!req.session || !req.session.userId) {
    console.log('[/api/me] Not authenticated - no userId in session');
    return res.status(401).json({ error: 'not authenticated' });
  }
  
  for (const user of users.values()) {
    if (user.userId === req.session.userId) {
      console.log('[/api/me] User found:', user.username);
      return res.json({ id: user.userId, username: user.username, createdAt: user.createdAt });
    }
  }
  
  console.log('[/api/me] User not found in database');
  res.status(404).json({ error: 'user not found' });
});

// ===== Middleware: Require Authentication =====
function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'not authenticated' });
  }
  next();
}

// ===== API: Submit Tugas (Create) =====
app.post('/api/tugas', requireAuth, (req, res) => {
  try {
    const userId = req.session.userId;
    const { name, mapel, deadline, rating } = req.body;
    
    if (!name || !mapel || !deadline) {
      return res.status(400).json({ error: 'name, mapel, deadline required' });
    }
    
    // Initialize user's task array if not exists
    if (!tasks.has(userId)) {
      tasks.set(userId, []);
    }
    
    // Create task object
    const task = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      name,
      mapel,
      deadline,
      rating: Number(rating) || 0,
      status: 'pending', // pending atau completed
      createdAt: new Date(),
      completedAt: null
    };
    
    // Store task for user
    tasks.get(userId).push(task);
    
    console.log('✓ Task created:', name, 'for user:', userId);
    res.status(201).json({ message: 'task created', task });
  } catch (err) {
    console.error('❌ Create task error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ===== API: Get Tugas History (Read) =====
app.get('/api/tugas', requireAuth, (req, res) => {
  try {
    const userId = req.session.userId;
    const userTasks = tasks.get(userId) || [];
    
    // Separate pending and completed tasks
    const pending = userTasks.filter(t => t.status === 'pending');
    const completed = userTasks.filter(t => t.status === 'completed');
    
    // Sort by deadline
    pending.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    
    console.log('[GET /api/tugas] User:', userId, 'Pending:', pending.length, 'Completed:', completed.length);
    
    res.json({
      pending,
      completed,
      total: userTasks.length
    });
  } catch (err) {
    console.error('❌ Get tasks error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ===== API: Mark Tugas as Completed (Update) =====
app.put('/api/tugas/:taskId', requireAuth, (req, res) => {
  try {
    const userId = req.session.userId;
    const { taskId } = req.params;
    
    const userTasks = tasks.get(userId);
    if (!userTasks) {
      return res.status(404).json({ error: 'no tasks found' });
    }
    
    const task = userTasks.find(t => t.id === taskId);
    if (!task) {
      return res.status(404).json({ error: 'task not found' });
    }
    
    task.status = 'completed';
    task.completedAt = new Date();
    
    console.log('✓ Task completed:', task.name, 'for user:', userId);
    res.json({ message: 'task completed', task });
  } catch (err) {
    console.error('❌ Update task error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ===== API: Delete Tugas =====
app.delete('/api/tugas/:taskId', requireAuth, (req, res) => {
  try {
    const userId = req.session.userId;
    const { taskId } = req.params;
    
    const userTasks = tasks.get(userId);
    if (!userTasks) {
      return res.status(404).json({ error: 'no tasks found' });
    }
    
    const idx = userTasks.findIndex(t => t.id === taskId);
    if (idx === -1) {
      return res.status(404).json({ error: 'task not found' });
    }
    
    const removed = userTasks.splice(idx, 1)[0];
    console.log('✓ Task deleted:', removed.name, 'for user:', userId);
    res.json({ message: 'task deleted' });
  } catch (err) {
    console.error('❌ Delete task error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ===== Redirect root to home (protected, will show login if not authed) =====
app.get('/', (req, res) => {
  res.redirect('/pages/halo.html');
});

// ===== Error Handlers =====
process.on('unhandledRejection', (reason) => {
  console.warn('Unhandled Rejection:', reason?.message || reason);
});
process.on('uncaughtException', (err) => {
  console.warn('Uncaught Exception:', err.message);
});

app.listen(8080, () => console.log('Backend berjalan di http://localhost:8080'));
