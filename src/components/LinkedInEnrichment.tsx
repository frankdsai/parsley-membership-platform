// src/components/LinkedInEnrichment.tsx - FIXED VERSION
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider
} from '@mui/material';
import { LinkedIn, CheckCircle, Person } from '@mui/icons-material';
import { linkedinService } from '../services/linkedinService';
import { LinkedInProfile } from '../types/user';

interface LinkedInEnrichmentProps {
  open: boolean;
  onClose: () => void;
  onEnrichmentComplete: (profile: LinkedInProfile) => void;
  existingLinkedInUrl?: string;
}

const LinkedInEnrichment: React.FC<LinkedInEnrichmentProps> = ({
  open,
  onClose,
  onEnrichmentComplete,
  existingLinkedInUrl = ''
}) => {
  const [linkedinUrl, setLinkedinUrl] = useState(existingLinkedInUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [enrichedProfile, setEnrichedProfile] = useState<LinkedInProfile | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Enter LinkedIn URL', 'Fetch Profile Data', 'Review & Confirm'];

  const handleEnrichProfile = async () => {
    if (!linkedinUrl.trim()) {
      setError('Please enter a LinkedIn profile URL');
      return;
    }

    setLoading(true);
    setError(null);
    setActiveStep(1);

    try {
      const profile = await linkedinService.enrichProfile(linkedinUrl);
      setEnrichedProfile(profile);
      setActiveStep(2);
      setSuccess(true);
    } catch (error: any) {
      // Fixed error handling - more robust error message extraction
      let errorMessage = 'Failed to enrich profile';
      
      if (error && typeof error === 'object') {
        if (error.message && typeof error.message === 'string') {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      setError(errorMessage);
      setActiveStep(0);
      console.error('LinkedIn enrichment error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmEnrichment = () => {
    if (enrichedProfile) {
      onEnrichmentComplete(enrichedProfile);
      handleClose();
    }
  };

  const handleClose = () => {
    setLinkedinUrl(existingLinkedInUrl);
    setLoading(false);
    setError(null);
    setSuccess(false);
    setEnrichedProfile(null);
    setActiveStep(0);
    onClose();
  };

  const isValidLinkedInUrl = (url: string): boolean => {
    const pattern = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-]+\/?$/;
    return pattern.test(url);
  };

  // Calculate profile completeness safely
  const calculateProfileCompleteness = (profile: LinkedInProfile): number => {
    let score = 0;
    if (profile.fullName) score += 15;
    if (profile.headline) score += 15;
    if (profile.summary && profile.summary.length > 50) score += 20;
    if (profile.workExperiences && profile.workExperiences.length > 0) score += 25;
    if (profile.education && profile.education.length > 0) score += 15;
    if (profile.skills && profile.skills.length >= 5) score += 10;
    return Math.min(score, 100);
  };

  // Determine expertise level safely
  const determineExpertiseLevel = (profile: LinkedInProfile): string => {
    if (!profile.workExperiences || profile.workExperiences.length === 0) {
      return 'Beginner';
    }

    const currentYear = new Date().getFullYear();
    const yearsExperience = profile.workExperiences.reduce((total, exp) => {
      const startYear = exp.startedOn?.year || currentYear;
      const endYear = exp.endedOn?.year || currentYear;
      return total + Math.max(0, endYear - startYear);
    }, 0);

    const hasLeadershipTitles = profile.workExperiences.some(exp => 
      /director|vp|ceo|cto|founder|head|lead|manager/i.test(exp.title || '')
    );

    const skillCount = profile.skills ? profile.skills.length : 0;

    if (yearsExperience >= 15 && hasLeadershipTitles && skillCount >= 20) {
      return 'Thought Leader';
    } else if (yearsExperience >= 8 && (hasLeadershipTitles || skillCount >= 15)) {
      return 'Expert';
    } else if (yearsExperience >= 3 && skillCount >= 8) {
      return 'Intermediate';
    } else {
      return 'Beginner';
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LinkedIn color="primary" />
        LinkedIn Profile Enrichment
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step 1: URL Input */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              Enter a LinkedIn profile URL to automatically enrich member data with professional information.
            </Typography>
            
            <TextField
              fullWidth
              label="LinkedIn Profile URL"
              placeholder="https://www.linkedin.com/in/username"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              error={linkedinUrl && !isValidLinkedInUrl(linkedinUrl)}
              helperText={
                linkedinUrl && !isValidLinkedInUrl(linkedinUrl)
                  ? 'Please enter a valid LinkedIn profile URL'
                  : 'Example: https://www.linkedin.com/in/johndoe'
              }
              sx={{ mb: 2 }}
            />

            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Note:</strong> This will use 1 LinkedIn credit from your Lix API account. 
                Profile data will be used to enhance member search and AI recommendations.
              </Typography>
            </Alert>

            {/* Test Mode Alert */}
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Test Mode:</strong> If you don't have a Lix API key yet, you can test with demo data by using the URL: https://www.linkedin.com/in/demo-user
              </Typography>
            </Alert>
          </Box>
        )}

        {/* Step 2: Loading */}
        {activeStep === 1 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Enriching Profile Data...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fetching professional information from LinkedIn
            </Typography>
          </Box>
        )}

        {/* Step 3: Profile Review */}
        {activeStep === 2 && enrichedProfile && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle color="success" />
              Profile Successfully Enriched
            </Typography>

            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main' }}>
                    {enrichedProfile.profileImageUrl ? (
                      <img 
                        src={enrichedProfile.profileImageUrl} 
                        alt={enrichedProfile.fullName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          // Fallback if image fails to load
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <Person />
                    )}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{enrichedProfile.fullName || 'Unknown Name'}</Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {enrichedProfile.headline || 'No headline available'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      📍 {enrichedProfile.location || 'Location not specified'}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Professional Summary</Typography>
                  <Typography variant="body2" sx={{ 
                    maxHeight: 80, 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {enrichedProfile.summary || 'No summary available'}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Experience</Typography>
                  <Typography variant="body2">
                    {(enrichedProfile.workExperiences || []).length} positions found
                  </Typography>
                  {(enrichedProfile.workExperiences || []).slice(0, 2).map((exp, index) => (
                    <Box key={index} sx={{ ml: 2, mt: 1 }}>
                      <Typography variant="body2">
                        <strong>{exp.title || 'Unknown Title'}</strong> at {exp.organisation?.name || 'Unknown Company'}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Top Skills</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(enrichedProfile.skills || []).slice(0, 6).map((skill, index) => (
                      <Chip 
                        key={index} 
                        label={skill.name || 'Skill'} 
                        size="small" 
                        variant="outlined"
                      />
                    ))}
                    {(!enrichedProfile.skills || enrichedProfile.skills.length === 0) && (
                      <Typography variant="body2" color="text.secondary">
                        No skills data available
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>Data Quality</Typography>
                  <Typography variant="body2">
                    Profile Completeness: {calculateProfileCompleteness(enrichedProfile)}%
                  </Typography>
                  <Typography variant="body2">
                    Expertise Level: {determineExpertiseLevel(enrichedProfile)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <Typography variant="body2">{error}</Typography>
            <Typography variant="body2" sx={{ mt: 1, fontSize: '0.8rem' }}>
              If you don't have a Lix API key, you can continue with manual profile data for now.
            </Typography>
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        
        {activeStep === 0 && (
          <Button
            variant="contained"
            onClick={handleEnrichProfile}
            disabled={!linkedinUrl || !isValidLinkedInUrl(linkedinUrl) || loading}
            startIcon={loading ? <CircularProgress size={20} /> : <LinkedIn />}
          >
            {loading ? 'Enriching...' : 'Enrich Profile'}
          </Button>
        )}

        {activeStep === 2 && (
          <Button
            variant="contained"
            onClick={handleConfirmEnrichment}
            startIcon={<CheckCircle />}
          >
            Confirm & Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default LinkedInEnrichment;