import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Initialize Firebase Admin SDK
// Option 1: Using service account JSON (recommended for production)
// Download your service account key from Firebase Console:
// Project Settings > Service Accounts > Generate New Private Key
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else if (process.env.FIREBASE_PROJECT_ID) {
  // Option 2: Using environment variables (alternative)
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
} else {
  console.warn(
    "⚠️  Firebase Admin not initialized. Set FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_PROJECT_ID in .env"
  );
}

export default admin;
