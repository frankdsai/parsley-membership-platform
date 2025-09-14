// src/components/rag/DocumentUploader.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
  Alert
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';

interface DocumentUploadProps {
  onUploadComplete?: (documentInfo: DocumentInfo) => void;
}

interface DocumentInfo {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  status: 'uploading' | 'processing' | 'ready' | 'error';
}

const DocumentUploader: React.FC<DocumentUploadProps> = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);

  const handleFileSelect = async (files: FileList) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => file.size < 5 * 1024 * 1024); // 5MB limit

    if (validFiles.length === 0) {
      alert('Please select files under 5MB');
      return;
    }

    setUploading(true);

    for (const file of validFiles) {
      await processFile(file);
    }

    setUploading(false);
  };

  const processFile = async (file: File): Promise<void> => {
    const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const docInfo: DocumentInfo = {
      id: documentId,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date(),
      status: 'uploading'
    };

    setDocuments(prev => [...prev, docInfo]);

    try {
      // Read file content
      const text = await readFileContent(file);
      
      // Update status to processing
      setDocuments(prev => 
        prev.map(doc => doc.id === documentId ? {...doc, status: 'processing'} : doc)
      );

      // Create chunks and store in Firestore
      await createAndStoreChunks(documentId, file.name, file.type, text);

      // Update status to ready
      setDocuments(prev => 
        prev.map(doc => doc.id === documentId ? {...doc, status: 'ready'} : doc)
      );

      if (onUploadComplete) {
        onUploadComplete({...docInfo, status: 'ready'});
      }

      console.log(`Document processed: ${file.name}`);

    } catch (error) {
      console.error('Processing failed:', error);
      setDocuments(prev => 
        prev.map(doc => doc.id === documentId ? {...doc, status: 'error'} : doc)
      );
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve(result || `Sample content for ${file.name}`);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const createAndStoreChunks = async (documentId: string, fileName: string, fileType: string, text: string) => {
    // Simple chunking by sentences
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const chunks = [];
    let currentChunk = '';
    
    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      
      if (currentChunk.length + trimmed.length > 500) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = trimmed;
        }
      } else {
        currentChunk += (currentChunk ? '. ' : '') + trimmed;
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    // Store each chunk in Firestore
    for (let i = 0; i < chunks.length; i++) {
      const chunkData = {
        documentId,
        chunkIndex: i,
        text: chunks[i],
        metadata: {
          fileName,
          fileType,
          chunkTokens: Math.ceil(chunks[i].length / 4)
        },
        createdAt: new Date()
      };
      
      await addDoc(collection(db, 'documentChunks'), chunkData);
    }

    // Store document metadata
    await addDoc(collection(db, 'documents'), {
      documentId,
      fileName,
      fileType,
      totalChunks: chunks.length,
      status: 'processed',
      processedAt: new Date(),
      textLength: text.length
    });

    console.log(`Created ${chunks.length} chunks for ${fileName}`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const getStatusColor = (status: DocumentInfo['status']) => {
    switch (status) {
      case 'uploading': return 'info';
      case 'processing': return 'warning';
      case 'ready': return 'success';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Document Knowledge Base
      </Typography>
      
      <Card 
        sx={{ 
          mb: 3, 
          border: '2px dashed #ccc',
          '&:hover': { borderColor: '#1976d2' }
        }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Upload Knowledge Documents
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Drag and drop files here, or click to select
          </Typography>
          <Typography variant="caption" display="block" gutterBottom>
            Supported: Text files (max 5MB each)
          </Typography>
          
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUpload />}
            disabled={uploading}
            sx={{ mt: 2 }}
          >
            {uploading ? 'Processing...' : 'Select Documents'}
            <input
              type="file"
              hidden
              multiple
              accept=".txt,.md"
              onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
            />
          </Button>
        </CardContent>
      </Card>

      {uploading && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <CircularProgress size={16} />
            Processing documents for knowledge base...
          </Box>
        </Alert>
      )}

      {documents.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Processed Documents
            </Typography>
            <List>
              {documents.map((doc) => (
                <ListItem key={doc.id} divider>
                  <ListItemText
                    primary={doc.name}
                    secondary={`${(doc.size / 1024).toFixed(1)} KB • ${doc.uploadDate.toLocaleString()}`}
                  />
                  <Chip 
                    label={doc.status} 
                    color={getStatusColor(doc.status)}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default DocumentUploader;
