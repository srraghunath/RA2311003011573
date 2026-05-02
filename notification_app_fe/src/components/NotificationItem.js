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
        backgroundColor: 'background.paper',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isViewed ? 0.7 : 1,
        transform: isViewed ? 'scale(0.99)' : 'scale(1)',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: '4px',
          background: isViewed ? 'rgba(255,255,255,0.1)' : `linear-gradient(180deg, ${type?.toLowerCase() === 'placement' ? '#34d399, #10b981' : type?.toLowerCase() === 'result' ? '#60a5fa, #3b82f6' : '#fbbf24, #f59e0b'})`,
        },
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px -10px rgba(0, 0, 0, 0.5), 0 0 10px rgba(255,255,255,0.05)',
          borderColor: 'rgba(255, 255, 255, 0.15)',
        }
      }}
    >
      <CardContent sx={{ pl: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Chip 
            label={type} 
            size="small" 
            sx={{ 
              backgroundColor: type?.toLowerCase() === 'placement' ? 'rgba(16, 185, 129, 0.15)' : type?.toLowerCase() === 'result' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: type?.toLowerCase() === 'placement' ? '#34d399' : type?.toLowerCase() === 'result' ? '#60a5fa' : '#fbbf24',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              fontSize: '0.7rem'
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8 }}>
            {new Date(timestamp).toLocaleString()}
          </Typography>
        </Box>
        <Typography variant="h6" component="div" sx={{ fontWeight: isViewed ? 500 : 700, color: isViewed ? 'text.secondary' : 'text.primary', mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.6 }}>
          {message}
        </Typography>
        
        {!isViewed && (
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button 
              variant="contained" 
              size="small" 
              onClick={handleView}
              sx={{ 
                background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
                  boxShadow: '0 6px 20px rgba(99, 102, 241, 0.23)',
                }
              }}
            >
              Mark as Viewed
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationItem;
