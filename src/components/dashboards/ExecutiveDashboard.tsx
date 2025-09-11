import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { UserProfile } from '../../types/user';
import ModernDashboard from '../ModernDashboard';
import EnhancedAIChat from '../EnhancedAIChat';
import { Box, Typography, Card, CardContent, Grid, Chip } from '@mui/material';

interface ExecutiveDashboardProps {
  user: User;
  userProfile: UserProfile;
}

const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ user, userProfile }) => {
  const [currentView, setCurrentView] = useState('overview');

  const renderContent = () => {
    switch (currentView) {
      case 'chat':
        return <EnhancedAIChat />;
      default:
        return (
          <Box sx={{ p: 4, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                Executive Overview
              </Typography>
              <Chip label="Read-Only Access" color="warning" size="small" sx={{ mb: 2 }} />
              <Typography variant="body1" sx={{ color: '#64748b' }}>
                Strategic insights and member engagement analytics
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#10b981', mb: 1 }}>
                      156
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b' }}>
                      Active Members
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#3b82f6', mb: 1 }}>
                      89%
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b' }}>
                      Engagement Rate
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#f59e0b', mb: 1 }}>
                      12
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b' }}>
                      Upcoming Events
                    </Typography>
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

export default ExecutiveDashboard;