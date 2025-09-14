"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processDocument = void 0;
// functions/src/documentProcessor.ts
const functions = __importStar(require("firebase-functions"));
const firestore_1 = require("firebase-admin/firestore");
exports.processDocument = functions.https.onCall(async (data, context) => {
    try {
        // Initialize Firestore inside the function call
        const db = (0, firestore_1.getFirestore)();
        const { documentId, gcsPath, fileName, fileType, textContent } = data;
        console.log(`Processing document: ${fileName}`);
        // For now, work with provided text content
        let extractedText = textContent || 'Sample document content for testing RAG functionality.';
        // Clean and preprocess text
        const cleanedText = extractedText
            .replace(/\r\n/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .replace(/\s{2,}/g, ' ')
            .trim();
        // Create chunks
        const chunks = createTextChunks(cleanedText);
        // Store chunks in Firestore
        const documentChunks = [];
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const documentChunk = {
                id: `${documentId}_chunk_${i}`,
                documentId,
                chunkIndex: i,
                text: chunk,
                metadata: {
                    fileName,
                    fileType,
                    chunkTokens: estimateTokens(chunk)
                },
                createdAt: new Date()
            };
            documentChunks.push(documentChunk);
        }
        // Store chunks in Firestore using batch write
        const batch = db.batch();
        documentChunks.forEach(chunk => {
            const docRef = db.collection('documentChunks').doc(chunk.id);
            batch.set(docRef, chunk);
        });
        await batch.commit();
        // Update document status
        await db.collection('documents').doc(documentId).set({
            fileName,
            fileType,
            gcsPath,
            totalChunks: documentChunks.length,
            status: 'processed',
            processedAt: new Date(),
            textLength: extractedText.length
        });
        console.log(`Successfully processed ${fileName}: ${documentChunks.length} chunks created`);
        return {
            success: true,
            documentId,
            chunksCreated: documentChunks.length,
            textLength: extractedText.length,
            message: 'Document processed successfully'
        };
    }
    catch (error) {
        console.error('Document processing error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        throw new functions.https.HttpsError('internal', `Failed to process document: ${errorMessage}`);
    }
});
function createTextChunks(text) {
    const sentences = text.split(/(?<=[.!?])\s+/);
    const chunks = [];
    let currentChunk = '';
    let currentTokens = 0;
    const maxTokens = 512;
    for (const sentence of sentences) {
        const sentenceTokens = estimateTokens(sentence);
        if (currentTokens + sentenceTokens > maxTokens && currentChunk) {
            chunks.push(currentChunk.trim());
            currentChunk = sentence;
            currentTokens = sentenceTokens;
        }
        else {
            currentChunk += (currentChunk ? ' ' : '') + sentence;
            currentTokens += sentenceTokens;
        }
    }
    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
    }
    return chunks;
}
function estimateTokens(text) {
    return Math.ceil(text.length / 4);
}
//# sourceMappingURL=documentProcessor.js.map