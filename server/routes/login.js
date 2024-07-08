const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { authenticateUser } = require('../utils/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

router.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authenticateUser(email, password);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
