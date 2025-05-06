const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    res.status(201).json({ code: 201, message: 'User registered', result: { id: user._id, name: user.username, email: user.email } });
  } catch (err) {
    res.status(400).json({ code: 400, message: 'Registration failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid username or password' });

    const token = generateToken(user);
    res.cookie('token', token, { httpOnly: true, sameSite: 'Lax' });

    res.json({ code: 200, message: 'Login successful', result: { id: user._id, name: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ code: 500, message: 'Login error', error: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ code: 200, message: 'Logged out' });
};

exports.verifyToken = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ code: 401, message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ code: 200, message: 'Token valid', result: decoded });
  } catch (err) {
    res.status(401).json({ code: 401, message: 'Invalid token' });
  }
};
