import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';
import { 
  TrendingUp, 
  Search, 
  People, 
  Lightbulb, 
  Psychology,
  AutoAwesome,
  Close,
  Analytics,
  NetworkCheck,
  Groups
} from '@mui/icons-material';

interface SearchTrend {
  query: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
  category: 'expertise' | 'member' | 'content' | 'general';
}

interface PopularTopic {
  topic: string;
  searches: number;
  members: number;
  growth: number;
}

interface AIInsight {
  id: string;
  type: 'opportunity' | 'gap' | 'trend';
  title: string;
  description: string;
  actionable: boolean;
  suggestions: string[];
}

interface SearchAnalyticsProps {
  onNavigateToWorkspace?: () => void;
  onNavigateToNetwork?: () => void;
  onNavigateToAI?: () => void;
}

const SearchAnalytics: React.FC<SearchAnalyticsProps> = ({ 
  onNavigateToWorkspace, 
  onNavigateToNetwork, 
  onNavigateToAI 
}) => {
  const [searchTrends, setSearchTrends] = useState<SearchTrend[]>([]);
  const [popularTopics, setPopularTopics] = useState<PopularTopic[]>([]);
  const [aiInsights, setAIInsights] = useState<AIInsight[]>([]);
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [weeklySpike, setWeeklySpike] = useState<boolean>(true);

  useEffect(() => {
    // Sample search analytics data with more realistic trends
    const sampleTrends: SearchTrend[] = [
      { query: 'AI product strategy', count: 45, trend: 'up', category: 'expertise' },
      { query: 'machine learning implementation', count: 38, trend: 'up', category: 'expertise' },
      { query: 'kubernetes best practices', count: 32, trend: 'up', category: 'expertise' },
      { query: 'fintech partnerships', count: 28, trend: 'stable', category: 'expertise' },
      { query: 'digital transformation', count: 23, trend: 'up', category: 'expertise' },
      { query: 'cloud architecture', count: 19, trend: 'down', category: 'expertise' },
      { query: 'blockchain regulations', count: 16, trend: 'stable', category: 'expertise' },
      { query: 'product management mentoring', count: 34, trend: 'up', category: 'member' },
      { query: 'startup advisor networking', count: 21, trend: 'up', category: 'member' },
      { query: 'senior software engineer', count: 29, trend: 'up', category: 'member' }
    ];

    const sampleTopics: PopularTopic[] = [
      { topic: 'Artificial Intelligence', searches: 89, members: 12, growth: 45 },
      { topic: 'Machine Learning', searches: 73, members: 8, growth: 38 },
      { topic: 'Cloud Computing', searches: 67, members: 15, growth: 15 },
      { topic: 'Financial Technology', searches: 54, members: 6, growth: 35 },
      { topic: 'Digital Transformation', searches: 43, members: 9, growth: 18 },
      { topic: 'Product Strategy', searches: 38, members: 7, growth: 22 }
    ];

    const sampleInsights: AIInsight[] = [
      {
        id: '1',
        type: 'trend',
        title: 'Unusual AI/ML Query Spike',
        description: '45% increase in AI and Machine Learning related searches this week. Technical skills category showing highest engagement.',
        actionable: true,
        suggestions: [
          'Create AI/ML special interest group',
          'Host "AI for Product Managers" workshop',
          'Connect blockchain experts with AI researchers'
        ]
      },
      {
        id: '2',
        type: 'gap',
        title: 'FinTech Expert Shortage',
        description: 'High demand for FinTech expertise (54 searches) but only 6 expert members available. Critical skill gap identified.',
        actionable: true,
        suggestions: [
          'Recruit FinTech executives from partner organizations',
          'Create FinTech expertise development program',
          'Partner with financial institutions for expert exchanges'
        ]
      },
      {
        id: '3',
        type: 'opportunity',
        title: 'Product Management Network Expansion',
        description: '23 members searching for product management expertise but only 4 are connected. High networking potential.',
        actionable: true,
        suggestions: [
          'Create "Connect Blockchain Community" initiative',
          'Host product management roundtable',
          'Introduce peer mentoring program'
        ]
      }
    ];

    setSearchTrends(sampleTrends);
    setPopularTopics(sampleTopics);
    setAIInsights(sampleInsights);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'expertise': return '#10b981';
      case 'member': return '#3b82f6';
      case 'content': return '#f59e0b';
      default: return '#64748b';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return '#10b981';
      case 'gap': return '#ef4444';
      case 'trend': return '#3b82f6';
      default: return '#64748b';
    }
  };

  const handleCreateInitiative = (insight: AIInsight) => {
    // Simulate creating initiative
    alert(`Creating initiative: "${insight.suggestions[0]}" - This would integrate with your project management system.`);
    setSelectedInsight(null);
  };

  const handleOpenWorkspace = () => {
    if (onNavigateToWorkspace) {
      onNavigateToWorkspace();
    } else {
      alert('Opening Community Analytics workspace with this week\'s search data loaded...');
    }
  };

  const handleViewNetwork = () => {
    if (onNavigateToNetwork) {
      onNavigateToNetwork();
    } else {
      alert('Navigating to Network view with blockchain community pre-filtered...');
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Priority Alert - Weekly Insights */}
      {weeklySpike && (
        <Alert 
          severity="info" 
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <IconButton size="small" onClick={() => setWeeklySpike(false)}>
              <Close />
            </IconButton>
          }
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoAwesome sx={{ color: '#3b82f6' }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Weekly search insights ready - unusual spike in AI/ML queries (+45%)
            </Typography>
          </Box>
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          Semantic Search Analytics
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          Understand what your community is searching for and identify trending topics
        </Typography>
      </Box>

      {/* AI-Powered Quick Actions */}
      <Card sx={{ mb: 4, borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Psychology sx={{ color: '#8b5cf6' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              AI Assistant Suggestions
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Analytics />}
                onClick={handleOpenWorkspace}
                sx={{ 
                  py: 2, 
                  borderColor: '#3b82f6', 
                  color: '#3b82f6',
                  '&:hover': { backgroundColor: '#eff6ff' }
                }}
              >
                Open Analytics Workspace
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<NetworkCheck />}
                onClick={handleViewNetwork}
                sx={{ 
                  py: 2, 
                  borderColor: '#10b981', 
                  color: '#10b981',
                  '&:hover': { backgroundColor: '#f0fdf4' }
                }}
              >
                View Network Opportunities
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Groups />}
                onClick={() => setSelectedInsight(aiInsights[2])}
                sx={{ 
                  py: 2, 
                  backgroundColor: '#8b5cf6',
                  '&:hover': { backgroundColor: '#7c3aed' }
                }}
              >
                Create Networking Initiative
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Search sx={{ fontSize: 40, color: '#3b82f6', mb: 1 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                287
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Total Searches This Week
              </Typography>
              <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>
                +24% from last week
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: '#10b981', mb: 1 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#10b981' }}>
                45%
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Technical Skills Searches
              </Typography>
              <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>
                Highest category
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <People sx={{ fontSize: 40, color: '#f59e0b', mb: 1 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                30%
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Industry Connections
              </Typography>
              <Typography variant="body2" sx={{ color: '#f59e0b', fontWeight: 600 }}>
                Growing trend
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Lightbulb sx={{ fontSize: 40, color: '#8b5cf6', mb: 1 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#8b5cf6' }}>
                23
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Unconnected Members
              </Typography>
              <Typography variant="body2" sx={{ color: '#ef4444', fontWeight: 600 }}>
                Networking opportunity
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* AI Insights */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                AI-Generated Insights & Recommendations
              </Typography>
              <Grid container spacing={3}>
                {aiInsights.map((insight) => (
                  <Grid item xs={12} md={4} key={insight.id}>
                    <Box 
                      sx={{ 
                        p: 3, 
                        backgroundColor: `${getInsightColor(insight.type)}10`, 
                        borderRadius: 2,
                        borderLeft: `4px solid ${getInsightColor(insight.type)}`,
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: `${getInsightColor(insight.type)}20` }
                      }}
                      onClick={() => setSelectedInsight(insight)}
                    >
                      <Typography variant="subtitle2" sx={{ color: getInsightColor(insight.type), fontWeight: 600, mb: 1 }}>
                        {insight.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                        {insight.description}
                      </Typography>
                      {insight.actionable && (
                        <Chip 
                          label="Action Required" 
                          size="small" 
                          sx={{ backgroundColor: getInsightColor(insight.type), color: 'white' }}
                        />
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Trends Table */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Trending Search Queries
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Query</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Count</TableCell>
                      <TableCell align="center">Trend</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {searchTrends.map((trend, index) => (
                      <TableRow key={index}>
                        <TableCell>{trend.query}</TableCell>
                        <TableCell>
                          <Chip 
                            label={trend.category} 
                            size="small" 
                            sx={{ 
                              backgroundColor: getCategoryColor(trend.category),
                              color: 'white',
                              fontSize: '0.75rem'
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">{trend.count}</TableCell>
                        <TableCell align="center">{getTrendIcon(trend.trend)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Popular Topics
              </Typography>
              <List>
                {popularTopics.map((topic, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={topic.topic}
                      secondary={
                        <Box>
                          <Typography variant="body2" sx={{ color: '#64748b' }}>
                            {topic.searches} searches • {topic.members} members
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={topic.growth} 
                            sx={{ 
                              mt: 1, 
                              backgroundColor: '#e2e8f0',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: topic.growth > 30 ? '#10b981' : '#3b82f6'
                              }
                            }}
                          />
                          <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600, mt: 0.5 }}>
                            +{topic.growth}% growth
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* AI Insight Detail Modal */}
      <Dialog 
        open={!!selectedInsight} 
        onClose={() => setSelectedInsight(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedInsight && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AutoAwesome sx={{ color: getInsightColor(selectedInsight.type) }} />
                {selectedInsight.title}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {selectedInsight.description}
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Recommended Actions:
              </Typography>
              <List>
                {selectedInsight.suggestions.map((suggestion, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={`${index + 1}. ${suggestion}`} />
                  </ListItem>
                ))}
              </List>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedInsight(null)}>Cancel</Button>
              <Button 
                variant="contained" 
                onClick={() => handleCreateInitiative(selectedInsight)}
                sx={{ backgroundColor: getInsightColor(selectedInsight.type) }}
              >
                Create Initiative
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default SearchAnalytics;