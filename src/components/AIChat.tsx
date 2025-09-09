import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m Parsley AI, your membership platform assistant. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      // Add current user message
      conversationHistory.push({
        role: 'user',
        parts: [{ text: currentInput }]
      });

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: `You are Parsley AI, an intelligent assistant for a membership management platform. You help with:
              
              - Member management and engagement strategies
              - Event planning and organization
              - Membership growth and retention
              - Association best practices
              - Technology and platform guidance
              - Analytics and reporting insights
              
              INFORMATION GUIDELINES:
              - You can discuss publicly known information about well-known figures, companies, or organizations from your training data
              - For specific or recent information not in your training, clearly state "I don't have current information about..." and suggest where they might find it
              - NEVER make up or invent facts - if uncertain, be honest about limitations
              - When asked about private organizational details (like internal company founders), explain you don't have access to private data
              - For publicly known founders of major companies or organizations, you can share general biographical information if it's well-established
              - Always distinguish between what you know from training vs. what would require current web search
              
              Example responses:
              - "I don't have current information about [specific person]. You might try searching LinkedIn, company websites, or news sources."
              - "From my training data, [well-known person] is known for... but for current information, I'd recommend checking recent sources."
              
              Be helpful and honest about both your capabilities and limitations.`
            }]
          },
          contents: conversationHistory,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API error details:', errorData);
        throw new Error(`API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I couldn\'t process that request.';
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I'm having trouble connecting right now. Error: ${error.message}. Please check your API key and try again.` 
      }]);
    }
    
    setLoading(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Parsley AI Assistant
      </Typography>
      
      <Paper sx={{ height: 400, p: 2, mb: 2, overflow: 'auto' }}>
        {messages.map((message, index) => (
          <Card key={index} sx={{ mb: 2, bgcolor: message.role === 'user' ? '#e3f2fd' : '#f5f5f5' }}>
            <CardContent>
              <Typography variant="subtitle2" color="primary">
                {message.role === 'user' ? 'You' : 'Parsley AI'}
              </Typography>
              <Typography variant="body1">
                {message.content}
              </Typography>
            </CardContent>
          </Card>
        ))}
        {loading && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Paper>

      <Box display="flex" gap={1}>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about membership management..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          disabled={loading}
        />
        <Button 
          variant="contained" 
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          Send
        </Button>
      </Box>
    </Container>
  );
};

export default AIChat;