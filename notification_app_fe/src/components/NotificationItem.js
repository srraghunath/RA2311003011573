import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Button } from '@mui/material';
import { Log } from 'logging_middleware/logger';

const NotificationItem = ({ notification, onMarkViewed }) => {
  // If notification object has 'viewed' or 'read' property, else default to false.
  // Assuming the API might return 'is_read' or 'viewed'. For demo purposes, we rely on parent state.
  const isViewed = notification.isViewed; 

  const type = notification.notification_type || notification.type || notification.Type;
  const timestamp = notification.timestamp || notification.created_at || notification.Timestamp || Date.now();
  const message = notification.message || notification.description || notification.Message || '';
  const title = notification.title || notification.Title || 'Notification';
  const id = notification.id || notification._id || notification.ID;

  const handleView = () => {
    Log('frontend', 'info', 'component', `marked notification as viewed`);
    onMarkViewed(id);
  };

  const getChipColor = (t) => {
    switch (t?.toLowerCase()) {
      case 'placement': return 'success';
      case 'result': return 'info';
      case 'event': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Card 
      sx={{ 
        mb: 2, 
        borderLeft: isViewed ? '4px solid #ccc' : '4px solid #1976d2',
        backgroundColor: isViewed ? '#f9f9f9' : '#ffffff',
        transition: '0.3s',
        '&:hover': {
          boxShadow: 3
        }
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Chip 
            label={type} 
            color={getChipColor(type)} 
            size="small" 
          />
          <Typography variant="caption" color="text.secondary">
            {new Date(timestamp).toLocaleString()}
          </Typography>
        </Box>
        <Typography variant="h6" component="div" sx={{ fontWeight: isViewed ? 'normal' : 'bold' }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {message}
        </Typography>
        
        {!isViewed && (
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button size="small" onClick={handleView} variant="outlined">
              Mark as Viewed
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationItem;
