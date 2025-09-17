// In src/components/Dashboard.tsx
import React from 'react';
import { User } from 'firebase/auth';
import PureDashboard from './PureDashboard';  // Use the pure version

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return <PureDashboard />;
};

export default Dashboard;