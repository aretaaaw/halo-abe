const path = require('path');
const dotenvResult = require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const express = require("express");
const cors = require("cors");
const session = require('express-session');
const bcrypt = require('bcryptjs');

// ===== Simplified User Store (in-memory for now) =====
const users = new Map();

const app = express();
app.use(cors({
  origin: "http://localhost:8080",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// ===== Session Setup (in-memory store for dev) =====
const sessionSecret = process.env.SESSION_SECRET || 'dev_secret_key_change_in_production';
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 14,
    httpOnly: true,
    secure: false,
    sameSite: 'lax', // allow cookie to be sent on top-level navigations
    path: '/'
  }
}));

// ===== Request Logger =====
app.use((req, res, next) => {
  const sid = req.session && req.session.userId ? String(req.session.userId).slice(0,6) : '-';
  console.log(new Date().toISOString(), req.method, req.path, 'sessionId=', sid);
  next();
});

// ===== Serve Static Assets BEFORE Auth =====
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use('/login', express.static(path.resolve(__dirname, '..', 'login')));

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
    
    req.session.save(err => {
      if (err) console.error('Session save error on register:', err);
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
    
    req.session.save(err => {
      if (err) console.error('Session save error on login:', err);
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
  if (!req.session || !req.session.userId) return res.status(401).json({ error: 'not authenticated' });
  for (const user of users.values()) {
    if (user.userId === req.session.userId) {
      return res.json({ id: user.userId, username: user.username, createdAt: user.createdAt });
    }
  }
  res.status(404).json({ error: 'user not found' });
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
