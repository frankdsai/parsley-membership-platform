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
  InputAdornment
} from '@mui/material';
import {
  Add,
  Search,
  Person,
  Business,
  Work,
  Delete,
  Edit
} from '@mui/icons-material';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

interface Member {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  joinDate: string;
}

const Members: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    company: '',
    role: ''
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const q = query(collection(db, 'members'), orderBy('joinDate', 'desc'));
      const querySnapshot = await getDocs(q);
      const membersList: Member[] = [];
      querySnapshot.forEach((doc) => {
        membersList.push({ id: doc.id, ...doc.data() } as Member);
      });
      setMembers(membersList);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleAddMember = async () => {
    if (!newMember.name.trim() || !newMember.email.trim() || !newMember.company.trim() || !newMember.role.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'members'), {
        ...newMember,
        joinDate: new Date().toISOString()
      });
      console.log('Member added successfully with ID:', docRef.id);
      setNewMember({ name: '', email: '', company: '', role: '' });
      setOpen(false);
      fetchMembers();
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Error adding member: ' + error);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await deleteDoc(doc(db, 'members', memberId));
        fetchMembers();
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 4, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
            Member Directory
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Manage your organization's member directory and engagement
          </Typography>
        </Box>

        {/* Controls */}
        <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none', mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{ 
                  flexGrow: 1, 
                  minWidth: 300,
                  '& .MuiOutlinedInput-root': { borderRadius: 2 }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  )
                }}
              />
              <Button 
                variant="contained" 
                startIcon={<Add />}
                onClick={() => setOpen(true)}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Add Member
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Members Grid */}
        <Grid container spacing={3}>
          {filteredMembers.map((member) => (
            <Grid item xs={12} sm={6} md={4} key={member.id}>
              <Card sx={{ 
                borderRadius: 3, 
                border: '1px solid #e2e8f0', 
                boxShadow: 'none',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transform: 'translateY(-2px)'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Avatar sx={{ 
                      width: 48, 
                      height: 48, 
                      backgroundColor: '#3b82f6',
                      fontSize: '1.1rem',
                      fontWeight: 600
                    }}>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDeleteMember(member.id)}
                      sx={{ color: '#ef4444' }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                  
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 0.5 }}>
                    {member.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Person fontSize="small" sx={{ color: '#64748b', mr: 1 }} />
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      {member.email}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Business fontSize="small" sx={{ color: '#64748b', mr: 1 }} />
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      {member.company}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Work fontSize="small" sx={{ color: '#64748b', mr: 1 }} />
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      {member.role}
                    </Typography>
                  </Box>
                  
                  <Chip 
                    label={`Joined ${new Date(member.joinDate).toLocaleDateString()}`}
                    size="small" 
                    sx={{ 
                      backgroundColor: '#f0fdf4',
                      color: '#166534',
                      fontSize: '0.75rem',
                      fontWeight: 500
                    }} 
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Empty State */}
        {filteredMembers.length === 0 && (
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none', mt: 3 }}>
            <CardContent sx={{ p: 6, textAlign: 'center' }}>
              <Person sx={{ fontSize: 48, color: '#64748b', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#1e293b', mb: 1 }}>
                {searchTerm ? 'No members found' : 'No members yet'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Get started by adding your first member to the directory'
                }
              </Typography>
              {!searchTerm && (
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  onClick={() => setOpen(true)}
                >
                  Add First Member
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Add Member Dialog */}
        <Dialog 
          open={open} 
          onClose={() => setOpen(false)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle sx={{ 
            fontSize: '1.25rem', 
            fontWeight: 600, 
            color: '#1e293b',
            borderBottom: '1px solid #e2e8f0'
          }}>
            Add New Member
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={newMember.name}
              onChange={(e) => setNewMember({...newMember, name: e.target.value})}
              margin="normal"
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={newMember.email}
              onChange={(e) => setNewMember({...newMember, email: e.target.value})}
              margin="normal"
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              label="Company"
              value={newMember.company}
              onChange={(e) => setNewMember({...newMember, company: e.target.value})}
              margin="normal"
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              label="Role/Title"
              value={newMember.role}
              onChange={(e) => setNewMember({...newMember, role: e.target.value})}
              margin="normal"
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid #e2e8f0' }}>
            <Button 
              onClick={() => setOpen(false)}
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddMember} 
              variant="contained"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Add Member
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Members;