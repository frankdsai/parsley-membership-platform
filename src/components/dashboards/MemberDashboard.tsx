import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { UserProfile } from '../../types/user';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  TextField,
  InputAdornment,
  Divider
} from '@mui/material';
import { 
  Person, 
  Event, 
  Groups, 
  Search,
  TrendingUp,
  Lightbulb,
  Notifications,
  Settings,
  Chat
} from '@mui/icons-material';

interface MemberDashboardProps {
  user: User;
  userProfile: UserProfile;
}

const MemberDashboard: React.FC<MemberDashboardProps> = ({ user, userProfile }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const recommendedConnections = [
    { name: 'Sarah Chen', expertise: 'AI Product Strategy', commonInterests: 3, avatar: 'SC' },
    { name: 'Alex Rodriguez', expertise: 'Cloud Architecture', commonInterests: 2, avatar: 'AR' },
    { name: 'Maria Gonzalez', expertise: 'FinTech Innovation', commonInterests: 4, avatar: 'MG' }
  ];

  const upcomingEvents = [
    { title: 'AI in Banking Workshop', date: 'Dec 15', attendees: 24 },
    { title: 'Product Strategy Roundtable', date: 'Dec 18', attendees: 12 },
    { title: 'Tech Leadership Forum', date: 'Dec 22', attendees: 45 }
  ];

  const personalizedContent = [
    { title: 'AI Product Strategy Best Practices', type: 'Article', relevance: 95 },
    { title: 'Digital Transformation Case Studies', type: 'Report', relevance: 87 },
    { title: 'Networking Tips for Tech Leaders', type: 'Guide', relevance: 82 }
  ];

  const recentActivity = [
    { action: 'Connected with', person: 'Sarah Chen', time: '2 hours ago' },
    { action: 'Registered for', event: 'AI Workshop', time: '1 day ago' },
    { action: 'Updated profile', person: 'expertise section', time: '3 days ago' }
  ];

  return (
    <Box sx={{ p: 4, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          Welcome back, {userProfile.displayName}!
        </Typography>
        <Chip 
          label="Member Portal" 
          color="success" 
          sx={{ mb: 2, fontWeight: 600 }}
        />
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          Your personalized membership experience with AI-powered recommendations
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Quick Actions & Search */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
                Find an Expert
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                State your goal or challenge and we'll find the most relevant expert in our community
              </Typography>
              
              <TextField
                fullWidth
                placeholder="e.g., 'I need help with AI product strategy for fintech apps'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <Button variant="contained" sx={{ ml: 1 }}>
                      Find Expert
                    </Button>
                  )
                }}
                sx={{ mb: 2 }}
              />
              
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Groups />}
                    sx={{ borderRadius: 2, py: 1.5, textTransform: 'none' }}
                  >
                    Browse Members
                  </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Event />}
                    sx={{ borderRadius: 2, py: 1.5, textTransform: 'none' }}
                  >
                    Find Events
                  </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Person />}
                    sx={{ borderRadius: 2, py: 1.5, textTransform: 'none' }}
                  >
                    Update Profile
                  </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Chat />}
                    sx={{ borderRadius: 2, py: 1.5, textTransform: 'none' }}
                  >
                    Ask Parsley AI
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Recommended Connections */}
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
                Recommended Connections
              </Typography>
              
              <Grid container spacing={2}>
                {recommendedConnections.map((connection, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <Card sx={{ 
                      border: '1px solid #e2e8f0', 
                      boxShadow: 'none',
                      '&:hover': { borderColor: '#3b82f6' }
                    }}>
                      <CardContent sx={{ p: 2, textAlign: 'center' }}>
                        <Avatar sx={{ 
                          width: 48, 
                          height: 48, 
                          backgroundColor: '#3b82f6',
                          mx: 'auto',
                          mb: 1
                        }}>
                          {connection.avatar}
                        </Avatar>
                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {connection.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', mb: 1, display: 'block' }}>
                          {connection.expertise}
                        </Typography>
                        <Chip 
                          label={`${connection.commonInterests} shared interests`}
                          size="small"
                          color="primary"
                          sx={{ mb: 1 }}
                        />
                        <Button size="small" variant="outlined" fullWidth>
                          Connect
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Personalized Content */}
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
                Recommended for You
              </Typography>
              
              <List>
                {personalizedContent.map((content, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Lightbulb sx={{ color: '#f59e0b' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={content.title}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip label={content.type} size="small" variant="outlined" />
                          <Typography variant="caption" sx={{ color: '#10b981' }}>
                            {content.relevance}% match
                          </Typography>
                        </Box>
                      }
                    />
                    <Button size="small" variant="text">View</Button>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Summary & Activity */}
        <Grid item xs={12} md={4}>
          {/* Profile Card */}
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none', mb: 3 }}>
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
                {userProfile.displayName?.[0] || userProfile.email[0]}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                {userProfile.displayName}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                {userProfile.organization}
              </Typography>
              
              <Grid container spacing={1} sx={{ mb: 2 }}>
                <Grid item xs={4}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                    {userProfile.connectionsMade}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Connections
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#10b981' }}>
                    {userProfile.eventsAttended}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Events
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                    {userProfile.profileCompleteness}%
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Complete
                  </Typography>
                </Grid>
              </Grid>
              
              <Button variant="outlined" size="small" fullWidth sx={{ mb: 1 }}>
                Edit Profile
              </Button>
              <Button variant="text" size="small" fullWidth startIcon={<Settings />}>
                Settings
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
                Upcoming Events
              </Typography>
              
              <List dense>
                {upcomingEvents.map((event, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={event.title}
                        secondary={
                          <Box>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              {event.date} • {event.attendees} attending
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < upcomingEvents.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              
              <Button variant="text" size="small" fullWidth sx={{ mt: 1 }}>
                View All Events
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
                Recent Activity
              </Typography>
              
              <List dense>
                {recentActivity.map((activity, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Notifications sx={{ color: '#64748b', fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${activity.action} ${activity.person || activity.event}`}
                      secondary={activity.time}
                      sx={{
                        '& .MuiListItemText-primary': { fontSize: '0.875rem' },
                        '& .MuiListItemText-secondary': { fontSize: '0.75rem' }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MemberDashboard;