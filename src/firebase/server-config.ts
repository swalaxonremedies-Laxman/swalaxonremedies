
import { initializeApp, getApps, getApp, App, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { firebaseConfig } from '@/firebase/config';

function getServiceAccount() {
    const serviceAccount = process.env.SERVICE_ACCOUNT;
    if (!serviceAccount) {
        throw new Error('SERVICE_ACCOUNT environment variable is not set.');
    }
    return JSON.parse(serviceAccount);
}

// IMPORTANT: DO NOT MODIFY THIS FILE
export function initializeServerApp() {
  if (getApps().length > 0) {
    const app = getApp();
    const firestore = getFirestore(app);
    const auth = getAuth(app);
    return { app, auth, firestore };
  }

  let app: App;

  try {
    const serviceAccount = getServiceAccount();
    app = initializeApp({
        credential: cert(serviceAccount),
        ...firebaseConfig,
    });
  } catch (e: any) {
     if (process.env.NODE_ENV === 'development') {
        console.warn('Could not initialize with service account, falling back to default. Error: ' + e.message);
     }
     // Fallback for environments where service account might not be set (e.g. some CI/CD)
     app = initializeApp();
  }
  
  const firestore = getFirestore(app);
  const auth = getAuth(app);

  return {
    app,
    auth,
    firestore,
  };
}
