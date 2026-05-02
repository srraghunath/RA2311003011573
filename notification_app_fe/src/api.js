import axios from 'axios';
import { Log } from 'logging_middleware/logger';

const API_URL = 'http://localhost:5005/api';

export const fetchNotifications = async (limit = 10, page = 1, type = '') => {
  Log('frontend', 'info', 'api', 'fetching notifications');
  try {
    const params = { limit, page };
    if (type) params.notification_type = type;

    const response = await axios.get(`${API_URL}/notifications`, { params });
    Log('frontend', 'info', 'api', 'successfully fetched notifications');
    return response.data;
  } catch (error) {
    Log('frontend', 'error', 'api', 'failed to fetch notifications');
    throw error;
  }
};

export const fetchPriorityNotifications = async (n = 5) => {
  Log('frontend', 'info', 'api', 'fetching priority notifications');
  try {
    const response = await axios.get(`${API_URL}/priority-notifications`, { params: { n } });
    Log('frontend', 'info', 'api', 'successfully fetched priority notifications');
    return response.data;
  } catch (error) {
    Log('frontend', 'error', 'api', 'failed to fetch priority notifications');
    throw error;
  }
};
