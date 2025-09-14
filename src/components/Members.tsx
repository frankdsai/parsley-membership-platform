// src/components/Members.tsx - Enhanced with LinkedIn Integration
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
  Divider,
  Alert,
  Tooltip,
  Tab,
  Tabs,
  Badge
} from '@mui/material';
import {
  Add,
  Search,
  Delete,
  Visibility,
  LinkedIn,
  LocationOn,
  Work,
  AutoAwesome,
  Person,
  School,
  TrendingUp
} from '@mui/icons-material';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile, LinkedInProfile } from '../types/user';
import LinkedInEnrichment from './LinkedInEnrichment';

const Members: React.FC = () => {
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<UserProfile | null>(null);
  const [open, setOpen] = useState(false);
  const [enrichmentOpen, setEnrichmentOpen] = useState(false);
  const [selectedMemberForEnrichment, setSelectedMemberForEnrichment] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [newMember, setNewMember] = useState({
    displayName: '',
    email: '',
    organization: '',
    role: 'member' as 'admin' | 'executive' | 'member',
    linkedinUrl: '',
    bio: ''
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      // Try to fetch from Firebase first
      const q = query(collection(db, 'members'), orderBy('joinDate', 'desc'));
      const querySnapshot = await getDocs(q);
      const membersList: UserProfile[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        membersList.push({ 
          uid: doc.id, 
          ...data,
          // Ensure required fields exist
          joinDate: data.joinDate || new Date().toISOString(),
          lastActive: data.lastActive || new Date().toISOString(),
          role: data.role || 'member'
        } as UserProfile);
      });

      // If no members in Firebase, create sample data
      if (membersList.length === 0) {
        const sampleMembers = await createSampleMembers();
        setMembers(sampleMembers);
      } else {
        setMembers(membersList);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      // Fallback to sample data
      const sampleMembers = await createSampleMembers();
      setMembers(sampleMembers);
    } finally {
      setLoading(false);
    }
  };

  const createSampleMembers = async (): Promise<UserProfile[]> => {
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
        eventsAttended: 12,
        enrichmentStatus: 'completed'
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
        eventsAttended: 8,
        enrichmentStatus: 'not_started'
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
        eventsAttended: 18,
        enrichmentStatus: 'not_started'
      }
    ];

    // Store sample members in Firebase
    try {
      for (const member of sampleMembers) {
        await addDoc(collection(db, 'members'), {
          ...member,
          uid: undefined // Let Firestore generate the ID
        });
      }
    } catch (error) {
      console.error('Error storing sample members:', error);
    }

    return sampleMembers;
  };

  const handleAddMember = async () => {
    try {
      const memberData = {
        ...newMember,
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        profileCompleteness: 30, // Basic info only
        enrichmentStatus: newMember.linkedinUrl ? 'pending' : 'not_started',
        skills: [],
        expertise: [],
        interests: [],
        connectionsMade: 0,
        eventsAttended: 0
      };

      await addDoc(collection(db, 'members'), memberData);
      setNewMember({ 
        displayName: '', 
        email: '', 
        organization: '', 
        role: 'member',
        linkedinUrl: '', 
        bio: '' 
      });
      setOpen(false);
      fetchMembers();
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await deleteDoc(doc(db, 'members', memberId));
        setMembers(members.filter(m => m.uid !== memberId));
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    }
  };

  const handleLinkedInEnrichment = (member: UserProfile) => {
    setSelectedMemberForEnrichment(member);
    setEnrichmentOpen(true);
  };

  const handleEnrichmentComplete = async (linkedinProfile: LinkedInProfile) => {
    if (!selectedMemberForEnrichment) return;

    try {
      // Update member with LinkedIn data
      const updatedMember: Partial<UserProfile> = {
        linkedinData: linkedinProfile,
        displayName: linkedinProfile.fullName || selectedMemberForEnrichment.displayName,
        bio: linkedinProfile.summary || selectedMemberForEnrichment.bio,
        location: linkedinProfile.location || selectedMemberForEnrichment.location,
        skills: linkedinProfile.skills.map(s => s.name),
        expertise: linkedinProfile.workExperiences.slice(0, 3).map(exp => exp.title),
        yearsExperience: linkedinProfile.workExperiences.length > 0 ? 
          new Date().getFullYear() - linkedinProfile.workExperiences[0].startedOn.year : 0,
        profileCompleteness: calculateProfileCompleteness(linkedinProfile),
        expertiseLevel: determineExpertiseLevel(linkedinProfile),
        enrichmentStatus: 'completed',
        lastEnrichmentDate: new Date().toISOString()
      };

      // Update in Firebase
      await updateDoc(doc(db, 'members', selectedMemberForEnrichment.uid), updatedMember);

      // Update local state
      setMembers(members.map(m => 
        m.uid === selectedMemberForEnrichment.uid 
          ? { ...m, ...updatedMember }
          : m
      ));

      setSelectedMemberForEnrichment(null);
    } catch (error) {
      console.error('Error updating member with LinkedIn data:', error);
    }
  };

  const calculateProfileCompleteness = (profile: LinkedInProfile): number => {
    let score = 0;
    if (profile.fullName) score += 15;
    if (profile.headline) score += 15;
    if (profile.summary) score += 20;
    if (profile.workExperiences.length > 0) score += 25;
    if (profile.education.length > 0) score += 15;
    if (profile.skills.length >= 5) score += 10;
    return Math.min(score, 100);
  };

  const determineExpertiseLevel = (profile: LinkedInProfile): 'Beginner' | 'Intermediate' | 'Expert' | 'Thought Leader' => {
    const yearsExperience = profile.workExperiences.length > 0 ? 
      new Date().getFullYear() - profile.workExperiences[0].startedOn.year : 0;
    const hasLeadershipTitles = profile.workExperiences.some(exp => 
      /director|vp|ceo|cto|founder|head|lead|manager/i.test(exp.title)
    );

    if (yearsExperience >= 15 && hasLeadershipTitles) return 'Thought Leader';
    if (yearsExperience >= 8 && hasLeadershipTitles) return 'Expert';
    if (yearsExperience >= 3) return 'Intermediate';
    return 'Beginner';
  };

  const filteredMembers = members.filter(member => {
    const searchLower = searchTerm.toLowerCase();
    return (
      member.displayName?.toLowerCase().includes(searchLower) ||
      member.organization?.toLowerCase().includes(searchLower) ||
      member.expertise?.some(exp => exp.toLowerCase().includes(searchLower)) ||
      member.skills?.some(skill => skill.toLowerCase().includes(searchLower)) ||
      member.industry?.toLowerCase().includes(searchLower)
    );
  });

  const getFilteredMembersByTab = () => {
    switch (tabValue) {
      case 0: return filteredMembers; // All
      case 1: return filteredMembers.filter(m => m.enrichmentStatus === 'completed'); // Enriched
      case 2: return filteredMembers.filter(m => m.enrichmentStatus === 'not_started' || m.enrichmentStatus === 'pending'); // Need Enrichment
      default: return filteredMembers;
    }
  };

  const getExpertiseLevelColor = (level: string) => {
    switch (level) {
      case 'Thought Leader': return '#8b5cf6';
      case 'Expert': return '#10b981';
      case 'Intermediate': return '#3b82f6';
      default: return '#64748b';
    }
  };

  const getEnrichmentStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <AutoAwesome sx={{ color: '#10b981' }} />;
      case 'pending': return <TrendingUp sx={{ color: '#f59e0b' }} />;
      default: return <Person sx={{ color: '#64748b' }} />;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6">Loading members...</Typography>
      </Container>
    );
  }

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

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>LinkedIn Integration:</strong> Click the LinkedIn icon on any member card to enrich their profile with professional data from LinkedIn using the Lix API.
        </Typography>
      </Alert>

      <TextField
        fullWidth
        placeholder="Search members by name, organization, skills, expertise, or industry..."
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

      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label={`All Members (${filteredMembers.length})`} />
        <Tab label={`LinkedIn Enriched (${filteredMembers.filter(m => m.enrichmentStatus === 'completed').length})`} />
        <Tab label={`Need Enrichment (${filteredMembers.filter(m => m.enrichmentStatus === 'not_started' || m.enrichmentStatus === 'pending').length})`} />
      </Tabs>

      <Grid container spacing={3}>
        {getFilteredMembersByTab().map((member) => (
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
                  <Badge
                    badgeContent={getEnrichmentStatusIcon(member.enrichmentStatus || 'not_started')}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  >
                    <Avatar sx={{ 
                      width: 56, 
                      height: 56, 
                      backgroundColor: '#3b82f6',
                      fontSize: '1.25rem',
                      fontWeight: 600
                    }}>
                      {member.linkedinData?.profileImageUrl ? (
                        <img 
                          src={member.linkedinData.profileImageUrl} 
                          alt={member.displayName}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        member.displayName?.[0] || member.email[0]
                      )}
                    </Avatar>
                  </Badge>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 0.5 }}>
                      {member.displayName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      {member.organization}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Enrich with LinkedIn">
                      <IconButton 
                        size="small"
                        onClick={() => handleLinkedInEnrichment(member)}
                        sx={{ color: '#0077b5' }}
                      >
                        <LinkedIn />
                      </IconButton>
                    </Tooltip>
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
                    label={member.expertiseLevel || 'Beginner'} 
                    size="small"
                    sx={{ 
                      backgroundColor: getExpertiseLevelColor(member.expertiseLevel || 'Beginner') + '20',
                      color: getExpertiseLevelColor(member.expertiseLevel || 'Beginner'),
                      fontWeight: 600
                    }}
                  />
                  {member.location && (
                    <Chip 
                      icon={<LocationOn />} 
                      label={member.location} 
                      size="small" 
                      variant="outlined"
                    />
                  )}
                </Box>

                <Typography variant="body2" sx={{ color: '#1e293b', mb: 2, lineHeight: 1.5 }}>
                  {member.bio && member.bio.length > 100 ? `${member.bio.substring(0, 100)}...` : member.bio}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                    Top Expertise:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {(member.expertise || []).slice(0, 2).map((exp, index) => (
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
                      Profile: {member.profileCompleteness || 30}%
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={member.profileCompleteness || 30} 
                      sx={{ height: 4, borderRadius: 2, mt: 0.5 }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Member Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Member</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Display Name"
            value={newMember.displayName}
            onChange={(e) => setNewMember({ ...newMember, displayName: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={newMember.email}
            onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Organization"
            value={newMember.organization}
            onChange={(e) => setNewMember({ ...newMember, organization: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="LinkedIn URL (Optional)"
            placeholder="https://www.linkedin.com/in/username"
            value={newMember.linkedinUrl}
            onChange={(e) => setNewMember({ ...newMember, linkedinUrl: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Bio"
            multiline
            rows={3}
            value={newMember.bio}
            onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAddMember}
            disabled={!newMember.displayName || !newMember.email}
          >
            Add Member
          </Button>
        </DialogActions>
      </Dialog>

      {/* LinkedIn Enrichment Dialog */}
      <LinkedInEnrichment
        open={enrichmentOpen}
        onClose={() => {
          setEnrichmentOpen(false);
          setSelectedMemberForEnrichment(null);
        }}
        onEnrichmentComplete={handleEnrichmentComplete}
        existingLinkedInUrl={selectedMemberForEnrichment?.linkedinUrl || ''}
      />

      {/* Simple Member Detail Modal */}
      {selectedMember && (
        <Dialog 
          open={!!selectedMember} 
          onClose={() => setSelectedMember(null)} 
          maxWidth="md" 
          fullWidth
        >
          <DialogTitle>
            {selectedMember.displayName} - Profile Details
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              <strong>Organization:</strong> {selectedMember.organization}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Email:</strong> {selectedMember.email}
            </Typography>
            {selectedMember.location && (
              <Typography variant="body1" gutterBottom>
                <strong>Location:</strong> {selectedMember.location}
              </Typography>
            )}
            {selectedMember.bio && (
              <Typography variant="body1" gutterBottom>
                <strong>Bio:</strong> {selectedMember.bio}
              </Typography>
            )}
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              Enhanced profile details coming soon! This will show complete LinkedIn data, skills matrix, networking preferences, and AI-powered insights.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedMember(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default Members;