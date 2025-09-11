import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Chip,
  Avatar,
  IconButton,
  InputAdornment,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  Add,
  Search,
  Delete,
  Visibility,
  LocationOn,
  Work
} from '@mui/icons-material';
import { UserProfile } from '../types/user';

const Members: React.FC = () => {
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<UserProfile | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      // Create enhanced sample data
      const sampleMembers: UserProfile[] = [
        {
          uid: 'member-1',
          email: 'sarah.chen@techcorp.com',
          role: 'member',
          displayName: 'Sarah Chen',
          organization: 'TechCorp Solutions',
          joinDate: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          skills: ['Product Management', 'AI/ML Strategy', 'Team Leadership'],
          expertise: ['Artificial Intelligence', 'Product Strategy', 'Market Research'],
          interests: ['Emerging Technologies', 'Startup Mentoring', 'Design Thinking'],
          bio: 'Senior Product Manager with 8+ years experience in AI-driven products. Passionate about building user-centric solutions that leverage cutting-edge technology.',
          linkedinUrl: 'https://linkedin.com/in/sarahchen',
          goals: ['Launch AI product line', 'Expand into European markets', 'Build strategic partnerships'],
          yearsExperience: 8,
          industry: 'Technology',
          location: 'San Francisco, CA',
          profileCompleteness: 95,
          expertiseLevel: 'Expert',
          networkingPreferences: ['1:1 Coffee Chats', 'Industry Events', 'Mentoring'],
          searchHistory: ['AI product strategy', 'market research techniques', 'team leadership'],
          connectionsMade: 23,
          eventsAttended: 12
        },
        {
          uid: 'member-2',
          email: 'alex.rodriguez@innovate.com',
          role: 'member',
          displayName: 'Alex Rodriguez',
          organization: 'Innovate Labs',
          joinDate: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          skills: ['Software Engineering', 'Cloud Architecture', 'DevOps'],
          expertise: ['Backend Development', 'System Design', 'Kubernetes'],
          interests: ['Open Source', 'Cloud Computing', 'Automation'],
          bio: 'Full-stack engineer and cloud architect specializing in scalable microservices. Active contributor to open source projects.',
          goals: ['Become solutions architect', 'Contribute to major OSS project', 'Speaking at conferences'],
          yearsExperience: 5,
          industry: 'Technology',
          location: 'Austin, TX',
          profileCompleteness: 78,
          expertiseLevel: 'Intermediate',
          networkingPreferences: ['Tech Meetups', 'Open Source Communities'],
          searchHistory: ['kubernetes best practices', 'microservices architecture'],
          connectionsMade: 15,
          eventsAttended: 8
        },
        {
          uid: 'member-3',
          email: 'maria.gonzalez@digitalfin.com',
          role: 'member',
          displayName: 'Maria Gonzalez',
          organization: 'Digital Finance Co',
          joinDate: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          skills: ['Financial Analysis', 'Risk Management', 'Digital Transformation'],
          expertise: ['FinTech Innovation', 'Regulatory Compliance', 'Data Analytics'],
          interests: ['Blockchain', 'Digital Banking', 'Financial Inclusion'],
          bio: 'Fintech strategist driving digital transformation in traditional banking. Expert in regulatory technology and risk management.',
          goals: ['Lead digital banking initiative', 'Become fintech thought leader', 'Launch financial inclusion program'],
          yearsExperience: 12,
          industry: 'Financial Services',
          location: 'New York, NY',
          profileCompleteness: 88,
          expertiseLevel: 'Thought Leader',
          networkingPreferences: ['Industry Conferences', 'Executive Roundtables'],
          searchHistory: ['blockchain regulations', 'digital banking trends', 'fintech partnerships'],
          connectionsMade: 34,
          eventsAttended: 18
        }
      ];
      
      setMembers(sampleMembers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching members:', error);
      setLoading(false);
    }
  };

  const handleDeleteMember = (memberId: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      setMembers(members.filter(m => m.uid !== memberId));
    }
  };

  const filteredMembers = members.filter(member =>
    member.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.expertise?.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase())) ||
    member.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getExpertiseLevelColor = (level: string) => {
    switch (level) {
      case 'Thought Leader': return '#8b5cf6';
      case 'Expert': return '#10b981';
      case 'Intermediate': return '#3b82f6';
      default: return '#64748b';
    }
  };

 // If a member is selected, show basic info (detailed profile coming soon)
if (selectedMember) {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Button 
        onClick={() => setSelectedMember(null)}
        sx={{ mb: 3 }}
        variant="outlined"
      >
        ← Back to Members
      </Button>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {selectedMember.displayName}
      </Typography>
      <Typography variant="body1">
        Enhanced profile view coming soon!
      </Typography>
    </Container>
  );
}

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          Loading members...
        </Typography>
      </Container>
    );
  }

  // Main members list view
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
          Member Directory
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => setOpen(true)}
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          Add Member
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Search members by name, organization, skills, or expertise..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: '#64748b' }} />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={3}>
        {filteredMembers.map((member) => (
          <Grid item xs={12} md={6} lg={4} key={member.uid}>
            <Card 
              sx={{ 
                borderRadius: 3, 
                border: '1px solid #e2e8f0', 
                boxShadow: 'none',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: '#3b82f6',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px -8px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ 
                    width: 56, 
                    height: 56, 
                    backgroundColor: '#3b82f6',
                    fontSize: '1.25rem',
                    fontWeight: 600
                  }}>
                    {member.displayName?.[0] || member.email[0]}
                  </Avatar>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 0.5 }}>
                      {member.displayName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      {member.organization}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton 
                      size="small"
                      onClick={() => setSelectedMember(member)}
                      sx={{ color: '#3b82f6' }}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton 
                      size="small"
                      onClick={() => handleDeleteMember(member.uid)}
                      sx={{ color: '#ef4444' }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Chip 
                    label={member.expertiseLevel} 
                    size="small"
                    sx={{ 
                      backgroundColor: getExpertiseLevelColor(member.expertiseLevel) + '20',
                      color: getExpertiseLevelColor(member.expertiseLevel),
                      fontWeight: 600
                    }}
                  />
                  <Chip 
                    icon={<LocationOn />} 
                    label={member.location} 
                    size="small" 
                    variant="outlined"
                  />
                </Box>

                <Typography variant="body2" sx={{ color: '#1e293b', mb: 2, lineHeight: 1.5 }}>
                  {member.bio && member.bio.length > 100 ? `${member.bio.substring(0, 100)}...` : member.bio}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                    Top Expertise:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {member.expertise && member.expertise.slice(0, 2).map((exp, index) => (
                      <Chip 
                        key={index} 
                        label={exp} 
                        size="small" 
                        sx={{ 
                          backgroundColor: '#10b981',
                          color: 'white',
                          fontSize: '0.7rem'
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                        {member.connectionsMade || 0}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        Connections
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#10b981' }}>
                        {member.eventsAttended || 0}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        Events
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ width: 60 }}>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Profile: {member.profileCompleteness || 0}%
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={member.profileCompleteness || 0} 
                      sx={{ height: 4, borderRadius: 2, mt: 0.5 }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Simple Add Member Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Member</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
            Enhanced member profiles with skills and expertise coming soon!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Members;