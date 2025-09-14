// src/components/rag/RAGChat.tsx
import React, { useState } from 'react';
import {
  Box,
  Alert,
  Typography,
  TextField,
  Button,
  Paper,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent
} from '@mui/material';
import { Send, ExpandMore, AutoFixHigh, Source } from '@mui/icons-material';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: DocumentSource[];
}

interface DocumentSource {
  fileName: string;
  snippet: string;
  relevanceScore: number;
}

// Demo knowledge base - in production this would come from Firestore
const DEMO_KNOWLEDGE_BASE = [
  {
    id: 'handbook_1',
    fileName: 'Employee Handbook.pdf',
    chunks: [
      'Remote work policy allows employees to work from home up to 3 days per week with manager approval.',
      'All employees are entitled to 15 days paid time off per year, increasing to 20 days after 3 years.',
      'Company provides health insurance with 80% premium coverage for employees and 60% for dependents.',
      'Professional development budget of $2000 per employee annually for conferences and training.'
    ]
  },
  {
    id: 'policies_1', 
    fileName: 'IT Security Policies.docx',
    chunks: [
      'All company devices must use two-factor authentication and encrypted hard drives.',
      'Employees must use VPN when accessing company systems from external networks.',
      'Password requirements: minimum 12 characters with uppercase, lowercase, numbers and symbols.',
      'Software installations require IT approval and must be from approved vendor list.'
    ]
  },
  {
    id: 'procedures_1',
    fileName: 'Onboarding Procedures.txt', 
    chunks: [
      'New employee orientation takes place during the first week and includes IT setup.',
      'HR conducts benefits enrollment meeting within 30 days of start date.',
      'Each new hire is assigned a buddy for their first 90 days.',
      'Performance review process begins after 6 months with quarterly check-ins.'
    ]
  }
];

const RAGChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '🔍 **RAG Demo Mode Active!** I now have access to your organization\'s knowledge base including Employee Handbook, IT Security Policies, and Onboarding Procedures. Ask me anything about company policies!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const searchKnowledgeBase = (query: string): DocumentSource[] => {
    const queryWords = query.toLowerCase().split(' ');
    const results: DocumentSource[] = [];

    DEMO_KNOWLEDGE_BASE.forEach(doc => {
      doc.chunks.forEach(chunk => {
        const chunkLower = chunk.toLowerCase();
        let score = 0;
        
        queryWords.forEach(word => {
          if (chunkLower.includes(word)) {
            score += 1;
          }
        });

        if (score > 0) {
          results.push({
            fileName: doc.fileName,
            snippet: chunk,
            relevanceScore: score / queryWords.length
          });
        }
      });
    });

    return results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3); // Top 3 most relevant chunks
  };

  const generateRAGResponse = async (query: string, sources: DocumentSource[]): Promise<string> => {
    if (sources.length === 0) {
      return "I don't have specific information about that in the knowledge base. This is a demo system with sample HR and IT policies. Try asking about:\n\n• Remote work policies\n• Time off and benefits\n• IT security requirements\n• Onboarding procedures";
    }

    const context = sources.map(source => source.snippet).join('\n\n');
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate contextual response based on the sources
    let response = "Based on your organization's documents:\n\n";

    if (query.toLowerCase().includes('remote work') || query.toLowerCase().includes('work from home')) {
      response += "**Remote Work Policy**: " + sources.find(s => s.snippet.includes('Remote work'))?.snippet;
    } else if (query.toLowerCase().includes('time off') || query.toLowerCase().includes('vacation') || query.toLowerCase().includes('pto')) {
      response += "**Time Off Policy**: " + sources.find(s => s.snippet.includes('time off'))?.snippet;
    } else if (query.toLowerCase().includes('security') || query.toLowerCase().includes('password') || query.toLowerCase().includes('vpn')) {
      response += "**Security Requirements**: " + sources.find(s => s.snippet.includes('Password') || s.snippet.includes('VPN'))?.snippet;
    } else if (query.toLowerCase().includes('onboarding') || query.toLowerCase().includes('new hire') || query.toLowerCase().includes('orientation')) {
      response += "**Onboarding Process**: " + sources.find(s => s.snippet.includes('orientation') || s.snippet.includes('new hire'))?.snippet;
    } else {
      response += sources[0].snippet;
    }

    response += "\n\n*This response was generated using Retrieval-Augmented Generation (RAG) from your knowledge base.*";

    return response;
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
      // Search knowledge base
      const relevantSources = searchKnowledgeBase(currentInput);
      
      // Generate response
      const response = await generateRAGResponse(currentInput, relevantSources);

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        sources: relevantSources,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('RAG error:', error);
      
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. In a production system, this would connect to your actual document knowledge base.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      <Alert severity="success" sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoFixHigh />
          <strong>RAG Demo:</strong> Connected to sample knowledge base (3 documents, 12 chunks)
        </Box>
      </Alert>

      {/* Demo Knowledge Base Status */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="body2">📁 Knowledge Base Contents</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {DEMO_KNOWLEDGE_BASE.map((doc) => (
              <Chip 
                key={doc.id}
                label={`${doc.fileName} (${doc.chunks.length} chunks)`}
                size="small"
                color="primary"
              />
            ))}
          </Box>
          <Typography variant="caption" color="text.secondary">
            Try asking: "What's the remote work policy?" or "How many vacation days do I get?" or "What are the password requirements?"
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Messages Area */}
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto', 
        mb: 2, 
        border: 1, 
        borderColor: 'divider', 
        borderRadius: 1,
        p: 1
      }}>
        {messages.map((message, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                backgroundColor: message.role === 'user' 
                  ? 'primary.light' 
                  : 'success.light',
                color: message.role === 'user' ? 'primary.contrastText' : 'text.primary',
                ml: message.role === 'user' ? 4 : 0,
                mr: message.role === 'user' ? 0 : 4,
              }}
            >
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {message.content}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {formatTime(message.timestamp)}
                </Typography>
                
                <Chip 
                  label={message.role === 'user' ? "You" : "RAG Enhanced"} 
                  size="small" 
                  color={message.role === 'user' ? "primary" : "success"} 
                />
              </Box>

              {/* Sources */}
              {message.sources && message.sources.length > 0 && (
                <Card sx={{ mt: 2, backgroundColor: 'background.paper' }}>
                  <CardContent sx={{ py: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Source fontSize="small" />
                      <Typography variant="subtitle2">Sources Used:</Typography>
                    </Box>
                    {message.sources.map((source, idx) => (
                      <Box key={idx} sx={{ mb: 1 }}>
                        <Typography variant="caption" color="primary">
                          📄 {source.fileName} (Relevance: {(source.relevanceScore * 100).toFixed(0)}%)
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                          "{source.snippet}"
                        </Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              )}
            </Paper>
          </Box>
        ))}
        
        {loading && (
          <Paper sx={{ p: 2, backgroundColor: 'action.hover' }}>
            <Typography variant="body2" color="text.secondary">
              🔍 Searching knowledge base and generating contextual response...
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Input Area */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about company policies, procedures, or benefits..."
          disabled={loading}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <Button
          variant="contained"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          sx={{ minWidth: 'fit-content' }}
        >
          <Send />
        </Button>
      </Box>
    </Box>
  );
};

export default RAGChat;