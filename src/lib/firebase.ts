// lib/firebase.ts
import { initializeApp, FirebaseApp, getApps, getApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Type definitions for clarity
interface FirebaseService {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
}

// Initialize these only once globally
let firebaseServices: FirebaseService | null = null;

// Function to get/initialize Firebase instances
function getFirebaseServices(): FirebaseService {
  // Check if Firebase app already exists
  const existingApp = getApps().length > 0 ? getApp() : null;

  if (!firebaseServices || !existingApp) {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    const app = existingApp || initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    firebaseServices = { app, auth, db };
  }
  return firebaseServices;
}

// Export the instances via a getter, or directly for client components
// We'll export directly for ease of use in your client components.
// The key here is that 'app/page.tsx' *is* a client component.
// If you had a server component that needed Firebase Admin SDK, it would use a separate file.
export const app = getFirebaseServices().app;
export const auth = getFirebaseServices().auth;
export const db = getFirebaseServices().db;