// src/components/ImprovedModernDashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  IconButton,
  Paper
} from '@mui/material';
import {
  Logout,
  Close
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
      <Box sx={{ p: 4, backgroundColor: '#F8FAFC', minHeight: 'calc(100vh - 64px)' }}>
        {/* Header */}
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#1E293B' }}>
          Welcome back, {userName} 👋
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748B', mb: 4 }}>
          Here's what's happening in your membership community today
        </Typography>

        {/* Quick Actions */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 2, 
          mb: 4 
        }}>
          {[
            { icon: '📊', title: 'View Analytics', desc: 'Check member engagement', bg: 'rgba(139, 92, 246, 0.1)' },
            { icon: '➕', title: 'Add Member', desc: 'Invite new members', bg: 'rgba(20, 184, 166, 0.1)' },
            { icon: '📅', title: 'Create Event', desc: 'Schedule activities', bg: 'rgba(236, 72, 153, 0.1)' },
            { icon: '📄', title: 'Export Report', desc: 'Download analytics', bg: 'rgba(59, 130, 246, 0.1)' }
          ].map((action, idx) => (
            <Paper
              key={idx}
              sx={{
                p: 2.5,
                textAlign: 'center',
                cursor: 'pointer',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                transition: 'all 0.3s',
                backgroundColor: 'white',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)'
                }
              }}
              elevation={0}
            >
              <Box sx={{
                width: 48,
                height: 48,
                mx: 'auto',
                mb: 2,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: action.bg,
                fontSize: '24px'
              }}>
                {action.icon}
              </Box>
              <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#1E293B' }}>
                {action.title}
              </Typography>
              <Typography sx={{ fontSize: '12px', color: '#64748B', mt: 0.5 }}>
                {action.desc}
              </Typography>
            </Paper>
          ))}
        </Box>

        {/* Metrics */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 2, 
          mb: 4 
        }}>
          {[
            { label: 'Total Members', value: '156', trend: '↑ 12%', color: '#8B5CF6', trendColor: '#22C55E', subtitle: 'Active this month' },
            { label: 'Engagement Rate', value: '89%', trend: '↑ 8%', color: '#22C55E', trendColor: '#22C55E', subtitle: 'Above target' },
            { label: 'Events This Month', value: '8', trend: '↑ 2', color: '#F97316', trendColor: '#22C55E', subtitle: '3 upcoming' },
            { label: 'At Risk', value: '23', trend: '↓ 3', color: '#EF4444', trendColor: '#EF4444', subtitle: 'Need attention' }
          ].map((metric, idx) => (
            <Paper
              key={idx}
              sx={{
                p: 2.5,
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                backgroundColor: 'white',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: metric.color
                }
              }}
              elevation={0}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography sx={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
                  {metric.label}
                </Typography>
                <Chip
                  label={metric.trend}
                  size="small"
                  sx={{
                    height: '20px',
                    fontSize: '11px',
                    fontWeight: 600,
                    backgroundColor: `${metric.trendColor}15`,
                    color: metric.trendColor,
                    '& .MuiChip-label': { px: 1 }
                  }}
                />
              </Box>
              <Typography sx={{ fontSize: '32px', fontWeight: 700, color: metric.color, lineHeight: 1 }}>
                {metric.value}
              </Typography>
              <Typography sx={{ fontSize: '12px', color: '#94A3B8', mt: 1 }}>
                {metric.subtitle}
              </Typography>
            </Paper>
          ))}
        </Box>

        {/* Activity Feed and Priority Members */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 3 }}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: '12px', 
            border: '1px solid #E2E8F0',
            backgroundColor: 'white'
          }} elevation={0}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#1E293B' }}>
                📊 Recent Activity
              </Typography>
              <Button size="small" sx={{ 
                color: '#8B5CF6', 
                textTransform: 'none',
                fontSize: '14px',
                '&:hover': { backgroundColor: 'rgba(139, 92, 246, 0.04)' }
              }}>
                VIEW ALL →
              </Button>
            </Box>
            <Typography sx={{ color: '#64748B' }}>
              Activity feed will appear here
            </Typography>
          </Paper>

          <Paper sx={{ 
            p: 3, 
            borderRadius: '12px', 
            border: '1px solid #E2E8F0',
            backgroundColor: 'white'
          }} elevation={0}>
            <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#1E293B', mb: 1 }}>
              ⚠️ High Priority Members
            </Typography>
            <Typography sx={{ fontSize: '14px', color: '#EF4444', mb: 2 }}>
              3 need attention
            </Typography>
            <Typography sx={{ color: '#64748B', fontSize: '14px' }}>
              Priority members will appear here
            </Typography>
          </Paper>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', position: 'relative', backgroundColor: '#F8FAFC' }}>
      {/* Sidebar */}
      <Box sx={{
        width: 280,
        backgroundColor: 'white',
        borderRight: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '1px 0 3px rgba(0,0,0,0.04)'
      }}>
        {/* Logo */}
        <Box sx={{
          p: 3,
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5
        }}>
          <Typography sx={{ fontSize: '28px' }}>🌿</Typography>
          <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#1E293B' }}>
            Parsley
          </Typography>
        </Box>

        {/* Navigation */}
        <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
          <Typography sx={{
            px: 1.5,
            py: 1,
            fontSize: '11px',
            fontWeight: 600,
            color: '#94A3B8',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Navigate
          </Typography>
          
          {sidebarItems.map((item) => (
            <Box
              key={item.id}
              onClick={() => setSelectedTab(item.id)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 2,
                py: 1.25,
                mx: 0.5,
                mb: 0.5,
                borderRadius: '8px',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s',
                backgroundColor: selectedTab === item.id ? 'rgba(139, 92, 246, 0.08)' : 'transparent',
                '&:hover': {
                  backgroundColor: selectedTab === item.id ? 'rgba(139, 92, 246, 0.08)' : '#F1F5F9'
                },
                '&::before': selectedTab === item.id ? {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 3,
                  height: 24,
                  backgroundColor: '#8B5CF6',
                  borderRadius: '0 3px 3px 0'
                } : undefined
              }}
            >
              <Box sx={{ 
                mr: 1.5, 
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                width: '24px'
              }}>
                {item.icon}
              </Box>
              <Typography sx={{
                fontSize: '14px',
                fontWeight: selectedTab === item.id ? 500 : 400,
                color: selectedTab === item.id ? '#8B5CF6' : '#475569'
              }}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Bottom Section */}
        <Box sx={{ p: 2, borderTop: '1px solid #E2E8F0' }}>
          {[
            { icon: '💬', label: 'Messages' },
            { icon: '📅', label: 'Calendar' },
            { icon: '⚙️', label: 'Settings' }
          ].map((item) => (
            <Box
              key={item.label}
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 2,
                py: 1.25,
                mx: 0.5,
                mb: 0.5,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { backgroundColor: '#F1F5F9' }
              }}
            >
              <Box sx={{ mr: 1.5, fontSize: '20px', width: '24px' }}>
                {item.icon}
              </Box>
              <Typography sx={{ fontSize: '14px', color: '#475569' }}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Main Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <Box sx={{
          height: 64,
          backgroundColor: 'white',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: 4,
          gap: 2
        }}>
          {/* User Info */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2,
            py: 1,
            backgroundColor: '#F8FAFC',
            borderRadius: '12px',
            border: '1px solid #E2E8F0'
          }}>
            <Avatar sx={{
              width: 32,
              height: 32,
              backgroundColor: '#8B5CF6',
              fontSize: '14px',
              fontWeight: 600
            }}>
              J
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1E293B' }}>
                {userName} Doe
              </Typography>
              <Typography sx={{ fontSize: '12px', color: '#64748B' }}>
                Host Organization
              </Typography>
            </Box>
            <Chip
              label="👑 Admin"
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                color: 'white',
                fontWeight: 600,
                fontSize: '12px',
                border: 'none',
                '& .MuiChip-label': { px: 1.5 }
              }}
            />
          </Box>

          {/* Logout Button */}
          <IconButton
            onClick={handleLogout}
            sx={{
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '8px',
              '&:hover': {
                backgroundColor: '#FEE2E2',
                borderColor: '#EF4444'
              }
            }}
          >
            <Logout sx={{ fontSize: '20px', color: '#64748B' }} />
          </IconButton>
        </Box>

        {/* Content Area */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {renderMainContent()}
        </Box>
      </Box>

      {/* AI Panel */}
      <Paper
        sx={{
          position: 'fixed',
          right: aiPanelOpen ? 0 : -400,
          top: 0,
          height: '100vh',
          width: 400,
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.1)',
          transition: 'right 0.3s ease',
          zIndex: 1200,
          display: 'flex',
          backgroundColor: 'white'
        }}
        elevation={0}
      >
        {/* AI Toggle Tab */}
        <Box
          onClick={() => setAiPanelOpen(!aiPanelOpen)}
          sx={{
            position: 'absolute',
            left: -48,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 48,
            height: 120,
            background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
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
          }}
        >
          <Typography sx={{ fontSize: '24px', mb: 1 }}>🌿</Typography>
          <Typography sx={{
            color: 'white',
            fontSize: '11px',
            fontWeight: 600,
            writingMode: 'vertical-rl',
            textOrientation: 'mixed'
          }}>
            AI Assistant
          </Typography>
        </Box>

        {/* AI Content */}
        <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3,
            pb: 2,
            borderBottom: '1px solid #E2E8F0'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '20px' }}>🌿</Typography>
              <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#1E293B' }}>
                Parsley AI Assistant
              </Typography>
            </Box>
            <IconButton 
              onClick={() => setAiPanelOpen(false)}
              sx={{
                padding: '6px',
                '&:hover': { backgroundColor: '#F1F5F9' }
              }}
            >
              <Close sx={{ fontSize: '20px' }} />
            </IconButton>
          </Box>

          {/* Context Chip */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 1.5,
            mb: 2,
            backgroundColor: 'rgba(59, 130, 246, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <Typography sx={{ fontSize: '14px' }}>📊</Typography>
            <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#0284C7' }}>
              {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Page
            </Typography>
            <Typography sx={{ fontSize: '12px', color: '#64748B' }}>
              • 156 members • 8 events
            </Typography>
          </Box>

          {/* AI Chat */}
          <Box sx={{ flex: 1 }}>
            <SmartAIChat
              context={{
                currentPage: selectedTab,
                userRole
              }}
              isWidget={true}
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ImprovedModernDashboard;