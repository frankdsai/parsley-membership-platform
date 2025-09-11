export interface EngagementMetric {
  id: string;
  userId: string;
  type: 'login' | 'event_attendance' | 'profile_update' | 'message_sent' | 'directory_search' | 'ai_interaction' | 'content_view';
  value: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface EngagementScore {
  userId: string;
  totalScore: number;
  weeklyScore: number;
  monthlyScore: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  lastActive: string;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export interface EngagementInsight {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'opportunity' | 'success';
  memberIds: string[];
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
}