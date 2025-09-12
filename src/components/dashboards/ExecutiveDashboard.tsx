import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { UserProfile } from '../../types/user';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemText,
  Alert
} from '@mui/material';
import { 
  TrendingUp, 
  People, 
  Event, 
  Assessment,
  Warning,
  CheckCircle
} from '@mui/icons-material';

interface ExecutiveDashboardProps {
  user: User;
  userProfile: UserProfile;
}

const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ user, userProfile }) => {
  const executiveMetrics = {
    totalMembers: 156,
    activeMembers: 134,
    newMembersThisMonth: 12,
    memberRetentionRate: 89,
    upcomingEvents: 8,
    pastEventsThisQuarter: 24,
    avgEventAttendance: 67,
    topEngagementCategories: ['AI/Technology', 'Product Strategy', 'Networking'],
    atRiskMembers: 8,
    highValueMembers: 23
  };

  const recentInsights = [
    {
      type: 'success',
      title: 'Strong Member Engagement',
      description: 'Member engagement up 23% this quarter with AI/ML topics leading interest.'
    },
    {
      type: 'warning', 
      title: 'At-Risk Members Identified',
      description: '8 members show declining activity. Consider targeted outreach.'
    },
    {
      type: 'info',
      title: 'Content Gap Opportunity',
      description: 'High search volume for FinTech expertise but limited expert members.'
    }
  ];

  const topSearches = [
    { term: 'AI product strategy', count: 45, trend: '+15%' },
    { term: 'digital transformation', count: 32, trend: '+8%' },
    { term: 'product management', count: 28, trend: '+22%' },
    { term: 'cloud architecture', count: 24, trend: '+5%' },
    { term: 'startup funding', count: 19, trend: '+35%' }
  ];

  return (
    <Box sx={{ p: 4, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          Executive Overview
        </Typography>
        <Chip 
          label="Executive Access - Read Only" 
          color="warning" 
          sx={{ mb: 2, fontWeight: 600 }}
        />
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          Strategic insights and member engagement analytics for leadership decision-making
        </Typography>
      </Box>

      {/* Key Performance Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <People sx={{ fontSize: 40, color: '#3b82f6', mb: 1 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                {executiveMetrics.totalMembers}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Total Members
              </Typography>
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                +{executiveMetrics.newMembersThisMonth} this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: '#10b981', mb: 1 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#10b981' }}>
                {executiveMetrics.memberRetentionRate}%
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Retention Rate
              </Typography>
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                Above industry avg
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Event sx={{ fontSize: 40, color: '#f59e0b', mb: 1 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                {executiveMetrics.avgEventAttendance}%
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Avg Event Attendance
              </Typography>
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                {executiveMetrics.upcomingEvents} upcoming
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assessment sx={{ fontSize: 40, color: '#8b5cf6', mb: 1 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#8b5cf6' }}>
                {executiveMetrics.highValueMembers}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                High-Value Members
              </Typography>
              <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600 }}>
                {executiveMetrics.atRiskMembers} at risk
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Strategic Insights */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                Strategic Insights
              </Typography>
              
              {recentInsights.map((insight, index) => (
                <Alert 
                  key={index}
                  severity={insight.type as any}
                  sx={{ mb: 2, borderRadius: 2 }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {insight.title}
                  </Typography>
                  <Typography variant="body2">
                    {insight.description}
                  </Typography>
                </Alert>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Member Search Trends */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                Top Member Search Terms
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Search Term</TableCell>
                      <TableCell align="right">Volume</TableCell>
                      <TableCell align="right">Trend</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topSearches.map((search, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {search.term}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">{search.count}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={search.trend}
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

        {/* Member Engagement Categories */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                Top Engagement Categories
              </Typography>
              
              <Grid container spacing={2}>
                {executiveMetrics.topEngagementCategories.map((category, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <Box sx={{ 
                      p: 2, 
                      backgroundColor: '#f1f5f9', 
                      borderRadius: 2,
                      textAlign: 'center'
                    }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                        #{index + 1}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {category}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExecutiveDashboard;