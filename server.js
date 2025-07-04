require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors());
app.use(express.json()); // Replaces bodyParser.json()

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Database Schemas ---
const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  type: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }
});

const Event = mongoose.model('Event', EventSchema);
const User = mongoose.model('User', UserSchema);

// --- Auth Middleware ---
// This function will protect routes by checking for a valid token
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required: No token provided.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId }; // Add user id to the request object
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed: Invalid token.' });
  }
};

// --- API Routes ---

// AUTH ROUTES (Public)
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User created successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during signup.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// EVENT ROUTES (Protected by authMiddleware)
app.get('/api/events', authMiddleware, async (req, res) => {
  try {
    const events = await Event.find({ owner: req.user.id });
    res.json(events.map(e => ({...e.toObject(), id: e._id }))); // Map _id to id for FullCalendar
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events.' });
  }
});

app.post('/api/events', authMiddleware, async (req, res) => {
  try {
    const newEvent = new Event({ ...req.body, owner: req.user.id });
    await newEvent.save();
    res.status(201).json({...newEvent.toObject(), id: newEvent._id });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create event.' });
  }
});

app.put('/api/events/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id }, // Ensure user can only update their own event
      req.body,
      { new: true } // Return the updated document
    );
    if (!event) {
      return res.status(404).json({ message: 'Event not found or you do not have permission to edit it.' });
    }
    res.json({...event.toObject(), id: event._id });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update event.' });
  }
});

app.delete('/api/events/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!event) {
      return res.status(404).json({ message: 'Event not found or you do not have permission to delete it.' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete event.' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));