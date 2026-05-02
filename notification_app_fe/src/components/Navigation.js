import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { Log } from 'logging_middleware/logger';

const Navigation = () => {
  const location = useLocation();

  const handleNavClick = (path) => {
    Log('frontend', 'info', 'component', `navigating to ${path}`);
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        mb: 4, 
        background: 'rgba(11, 15, 25, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        top: 0,
        zIndex: 1100
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, background: 'linear-gradient(90deg, #818cf8 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Campus Notifications
        </Typography>
        <Box>
          <Button 
            component={Link} 
            to="/" 
            onClick={() => handleNavClick('all notifications')}
            sx={{ 
              color: location.pathname === '/' ? '#ffffff' : '#9ca3af',
              fontWeight: location.pathname === '/' ? 600 : 500,
              position: 'relative',
              '&::after': location.pathname === '/' ? {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: '10%',
                width: '80%',
                height: 3,
                borderRadius: '4px 4px 0 0',
                backgroundColor: '#6366f1'
              } : {}
            }}
          >
            All Notifications
          </Button>
          <Button 
            component={Link} 
            to="/priority" 
            onClick={() => handleNavClick('priority notifications')}
            sx={{ 
              color: location.pathname === '/priority' ? '#ffffff' : '#9ca3af',
              fontWeight: location.pathname === '/priority' ? 600 : 500,
              position: 'relative',
              ml: 2,
              '&::after': location.pathname === '/priority' ? {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: '10%',
                width: '80%',
                height: 3,
                borderRadius: '4px 4px 0 0',
                backgroundColor: '#ec4899'
              } : {}
            }}
          >
            Priority
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
