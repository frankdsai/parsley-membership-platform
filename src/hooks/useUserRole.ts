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
        const userDoc = await getDoc(doc(db, 'userProfiles', user.uid));
        
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile);
        } else {
          // Create default profile for new users
          const defaultProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            role: 'member', // Default role
            displayName: user.displayName || '',
            joinDate: new Date().toISOString(),
            lastActive: new Date().toISOString()
          };
          
          await setDoc(doc(db, 'userProfiles', user.uid), defaultProfile);
          setUserProfile(defaultProfile);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
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
      await setDoc(doc(db, 'userProfiles', user.uid), updatedProfile);
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  return { userProfile, loading, updateUserRole };
};