// src/components/PureDashboard.tsx
import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

// Import your existing components for content areas
import Members from './Members';
import Events from './Events';
import EngagementDashboard from './EngagementDashboard';
import SearchAnalytics from './SearchAnalytics';
import RAGTestingDashboard from './rag/RAGTestingDashboard';
import SmartAIChat from './ContextAwareAIChat';

// Inline all styles as a string
const dashboardStyles = `
  .dashboard-container {
    display: flex;
    height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #f8fafc;
    color: #1e293b;
    position: relative;
  }

  /* Sidebar */
  .sidebar {
    width: 280px;
    background: white;
    border-right: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
  }

  .logo {
    padding: 24px;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .logo-icon {
    font-size: 28px;
  }

  .logo-text {
    font-size: 22px;
    font-weight: 700;
    color: #1e293b;
  }

  .nav-section {
    padding: 16px 12px 8px 12px;
    color: #94a3b8;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    margin: 0 12px 4px 12px;
    cursor: pointer;
    border-radius: 8px;
    color: #64748b;
    position: relative;
    transition: all 0.2s;
  }

  .nav-item:hover {
    background: #f1f5f9;
    color: #1e293b;
  }

  .nav-item.active {
    background: rgba(139, 92, 246, 0.1);
    color: #8b5cf6;
    font-weight: 500;
  }

  .nav-item.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 24px;
    background: #8b5cf6;
    border-radius: 0 3px 3px 0;
  }

  .nav-icon {
    width: 24px;
    margin-right: 12px;
    font-size: 20px;
  }

  /* Main Area */
  .main-area {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  /* Top Bar */
  .top-bar {
    height: 64px;
    background: white;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 32px;
    gap: 16px;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 16px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
  }

  .user-details {
    display: flex;
    flex-direction: column;
  }

  .user-name {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
  }

  .user-role {
    font-size: 12px;
    color: #64748b;
  }

  .role-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    color: white;
  }

  .logout-btn {
    padding: 8px 12px;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
    color: #64748b;
  }

  .logout-btn:hover {
    background: #fee2e2;
    border-color: #ef4444;
    color: #ef4444;
  }

  /* Content Area */
  .content-area {
    flex: 1;
    overflow-y: auto;
    padding: 32px;
    background: #f8fafc;
  }

  .page-title {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #1e293b;
  }

  .subtitle {
    color: #64748b;
    font-size: 16px;
    margin-bottom: 32px;
  }

  /* Quick Actions */
  .quick-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }

  .quick-action-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s;
    text-align: center;
  }

  .quick-action-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
    border-color: #cbd5e1;
  }

  .quick-action-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto 12px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }

  .quick-action-title {
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 4px;
    color: #1e293b;
  }

  .quick-action-desc {
    color: #64748b;
    font-size: 12px;
  }

  /* Metrics */
  .metrics-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }

  .metric-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 20px;
    position: relative;
    overflow: hidden;
  }

  .metric-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
  }

  .metric-card.purple::before { background: linear-gradient(90deg, #8b5cf6, #7c3aed); }
  .metric-card.green::before { background: linear-gradient(90deg, #22c55e, #16a34a); }
  .metric-card.orange::before { background: linear-gradient(90deg, #f97316, #ea580c); }
  .metric-card.red::before { background: linear-gradient(90deg, #ef4444, #dc2626); }

  .metric-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .metric-label {
    color: #64748b;
    font-size: 13px;
    font-weight: 500;
  }

  .metric-trend {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
  }

  .trend-up {
    background: #dcfce7;
    color: #16a34a;
  }

  .trend-down {
    background: #fee2e2;
    color: #dc2626;
  }

  .metric-value {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
    line-height: 1;
  }

  .metric-subtitle {
    color: #94a3b8;
    font-size: 12px;
  }

  /* Dashboard Grid */
  .dashboard-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
  }

  .card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 24px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .card-title {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
  }

  .card-link {
    color: #8b5cf6;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: color 0.2s;
    cursor: pointer;
    background: none;
    border: none;
  }

  .card-link:hover {
    color: #7c3aed;
  }

  /* AI Panel */
  .ai-panel {
    position: fixed;
    right: -400px;
    top: 0;
    height: 100vh;
    width: 400px;
    background: white;
    box-shadow: -4px 0 24px rgba(0, 0, 0, 0.1);
    transition: right 0.3s ease;
    z-index: 1000;
    display: flex;
  }

  .ai-panel.open {
    right: 0;
  }

  .ai-panel-toggle {
    position: absolute;
    left: -48px;
    top: 50%;
    transform: translateY(-50%);
    width: 48px;
    height: 120px;
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    border-radius: 8px 0 0 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: -2px 0 12px rgba(139, 92, 246, 0.3);
  }

  .ai-panel-toggle:hover {
    box-shadow: -4px 0 16px rgba(139, 92, 246, 0.4);
  }

  .ai-panel-content {
    flex: 1;
    padding: 24px;
    display: flex;
    flex-direction: column;
  }

  .ai-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e2e8f0;
  }
`;

const PureDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('feed');
  const [userRole, setUserRole] = useState<'admin' | 'member' | 'team'>('admin');
  const [aiPanelOpen, setAiPanelOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'members':
        return <Members />;
      case 'events':
        return <Events />;
      case 'analytics':
        return <EngagementDashboard />;
      case 'search-analytics':
        return <SearchAnalytics />;
      case 'rag-testing':
        return <RAGTestingDashboard />;
      default:
        return (
          <>
            <h1 className="page-title">Welcome back, John 👋</h1>
            <p className="subtitle">Here's what's happening in your membership community today</p>

            {/* Quick Actions */}
            <div className="quick-actions">
              <div className="quick-action-card">
                <div className="quick-action-icon" style={{ background: 'rgba(139, 92, 246, 0.15)' }}>📊</div>
                <div className="quick-action-title">View Analytics</div>
                <div className="quick-action-desc">Check member engagement</div>
              </div>
              <div className="quick-action-card">
                <div className="quick-action-icon" style={{ background: 'rgba(20, 184, 166, 0.15)' }}>➕</div>
                <div className="quick-action-title">Add Member</div>
                <div className="quick-action-desc">Invite new members</div>
              </div>
              <div className="quick-action-card">
                <div className="quick-action-icon" style={{ background: 'rgba(236, 72, 153, 0.15)' }}>📅</div>
                <div className="quick-action-title">Create Event</div>
                <div className="quick-action-desc">Schedule activities</div>
              </div>
              <div className="quick-action-card">
                <div className="quick-action-icon" style={{ background: 'rgba(59, 130, 246, 0.15)' }}>📄</div>
                <div className="quick-action-title">Export Report</div>
                <div className="quick-action-desc">Download analytics</div>
              </div>
            </div>

            {/* Metrics */}
            <div className="metrics-row">
              <div className="metric-card purple">
                <div className="metric-header">
                  <span className="metric-label">Total Members</span>
                  <span className="metric-trend trend-up">↑ 12%</span>
                </div>
                <div className="metric-value" style={{ color: '#8b5cf6' }}>156</div>
                <div className="metric-subtitle">Active this month</div>
              </div>
              <div className="metric-card green">
                <div className="metric-header">
                  <span className="metric-label">Engagement Rate</span>
                  <span className="metric-trend trend-up">↑ 8%</span>
                </div>
                <div className="metric-value" style={{ color: '#22c55e' }}>89%</div>
                <div className="metric-subtitle">Above target</div>
              </div>
              <div className="metric-card orange">
                <div className="metric-header">
                  <span className="metric-label">Events This Month</span>
                  <span className="metric-trend trend-up">↑ 2</span>
                </div>
                <div className="metric-value" style={{ color: '#f97316' }}>8</div>
                <div className="metric-subtitle">3 upcoming</div>
              </div>
              <div className="metric-card red">
                <div className="metric-header">
                  <span className="metric-label">At Risk</span>
                  <span className="metric-trend trend-down">↓ 3</span>
                </div>
                <div className="metric-value" style={{ color: '#ef4444' }}>23</div>
                <div className="metric-subtitle">Need attention</div>
              </div>
            </div>

            {/* Activity Feed and Priority Members */}
            <div className="dashboard-grid">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">📊 Recent Activity</h3>
                  <button className="card-link">VIEW ALL →</button>
                </div>
                <p style={{ color: '#64748b' }}>Activity feed will appear here</p>
              </div>
              
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">⚠️ High Priority Members</h3>
                </div>
                <p style={{ color: '#ef4444', fontSize: '14px' }}>3 need attention</p>
                <p style={{ color: '#64748b', fontSize: '14px' }}>Priority members will appear here</p>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <>
      <style>{dashboardStyles}</style>
      
      <div className="dashboard-container">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="logo">
            <span className="logo-icon">🌿</span>
            <span className="logo-text">Parsley</span>
          </div>
          
          <div style={{ flex: 1, padding: '16px 0' }}>
            <div className="nav-section">NAVIGATE</div>
            {[
              { id: 'feed', icon: '📊', label: 'Feed' },
              { id: 'members', icon: '👥', label: 'Members' },
              { id: 'events', icon: '📅', label: 'Events' },
              { id: 'analytics', icon: '📈', label: 'Analytics' },
              { id: 'search-analytics', icon: '🔍', label: 'Search Analytics' },
              { id: 'rag-testing', icon: '🧪', label: 'RAG Testing' },
              { id: 'priorities', icon: '📌', label: 'Your Priorities' },
              { id: 'goals', icon: '🎯', label: 'Your Goals' },
              { id: 'review', icon: '📋', label: 'For Review' },
              { id: 'networks', icon: '🌐', label: 'Groups & Networks' }
            ].map((item) => (
              <div
                key={item.id}
                className={`nav-item ${selectedTab === item.id ? 'active' : ''}`}
                onClick={() => setSelectedTab(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div style={{ padding: '16px 0', borderTop: '1px solid #e2e8f0' }}>
            <div className="nav-item">
              <span className="nav-icon">💬</span>
              <span>Messages</span>
            </div>
            <div className="nav-item">
              <span className="nav-icon">📅</span>
              <span>Calendar</span>
            </div>
            <div className="nav-item">
              <span className="nav-icon">⚙️</span>
              <span>Settings</span>
            </div>
          </div>
        </div>

        {/* Main Area */}
        <div className="main-area">
          {/* Top Bar */}
          <div className="top-bar">
            <div className="user-info">
              <div className="user-avatar">J</div>
              <div className="user-details">
                <span className="user-name">John Doe</span>
                <span className="user-role">Host Organization</span>
              </div>
              <span className="role-badge">👑 Admin</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Sign Out →
            </button>
          </div>

          {/* Content Area */}
          <div className="content-area">
            {renderContent()}
          </div>
        </div>

        {/* AI Panel */}
        <div className={`ai-panel ${aiPanelOpen ? 'open' : ''}`}>
          <div className="ai-panel-toggle" onClick={() => setAiPanelOpen(!aiPanelOpen)}>
            <span style={{ fontSize: '24px', marginBottom: '8px' }}>🌿</span>
            <span style={{ 
              color: 'white', 
              fontSize: '11px', 
              fontWeight: 600,
              writingMode: 'vertical-rl',
              textOrientation: 'mixed'
            }}>
              AI Assistant
            </span>
          </div>
          
          <div className="ai-panel-content">
            <div className="ai-panel-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🌿</span>
                <span style={{ fontSize: '18px', fontWeight: 600 }}>Parsley AI Assistant</span>
              </div>
              <button 
                onClick={() => setAiPanelOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                ×
              </button>
            </div>
            
            <SmartAIChat
              context={{
                currentPage: selectedTab,
                userRole
              }}
              isWidget={true}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PureDashboard;