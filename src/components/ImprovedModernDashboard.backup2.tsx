// src/components/ImprovedModernDashboard.tsx
import './styles/dashboard.css';
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Paper
} from '@mui/material';
import {
  Dashboard,
  People,
  Event,
  Search,
  TrendingUp,
  Groups,
  Psychology,
  CalendarToday,
  Mail,
  BusinessCenter,
  Science,
  Settings,
  Logout,
  Close,
  Send
} from '@mui/icons-material';

// Import existing components
import Members from './Members';
import Events from './Events';
import EngagementDashboard from './EngagementDashboard';
import SearchAnalytics from './SearchAnalytics';
import RAGTestingDashboard from './rag/RAGTestingDashboard';
import SmartAIChat from './ContextAwareAIChat';

// Import Firebase auth
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

// Define color palette
const colors = {
  primary: {
    purple: '#8B5CF6',
    purpleDark: '#7C3AED',
    magenta: '#EC4899',
    teal: '#14B8A6'
  },
  system: {
    red: '#EF4444',
    orange: '#F97316',
    green: '#22C55E',
    blue: '#3B82F6'
  },
  neutral: {
    900: '#0F172A',
    800: '#1E293B',
    700: '#334155',
    600: '#475569',
    500: '#64748B',
    400: '#94A3B8',
    300: '#CBD5E1',
    200: '#E2E8F0',
    100: '#F1F5F9',
    50: '#F8FAFC'
  }
};

// Styled Components
const Container = styled(Box)({
  display: 'flex',
  height: '100vh',
  backgroundColor: colors.neutral[50],
  position: 'relative'
});

const Sidebar = styled(Box)({
  width: 280,
  backgroundColor: 'white',
  borderRight: `1px solid ${colors.neutral[200]}`,
  display: 'flex',
  flexDirection: 'column'
});

const Logo = styled(Box)({
  padding: '24px',
  borderBottom: `1px solid ${colors.neutral[200]}`,
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
});

const NavSection = styled(Typography)({
  padding: '16px 12px 8px 12px',
  color: colors.neutral[400],
  fontSize: '11px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
});

const NavItem = styled(Box)<{ active?: boolean }>(({ active }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '10px 20px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  borderRadius: '8px',
  margin: '0 12px 4px 12px',
  color: active ? colors.primary.purple : colors.neutral[500],
  backgroundColor: active ? `${colors.primary.purple}10` : 'transparent',
  position: 'relative',
  '&:hover': {
    backgroundColor: colors.neutral[100],
    color: colors.neutral[800]
  },
  '&::before': active ? {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: 3,
    height: 24,
    backgroundColor: colors.primary.purple,
    borderRadius: '0 3px 3px 0'
  } : {}
}));

const TopBar = styled(Box)({
  height: 64,
  backgroundColor: 'white',
  borderBottom: `1px solid ${colors.neutral[200]}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: '0 32px',
  gap: '16px'
});

const UserInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '8px 16px',
  backgroundColor: colors.neutral[50],
  borderRadius: '12px',
  border: `1px solid ${colors.neutral[200]}`
});

const QuickActionCard = styled(Box)({
  backgroundColor: 'white',
  border: `1px solid ${colors.neutral[200]}`,
  borderRadius: '12px',
  padding: '20px',
  cursor: 'pointer',
  transition: 'all 0.3s',
  textAlign: 'center',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
    borderColor: colors.neutral[300]
  }
});

const MetricCard = styled(Box)<{ color: string }>(({ color }) => ({
  backgroundColor: 'white',
  border: `1px solid ${colors.neutral[200]}`,
  borderRadius: '12px',
  padding: '20px',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    background: color
  }
}));

const AIPanel = styled(Paper)<{ open: boolean }>(({ open }) => ({
  position: 'fixed',
  right: open ? 0 : -400,
  top: 0,
  height: '100vh',
  width: 400,
  boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.1)',
  transition: 'right 0.3s ease',
  zIndex: 1200,
  display: 'flex'
}));

const AIPanelToggle = styled(Box)({
  position: 'absolute',
  left: -48,
  top: '50%',
  transform: 'translateY(-50%)',
  width: 48,
  height: 120,
  background: `linear-gradient(135deg, ${colors.primary.purple}, ${colors.primary.purpleDark})`,
  borderRadius: '8px 0 0 8px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: '-2px 0 12px rgba(139, 92, 246, 0.3)',
  '&:hover': {
    boxShadow: '-4px 0 16px rgba(139, 92, 246, 0.4)'
  }
});

const ImprovedModernDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('feed');
  const [userRole, setUserRole] = useState<'admin' | 'member' | 'team'>('admin');
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [userName, setUserName] = useState('John');

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      setUserRole(storedRole as 'admin' | 'member' | 'team');
    }
  }, []);

  const sidebarItems = [
    { id: 'feed', icon: '📊', label: 'Feed' },
    { id: 'members', icon: '👥', label: 'Members' },
    { id: 'events', icon: '📅', label: 'Events' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
    { id: 'search-analytics', icon: '🔍', label: 'Search Analytics' },
    { id: 'rag-testing', icon: '🧪', label: 'RAG Testing' },
    { id: 'priorities', icon: '📌', label: 'Your Priorities' },
    { id: 'goals', icon: '🎯', label: 'Your Goals' },
    { id: 'review', icon: '📋', label: 'For Review' },
    { id: 'networks', icon: '🌐', label: 'Groups & Networks' }
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderMainContent = () => {
    if (selectedTab === 'members') return <Members />;
    if (selectedTab === 'events') return <Events />;
    if (selectedTab === 'analytics') return <EngagementDashboard />;
    if (selectedTab === 'search-analytics') return <SearchAnalytics />;
    if (selectedTab === 'rag-testing') return <RAGTestingDashboard />;

    // Default Feed View
    return (
      <Box sx={{ p: 4 }}>
        {/* Header */}
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Welcome back, {userName} 👋
        </Typography>
        <Typography variant="body1" sx={{ color: colors.neutral[500], mb: 4 }}>
          Here's what's happening in your membership community today
        </Typography>

        {/* Quick Actions */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 4 }}>
          <QuickActionCard>
            <Box sx={{ 
              width: 48, height: 48, mx: 'auto', mb: 2,
              borderRadius: '12px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              background: `rgba(139, 92, 246, 0.15)`, fontSize: '24px'
            }}>
              📊
            </Box>
            <Typography fontWeight={600} fontSize={14}>View Analytics</Typography>
            <Typography variant="caption" color="text.secondary">Check member engagement</Typography>
          </QuickActionCard>
          
          <QuickActionCard>
            <Box sx={{ 
              width: 48, height: 48, mx: 'auto', mb: 2,
              borderRadius: '12px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              background: `rgba(20, 184, 166, 0.15)`, fontSize: '24px'
            }}>
              ➕
            </Box>
            <Typography fontWeight={600} fontSize={14}>Add Member</Typography>
            <Typography variant="caption" color="text.secondary">Invite new members</Typography>
          </QuickActionCard>
          
          <QuickActionCard>
            <Box sx={{ 
              width: 48, height: 48, mx: 'auto', mb: 2,
              borderRadius: '12px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              background: `rgba(236, 72, 153, 0.15)`, fontSize: '24px'
            }}>
              📅
            </Box>
            <Typography fontWeight={600} fontSize={14}>Create Event</Typography>
            <Typography variant="caption" color="text.secondary">Schedule activities</Typography>
          </QuickActionCard>
          
          <QuickActionCard>
            <Box sx={{ 
              width: 48, height: 48, mx: 'auto', mb: 2,
              borderRadius: '12px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              background: `rgba(59, 130, 246, 0.15)`, fontSize: '24px'
            }}>
              📄
            </Box>
            <Typography fontWeight={600} fontSize={14}>Export Report</Typography>
            <Typography variant="caption" color="text.secondary">Download analytics</Typography>
          </QuickActionCard>
        </Box>

        {/* Metrics */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 4 }}>
          <MetricCard color={`linear-gradient(90deg, ${colors.primary.purple}, ${colors.primary.purpleDark})`}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="caption" sx={{ color: colors.neutral[500], fontSize: '13px', fontWeight: 500 }}>
                Total Members
              </Typography>
              <Chip label="↑ 12%" size="small" sx={{ 
                backgroundColor: `${colors.system.green}20`, 
                color: colors.system.green, 
                fontSize: '11px',
                height: '20px',
                fontWeight: 600
              }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: colors.primary.purple, mb: 1 }}>156</Typography>
            <Typography variant="caption" sx={{ color: colors.neutral[400], fontSize: '12px' }}>Active this month</Typography>
          </MetricCard>
          
          <MetricCard color={`linear-gradient(90deg, ${colors.system.green}, #16A34A)`}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="caption" sx={{ color: colors.neutral[500], fontSize: '13px', fontWeight: 500 }}>
                Engagement Rate
              </Typography>
              <Chip label="↑ 8%" size="small" sx={{ 
                backgroundColor: `${colors.system.green}20`, 
                color: colors.system.green, 
                fontSize: '11px',
                height: '20px',
                fontWeight: 600
              }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: colors.system.green, mb: 1 }}>89%</Typography>
            <Typography variant="caption" sx={{ color: colors.neutral[400], fontSize: '12px' }}>Above target</Typography>
          </MetricCard>
          
          <MetricCard color={`linear-gradient(90deg, ${colors.system.orange}, #EA580C)`}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="caption" sx={{ color: colors.neutral[500], fontSize: '13px', fontWeight: 500 }}>
                Events This Month
              </Typography>
              <Chip label="↑ 2" size="small" sx={{ 
                backgroundColor: `${colors.system.green}20`, 
                color: colors.system.green, 
                fontSize: '11px',
                height: '20px',
                fontWeight: 600
              }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: colors.system.orange, mb: 1 }}>8</Typography>
            <Typography variant="caption" sx={{ color: colors.neutral[400], fontSize: '12px' }}>3 upcoming</Typography>
          </MetricCard>
          
          <MetricCard color={`linear-gradient(90deg, ${colors.system.red}, #DC2626)`}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="caption" sx={{ color: colors.neutral[500], fontSize: '13px', fontWeight: 500 }}>
                At Risk
              </Typography>
              <Chip label="↓ 3" size="small" sx={{ 
                backgroundColor: `${colors.system.red}20`, 
                color: colors.system.red, 
                fontSize: '11px',
                height: '20px',
                fontWeight: 600
              }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: colors.system.red, mb: 1 }}>23</Typography>
            <Typography variant="caption" sx={{ color: colors.neutral[400], fontSize: '12px' }}>Need attention</Typography>
          </MetricCard>
        </Box>

        {/* Activity Feed */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 3 }}>
          <Paper sx={{ p: 3, borderRadius: '12px', border: `1px solid ${colors.neutral[200]}` }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>📊 Recent Activity</Typography>
              <Button size="small" sx={{ color: colors.primary.purple, textTransform: 'none' }}>
                VIEW ALL →
              </Button>
            </Box>
            {/* Activity items would go here */}
          </Paper>
          
          <Paper sx={{ p: 3, borderRadius: '12px', border: `1px solid ${colors.neutral[200]}` }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>⚠️ High Priority Members</Typography>
            <Typography variant="body2" sx={{ color: colors.system.red }} gutterBottom>
              3 need attention
            </Typography>
            {/* Priority members would go here */}
          </Paper>
        </Box>
      </Box>
    );
  };

  return (
    <Container>
      {/* Sidebar */}
      <Sidebar>
        <Logo>
          <Typography fontSize={28}>🌿</Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, color: colors.neutral[800] }}>
            Parsley
          </Typography>
        </Logo>
        
        <Box sx={{ flex: 1, p: 2 }}>
          <NavSection>NAVIGATE</NavSection>
          {sidebarItems.map((item) => (
            <NavItem 
              key={item.id} 
              active={selectedTab === item.id}
              onClick={() => setSelectedTab(item.id)}
            >
              <Box sx={{ mr: 1.5, fontSize: '20px' }}>{item.icon}</Box>
              <Typography sx={{ 
                fontSize: '14px', 
                fontWeight: selectedTab === item.id ? 500 : 400
              }}>
                {item.label}
              </Typography>
            </NavItem>
          ))}
        </Box>

        <Box sx={{ p: 2, borderTop: `1px solid ${colors.neutral[200]}` }}>
          <NavItem>
            <Box sx={{ mr: 1.5, fontSize: '20px' }}>💬</Box>
            <Typography sx={{ fontSize: '14px' }}>Messages</Typography>
          </NavItem>
          <NavItem>
            <Box sx={{ mr: 1.5, fontSize: '20px' }}>📅</Box>
            <Typography sx={{ fontSize: '14px' }}>Calendar</Typography>
          </NavItem>
          <NavItem>
            <Box sx={{ mr: 1.5, fontSize: '20px' }}>⚙️</Box>
            <Typography sx={{ fontSize: '14px' }}>Settings</Typography>
          </NavItem>
        </Box>
      </Sidebar>

      {/* Main Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <TopBar>
          <UserInfo>
            <Avatar sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: colors.primary.purple,
              fontSize: '14px'
            }}>
              J
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600}>{userName} Doe</Typography>
              <Typography variant="caption" color="text.secondary">Host Organization</Typography>
            </Box>
            <Chip 
              label="👑 Admin"
              size="small"
              sx={{
                background: `linear-gradient(135deg, ${colors.primary.purple}, ${colors.primary.purpleDark})`,
                color: 'white',
                fontWeight: 600,
                fontSize: '12px'
              }}
            />
          </UserInfo>
          <IconButton 
            onClick={handleLogout}
            sx={{ 
              border: `1px solid ${colors.neutral[200]}`,
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#fee2e2',
                borderColor: colors.system.red
              }
            }}
          >
            <Logout fontSize="small" />
          </IconButton>
        </TopBar>

        {/* Content Area */}
        <Box sx={{ flex: 1, overflow: 'auto', backgroundColor: colors.neutral[50] }}>
          {renderMainContent()}
        </Box>
      </Box>

      {/* AI Panel */}
      <AIPanel open={aiPanelOpen} elevation={0}>
        <AIPanelToggle onClick={() => setAiPanelOpen(!aiPanelOpen)}>
          <Typography fontSize={24}>🌿</Typography>
          <Typography sx={{ 
            color: 'white', 
            fontSize: '11px', 
            fontWeight: 600,
            writingMode: 'vertical-rl',
            textOrientation: 'mixed'
          }}>
            AI Assistant
          </Typography>
        </AIPanelToggle>

        <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography fontSize={20}>🌿</Typography>
              <Typography variant="h6" fontWeight={600}>Parsley AI Assistant</Typography>
            </Box>
            <IconButton onClick={() => setAiPanelOpen(false)} size="small">
              <Close />
            </IconButton>
          </Box>

          <SmartAIChat
            context={{
              currentPage: selectedTab,
              userRole
            }}
            isWidget={true}
          />
        </Box>
      </AIPanel>
    </Container>
  );
};

export default ImprovedModernDashboard;