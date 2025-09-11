import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { UserProfile } from '../../types/user';
import ModernDashboard from '../ModernDashboard';
import Members from '../Members';
import Events from '../Events';
import EnhancedAIChat from '../EnhancedAIChat';

interface AdminDashboardProps {
  user: User;
  userProfile: UserProfile;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, userProfile }) => {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'members':
        return <Members />;
      case 'events':
        return <Events />;
      case 'chat':
        return <EnhancedAIChat />;
      default:
        return <ModernDashboard onNavigate={setCurrentView} userRole="admin" />;
    }
  };

  return renderContent();
};

export default AdminDashboard;