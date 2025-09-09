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
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are Parsley AI, an assistant for a membership management platform. Help with membership-related questions. User question: ${input}`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I couldn\'t process that request.';
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I\'m having trouble connecting right now. Please check your API key and try again.' 
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