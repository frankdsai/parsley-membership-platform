// src/config/featureFlags.ts
export interface FeatureFlags {
  enableRAG: boolean;
  ragMode: 'basic' | 'enhanced' | 'hybrid';
  enableDocumentUpload: boolean;
  debugRAG: boolean;
}

export const getFeatureFlags = (): FeatureFlags => {
  return {
    enableRAG: process.env.REACT_APP_ENABLE_RAG === 'true',
    ragMode: (process.env.REACT_APP_RAG_MODE as any) || 'basic',
    enableDocumentUpload: process.env.REACT_APP_ENABLE_DOC_UPLOAD === 'true',
    debugRAG: process.env.REACT_APP_DEBUG_RAG === 'true'
  };
};