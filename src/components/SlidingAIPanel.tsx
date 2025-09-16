import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Slide,
  Paper,
  useTheme,
  useMediaQuery,
  Divider
} from '@mui/material';
import { 
  AutoAwesome, 
  ChevronLeft, 
  ChevronRight,
  Psychology 
} from '@mui/icons-material';
import SmartAIChat from './ContextAwareAIChat';

interface SlidingAIPanelProps {
  currentPage: string;
  pageData?: any;
  onNavigate?: (destination: string, data?: any) => void;
  onCreateEvent?: (eventData: any) => void;
  onCreateInitiative?: (initiativeData: any) => void;
  onCreateActivity?: (activityData: any) => void;
}

const SlidingAIPanel: React.FC<SlidingAIPanelProps> = ({
  currentPage,
  pageData,
  onNavigate,
  onCreateEvent,
  onCreateInitiative,
  onCreateActivity
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigate = (destination: string, data?: any) => {
    if (onNavigate) {
      onNavigate(destination, data);
    }
    console.log(`AI Navigation: ${destination}`, data);
  };

  const handleCreateEvent = (eventData: any) => {
    if (onCreateEvent) {
      onCreateEvent(eventData);
    }
    console.log('AI Creating Event:', eventData);
    alert(`Created event: "${eventData.name}" for ${eventData.targetCount || 'members'} based on ${eventData.basedOnPage} page data.`);
  };

  const handleCreateInitiative = (initiativeData: any) => {
    if (onCreateInitiative) {
      onCreateInitiative(initiativeData);
    }
    console.log('AI Creating Initiative:', initiativeData);
    alert(`Launched initiative: "${initiativeData.name}" targeting ${initiativeData.targetMembers} members from ${initiativeData.scope} context.`);
  };

  const handleCreateActivity = (activityData: any) => {
    if (onCreateActivity) {
      onCreateActivity(activityData);
    }
    console.log('AI Creating Activity:', activityData);
    alert(`Set up activity: "${activityData.type}" in ${activityData.context} context.`);
  };

  return (
    <>
      {/* Toggle Button - Always Visible */}
      <Box
        sx={{
          position: 'fixed',
          right: isOpen ? (isMobile ? 0 : 400) : 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1100,
          transition: 'right 0.3s ease'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            borderRadius: isOpen ? '8px 0 0 8px' : '8px 0 0 8px',
            backgroundColor: '#8b5cf6',
            color: 'white',
            overflow: 'hidden'
          }}
        >
          <IconButton
            onClick={togglePanel}
            sx={{
              color: 'white',
              borderRadius: 0,
              p: 2,
              '&:hover': {
                backgroundColor: '#7c3aed'
              }
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
              {isOpen ? <ChevronRight /> : <ChevronLeft />}
              <AutoAwesome sx={{ fontSize: 16 }} />
              {!isOpen && (
                <Typography variant="caption" sx={{ fontSize: '0.6rem', writingMode: 'vertical-rl' }}>
                  AI
                </Typography>
              )}
            </Box>
          </IconButton>
        </Paper>
      </Box>

      {/* Sliding Panel */}
      <Slide direction="left" in={isOpen} mountOnEnter unmountOnExit>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            right: 0,
            top: 0,
            bottom: 0,
            width: isMobile ? '100%' : 400,
            zIndex: 1050,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
            borderLeft: '1px solid #e2e8f0'
          }}
        >
          {/* Panel Header */}
          <Box
            sx={{
              p: 3,
              backgroundColor: '#8b5cf6',
              color: 'white',
              borderBottom: '1px solid #7c3aed'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Psychology sx={{ fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Parsley AI
                </Typography>
              </Box>
              <IconButton
                onClick={togglePanel}
                size="small"
                sx={{ 
                  color: 'white',
                  '&:hover': { backgroundColor: '#7c3aed' }
                }}
              >
                <ChevronRight />
              </IconButton>
            </Box>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Smart assistant with contextual awareness
            </Typography>
            <Box sx={{ 
              mt: 1, 
              p: 1, 
              backgroundColor: '#7c3aed', 
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                backgroundColor: '#10b981',
                animation: 'pulse 2s infinite'
              }} />
              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                Active on {currentPage} page
              </Typography>
            </Box>
          </Box>

          {/* AI Chat Content */}
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <SmartAIChat
              context={{
                currentPage,
                pageData,
                userRole: 'admin'
              }}
              onNavigate={handleNavigate}
              onCreateEvent={handleCreateEvent}
              onCreateInitiative={handleCreateInitiative}
              onCreateActivity={handleCreateActivity}
              isWidget={false}
            />
          </Box>

          {/* Panel Footer */}
          <Box sx={{ 
            p: 2, 
            backgroundColor: '#f8fafc', 
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography variant="caption" sx={{ color: '#64748b', textAlign: 'center' }}>
              AI assistant with real-time data access
            </Typography>
          </Box>
        </Paper>
      </Slide>

      {/* Backdrop for Mobile */}
      {isMobile && isOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1040
          }}
          onClick={togglePanel}
        />
      )}

      {/* CSS for animations */}
      <style>
        {`
          @keyframes pulse {
            0% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
            100% {
              opacity: 1;
            }
          }
        `}
      </style>
    </>
  );
};

export default SlidingAIPanel;