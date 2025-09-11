import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { UserProfile } from '../../types/user';
import EnhancedAIChat from '../EnhancedAIChat';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  Avatar,
  Chip
} from '@mui/material';
import { Person, Event, Groups } from '@mui/icons-material';

interface MemberDashboardProps {
  user: User;
  userProfile: UserProfile;
}

const MemberDashboard: React.FC<MemberDashboardProps> = ({ user, userProfile }) => {
  const [currentView, setCurrentView] = useState('portal');

  const renderContent = () => {
    switch (currentView) {
      case 'chat':
        return <EnhancedAIChat />;
      default:
        return (
          <Box sx={{ p: 4, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                Welcome back, {userProfile.displayName || 'Member'}!
              </Typography>
              <Chip label="Member Access" color="success" size="small" sx={{ mb: 2 }} />
              <Typography variant="body1" sx={{ color: '#64748b' }}>
                Your personal membership portal
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Avatar sx={{ 
                      width: 80, 
                      height: 80, 
                      backgroundColor: '#3b82f6',
                      fontSize: '2rem',
                      fontWeight: 600,
                      mx: 'auto',
                      mb: 2
                    }}>
                      {userProfile.displayName ? userProfile.displayName[0] : userProfile.email[0]}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                      {userProfile.displayName || 'Member'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                      {userProfile.email}
                    </Typography>
                    <Button variant="contained" size="small" sx={{ borderRadius: 2 }}>
                      Edit Profile
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
                      Quick Actions
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<Event />}
                          sx={{ borderRadius: 2, py: 1.5, textTransform: 'none' }}
                        >
                          Browse Events
                        </Button>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<Groups />}
                          sx={{ borderRadius: 2, py: 1.5, textTransform: 'none' }}
                        >
                          Find Members
                        </Button>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => setCurrentView('chat')}
                          sx={{ borderRadius: 2, py: 1.5, textTransform: 'none' }}
                        >
                          Ask Parsley AI
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
    }
  };

  return renderContent();
};

export default MemberDashboard;