import React from 'react';
import { Box, Typography, Card, CardContent, Chip } from '@mui/material';

const DemoLogin: React.FC = () => {
  return (
    <Box sx={{ mt: 3, maxWidth: 400 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Demo Accounts
      </Typography>
      
      <Card sx={{ mb: 2, borderRadius: 2 }}>
        <CardContent sx={{ p: 2 }}>
          <Chip label="Admin" color="primary" size="small" sx={{ mb: 1 }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            admin@demo.com
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Full access to all features, analytics, and member management
          </Typography>
        </CardContent>
      </Card>
      
      <Card sx={{ mb: 2, borderRadius: 2 }}>
        <CardContent sx={{ p: 2 }}>
          <Chip label="Executive" color="warning" size="small" sx={{ mb: 1 }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            executive@demo.com
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Read-only strategic insights and analytics dashboard
          </Typography>
        </CardContent>
      </Card>
      
      <Card sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 2 }}>
          <Chip label="Member" color="success" size="small" sx={{ mb: 1 }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            member@demo.com
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Member portal with expert matching and networking
          </Typography>
        </CardContent>
      </Card>
      
      <Typography variant="caption" sx={{ color: '#64748b', mt: 2, display: 'block' }}>
        Use any password for demo accounts
      </Typography>
    </Box>
  );
};

export default DemoLogin;