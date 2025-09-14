import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { UserProfile } from '../../types/user';
import ModernDashboard from '../ModernDashboard';
import Members from '../Members';
import Events from '../Events';
import EnhancedAIChat from '../EnhancedAIChat';
import { getFeatureFlags } from '../../config/featureFlags';

// Import RAG components
import RAGTestingDashboard from '../rag/RAGTestingDashboard';

interface AdminDashboardProps {
  user: User;
  userProfile: UserProfile;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, userProfile }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const flags = getFeatureFlags();

  const renderContent = () => {
    switch (currentView) {
      case 'members':
        return <Members />;
      case 'events':
        return <Events />;
      case 'chat':
        return <EnhancedAIChat />;
      case 'rag-testing':
        return <RAGTestingDashboard />;
      default:
        return <ModernDashboard onNavigate={setCurrentView} userRole="admin" />;
    }
  };

  return renderContent();
};

export default AdminDashboard;