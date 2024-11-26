import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { scaleConfig } from './scale';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with persistence
const db = getFirestore(app);
enableIndexedDbPersistence(db, {
  synchronizeTabs: true,
  cacheSizeBytes: scaleConfig.performance.maxCacheSize
}).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('Browser doesn\'t support persistence');
  }
});

// Initialize Auth
const auth = getAuth(app);

// Database collections
export const collections = {
  USERS: 'users',
  QUESTS: 'quests',
  GUILDS: 'guilds',
  RAIDS: 'raids',
  LEADERBOARDS: 'leaderboards',
  SETTINGS: 'settings'
} as const;

// Cache durations
export const cacheDuration = {
  SHORT: 5 * 60 * 1000,    // 5 minutes
  MEDIUM: 15 * 60 * 1000,  // 15 minutes
  LONG: 60 * 60 * 1000     // 1 hour
} as const;

// Batch sizes for operations
export const batchSize = {
  WRITE: 500,              // Maximum batch write size
  READ: 1000,              // Maximum batch read size
  QUERY: 100               // Default query limit
} as const;

export { db, auth };