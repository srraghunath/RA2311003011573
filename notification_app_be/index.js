const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const { getTopNNotifications } = require('./priorityLogic');

dotenv.config({ path: '../notification_app_fe/.env' });

const app = express();
app.use(cors());
app.use(express.json());

const EVAL_SERVICE_URL = 'http://20.207.122.201/evaluation-service';
let TOKEN = process.env.ACCESS_TOKEN || process.env.REACT_APP_ACCESS_TOKEN;

let Log = null;
let setToken = null;
(async () => {
  const logger = await import('../logging_middleware/logger.js');
  Log = logger.Log;
  setToken = logger.setToken;
  setToken(TOKEN);
})();

const refreshTokenIfNeeded = async (error) => {
  if (error.response && error.response.status === 401) {
    if (Log) Log('backend', 'warn', 'auth', 'token expired. attempting to refresh');
    try {
      const payloadString = Buffer.from(TOKEN.split('.')[1], 'base64').toString('utf8');
      const payload = JSON.parse(payloadString);
      
      const authRes = await axios.post(`${EVAL_SERVICE_URL}/auth`, {
        clientID: process.env.CLIENT_ID || payload.clientID,
        clientSecret: process.env.CLIENT_SECRET || payload.clientSecret,
        email: payload.email,
        name: payload.name,
        rollNo: payload.rollNo,
        accessCode: payload.accessCode
      });
      
      TOKEN = authRes.data.access_token;
      setToken(TOKEN);
      if (Log) Log('backend', 'info', 'auth', 'token successfully refreshed');
      return true;
    } catch (refreshErr) {
      if (Log) Log('backend', 'fatal', 'auth', 'failed to refresh token');
      return false;
    }
  }
  return false;
};

const makeApiRequest = async (url, config, attempt = 1) => {
  try {
    return await axios.get(url, { ...config, headers: { Authorization: `Bearer ${TOKEN}` } });
  } catch (error) {
    if (attempt === 1 && await refreshTokenIfNeeded(error)) {
      return await makeApiRequest(url, config, 2);
    }
    throw error;
  }
};

app.get('/api/notifications', async (req, res) => {
  if (Log) Log('backend', 'info', 'api', 'received request for all notifications');
  try {
    const response = await makeApiRequest(`${EVAL_SERVICE_URL}/notifications`, { params: req.query });
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
    // Fetch multiple pages since external API enforces max limit=10
    const promises = [1, 2, 3, 4, 5].map(p => 
      makeApiRequest(`${EVAL_SERVICE_URL}/notifications`, { params: { limit: 10, page: p } })
    );
    const responses = await Promise.all(promises);
    
    let items = [];
    responses.forEach(r => {
      const dataItems = Array.isArray(r.data) ? r.data : (r.data.notifications || r.data.data || []);
      items = items.concat(dataItems);
    });
    
    const topN = parseInt(req.query.n, 10) || 5;
    if (Log) Log('backend', 'info', 'handler', 'computing top n notifications via min heap');
    const prioritized = getTopNNotifications(items, topN);
    
    if (Log) Log('backend', 'info', 'api', 'successfully computed priority notifications');
    res.json(prioritized);
  } catch (error) {
    if (Log) Log('backend', 'error', 'api', 'failed to fetch priority notifications');
    res.status(500).json({ error: error.message, data: error.response?.data, stack: error.stack });
  }
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  // Silent startup
});
