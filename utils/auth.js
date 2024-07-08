const users = [
  { id: 1, email: 'user@example.com', password: 'password' }
];

function authenticateUser(email, password) {
  const user = users.find(u => u.email === email && u.password === password);
  return user || null;
}

function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
}

module.exports = { authenticateUser, requireAuth };
