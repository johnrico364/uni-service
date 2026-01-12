# Firebase Authentication Setup Guide

This guide explains how to set up Firebase Authentication with your Node.js backend.

## Architecture Overview

- **Firebase Authentication**: Handles all user authentication (email/password, Google Sign-In)
- **MongoDB**: Stores application data (user profiles, services, orders, etc.)
- **Backend**: Verifies Firebase tokens and auto-creates MongoDB users

## Setup Steps

### 1. Install Dependencies

```bash
cd server
npm install
```

This will install `firebase-admin` along with other dependencies.

### 2. Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** (gear icon)
4. Click on **Service Accounts** tab
5. Click **Generate New Private Key**
6. Save the JSON file (keep it secure!)

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory:

**Option A: Using Service Account JSON (Recommended)**

```env
MONGO_DB_URI=mongodb://localhost:27017/uniservice
PORT=5000
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id",...}
```

Paste the entire JSON content as a single line, or use a file path.

**Option B: Using Individual Variables**

```env
MONGO_DB_URI=mongodb://localhost:27017/uniservice
PORT=5000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
```

### 4. Update User Model

The user model has been updated to:
- Include `firebaseUid` field (required, unique)
- Remove `password` field (authentication handled by Firebase)
- Set default status to "active"

### 5. How It Works

#### Authentication Flow:

1. **User logs in via Flutter app** → Firebase Authentication
2. **Flutter app gets Firebase ID token** → `user.getIdToken()`
3. **Flutter app makes API request** → Includes `Authorization: Bearer <token>` header
4. **Backend middleware verifies token** → `authenticateFirebase` middleware
5. **Backend checks MongoDB user** → Looks for user with matching `firebaseUid`
6. **Auto-creates user if needed** → Creates MongoDB user automatically
7. **Attaches user to request** → `req.user` contains MongoDB user object

#### Example API Request from Flutter:

```dart
import 'package:your_app/core/services/api_service.dart';

// Get current user
final response = await ApiService.get('/users/me');
final data = ApiService.handleResponse(response);
final user = data['data'];
```

### 6. Using the Middleware

#### Protect a route:

```javascript
import { authenticateFirebase } from "../middlewear/firebase-auth.js";

router.get("/protected", authenticateFirebase, (req, res) => {
  // req.user contains the MongoDB user object
  res.json({ user: req.user });
});
```

#### Protect with role-based authorization:

```javascript
import { authenticateFirebase, authorizeRoles } from "../middlewear/firebase-auth.js";

router.get("/admin-only", 
  authenticateFirebase, 
  authorizeRoles("admin", "super_admin"),
  (req, res) => {
    res.json({ message: "Admin access granted" });
  }
);
```

### 7. User Auto-Creation

When a user authenticates with Firebase for the first time:
- The middleware automatically creates a MongoDB user
- Uses Firebase UID as `firebaseUid`
- Extracts email, name, and profile picture from Firebase token
- Sets default role to "user" and status to "active"

### 8. Testing

1. Start your backend:
```bash
npm run dev
```

2. Test authentication:
```bash
# Get Firebase ID token from Flutter app
# Then test with curl:
curl -X GET http://localhost:5000/api/users/me \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN"
```

### 9. Flutter Integration

The Flutter app includes `ApiService` that automatically:
- Gets Firebase ID tokens
- Includes them in API requests
- Handles authentication errors

Example usage:
```dart
// Get current user
final response = await ApiService.get('/users/me');
final data = ApiService.handleResponse(response);

// Update user
final updateResponse = await ApiService.patch(
  '/users/${userId}',
  body: {'first_name': 'John'},
);
```

## Security Notes

- ✅ Never commit `.env` file to version control
- ✅ Keep Firebase service account key secure
- ✅ Use HTTPS in production
- ✅ Firebase tokens expire after 1 hour (automatically refreshed)
- ✅ MongoDB does NOT store passwords (Firebase handles all auth)

## Troubleshooting

**Error: "Firebase Admin not initialized"**
- Check your `.env` file has correct Firebase credentials
- Verify the service account key is valid

**Error: "Invalid or expired Firebase token"**
- Token may have expired (tokens last 1 hour)
- Flutter app should automatically refresh tokens

**Error: "User not authenticated"**
- Make sure Flutter app is sending `Authorization: Bearer <token>` header
- Verify user is logged in to Firebase
