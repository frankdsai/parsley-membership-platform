import React from 'react';
import { User } from 'firebase/auth';
import { useUserRole } from '../hooks/useUserRole';
import AdminDashboard from './dashboards/AdminDashboard';
import ExecutiveDashboard from './dashboards/ExecutiveDashboard';
import MemberDashboard from './dashboards/MemberDashboard';
import { Box, CircularProgress, Typography } from '@mui/material';

interface RoleBasedDashboardProps {
  user: User;
}

const RoleBasedDashboard: React.FC<RoleBasedDashboardProps> = ({ user }) => {
  const { userProfile, loading } = useUserRole(user);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Loading your workspace...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!userProfile) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <Typography variant="h6" sx={{ color: '#ef4444' }}>
          Error loading user profile
        </Typography>
      </Box>
    );
  }

  switch (userProfile.role) {
    case 'admin':
      return <AdminDashboard user={user} userProfile={userProfile} />;
    case 'executive':
      return <ExecutiveDashboard user={user} userProfile={userProfile} />;
    case 'member':
      return <MemberDashboard user={user} userProfile={userProfile} />;
    default:
      return <MemberDashboard user={user} userProfile={userProfile} />;
  }
};

export default RoleBasedDashboard;