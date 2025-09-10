import React from 'react';
import { User } from 'firebase/auth';
import ModernDashboard from './ModernDashboard';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return <ModernDashboard />;
};

export default Dashboard;