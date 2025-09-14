// src/services/linkedinService.ts - FIXED VERSION with Demo Mode
import { LinkedInProfile, LinkedInEnrichmentRequest } from '../types/user';

class LinkedInService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.REACT_APP_LIX_API_KEY || '';
    this.baseUrl = process.env.REACT_APP_LIX_API_BASE_URL || 'https://api.lix-it.com/v1';
    
    if (!this.apiKey) {
      console.warn('Lix API key not found. Demo mode will be used for testing.');
    }
  }

  /**
   * Enriches a LinkedIn profile URL using the Lix API or demo data
   */
  async enrichProfile(profileUrl: string): Promise<LinkedInProfile> {
    // Demo mode for testing without API key
    if (!this.apiKey || profileUrl.includes('demo-user')) {
      return this.getDemoProfile();
    }

    // Validate LinkedIn URL
    if (!this.isValidLinkedInUrl(profileUrl)) {
      throw new Error('Invalid LinkedIn profile URL. Please use format: https://www.linkedin.com/in/username');
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/person?profile_link=${encodeURIComponent(profileUrl)}`,
        {
          method: 'GET',
          headers: {
            'Authorization': this.apiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        let errorMessage = `API Error ${response.status}`;
        
        try {
          const errorData = await response.json();
          if (errorData.error && errorData.error.message) {
            errorMessage = errorData.error.message;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          // If JSON parsing fails, use status-based message
          if (response.status === 401) {
            errorMessage = 'Invalid API key. Please check your Lix API configuration.';
          } else if (response.status === 402) {
            errorMessage = 'Insufficient API credits. Please check your Lix account balance.';
          } else if (response.status === 404) {
            errorMessage = 'LinkedIn profile not found or not accessible.';
          } else if (response.status === 429) {
            errorMessage = 'Rate limit exceeded. Please try again later.';
          }
        }
        
        throw new Error(errorMessage);
      }

      const profileData = await response.json();
      return this.transformLixResponse(profileData);
    } catch (networkError: any) {
      console.error('LinkedIn enrichment error:', networkError);
      
      // Handle network errors
      if (networkError.name === 'TypeError' && networkError.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
      
      // Re-throw with original message if it's already a proper error
      throw networkError;
    }
  }

  /**
   * Get demo profile data for testing
   */
  private getDemoProfile(): Promise<LinkedInProfile> {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        resolve({
          fullName: 'Sarah Chen',
          headline: 'Senior Product Manager | AI & Machine Learning Specialist',
          summary: 'Experienced product manager with 8+ years building AI-driven products at scale. Led teams of 15+ engineers and designers. Passionate about using technology to solve real-world problems and improve user experiences.',
          location: 'San Francisco, CA',
          profileImageUrl: undefined,
          emails: ['sarah.chen@example.com'],
          socialAccounts: {
            linkedin: {
              username: 'sarah-chen-demo',
              url: 'https://www.linkedin.com/in/demo-user',
            },
            twitter: {
              username: 'sarahchen_pm',
            },
          },
          workExperiences: [
            {
              organisation: {
                name: 'TechCorp Solutions',
                socialAccounts: {
                  linkedin: { url: 'https://www.linkedin.com/company/techcorp' },
                },
              },
              title: 'Senior Product Manager',
              description: 'Lead product strategy for AI-powered enterprise solutions. Managed cross-functional teams to deliver features serving 100k+ users.',
              location: 'San Francisco, CA',
              startedOn: {
                year: 2020,
                month: 3,
              },
              endedOn: undefined,
              current: true,
            },
            {
              organisation: {
                name: 'StartupXYZ',
                socialAccounts: {
                  linkedin: { url: 'https://www.linkedin.com/company/startupxyz' },
                },
              },
              title: 'Product Manager',
              description: 'Built mobile app from 0 to 50k users. Led product discovery and user research initiatives.',
              location: 'San Francisco, CA',
              startedOn: {
                year: 2018,
                month: 1,
              },
              endedOn: {
                year: 2020,
                month: 2,
              },
            },
          ],
          education: [
            {
              schoolName: 'Stanford University',
              degree: 'Master of Science',
              fieldOfStudy: 'Computer Science',
              startedOn: {
                year: 2015,
              },
              endedOn: {
                year: 2017,
              },
            },
            {
              schoolName: 'UC Berkeley',
              degree: 'Bachelor of Science',
              fieldOfStudy: 'Electrical Engineering',
              startedOn: {
                year: 2011,
              },
              endedOn: {
                year: 2015,
              },
            },
          ],
          skills: [
            { name: 'Product Management', numOfEndorsement: '45' },
            { name: 'Machine Learning', numOfEndorsement: '32' },
            { name: 'User Experience Design', numOfEndorsement: '28' },
            { name: 'Data Analysis', numOfEndorsement: '25' },
            { name: 'Team Leadership', numOfEndorsement: '22' },
            { name: 'Agile Methodologies', numOfEndorsement: '20' },
            { name: 'Python', numOfEndorsement: '18' },
            { name: 'Strategic Planning', numOfEndorsement: '15' },
          ],
          connections: 500,
          recommendations: 12,
        });
      }, 2000); // 2-second delay to simulate API call
    });
  }

  /**
   * Get account balance to check API credits
   */
  async getAccountBalance(): Promise<{ emailBalance: number; linkedInBalance: number }> {
    if (!this.apiKey) {
      // Return demo balance for testing
      return { emailBalance: 0, linkedInBalance: 0 };
    }

    try {
      const response = await fetch(`${this.baseUrl}/account/balances`, {
        method: 'GET',
        headers: {
          'Authorization': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get account balance: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error getting account balance:', error);
      throw new Error('Unable to check account balance. Please verify your API configuration.');
    }
  }

  /**
   * Validates if the URL is a proper LinkedIn profile URL
   */
  private isValidLinkedInUrl(url: string): boolean {
    // Allow demo URL for testing
    if (url.includes('demo-user')) {
      return true;
    }
    
    const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-]+\/?$/;
    return linkedinRegex.test(url);
  }

  /**
   * Transforms the Lix API response to our internal LinkedInProfile format
   */
  private transformLixResponse(data: any): LinkedInProfile {
    return {
      fullName: data.name || data.displayName || data.fullName || '',
      headline: data.description || data.headline || '',
      summary: data.aboutSummaryText || data.bio || data.summary || '',
      location: data.location || '',
      profileImageUrl: data.profileImageUrl,
      emails: data.emails || [],
      socialAccounts: {
        linkedin: {
          username: this.extractUsernameFromUrl(data.link || ''),
          url: data.link || '',
        },
        twitter: data.twitter ? { username: data.twitter } : undefined,
      },
      workExperiences: this.transformWorkExperiences(data.experience || data.workExperiences || []),
      education: this.transformEducation(data.education || []),
      skills: this.transformSkills(data.skills || []),
      connections: data.connections,
      recommendations: data.recommendations,
    };
  }

  /**
   * Transforms work experience data from Lix format
   */
  private transformWorkExperiences(experiences: any[]): any[] {
    if (!Array.isArray(experiences)) {
      return [];
    }

    return experiences.map(exp => ({
      organisation: {
        name: exp.organisation?.name || exp.company || exp.organization?.name || '',
        socialAccounts: {
          linkedin: { url: exp.organisation?.socialAccounts?.linkedin?.url },
        },
      },
      title: exp.title || '',
      description: exp.description || '',
      location: exp.location || '',
      startedOn: {
        year: exp.timePeriod?.startedOn?.year || exp.startedOn?.year || 0,
        month: exp.timePeriod?.startedOn?.month || exp.startedOn?.month,
      },
      endedOn: exp.timePeriod?.endedOn || exp.endedOn ? {
        year: exp.timePeriod?.endedOn?.year || exp.endedOn?.year,
        month: exp.timePeriod?.endedOn?.month || exp.endedOn?.month,
      } : undefined,
      current: !exp.timePeriod?.endedOn && !exp.endedOn,
    }));
  }

  /**
   * Transforms education data from Lix format
   */
  private transformEducation(education: any[]): any[] {
    if (!Array.isArray(education)) {
      return [];
    }

    return education.map(edu => ({
      schoolName: edu.institutionName || edu.schoolName || '',
      degree: edu.degree || '',
      fieldOfStudy: edu.fieldOfStudy || '',
      startedOn: edu.timePeriod?.startedOn || edu.startedOn ? {
        year: edu.timePeriod?.startedOn?.year || edu.startedOn?.year,
      } : undefined,
      endedOn: edu.timePeriod?.endedOn || edu.endedOn ? {
        year: edu.timePeriod?.endedOn?.year || edu.endedOn?.year,
      } : undefined,
    }));
  }

  /**
   * Transforms skills data from Lix format
   */
  private transformSkills(skills: any[]): any[] {
    if (!Array.isArray(skills)) {
      return [];
    }

    return skills.map(skill => ({
      name: skill.name || skill.skill || '',
      numOfEndorsement: skill.numOfEndorsement || skill.endorsements || '0',
    }));
  }

  /**
   * Extracts username from LinkedIn URL
   */
  private extractUsernameFromUrl(url: string): string {
    if (!url) return '';
    const match = url.match(/linkedin\.com\/in\/([^\/\?]+)/);
    return match ? match[1] : '';
  }

  /**
   * Calculates profile completeness score based on available data
   */
  calculateProfileCompleteness(profile: LinkedInProfile): number {
    let score = 0;
    const maxScore = 100;

    // Basic info (30 points)
    if (profile.fullName) score += 10;
    if (profile.headline) score += 10;
    if (profile.location) score += 10;

    // Summary (20 points)
    if (profile.summary && profile.summary.length > 50) score += 20;

    // Work experience (25 points)
    if (profile.workExperiences && profile.workExperiences.length > 0) score += 15;
    if (profile.workExperiences && profile.workExperiences.length >= 3) score += 10;

    // Education (15 points)
    if (profile.education && profile.education.length > 0) score += 15;

    // Skills (10 points)
    if (profile.skills && profile.skills.length >= 5) score += 10;

    return Math.min(score, maxScore);
  }

  /**
   * Determines expertise level based on profile data
   */
  determineExpertiseLevel(profile: LinkedInProfile): 'Beginner' | 'Intermediate' | 'Expert' | 'Thought Leader' {
    const yearsExperience = this.calculateYearsOfExperience(profile.workExperiences || []);
    const skillCount = profile.skills ? profile.skills.length : 0;
    const hasLeadershipTitles = (profile.workExperiences || []).some(exp => 
      /director|vp|ceo|cto|founder|head|lead|manager/i.test(exp.title || '')
    );

    if (yearsExperience >= 15 && hasLeadershipTitles && skillCount >= 20) {
      return 'Thought Leader';
    } else if (yearsExperience >= 8 && (hasLeadershipTitles || skillCount >= 15)) {
      return 'Expert';
    } else if (yearsExperience >= 3 && skillCount >= 8) {
      return 'Intermediate';
    } else {
      return 'Beginner';
    }
  }

  /**
   * Calculates total years of work experience
   */
  private calculateYearsOfExperience(experiences: any[]): number {
    const currentYear = new Date().getFullYear();
    return experiences.reduce((total, exp) => {
      const startYear = exp.startedOn?.year || currentYear;
      const endYear = exp.endedOn?.year || currentYear;
      return total + Math.max(0, endYear - startYear);
    }, 0);
  }
}

export const linkedinService = new LinkedInService();