const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(bodyParser.json());

// Create a user
app.post('/users', async (req, res) => {
  const { name, email, age } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
      [name, email, age]
    );
    res.status(201).json({ id: result.insertId, name, email, age });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create multiple users
app.post('/users/bulk', async (req, res) => {
  const users = req.body; // Expecting an array of user objects
  if (!Array.isArray(users)) return res.status(400).json({ error: "Expected array of users" });

  try {
    const values = users.map(user => [user.name, user.email, user.age]);
    await db.query(
      'INSERT INTO users (name, email, age) VALUES ?',
      [values]
    );
    res.status(201).json({ message: 'Users inserted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read all users
app.get('/users', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read specific user
app.get('/users/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [req.params.id]);
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a user
app.put('/users/:id', async (req, res) => {
  const { name, email, age } = req.body;
  try {
    await db.execute(
      'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?',
      [name, email, age, req.params.id]
    );
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a user
app.delete('/users/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
