const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// ✅ Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(session({
  secret: 'museosmart_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000, // 1 hour
    httpOnly: true,
    secure: false,   // false for localhost
    sameSite: 'lax'
  }
}));

// ✅ MySQL setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'museosmart'
});

db.connect(err => {
  if (err) {
    console.error('❌ Database connection error:', err);
  } else {
    console.log('✅ Connected to MySQL');
  }
});

// ✅ Middleware for session authentication
const isAuthenticated = (req, res, next) => {
  if (req.session.user) return next();
  return res.status(401).json({ success: false, message: 'Not authenticated' });
};

// ✅ Signup route
app.post('/api/signup', (req, res) => {
  const { username, firstname, lastname, password, role } = req.body;

  if (!username || !firstname || !lastname || !password || role === undefined) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const sql = `INSERT INTO system_user (username, firstname, lastname, password, role, status)
               VALUES (?, ?, ?, ?, ?, 'active')`;
  db.query(sql, [username, firstname, lastname, password, role], err => {
    if (err) {
      console.error('❌ Signup error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    res.json({ success: true, message: 'Account created successfully!' });
  });
});

// ✅ Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.query(`SELECT * FROM system_user WHERE username = ?`, [username], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (results.length === 0) return res.json({ success: false, message: 'Invalid username or password' });

    const user = results[0];
    if (user.password !== password) {
      return res.json({ success: false, message: 'Invalid username or password' });
    }

    if (user.status === 'deactivated') {
      return res.json({ success: false, message: 'Account is deactivated.' });
    }

    req.session.user = {
      id: user.user_ID,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role
    };

    res.json({ success: true, message: 'Login successful', user: req.session.user });
  });
});

// ✅ Current logged-in user
app.get('/api/user', isAuthenticated, (req, res) => {
  res.json({ success: true, user: req.session.user });
});

// ✅ Get all users
app.get('/api/users', (req, res) => {
  const sql = `
    SELECT 
      user_ID AS id,
      username,
      firstname,
      lastname,
      role,
      status
    FROM system_user
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching users:", err);
      return res.status(500).json({ success: false, message: "Failed to fetch users" });
    }

    res.json({ success: true, users: results });
  });
});

// ✅ Logout
app.get('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ success: false, message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ success: true, message: 'Logged out' });
  });
});

// ✅ Change password
app.post('/api/change-password', isAuthenticated, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.session.user.id;

  db.query(`SELECT password FROM system_user WHERE user_ID = ?`, [userId], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'DB error' });

    const user = results[0];
    if (!user || user.password !== currentPassword) {
      return res.json({ success: false, message: 'Current password incorrect' });
    }

    db.query(`UPDATE system_user SET password = ? WHERE user_ID = ?`, [newPassword, userId], err => {
      if (err) return res.status(500).json({ success: false, message: 'DB update error' });
      res.json({ success: true, message: 'Password updated successfully' });
    });
  });
});

// ✅ Deactivate user
app.post('/api/users/:id/deactivate', (req, res) => {
  const { id } = req.params;
  db.query(`UPDATE system_user SET status = 'deactivated' WHERE user_ID = ?`, [id], err => {
    if (err) return res.status(500).json({ success: false, message: 'Deactivate failed' });
    res.json({ success: true });
  });
});

// ✅ Activate user
app.post('/api/users/:id/activate', (req, res) => {
  const { id } = req.params;
  db.query(`UPDATE system_user SET status = 'active' WHERE user_ID = ?`, [id], err => {
    if (err) return res.status(500).json({ success: false, message: 'Activate failed' });
    res.json({ success: true });
  });
});

// ✅ Delete user
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.query(`DELETE FROM system_user WHERE user_ID = ?`, [id], err => {
    if (err) return res.status(500).json({ success: false, message: 'Delete failed' });
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
