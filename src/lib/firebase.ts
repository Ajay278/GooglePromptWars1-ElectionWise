/**
 * firebase.ts — Firebase app initialisation for ElectionWise.
 *
 * Provides a shared Firebase app instance and Firestore database reference
 * used across the application. Configuration is sourced entirely from
 * environment variables so credentials are never hard-coded.
 *
 * Google Services used:
 *  - Firebase App (core)
 *  - Cloud Firestore (structured civic-query logging)
 *  - Firebase Analytics (usage telemetry)
 */
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Prevent duplicate app initialisation during hot-module replacement
const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db: Firestore = getFirestore(app);

export default app;
