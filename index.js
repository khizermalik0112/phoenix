const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const app = express();

const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
const logFile = path.join(logDir, 'server.log');

function logToFile(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(logFile, line);
}

const dbUri = process.env.DATABASE_URI || 'mongodb://database:27017/phoenix';

mongoose.connect(dbUri)
  .then(() => {
    console.log('Connected to MongoDB!');
    logToFile('Connected to MongoDB!');
  })
  .catch(err => {
    console.error('Failed to connect:', err);
    logToFile(`Failed to connect: ${err.message}`);
  });

const uiPath = path.join(__dirname, 'dist');
app.use(express.static(uiPath));

app.get('/api/health', (req, res) => {
  logToFile('Health check hit');
  res.json({ status: 'API is alive' });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
  logToFile('Server running on port 5000');
});