import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
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
  Paper
} from '@mui/material';
import { TrendingUp, Search, People, Lightbulb } from '@mui/icons-material';

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

const SearchAnalytics: React.FC = () => {
  const [searchTrends, setSearchTrends] = useState<SearchTrend[]>([]);
  const [popularTopics, setPopularTopics] = useState<PopularTopic[]>([]);

  useEffect(() => {
    // Sample search analytics data
    const sampleTrends: SearchTrend[] = [
      { query: 'AI product strategy', count: 45, trend: 'up', category: 'expertise' },
      { query: 'kubernetes best practices', count: 32, trend: 'up', category: 'expertise' },
      { query: 'fintech partnerships', count: 28, trend: 'stable', category: 'expertise' },
      { query: 'digital transformation', count: 23, trend: 'up', category: 'expertise' },
      { query: 'cloud architecture', count: 19, trend: 'down', category: 'expertise' },
      { query: 'blockchain regulations', count: 16, trend: 'stable', category: 'expertise' },
      { query: 'product management', count: 34, trend: 'up', category: 'member' },
      { query: 'startup mentoring', count: 21, trend: 'up', category: 'member' }
    ];

    const sampleTopics: PopularTopic[] = [
      { topic: 'Artificial Intelligence', searches: 89, members: 12, growth: 25 },
      { topic: 'Cloud Computing', searches: 67, members: 8, growth: 15 },
      { topic: 'Financial Technology', searches: 54, members: 6, growth: 35 },
      { topic: 'Digital Transformation', searches: 43, members: 9, growth: 18 },
      { topic: 'Product Strategy', searches: 38, members: 7, growth: 22 }
    ];

    setSearchTrends(sampleTrends);
    setPopularTopics(sampleTopics);
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

  return (
    <Box sx={{ p: 4, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          Search Analytics
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          Understand what your community is searching for and identify trending topics
        </Typography>
      </Box>

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
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: '#10b981', mb: 1 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#10b981' }}>
                23%
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Growth vs Last Week
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <People sx={{ fontSize: 40, color: '#f59e0b', mb: 1 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                42
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Active Searchers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Lightbulb sx={{ fontSize: 40, color: '#8b5cf6', mb: 1 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#8b5cf6' }}>
                8
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Trending Topics
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Popular Search Terms */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                Trending Search Terms
              </Typography>
              
              <List>
                {searchTrends.slice(0, 8).map((trend, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 1 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" sx={{ flex: 1, fontWeight: 500 }}>
                            {trend.query}
                          </Typography>
                          <Chip 
                            label={trend.category} 
                            size="small"
                            sx={{ 
                              backgroundColor: getCategoryColor(trend.category) + '20',
                              color: getCategoryColor(trend.category),
                              fontSize: '0.7rem'
                            }}
                          />
                          <Typography variant="body2" sx={{ minWidth: 60, textAlign: 'right' }}>
                            {getTrendIcon(trend.trend)} {trend.count}
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

        {/* Popular Topics */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                Popular Topics
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Topic</TableCell>
                      <TableCell align="right">Searches</TableCell>
                      <TableCell align="right">Members</TableCell>
                      <TableCell align="right">Growth</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {popularTopics.map((topic, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {topic.topic}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">{topic.searches}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">{topic.members}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={`+${topic.growth}%`}
                            size="small"
                            sx={{ 
                              backgroundColor: '#10b981',
                              color: 'white',
                              fontSize: '0.7rem'
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Search Insights */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                Key Insights
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, backgroundColor: '#dbeafe', borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#1e40af', fontWeight: 600 }}>
                      Rising Interest
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#1e40af' }}>
                      AI product strategy searches up 45% this week. Consider hosting an AI workshop.
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, backgroundColor: '#dcfce7', borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#166534', fontWeight: 600 }}>
                      Expert Gap
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#166534' }}>
                      High demand for FinTech expertise but only 6 expert members. Recruit more experts.
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, backgroundColor: '#fef3c7', borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#92400e', fontWeight: 600 }}>
                      Networking Opportunity
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#92400e' }}>
                      34 searches for product management. Connect Sarah Chen with other PMs.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchAnalytics;