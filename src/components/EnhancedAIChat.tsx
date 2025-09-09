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
  CircularProgress,
  Chip,
  Link,
  Alert
} from '@mui/material';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  searchResults?: SearchResult[];
  hasNameConflict?: boolean;
}

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

const EnhancedAIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m Parsley AI with web search capabilities. I can help you find information about people, companies, and membership management topics. How can I assist you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const performWebSearch = async (query: string): Promise<SearchResult[]> => {
    try {
      const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.REACT_APP_GOOGLE_SEARCH_API_KEY}&cx=${process.env.REACT_APP_GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`;
      
      const response = await fetch(searchUrl);
      if (!response.ok) {
        throw new Error(`Search API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.items?.slice(0, 5).map((item: any) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet
      })) || [];
    } catch (error) {
      console.error('Web search error:', error);
      return [];
    }
  };

  const checkForNameConflicts = (searchResults: SearchResult[], query: string): boolean => {
    // Check for conflicting biographical information
    const birthdatePattern = /born|birth|age \d+|\(\d{4}-\d{4}\)|\b19\d{2}\b|\b20\d{2}\b/i;
    const deathPattern = /died|death|passed away|obituary|memorial/i;
    const professionPattern = /CEO|CTO|founder|president|director|professor|engineer/i;
    
    let birthYears: string[] = [];
    let deathMentions = 0;
    let professions: string[] = [];
    let companies: string[] = [];
    
    searchResults.forEach(result => {
      const text = result.title + ' ' + result.snippet;
      
      // Extract birth years
      const yearMatches = text.match(/\b(19|20)\d{2}\b/g);
      if (yearMatches) birthYears.push(...yearMatches);
      
      // Count death mentions
      if (deathPattern.test(text)) deathMentions++;
      
      // Extract professions
      const profMatch = text.match(professionPattern);
      if (profMatch) professions.push(profMatch[0]);
      
      // Extract company names (basic detection)
      const companyMatches = text.match(/at ([A-Z][a-zA-Z\s&]+(?:Inc|Corp|LLC|Company|Corporation)?)/g);
      if (companyMatches) companies.push(...companyMatches);
    });
    
    // Check for conflicts
    const uniqueBirthYears = [...new Set(birthYears)];
    const uniqueProfessions = [...new Set(professions)];
    const uniqueCompanies = [...new Set(companies)];
    
    // Potential conflict indicators
    const hasMultipleBirthYears = uniqueBirthYears.length > 2;
    const hasMixedLifeStatus = deathMentions > 0 && deathMentions < searchResults.length;
    const hasVaryingProfessions = uniqueProfessions.length > 2;
    const hasMultipleCompanies = uniqueCompanies.length > 2;
    
    return hasMultipleBirthYears || hasMixedLifeStatus || hasVaryingProfessions || hasMultipleCompanies;
  };

  const shouldPerformSearch = (userInput: string): boolean => {
    const searchTriggers = [
      'who is', 'what is', 'tell me about', 'find information',
      'search for', 'look up', 'founder', 'ceo', 'company',
      'background', 'biography', 'linkedin', 'profile'
    ];
    
    return searchTriggers.some(trigger => 
      userInput.toLowerCase().includes(trigger)
    );
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      let searchResults: SearchResult[] = [];
      let hasNameConflict = false;
      
      // Perform web search if needed
      if (shouldPerformSearch(currentInput)) {
        searchResults = await performWebSearch(currentInput);
        hasNameConflict = checkForNameConflicts(searchResults, currentInput);
      }

      // Build conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      // Add current user message and search context
      let promptWithSearch = currentInput;
      if (searchResults.length > 0) {
        const searchContext = searchResults.map(result => 
          `Title: ${result.title}\nSnippet: ${result.snippet}\nSource: ${result.link}`
        ).join('\n\n');
        
        promptWithSearch = `User question: ${currentInput}
        
        I found the following information from web search:
        ${searchContext}
        
        ${hasNameConflict ? 
          'WARNING: The search results may contain information about multiple different people with the same name. Please carefully analyze the results and clearly indicate if there appears to be conflicting information that suggests multiple individuals.' : 
          'Please provide a helpful response based on this information and your knowledge.'
        }
        
        Always cite sources when using web search information and be transparent about any potential ambiguities.`;
      }

      conversationHistory.push({
        role: 'user',
        parts: [{ text: promptWithSearch }]
      });

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: `You are Parsley AI, an intelligent assistant for a membership management platform with web search capabilities. You help with:
              
              - Member management and engagement strategies
              - Event planning and organization
              - Membership growth and retention
              - Association best practices
              - Technology and platform guidance
              - Finding information about people and organizations
              
              CRITICAL IDENTITY DISAMBIGUATION RULES:
              - When searching for people by name, be extremely careful about identity conflicts
              - If search results show conflicting biographical information (different birth/death dates, ages, companies, locations), clearly state that multiple people may share this name
              - Ask for clarification about which specific person they're asking about when conflicts exist
              - Never mix information from different people with the same name
              - Clearly separate information by source when presenting potentially conflicting data
              - Use phrases like "Based on [specific source], one Monte Gibbs..." and "According to [different source], another Monte Gibbs..."
              
              When provided with web search results:
              - Use the information to provide accurate, helpful responses
              - Always mention your sources when citing web search results
              - Combine web search information with your general knowledge carefully
              - If search results seem to conflate different people, explicitly point this out
              - If search results seem outdated or incomplete, mention this limitation
              
              Be professional, accurate, and helpful while clearly attributing information sources and identifying potential identity conflicts.`
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
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: aiResponse,
        searchResults: searchResults.length > 0 ? searchResults : undefined,
        hasNameConflict: hasNameConflict
      }]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I'm having trouble connecting right now. Error: ${error.message}. Please try again.` 
      }]);
    }
    
    setLoading(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Parsley AI Assistant with Web Search
      </Typography>
      
      <Paper sx={{ height: 500, p: 2, mb: 2, overflow: 'auto' }}>
        {messages.map((message, index) => (
          <Box key={index} mb={2}>
            {message.hasNameConflict && (
              <Alert severity="warning" sx={{ mb: 1 }}>
                ⚠️ Multiple people with this name detected in search results. Information may be mixed between different individuals.
              </Alert>
            )}
            <Card sx={{ bgcolor: message.role === 'user' ? '#e3f2fd' : '#f5f5f5' }}>
              <CardContent>
                <Typography variant="subtitle2" color="primary">
                  {message.role === 'user' ? 'You' : 'Parsley AI'}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {message.content}
                </Typography>
                {message.searchResults && message.searchResults.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Sources found:
                    </Typography>
                    {message.searchResults.map((result, idx) => (
                      <Box key={idx} mb={1}>
                        <Link href={result.link} target="_blank" rel="noopener">
                          <Chip 
                            label={result.title} 
                            size="small" 
                            variant="outlined" 
                            sx={{ mr: 1, mb: 0.5 }}
                          />
                        </Link>
                        <Typography variant="caption" display="block" color="textSecondary">
                          {result.snippet.substring(0, 100)}...
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
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
          placeholder="Ask me about people, companies, or membership management..."
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
      
      <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
        Pro tip: Ask "Who is [person]?" or "Tell me about [company]" to trigger web search. The system will warn about potential name conflicts.
      </Typography>
    </Container>
  );
};

export default EnhancedAIChat;