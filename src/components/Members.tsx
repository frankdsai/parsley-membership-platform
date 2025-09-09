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
  Chip
} from '@mui/material';
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
    // Validate all fields are filled
    if (!newMember.name.trim() || !newMember.email.trim() || !newMember.company.trim() || !newMember.role.trim()) {
      alert('Please fill in all fields');
      return;
    }

    console.log('Attempting to add member:', newMember);
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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Member Directory</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Member
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Search members..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Grid container spacing={3}>
        {filteredMembers.map((member) => (
          <Grid item xs={12} md={6} lg={4} key={member.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {member.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {member.email}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {member.company}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                  <Chip label={member.role} size="small" color="primary" />
                  <Button 
                    size="small" 
                    color="error" 
                    onClick={() => handleDeleteMember(member.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Member</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={newMember.name}
            onChange={(e) => setNewMember({...newMember, name: e.target.value})}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            value={newMember.email}
            onChange={(e) => setNewMember({...newMember, email: e.target.value})}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Company"
            value={newMember.company}
            onChange={(e) => setNewMember({...newMember, company: e.target.value})}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Role"
            value={newMember.role}
            onChange={(e) => setNewMember({...newMember, role: e.target.value})}
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddMember} variant="contained">Add Member</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Members;