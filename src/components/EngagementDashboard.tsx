import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Chip, 
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  Warning, 
  CheckCircle,
  Remove
} from '@mui/icons-material';
import { useEngagementScoring } from '../hooks/useEngagementScoring';

const EngagementDashboard: React.FC = () => {
  const { memberScores, insights, loading } = useEngagementScoring();

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading engagement data...</Typography>
      </Box>
    );
  }

  const totalMembers = memberScores.length;
  const highRiskCount = memberScores.filter(s => s.riskLevel === 'high').length;
  const averageWeeklyScore = totalMembers > 0 ? 
    memberScores.reduce((sum, s) => sum + s.weeklyScore, 0) / totalMembers : 0;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp sx={{ color: '#10b981' }} />;
      case 'decreasing': return <TrendingDown sx={{ color: '#ef4444' }} />;
      default: return <Remove sx={{ color: '#64748b' }} />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      default: return '#10b981';
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          Engagement Analytics
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          Real-time member engagement scoring and insights
        </Typography>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                {totalMembers}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Total Members
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#ef4444' }}>
                {highRiskCount}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                At Risk
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#10b981' }}>
                {averageWeeklyScore.toFixed(1)}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Avg Weekly Score
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                {totalMembers > 0 ? ((totalMembers - highRiskCount) / totalMembers * 100).toFixed(0) : 0}%
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Healthy Engagement
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Member Scores */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                Member Engagement Scores
              </Typography>
              
              <List>
                {memberScores.map((score, index) => (
                  <ListItem key={score.userId} sx={{ borderBottom: '1px solid #f1f5f9' }}>
                    <ListItemIcon>
                      {getTrendIcon(score.trend)}
                    </ListItemIcon>
                    <ListItemText
                      primary={`Member ${score.userId}`}
                      secondary={`Weekly: ${score.weeklyScore} | Monthly: ${score.monthlyScore}`}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        label={score.riskLevel.toUpperCase()} 
                        size="small"
                        sx={{ 
                          backgroundColor: getRiskColor(score.riskLevel) + '20',
                          color: getRiskColor(score.riskLevel),
                          fontWeight: 600
                        }}
                      />
                      <Box sx={{ width: 100 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={Math.min(score.weeklyScore * 2, 100)} 
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Insights & Alerts */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                Insights & Alerts
              </Typography>
              
              {insights.length > 0 ? (
                insights.map((insight) => (
                  <Alert 
                    key={insight.id}
                    severity={insight.type === 'warning' ? 'warning' : insight.type === 'success' ? 'success' : 'info'}
                    sx={{ mb: 2, borderRadius: 2 }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {insight.title}
                    </Typography>
                    <Typography variant="body2">
                      {insight.description}
                    </Typography>
                  </Alert>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic' }}>
                  No insights available at this time.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EngagementDashboard;