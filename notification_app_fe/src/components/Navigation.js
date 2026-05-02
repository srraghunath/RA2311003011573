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
    <AppBar position="static" color="primary" elevation={0} sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Campus Notifications
        </Typography>
        <Box>
          <Button 
            color="inherit" 
            component={Link} 
            to="/" 
            onClick={() => handleNavClick('all notifications')}
            sx={{ 
              fontWeight: location.pathname === '/' ? 'bold' : 'normal',
              borderBottom: location.pathname === '/' ? '2px solid white' : 'none',
              borderRadius: 0
            }}
          >
            All Notifications
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/priority" 
            onClick={() => handleNavClick('priority notifications')}
            sx={{ 
              fontWeight: location.pathname === '/priority' ? 'bold' : 'normal',
              borderBottom: location.pathname === '/priority' ? '2px solid white' : 'none',
              borderRadius: 0,
              ml: 2
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
