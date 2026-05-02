const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const { getTopNNotifications } = require('./priorityLogic');

// Assuming logger.js is compatible with CommonJS or we use dynamic import.
// Since it's an ES module in our current setup (using `export`), let's just make it CommonJS compatible or fetch it.
// The prompt says "logging_middleware/logger.js"
// Actually, since React frontend uses it, it's better if it's imported correctly.
// Let's rewrite logger.js to be universally compatible or just import it cleanly.
// Since logger.js uses `export const`, Node.js might complain if package.json type isn't module.
// We can use a dynamic import.

dotenv.config({ path: '../notification_app_fe/.env' }); // Reusing the same .env for simplicity

const app = express();
app.use(cors());
app.use(express.json());

const EVAL_SERVICE_URL = 'http://20.207.122.201/evaluation-service';
const TOKEN = process.env.ACCESS_TOKEN || process.env.REACT_APP_ACCESS_TOKEN;

// Dynamic import of ES Module logger
let Log = null;
let setToken = null;
(async () => {
  const logger = await import('../../logging_middleware/logger.js');
  Log = logger.Log;
  setToken = logger.setToken;
  setToken(TOKEN);
})();

app.get('/api/notifications', async (req, res) => {
  if (Log) Log('backend', 'info', 'api', 'received request for all notifications');
  try {
    const response = await axios.get(`${EVAL_SERVICE_URL}/notifications`, {
      params: req.query,
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    if (Log) Log('backend', 'info', 'api', 'successfully fetched notifications from eval service');
    res.json(response.data);
  } catch (error) {
    if (Log) Log('backend', 'error', 'api', 'failed to fetch notifications from eval service');
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

app.get('/api/priority-notifications', async (req, res) => {
  if (Log) Log('backend', 'info', 'api', 'received request for priority notifications');
  try {
    // Fetch a large subset or all
    const response = await axios.get(`${EVAL_SERVICE_URL}/notifications`, {
      params: { limit: 100, page: 1 }, 
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    
    const items = Array.isArray(response.data) ? response.data : (response.data.notifications || response.data.data || []);
    
    const topN = parseInt(req.query.n, 10) || 5;
    if (Log) Log('backend', 'info', 'handler', 'computing top n notifications via min heap');
    const prioritized = getTopNNotifications(items, topN);
    
    if (Log) Log('backend', 'info', 'api', 'successfully computed priority notifications');
    res.json(prioritized);
  } catch (error) {
    if (Log) Log('backend', 'error', 'api', 'failed to fetch priority notifications');
    res.status(500).json({ error: 'Failed to fetch priority notifications' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  // Silent startup
});
