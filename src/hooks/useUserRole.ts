import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../types/user';

export const useUserRole = (user: User | null) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setUserProfile(null);
        setLoading(false);
        return;
      }

      try {
        // Create demo profile based on email for easy role switching
        let role: 'admin' | 'executive' | 'member' = 'member';
        let displayName = 'Demo User';
        
        if (user.email?.includes('admin')) {
          role = 'admin';
          displayName = 'Admin User';
        } else if (user.email?.includes('executive')) {
          role = 'executive';  
          displayName = 'Executive User';
        } else if (user.email?.includes('member')) {
          role = 'member';
          displayName = 'Member User';
        }

        const defaultProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          role: role,
          displayName: displayName,
          organization: 'Demo Organization',
          joinDate: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          skills: ['Demo Skill'],
          expertise: ['Demo Expertise'],
          interests: ['Demo Interest'],
          bio: `Demo ${role} profile for testing different user experiences.`,
          goals: ['Demo goal'],
          yearsExperience: 5,
          industry: 'Technology',
          location: 'Demo City',
          profileCompleteness: 85,
          expertiseLevel: 'Intermediate',
          networkingPreferences: ['Demo Preference'],
          searchHistory: ['demo search'],
          connectionsMade: 10,
          eventsAttended: 5
        };
        
        setUserProfile(defaultProfile);
      } catch (error) {
        console.error('Error creating user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const updateUserRole = async (newRole: 'admin' | 'executive' | 'member') => {
    if (!user || !userProfile) return;

    try {
      const updatedProfile = { ...userProfile, role: newRole };
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  return { userProfile, loading, updateUserRole };
};