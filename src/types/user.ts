// src/types/user.ts - Enhanced version with LinkedIn integration

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'executive' | 'member';
  displayName?: string;
  organization?: string;
  joinDate: string;
  lastActive: string;
  
  // Enhanced profile fields
  skills?: string[];
  expertise?: string[];
  interests?: string[];
  bio?: string;
  linkedinUrl?: string;
  goals?: string[];
  yearsExperience?: number;
  industry?: string;
  location?: string;
  profileCompleteness?: number;
  expertiseLevel?: 'Beginner' | 'Intermediate' | 'Expert' | 'Thought Leader';
  networkingPreferences?: string[];
  searchHistory?: string[];
  connectionsMade?: number;
  eventsAttended?: number;
  
  // LinkedIn enrichment data
  linkedinData?: LinkedInProfile;
  enrichmentStatus?: 'pending' | 'completed' | 'failed' | 'not_started';
  lastEnrichmentDate?: string;
}

export interface LinkedInProfile {
  fullName: string;
  headline: string;
  summary: string;
  location: string;
  profileImageUrl?: string;
  emails?: string[];
  socialAccounts?: {
    linkedin?: {
      username: string;
      url: string;
    };
    twitter?: {
      username: string;
    };
  };
  workExperiences: WorkExperience[];
  education: Education[];
  skills: LinkedInSkill[];
  connections?: number;
  recommendations?: number;
}

export interface WorkExperience {
  organisation: {
    name: string;
    socialAccounts?: {
      linkedin?: { url?: string };
      twitter?: { username?: string };
    };
  };
  title: string;
  description: string;
  location: string;
  startedOn: {
    year: number;
    month?: number;
  };
  endedOn?: {
    year?: number;
    month?: number;
  };
  current?: boolean;
}

export interface Education {
  schoolName: string;
  degree?: string;
  fieldOfStudy?: string;
  startedOn?: {
    year: number;
  };
  endedOn?: {
    year: number;
  };
}

export interface LinkedInSkill {
  name: string;
  numOfEndorsement?: string;
}

export interface LinkedInEnrichmentRequest {
  userId: string;
  linkedinUrl: string;
  requestedBy: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  error?: string;
}