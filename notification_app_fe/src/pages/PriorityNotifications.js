import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Slider } from '@mui/material';
import { fetchPriorityNotifications } from '../api';
import NotificationItem from '../components/NotificationItem';
import { Log } from 'logging_middleware/logger';

const PriorityNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [topN, setTopN] = useState(5);
  const [viewedState, setViewedState] = useState({});

  useEffect(() => {
    Log('frontend', 'info', 'page', 'priority notifications page loaded');
  }, []);

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      setError('');
      try {
        const prioritized = await fetchPriorityNotifications(topN);
        setNotifications(prioritized);
        Log('frontend', 'info', 'state', 'priority notifications state updated');
      } catch (err) {
        Log('frontend', 'error', 'api', 'failed to fetch priority notifications');
        setError('Failed to load priority notifications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [topN]);

  const handleTopNChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (val > 0) {
      setTopN(val);
      Log('frontend', 'info', 'component', `changed top N to ${val}`);
    }
  };

  const markAsViewed = (id) => {
    setViewedState(prev => ({ ...prev, [id]: true }));
    Log('frontend', 'info', 'state', `marked priority notification ${id} as viewed`);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={2} mb={4} sx={{ borderBottom: '1px solid rgba(255,255,255,0.08)', pb: 2 }}>
        <Typography variant="h4" component="h1" sx={{ background: 'linear-gradient(90deg, #f9fafb 0%, #9ca3af 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', minWidth: '250px' }}>
          Priority Overview
        </Typography>
        
        <Box sx={{ width: { xs: '100%', sm: 300 }, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
            Top {topN} Results
          </Typography>
          <Slider
            value={topN}
            onChange={(e, val) => {
              setTopN(val);
              Log('frontend', 'info', 'component', `changed top N slider to ${val}`);
            }}
            min={1}
            max={50}
            step={1}
            valueLabelDisplay="auto"
            sx={{
              color: '#ec4899',
              '& .MuiSlider-thumb': {
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0px 0px 0px 8px rgba(236, 72, 153, 0.16)',
                },
              },
            }}
          />
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center" mt={5}>{error}</Typography>
      ) : notifications.length === 0 ? (
        <Typography align="center" mt={5} color="text.secondary">No priority notifications found.</Typography>
      ) : (
        notifications.map((notif, index) => {
          const id = notif.id || notif._id || index;
          return (
            <NotificationItem 
              key={id} 
              notification={{ ...notif, isViewed: viewedState[id] }} 
              onMarkViewed={() => markAsViewed(id)} 
            />
          );
        })
      )}
    </Container>
  );
};

export default PriorityNotifications;
