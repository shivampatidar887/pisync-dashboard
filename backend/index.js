const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Mock dataBase
const devices = Array.from({ length: 20 }, (_, i) => ({
  id: `device-${i + 1}`,
  name: `PiBook-${Math.floor(Math.random() * 1000)}`,
  lastSync: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  status: ['Success', 'Pending', 'Failed'][Math.floor(Math.random() * 3)],
  location: ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Kolkata'][Math.floor(Math.random() * 5)],
  osVersion: `v${Math.random().toFixed(2)}`
}));

const errorLogs = devices
  .filter(device => device.status === 'Failed')
  .map(device => ({
    deviceId: device.id,
    error: ['Network timeout', 'Authentication failed', 'Storage limit exceeded', 'Invalid data format'][Math.floor(Math.random() * 4)],
    timestamp: new Date().toISOString()
  }));

// Routes
app.get('/api/devices', (req, res) => {
  res.json(devices);
});

app.get('/api/error-logs', (req, res) => {
  res.json(errorLogs);
});

app.post('/api/sync/:deviceId', (req, res) => {
  const device = devices.find(d => d.id === req.params.deviceId);
  if (device) {
    device.status = 'Pending';
    device.lastSync = new Date().toISOString();
    setTimeout(() => {
      device.status = Math.random() > 0.2 ? 'Success' : 'Failed';
      res.json({ success: true });
    }, 1500);
  } else {
    res.status(404).json({ error: 'Device not found' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});