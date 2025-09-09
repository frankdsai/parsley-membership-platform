import EnhancedAIChat from './EnhancedAIChat';
import Events from './Events';
import AIChat from './AIChat';
import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent,
  Box
} from '@mui/material';
import { signOut, User } from 'firebase/auth';
import { auth } from '../firebase';
import Members from './Members';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [currentView, setCurrentView] = useState('home');

  const handleLogout = () => {
    signOut(auth);
  };

  const renderContent = () => {
    switch(currentView) {
      case 'members':
        return <Members />;
      case 'events':
        return <Events />;
      case 'ai':
        return <EnhancedAIChat />;
      default:
        return (
          <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ cursor: 'pointer' }} onClick={() => setCurrentView('members')}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Members
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Manage your member directory
                    </Typography>
                    <Box mt={2}>
                      <Button variant="contained" size="small">
                        View Members
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card sx={{ cursor: 'pointer' }} onClick={() => setCurrentView('events')}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Events
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Create and manage events
                    </Typography>
                    <Box mt={2}>
                      <Button variant="contained" size="small">
                        View Events
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card sx={{ cursor: 'pointer' }} onClick={() => setCurrentView('ai')}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      AI Assistant
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Chat with Parsley AI
                    </Typography>
                    <Box mt={2}>
                      <Button variant="contained" size="small">
                        Open Chat
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        );
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => setCurrentView('home')}
          >
            🌿 Parsley Dashboard
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Welcome, {user.email}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {renderContent()}
    </>
  );
};

export default Dashboard;