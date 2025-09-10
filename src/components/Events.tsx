import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Chip,
  IconButton,
  InputAdornment,
  Avatar
} from '@mui/material';
import {
  Add,
  Search,
  Event as EventIcon,
  LocationOn,
  People,
  Delete,
  CalendarToday,
  AccessTime
} from '@mui/icons-material';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const q = query(collection(db, 'events'), orderBy('date', 'asc'));
      const querySnapshot = await getDocs(q);
      const eventsList: Event[] = [];
      querySnapshot.forEach((doc) => {
        eventsList.push({ id: doc.id, ...doc.data() } as Event);
      });
      setEvents(eventsList);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleAddEvent = async () => {
    console.log('handleAddEvent called with:', newEvent);
  
    if (!newEvent.title.trim() || !newEvent.date.trim() || !newEvent.location.trim()) {
    alert('Please fill in required fields');
    return;
    }

    console.log('Validation passed, attempting to add event...');
  
    try {
      console.log('Adding event to Firestore...');
      const docRef = await addDoc(collection(db, 'events'), {
        ...newEvent,
        capacity: parseInt(newEvent.capacity) || 0
      });
      console.log('Event added successfully with ID:', docRef.id);
      setNewEvent({ title: '', description: '', date: '', location: '', capacity: '' });
      setOpen(false);
      fetchEvents();
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Error adding event: ' + error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteDoc(doc(db, 'events', eventId));
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
            Events & Activities
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Manage your organization's events, workshops, and networking activities
          </Typography>
        </Box>

        {/* Controls */}
        <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none', mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search events..."
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
                Create Event
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Events Grid */}
        <Grid container spacing={3}>
          {filteredEvents.map((event) => (
            <Grid item xs={12} md={6} key={event.id}>
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
                      backgroundColor: isUpcoming(event.date) ? '#10b981' : '#64748b',
                      fontSize: '1.1rem',
                      fontWeight: 600
                    }}>
                      <EventIcon />
                    </Avatar>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip 
                        label={isUpcoming(event.date) ? 'Upcoming' : 'Past'}
                        size="small" 
                        sx={{ 
                          backgroundColor: isUpcoming(event.date) ? '#f0fdf4' : '#f1f5f9',
                          color: isUpcoming(event.date) ? '#166534' : '#64748b',
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }} 
                      />
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteEvent(event.id)}
                        sx={{ color: '#ef4444' }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                    {event.title}
                  </Typography>
                  
                  {event.description && (
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 2, lineHeight: 1.5 }}>
                      {event.description}
                    </Typography>
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarToday fontSize="small" sx={{ color: '#64748b', mr: 1 }} />
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                      {formatDate(event.date)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn fontSize="small" sx={{ color: '#64748b', mr: 1 }} />
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      {event.location}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <People fontSize="small" sx={{ color: '#64748b', mr: 1 }} />
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      Capacity: {event.capacity} people
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button 
                      size="small" 
                      variant="contained"
                      disabled={!isUpcoming(event.date)}
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500
                      }}
                    >
                      {isUpcoming(event.date) ? 'Register' : 'View Details'}
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined"
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500
                      }}
                    >
                      Share
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none', mt: 3 }}>
            <CardContent sx={{ p: 6, textAlign: 'center' }}>
              <EventIcon sx={{ fontSize: 48, color: '#64748b', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#1e293b', mb: 1 }}>
                {searchTerm ? 'No events found' : 'No events scheduled'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Get started by creating your first event'
                }
              </Typography>
              {!searchTerm && (
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  onClick={() => setOpen(true)}
                >
                  Create First Event
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Create Event Dialog */}
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
            Create New Event
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              fullWidth
              label="Event Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              margin="normal"
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              label="Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              margin="normal"
              multiline
              rows={3}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              label="Location"
              value={newEvent.location}
              onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
              margin="normal"
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              label="Capacity"
              type="number"
              value={newEvent.capacity}
              onChange={(e) => setNewEvent({...newEvent, capacity: e.target.value})}
              margin="normal"
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
              onClick={handleAddEvent} 
              variant="contained"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Create Event
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Events;