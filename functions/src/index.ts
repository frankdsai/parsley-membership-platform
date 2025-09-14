import { initializeApp } from 'firebase-admin/app';
import { processDocument } from './documentProcessor';

initializeApp();

export { processDocument };