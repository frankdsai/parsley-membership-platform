import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Divider,
  Paper,
  LinearProgress,
  IconButton,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Dashboard,
  People,
  Event,
  Chat,
  Settings,
  Search,
  MoreVert,
  TrendingUp,
  Groups,
  Psychology,
  CalendarToday,
  Mail,
  LinkedIn,
  BusinessCenter
} from '@mui/icons-material';
import EnhancedAIChat from './EnhancedAIChat';
import Members from './Members';
import Events from './Events';
import EngagementDashboard from './EngagementDashboard';

const ModernDashboard = ({ onNavigate, userRole }: { onNavigate?: (view: string) => void; userRole?: string }) => {
  const [selectedTab, setSelectedTab] = useState('feed');

  const sidebarItems = [
    { id: 'feed', icon: <Dashboard />, label: 'Feed', active: true },
    { id: 'members', icon: <People />, label: 'Members' },
    { id: 'events', icon: <Event />, label: 'Events' },
    { id: 'analytics', icon: <TrendingUp />, label: 'Analytics' },
    { id: 'priorities', icon: <TrendingUp />, label: 'Your Priorities' },
    { id: 'goals', icon: <Psychology />, label: 'Your Goals' },
    { id: 'review', icon: <BusinessCenter />, label: 'For Review' },
    { id: 'networks', icon: <Groups />, label: 'Groups and Networks' },
    { id: 'chat', icon: <Chat />, label: 'Parsley AI' }
  ];

  const bottomItems = [
    { id: 'messages', icon: <Mail />, label: 'Messages' },
    { id: 'calendar', icon: <CalendarToday />, label: 'Calendar' },
    { id: 'settings', icon: <Settings />, label: 'Settings' }
  ];

  const connections = [
    { name: 'Alyssa Gutierrez', role: 'Senior Product Manager', company: 'Microsoft', tags: ['Tech', 'FinTech', 'Health Tech'] },
    { name: 'Lindon Acre', role: 'Public Relations Officer', company: 'Greenlight PR', tags: ['Communications', 'Startups', 'Invest'] },
    { name: 'Lisa Baytree', role: 'Doctor of General Medicine', company: 'Avanta Health', tags: ['Tech', 'Health Tech', 'Finance'] }
  ];

  const renderMainContent = () => {
    if (selectedTab === 'chat') {
        return <EnhancedAIChat />;
    }
  
    if (selectedTab === 'members') {
        return <Members />;
    }
  
    if (selectedTab === 'events') {
        return <Events />;
    }

    if (selectedTab === 'analytics') {
        return <EngagementDashboard />;
    }

    return (
      <Box sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Today ↗
            </Typography>
            <Chip label="Admin View" color="primary" size="small" />
        </Box>
          <Typography variant="body1" sx={{ color: '#64748b', mb: 3 }}>
            Here's a recap of your membership objectives, goals and activities to help get your day started.
          </Typography>
          
          {/* Parsley AI Widget */}
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none', backgroundColor: '#f8fafc', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '50%', 
                    backgroundColor: '#3b82f6', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mr: 2
                  }}>
                    <Chat sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                      🌿 Ask Parsley AI
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      Your AI assistant is here to help with insights and recommendations
                    </Typography>
                  </Box>
                </Box>
                <Button 
                  variant="contained" 
                  onClick={() => setSelectedTab('chat')}
                  sx={{ borderRadius: 2 }}
                >
                  Open Full Chat →
                </Button>
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Ask Parsley anything about your workspace..."
                  size="small"
                  onClick={() => setSelectedTab('chat')}
                  sx={{ 
                    backgroundColor: 'white',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      cursor: 'pointer'
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search fontSize="small" sx={{ color: '#64748b' }} />
                      </InputAdornment>
                    ),
                    readOnly: true
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} lg={8}>
            <Grid container spacing={3}>
              {/* Member Engagement */}
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Member Engagement</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', mb: 2, display: 'block' }}>
                      Updated Just Now
                    </Typography>
                    <Box sx={{ backgroundColor: '#f8fafc', borderRadius: 2, p: 2, mb: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>High Priority Members</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        3 members require immediate attention for renewal risk...
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="contained">Review Members</Button>
                      <Button size="small" variant="text">View Analytics</Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Event Performance */}
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Event Performance</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', mb: 2, display: 'block' }}>
                      Q4 2024 Analysis
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      {['95%', '87%', '92%', '89%', '94%'].map((score, index) => (
                        <Box key={index} sx={{ 
                          width: 40, 
                          height: 40, 
                          borderRadius: '50%', 
                          backgroundColor: '#3b82f6', 
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                          fontWeight: 600
                        }}>
                          {score}
                        </Box>
                      ))}
                    </Box>
                    
                    <Typography variant="caption" sx={{ color: '#64748b', mb: 1, display: 'block' }}>
                      Member Satisfaction Rate: 92%
                    </Typography>
                    
                    <LinearProgress variant="determinate" value={92} sx={{ mb: 2, height: 8, borderRadius: 4 }} />
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="contained">View Details</Button>
                      <Button size="small" variant="text">Export Report</Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* AI Analytics */}
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          Membership Analytics 
                          <Chip label="AI-POWERED" size="small" sx={{ ml: 1, backgroundColor: '#dbeafe', color: '#1d4ed8' }} />
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                          AI-generated insights about member engagement and networking opportunities
                        </Typography>
                      </Box>
                      <IconButton size="small">
                        <MoreVert />
                      </IconButton>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#ef4444' }}>23</Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>At Risk</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#f59e0b' }}>156</Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>Active Members</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#10b981' }}>89%</Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>Engagement</Typography>
                      </Box>
                    </Box>

                    {/* Member categories */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                      {['New Members', 'Active Networkers', 'Event Attendees', 'Content Creators', 'Mentors', 'Industry Leaders'].map((category, index) => (
                        <Box key={category} sx={{ textAlign: 'center', flex: 1 }}>
                          <Box sx={{ 
                            height: 60, 
                            backgroundColor: '#f1f5f9', 
                            borderRadius: 1, 
                            mb: 1,
                            position: 'relative',
                            overflow: 'hidden'
                          }}>
                            <Box sx={{ 
                              position: 'absolute', 
                              bottom: 0, 
                              width: '100%', 
                              height: `${30 + index * 10}%`, 
                              backgroundColor: index % 2 === 0 ? '#10b981' : '#3b82f6',
                              borderRadius: '4px 4px 0 0'
                            }} />
                          </Box>
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#64748b' }}>
                            {category}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Right Sidebar */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>🔗 Connections</Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>1st Degree 15 Results</Typography>
                </Box>
                
                <TextField
                  size="small"
                  placeholder="Search members..."
                  fullWidth
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />

                {connections.map((connection, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ width: 40, height: 40, mr: 2, backgroundColor: '#3b82f6' }}>
                        {connection.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {connection.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          {connection.role}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                          {connection.company}
                        </Typography>
                      </Box>
                      <IconButton size="small">
                        <LinkedIn fontSize="small" />
                      </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {connection.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                      ))}
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>📅 Upcoming Events</Typography>
                <Box sx={{ backgroundColor: '#f0fdf4', borderRadius: 2, p: 2, mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Dec 8th: AI in Banking Workshop</Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', mb: 1, display: 'block' }}>
                    Presenter: Liam Drake, CEO of Draybe Dynamics
                  </Typography>
                  <Button size="small" variant="contained">Register</Button>
                </Box>
                <Box sx={{ backgroundColor: '#fef3c7', borderRadius: 2, p: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Dec 15th: Networking Mixer</Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', mb: 1, display: 'block' }}>
                    Monthly professional networking event
                  </Typography>
                  <Button size="small" variant="outlined">Learn More</Button>
                </Box>
              </CardContent>
            </Card>

            {/* Goals Section */}
            <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Your Goals</Typography>
                <Box sx={{ backgroundColor: '#f0fdf4', borderRadius: 2, p: 2, mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Member Engagement</Typography>
                  <LinearProgress variant="determinate" value={75} sx={{ mb: 1, height: 6, borderRadius: 3 }} />
                  <Typography variant="caption" sx={{ color: '#64748b' }}>75% of quarterly goal</Typography>
                </Box>
                <Box sx={{ backgroundColor: '#e0f2fe', borderRadius: 2, p: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Event Attendance</Typography>
                  <LinearProgress variant="determinate" value={60} sx={{ mb: 1, height: 6, borderRadius: 3 }} />
                  <Typography variant="caption" sx={{ color: '#64748b' }}>60% of quarterly goal</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Left Sidebar */}
      <Box sx={{ width: 280, backgroundColor: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
            🌿 Parsley
          </Typography>
        </Box>
        
        <Box sx={{ flex: 1, p: 2 }}>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, px: 2, mb: 1, display: 'block' }}>
            Navigate
          </Typography>
          <List sx={{ mb: 3 }}>
            {sidebarItems.map((item) => (
              <ListItemButton
                key={item.id}
                selected={selectedTab === item.id}
                onClick={() => setSelectedTab(item.id)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: '#f1f5f9',
                    '& .MuiListItemIcon-root': { color: '#3b82f6' }
                  }
                }}
              >
                <Box sx={{ mr: 2, color: '#64748b', minWidth: 'auto' }}>{item.icon}</Box>
                <ListItemText primary={item.label} sx={{ '& .MuiTypography-root': { fontSize: '0.875rem', fontWeight: 500 } }} />
              </ListItemButton>
            ))}
          </List>

          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, px: 2, mb: 1, display: 'block' }}>
            Workspaces
          </Typography>
          <List>
            {['Member Management', 'Event Analytics', 'AI Insights'].map((workspace) => (
              <ListItemButton key={workspace} sx={{ borderRadius: 2, mb: 0.5, py: 0.5 }}>
                <ListItemText 
                  primary={workspace} 
                  sx={{ '& .MuiTypography-root': { fontSize: '0.8rem', color: '#64748b' } }} 
                />
              </ListItemButton>
            ))}
          </List>
        </Box>

        <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
          {bottomItems.map((item) => (
            <ListItemButton key={item.id} sx={{ borderRadius: 2, mb: 0.5 }}>
              <Box sx={{ mr: 2, color: '#64748b', minWidth: 'auto' }}>{item.icon}</Box>
              <ListItemText primary={item.label} sx={{ '& .MuiTypography-root': { fontSize: '0.875rem' } }} />
            </ListItemButton>
          ))}
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {renderMainContent()}
      </Box>
    </Box>
  );
};

export default ModernDashboard;