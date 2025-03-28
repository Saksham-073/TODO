const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const users = [
  { id: 1, username: 'user1', password: 'pass1' },
  { id: 2, username: 'user2', password: 'pass2' }
];

const weatherData = {
  'New York': { temp: 72, condition: 'Sunny', humidity: 50 },
  'London': { temp: 60, condition: 'Cloudy', humidity: 70 },
  'Tokyo': { temp: 75, condition: 'Rainy', humidity: 80 }
};

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    res.json({ success: true, user: { id: user.id, username: user.username } });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/api/logout', (req, res) => {
  res.json({ success: true });
});

app.get('/api/weather/:location', (req, res) => {
  const location = req.params.location;
  const weather = weatherData[location] || { temp: 68, condition: 'Partly Cloudy', humidity: 60 };
  
  setTimeout(() => {
    res.json(weather);
  }, 500); 
});

app.use(cors({
  origin: 'http://localhost:1234',
  credentials: true
}));

app.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`);
});