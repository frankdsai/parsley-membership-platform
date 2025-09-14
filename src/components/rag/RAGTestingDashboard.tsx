// src/components/rag/RAGTestingDashboard.tsx
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Divider,
  Chip,
  Grid
} from '@mui/material';
import { getFeatureFlags } from '../../config/featureFlags';
import EnhancedAIChat from '../EnhancedAIChat'; // Your working chat
import RAGChat from './RAGChat'; // New RAG version
import DocumentUploader from './DocumentUploader';

const RAGTestingDashboard: React.FC = () => {
  const [testMode, setTestMode] = useState<'original' | 'rag'>('original');
  const [showUploader, setShowUploader] = useState(false);
  const flags = getFeatureFlags();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🧪 RAG Development & Testing
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>Safe Development Mode:</strong> Test RAG functionality without affecting your production Parsley AI chat.
        Currently on branch: <strong>rag-development</strong>
      </Alert>

      {/* Testing Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Testing Controls
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Button
                variant={testMode === 'original' ? 'contained' : 'outlined'}
                onClick={() => setTestMode('original')}
                color="success"
              >
                ✅ Original Chat (Working)
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={testMode === 'rag' ? 'contained' : 'outlined'}
                onClick={() => setTestMode('rag')}
                color="primary"
              >
                🧪 RAG Chat (Testing)
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={showUploader ? 'contained' : 'outlined'}
                onClick={() => setShowUploader(!showUploader)}
                color="info"
              >
                📚 Document Upload
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Feature Flags Status */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Current Configuration
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              label={`RAG: ${flags.enableRAG ? 'Enabled' : 'Disabled'}`}
              color={flags.enableRAG ? 'success' : 'default'}
              size="small"
            />
            <Chip 
              label={`Mode: ${flags.ragMode}`}
              color="info"
              size="small"
            />
            <Chip 
              label={`Upload: ${flags.enableDocumentUpload ? 'Enabled' : 'Disabled'}`}
              color={flags.enableDocumentUpload ? 'success' : 'default'}
              size="small"
            />
            <Chip 
              label={`Debug: ${flags.debugRAG ? 'On' : 'Off'}`}
              color={flags.debugRAG ? 'warning' : 'default'}
              size="small"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Document Uploader (Testing) */}
      {showUploader && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <DocumentUploader />
          </CardContent>
        </Card>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Chat Testing Area */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h6">
              {testMode === 'original' ? '✅ Original Chat (Safe)' : '🧪 RAG Chat (Testing)'}
            </Typography>
            {testMode === 'rag' && (
              <Chip label="Experimental" color="warning" size="small" />
            )}
          </Box>
          
          {testMode === 'original' && <EnhancedAIChat />}
          {testMode === 'rag' && <RAGChat />}
        </CardContent>
      </Card>
    </Box>
  );
};

export default RAGTestingDashboard;