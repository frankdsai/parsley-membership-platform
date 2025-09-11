import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, orderBy, limit, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { EngagementMetric, EngagementScore, EngagementInsight } from '../types/engagement';

export const useEngagementScoring = () => {
  const [memberScores, setMemberScores] = useState<EngagementScore[]>([]);
  const [insights, setInsights] = useState<EngagementInsight[]>([]);
  const [loading, setLoading] = useState(true);

  // Track engagement activity
  const trackEngagement = async (userId: string, type: EngagementMetric['type'], value: number = 1, metadata?: Record<string, any>) => {
    try {
      await addDoc(collection(db, 'engagementMetrics'), {
        userId,
        type,
        value,
        timestamp: new Date().toISOString(),
        metadata: metadata || {}
      });
    } catch (error) {
      console.error('Error tracking engagement:', error);
    }
  };

  // Generate insights
  const generateInsights = (scores: EngagementScore[]): EngagementInsight[] => {
    const insights: EngagementInsight[] = [];

    // High risk members
    const highRiskMembers = scores.filter(s => s.riskLevel === 'high');
    if (highRiskMembers.length > 0) {
      insights.push({
        id: 'high-risk-members',
        title: `${highRiskMembers.length} Members at High Risk`,
        description: 'These members have shown no activity recently and may be at risk of churning.',
        type: 'warning',
        memberIds: highRiskMembers.map(m => m.userId),
        actionable: true,
        priority: 'high'
      });
    }

    // Declining engagement trend
    const decliningMembers = scores.filter(s => s.trend === 'decreasing');
    if (decliningMembers.length > 0) {
      insights.push({
        id: 'declining-engagement',
        title: `${decliningMembers.length} Members with Declining Engagement`,
        description: 'These members show decreasing activity patterns.',
        type: 'warning',
        memberIds: decliningMembers.map(m => m.userId),
        actionable: true,
        priority: 'medium'
      });
    }

    return insights;
  };

  useEffect(() => {
    const fetchEngagementData = async () => {
      try {
        // Sample data showing realistic engagement scores
        const sampleScores: EngagementScore[] = [
          {
            userId: 'frank-admin',
            totalScore: 245,
            weeklyScore: 45,
            monthlyScore: 156,
            trend: 'increasing',
            lastActive: new Date().toISOString(),
            riskLevel: 'low',
            recommendations: []
          },
          {
            userId: 'member-john',
            totalScore: 23,
            weeklyScore: 0,
            monthlyScore: 8,
            trend: 'decreasing',
            lastActive: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            riskLevel: 'high',
            recommendations: ['No activity this week - consider reaching out']
          },
          {
            userId: 'member-alex',
            totalScore: 178,
            weeklyScore: 32,
            monthlyScore: 98,
            trend: 'increasing',
            lastActive: new Date().toISOString(),
            riskLevel: 'low',
            recommendations: []
          }
        ];

        const newInsights = generateInsights(sampleScores);
        setMemberScores(sampleScores);
        setInsights(newInsights);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching engagement data:', error);
        setLoading(false);
      }
    };

    fetchEngagementData();
  }, []);

  return {
    memberScores,
    insights,
    loading,
    trackEngagement
  };
};