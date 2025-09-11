export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'executive' | 'member';
  displayName?: string;
  organization?: string;
  joinDate: string;
  lastActive: string;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  description: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'executive' | 'member';
  displayName?: string;
  organization?: string;
  joinDate: string;
  lastActive: string;
  
  // Enhanced profile fields for expert matching
  skills: string[];
  expertise: string[];
  interests: string[];
  bio: string;
  linkedinUrl?: string;
  goals: string[];
  yearsExperience: number;
  industry: string;
  location: string;
  
  // AI-generated insights
  profileCompleteness: number;
  expertiseLevel: 'Beginner' | 'Intermediate' | 'Expert' | 'Thought Leader';
  networkingPreferences: string[];
  
  // Search and analytics
  searchHistory: string[];
  connectionsMade: number;
  eventsAttended: number;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  description: string;
}

// New interfaces for enhanced functionality
export interface ExpertiseArea {
  name: string;
  level: number;
  endorsements: number;
  relatedMembers: string[];
}

export interface SearchQuery {
  id: string;
  userId: string;
  query: string;
  timestamp: string;
  category: 'expertise' | 'member' | 'content' | 'general';
  results: string[];
}