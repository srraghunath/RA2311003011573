import React, { useState, useEffect } from 'react';
import { Container, Typography, Select, MenuItem, FormControl, InputLabel, Box, CircularProgress, Pagination } from '@mui/material';
import { fetchNotifications } from '../api';
import NotificationItem from '../components/NotificationItem';
import { Log } from 'logging_middleware/logger';

const AllNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filterType, setFilterType] = useState('');
  
  const [viewedState, setViewedState] = useState({});

  useEffect(() => {
    Log('frontend', 'info', 'page', 'notifications page loaded');
  }, []);

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      setError('');
      try {
        Log('frontend', 'info', 'api', 'fetching all notifications');
        const data = await fetchNotifications(limit, page, filterType);
        
        // Ensure data is an array (adapt based on actual API response structure)
        const items = Array.isArray(data) ? data : (data.notifications || data.data || []);
        setNotifications(items);
        Log('frontend', 'info', 'state', 'notifications state updated');
      } catch (err) {
        Log('frontend', 'error', 'api', 'failed to fetch notifications');
        setError('Failed to load notifications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [page, filterType, limit]);

  const handleFilterChange = (e) => {
    Log('frontend', 'info', 'component', 'changed notification filter');
    setFilterType(e.target.value);
    setPage(1); // Reset to first page
  };

  const handlePageChange = (event, value) => {
    Log('frontend', 'info', 'component', `changed page to ${value}`);
    setPage(value);
  };

  const markAsViewed = (id) => {
    setViewedState(prev => ({ ...prev, [id]: true }));
    Log('frontend', 'info', 'state', `marked notification ${id} as viewed`);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={2} mb={3}>
        <Typography variant="h4" component="h1">
          All Notifications
        </Typography>
        <FormControl sx={{ minWidth: 200, width: { xs: '100%', sm: 'auto' } }}>
          <InputLabel id="filter-type-label">Filter by Type</InputLabel>
          <Select
            labelId="filter-type-label"
            value={filterType}
            label="Filter by Type"
            onChange={handleFilterChange}
          >
            <MenuItem value=""><em>All</em></MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center" mt={5}>{error}</Typography>
      ) : notifications.length === 0 ? (
        <Typography align="center" mt={5} color="text.secondary">No notifications found.</Typography>
      ) : (
        <>
          {notifications.map((notif, index) => {
            const id = notif.id || notif._id || index;
            return (
              <NotificationItem 
                key={id} 
                notification={{ ...notif, isViewed: viewedState[id] }} 
                onMarkViewed={() => markAsViewed(id)} 
              />
            );
          })}
          
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination 
              count={10} // Ideally driven by API total count
              page={page} 
              onChange={handlePageChange} 
              color="primary" 
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default AllNotifications;
