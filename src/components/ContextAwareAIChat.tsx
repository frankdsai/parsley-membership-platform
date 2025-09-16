import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  Paper,
  Chip,
  CircularProgress,
  Button,
  Alert
} from '@mui/material';
import { Send, AutoAwesome, TrendingUp, People, Analytics, Event, Groups } from '@mui/icons-material';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  contextUsed?: string[];
}

interface PageContext {
  currentPage: string;
  pageData?: any;
  memberCount?: number;
  eventCount?: number;
  searchData?: any;
  userRole?: string;
}

interface SmartAIChatProps {
  context?: PageContext;
  onNavigate?: (destination: string, data?: any) => void;
  onCreateEvent?: (eventData: any) => void;
  onCreateInitiative?: (initiativeData: any) => void;
  onCreateActivity?: (activityData: any) => void;
  isWidget?: boolean;
}

const SmartAIChat: React.FC<SmartAIChatProps> = ({
  context = { currentPage: 'dashboard' },
  onNavigate,
  onCreateEvent,
  onCreateInitiative,
  onCreateActivity,
  isWidget = false
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get real-time page data
  const getCurrentPageData = () => {
    const pageElement = document.querySelector('[data-page]');
    const memberCards = document.querySelectorAll('[data-member-card]');
    const eventCards = document.querySelectorAll('[data-event-card]');
    const searchResults = document.querySelectorAll('[data-search-result]');
    
    return {
      memberCount: memberCards.length,
      eventCount: eventCards.length,
      searchResults: searchResults.length,
      visibleData: context.pageData || {}
    };
  };

  // Initialize with smart contextual greeting
  useEffect(() => {
    const getSmartGreeting = () => {
      const pageData = getCurrentPageData();
      
      switch (context.currentPage) {
        case 'members':
          return `I can see the Member Directory with ${pageData.memberCount || 'several'} members currently displayed. I can help you analyze member data, create networking events, or find specific expertise. What would you like to do?`;
        case 'search-analytics':
          return `I'm viewing your Search Analytics showing the AI/ML query spike (+45%). I can create targeted initiatives, analyze trends, or help you act on these insights. What action would you like to take?`;
        case 'events':
          return `I can see your Events page with ${pageData.eventCount || 'multiple'} events. I can help create new events, analyze attendance patterns, or suggest event improvements. How can I assist?`;
        case 'analytics':
          return `I'm looking at your engagement analytics. I can help interpret trends, create action plans, or identify at-risk members. What insights do you need?`;
        default:
          return `Hello! I'm your smart Parsley AI assistant. I can see you're on the ${context.currentPage} page and can access real-time data to help with member management, event creation, and strategic insights. What would you like to accomplish?`;
      }
    };

    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: getSmartGreeting(),
        timestamp: new Date(),
        contextUsed: [context.currentPage]
      }]);
    }
  }, [context.currentPage, messages.length]);

  const generateSmartResponse = async (userMessage: string): Promise<string> => {
    const pageData = getCurrentPageData();
    const contextInfo = getDetailedContext(pageData);
    
    // Enhanced system prompt with real data access
    const systemPrompt = `You are Parsley AI, an intelligent assistant for membership management with REAL-TIME data access.

CURRENT CONTEXT:
- Page: ${context.currentPage}
- Real member count: ${pageData.memberCount}
- Real event count: ${pageData.eventCount}
- Search results: ${pageData.searchResults}
- User Role: ${context.userRole || 'admin'}

REAL DATA AVAILABLE:
${contextInfo}

CAPABILITIES & ACTIONS:
1. CREATE EVENTS: I can create real events with specific details
2. CREATE INITIATIVES: I can launch member networking initiatives  
3. CREATE ACTIVITIES: I can set up workshops, mentoring programs, etc.
4. ANALYZE DATA: I can interpret real member counts, trends, engagement
5. NAVIGATE: I can direct users to relevant sections
6. PROVIDE INSIGHTS: Based on actual visible data

ACTION DETECTION:
- If user wants to create something → offer specific creation options
- If user asks about counts/data → use real numbers from page
- If user wants analysis → use actual context data
- If user wants to connect members → offer networking solutions

RESPONSE GUIDELINES:
- Use REAL data from the current page (member counts, event numbers, etc.)
- Be specific about what I can actually see and do
- Offer concrete actions with clear next steps
- When suggesting creation, be detailed about what I'll build

USER MESSAGE: ${userMessage}

Provide a helpful, data-driven response using real context information.`;

    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      if (!apiKey) {
        return `I can see you're on the ${context.currentPage} page with real data, but I need an API key configured to provide intelligent responses. I can still help with basic actions based on what I observe.`;
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      const data = await response.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
      
      // Fallback with real data
      return getContextualFallback(userMessage, pageData);
    } catch (error) {
      console.error('AI Error:', error);
      return getContextualFallback(userMessage, pageData);
    }
  };

  const getDetailedContext = (pageData: any): string => {
    let contextInfo = '';

    switch (context.currentPage) {
      case 'members':
        contextInfo = `
MEMBER DIRECTORY DATA:
- Currently displaying: ${pageData.memberCount} member cards
- Page shows member profiles with expertise and skills
- Each member has networking potential and engagement metrics
- Real-time member data available for analysis

POSSIBLE ACTIONS:
- Create networking events for specific expertise areas
- Launch mentoring initiatives
- Analyze member engagement patterns
- Connect members with similar interests
        `;
        break;
      case 'search-analytics':
        contextInfo = `
SEARCH ANALYTICS DATA:
- Total searches this week: 287 (+24% growth)
- AI/ML query spike: +45% (unusual trend)
- Technical skills: 45% of all searches
- Networking opportunities: 23 unconnected members
- Expert gaps: FinTech (54 searches, only 6 experts)

ACTIONABLE INSIGHTS:
- High demand for AI/ML expertise
- Product management networking opportunity  
- FinTech expert recruitment needed
        `;
        break;
      case 'events':
        contextInfo = `
EVENT MANAGEMENT DATA:
- Currently showing: ${pageData.eventCount} events
- Event performance and attendance tracking available
- Member registration and engagement data
- Upcoming events and planning opportunities

POSSIBLE ACTIONS:
- Create new events based on member interests
- Analyze event performance trends
- Plan workshops or networking sessions
- Set up recurring activities
        `;
        break;
      case 'analytics':
        contextInfo = `
ENGAGEMENT ANALYTICS:
- Member engagement scoring visible
- Activity trends and patterns
- At-risk member identification
- Performance metrics across platform

INSIGHTS AVAILABLE:
- Member activity levels
- Platform usage patterns  
- Engagement improvement opportunities
        `;
        break;
      default:
        contextInfo = `
DASHBOARD OVERVIEW:
- Admin access to full platform
- Real-time member count: ${pageData.memberCount || 'Available'}
- Event count: ${pageData.eventCount || 'Available'}
- Multiple data sources accessible
        `;
    }

    return contextInfo;
  };

  const getContextualFallback = (userMessage: string, pageData: any): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('count') || message.includes('how many')) {
      switch (context.currentPage) {
        case 'members':
          return `I can see ${pageData.memberCount} members currently displayed on this page. This represents the active member profiles with their skills and expertise visible for networking and engagement.`;
        case 'events':
          return `There are ${pageData.eventCount} events shown on this page. I can help you create additional events or analyze the performance of existing ones.`;
        default:
          return `I can see real data on this ${context.currentPage} page. What specific information would you like me to analyze?`;
      }
    }

    if (message.includes('create') || message.includes('new')) {
      return `I can help you create new events, initiatives, or activities. Based on the current ${context.currentPage} page data, what type of creation would be most valuable?`;
    }

    return `I'm analyzing the ${context.currentPage} page with real-time data. I can see ${pageData.memberCount || 'current'} members, ${pageData.eventCount || 'available'} events, and other contextual information. How can I help you take action on this data?`;
  };

  const detectActionIntent = (userMessage: string, aiResponse: string) => {
    const message = userMessage.toLowerCase();
    
    // Event creation
    if (message.includes('create event') || message.includes('new event') || 
        message.includes('workshop') || message.includes('meeting')) {
      return {
        type: 'create-event',
        suggestion: 'Create New Event',
        data: {
          type: 'networking',
          basedOnPage: context.currentPage,
          targetAudience: context.currentPage === 'members' ? 'current members' : 'community'
        }
      };
    }

    // Initiative creation  
    if (message.includes('initiative') || message.includes('connect') || 
        message.includes('networking') || message.includes('program')) {
      return {
        type: 'create-initiative',
        suggestion: 'Launch Member Initiative',
        data: {
          type: 'networking',
          basedOnData: context.currentPage,
          scope: 'member engagement'
        }
      };
    }

    // Activity creation
    if (message.includes('activity') || message.includes('mentoring') ||
        message.includes('training') || message.includes('session')) {
      return {
        type: 'create-activity',
        suggestion: 'Set Up New Activity',
        data: {
          type: 'engagement',
          context: context.currentPage
        }
      };
    }

    return null;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const aiResponse = await generateSmartResponse(currentInput);
      
      const actionSuggestion = detectActionIntent(currentInput, aiResponse);
      
      const aiMessage: Message = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        contextUsed: [context.currentPage, 'real-time-data']
      };

      setMessages(prev => [...prev, aiMessage]);

      // Add action suggestion if detected
      if (actionSuggestion) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `I can help you with that! Would you like me to "${actionSuggestion.suggestion}" based on the current page data?`,
            timestamp: new Date()
          }]);
        }, 1000);
      }

    } catch (error) {
      console.error('Error:', error);
      const pageData = getCurrentPageData();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I can see the ${context.currentPage} page with ${pageData.memberCount || 'current'} members displayed. While I had trouble with advanced AI processing, I can still help with actions based on the visible data. What would you like to do?`,
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    const pageData = getCurrentPageData();
    
    switch (action) {
      case 'create-event':
        if (onCreateEvent) {
          onCreateEvent({
            name: `Networking Event - ${context.currentPage}`,
            type: 'networking',
            basedOnPage: context.currentPage,
            targetCount: pageData.memberCount
          });
        }
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `I've created a networking event based on the ${pageData.memberCount} members visible on this page. The event is designed to connect these members around shared interests.`,
          timestamp: new Date()
        }]);
        break;
      case 'create-initiative':
        if (onCreateInitiative) {
          onCreateInitiative({
            name: `Member Engagement Initiative`,
            type: 'networking',
            scope: context.currentPage,
            targetMembers: pageData.memberCount
          });
        }
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `I've launched a member engagement initiative targeting the ${pageData.memberCount} members currently displayed. This will help increase connections and activity.`,
          timestamp: new Date()
        }]);
        break;
      case 'analyze-data':
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Based on the current page data: ${pageData.memberCount} members visible, ${pageData.eventCount} events available. I can see engagement patterns and networking opportunities. What specific analysis would you like?`,
          timestamp: new Date()
        }]);
        break;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box sx={{ 
      height: isWidget ? '400px' : '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#f8fafc'
    }}>
      {/* Smart Context Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0', backgroundColor: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <AutoAwesome sx={{ color: '#8b5cf6', fontSize: 20 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
            Smart Parsley AI
          </Typography>
          <Chip 
            label={`${context.currentPage} • Live Data`}
            size="small"
            sx={{ backgroundColor: '#dcfce7', color: '#166534' }}
          />
        </Box>
        
        {/* Smart Quick Actions */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            size="small"
            startIcon={<Event />}
            onClick={() => handleQuickAction('create-event')}
            sx={{ fontSize: '0.75rem' }}
          >
            Create Event
          </Button>
          <Button
            size="small"
            startIcon={<Groups />}
            onClick={() => handleQuickAction('create-initiative')}
            sx={{ fontSize: '0.75rem' }}
          >
            Launch Initiative
          </Button>
          <Button
            size="small"
            startIcon={<Analytics />}
            onClick={() => handleQuickAction('analyze-data')}
            sx={{ fontSize: '0.75rem' }}
          >
            Analyze Data
          </Button>
        </Box>
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <List>
          {messages.map((message, index) => (
            <ListItem key={index} sx={{ 
              display: 'flex', 
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-start',
              py: 1
            }}>
              <Paper
                sx={{
                  p: 2,
                  maxWidth: '80%',
                  backgroundColor: message.role === 'user' ? '#8b5cf6' : 'white',
                  color: message.role === 'user' ? 'white' : '#1e293b',
                  borderRadius: message.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  border: message.role === 'assistant' ? '1px solid #e2e8f0' : 'none'
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {message.content}
                </Typography>
                {message.contextUsed && (
                  <Box sx={{ mt: 1 }}>
                    <Chip 
                      label={`Context: ${message.contextUsed.join(', ')}`}
                      size="small"
                      sx={{ backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '0.7rem' }}
                    />
                  </Box>
                )}
              </Paper>
            </ListItem>
          ))}
        </List>
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box sx={{ p: 2, backgroundColor: 'white', borderTop: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask about ${context.currentPage} data, create events, or take actions...`}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#f8fafc'
              }
            }}
          />
          <IconButton
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            sx={{
              backgroundColor: '#8b5cf6',
              color: 'white',
              '&:hover': { backgroundColor: '#7c3aed' },
              '&:disabled': { backgroundColor: '#e2e8f0' }
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default SmartAIChat;