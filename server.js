const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Dummy in-memory database. Add some initial events for testing.
let events = [
    { id: 1, title: 'Team Meeting', start: new Date().toISOString().slice(0, 10) + 'T10:00:00', end: new Date().toISOString().slice(0, 10) + 'T11:00:00', type: 'Business' },
    { id: 2, title: 'Project Deadline', start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), type: 'Assignment' }
];

app.use(cors());
app.use(bodyParser.json());

// READ all events
app.get('/api/events', (req, res) => {
  res.json(events);
});

// CREATE an event
app.post('/api/events', (req, res) => {
  const newEvent = req.body;
  newEvent.id = Date.now(); // Simple unique ID
  events.push(newEvent);
  res.status(201).json(newEvent);
});

// UPDATE an event
app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = events.findIndex(e => e.id === id);
  if (index > -1) {
    events[index] = { ...events[index], ...req.body };
    res.json(events[index]);
  } else {
    res.status(404).send('Event not found');
  }
});

// DELETE an event
app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter(e => e.id !== id);
  res.status(204).send();
});

app.listen(PORT, () => console.log(`Server running with API on http://localhost:${PORT}`));