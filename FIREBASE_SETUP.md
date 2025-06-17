# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication for your Tutoro application.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Use project name: `tutoro-73ee2` (or choose your own)
4. Follow the setup wizard

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** sign-in provider
3. Optionally enable **Google** sign-in if you want social login

## Step 3: Get Firebase Configuration

1. Go to **Project settings** (gear icon)
2. In "Your apps" section, click **Web app** icon (`</>`)
3. Register your app with nickname "tutoro-web"
4. Copy the Firebase configuration object

## Step 4: Update Configuration

Update `src/lib/firebase.ts` with your actual Firebase configuration:****

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "tutoro-73ee2.firebaseapp.com",
  projectId: "tutoro-73ee2",
  storageBucket: "tutoro-73ee2.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Step 5: Test the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:5173/auth`
3. Try creating a new account
4. Try signing in with the created account
5. Verify you're redirected to the dashboard when authenticated
6. Verify you're redirected to auth when accessing `/dashboard` without being logged in

## Features Implemented

### 🔐 Authentication System
- **Email/Password Registration**: Users can create accounts with email and password
- **Email/Password Login**: Users can sign in with their credentials
- **Route Protection**: Dashboard and protected routes require authentication
- **Auto-redirect**: Automatic redirection based on authentication state
- **Logout Functionality**: Users can sign out from any page

### 🎨 User Interface
- **Modern Auth Forms**: Beautiful login/register forms with smooth transitions
- **Error Handling**: Clear error messages for authentication failures
- **Loading States**: Loading indicators during authentication processes
- **Responsive Design**: Works on desktop and mobile devices

### 🛡️ Security Features
- **Client-side Route Guards**: Automatic redirection for protected routes
- **Auth State Persistence**: Users stay logged in across browser sessions
- **Form Validation**: Email format and password length validation

## File Structure

```
src/
├── lib/
│   ├── firebase.ts      # Firebase configuration and initialization
│   ├── auth.ts          # Authentication store and functions
│   └── types.ts         # TypeScript type definitions
├── routes/
│   ├── +layout.svelte   # Main layout with auth-aware navigation
│   ├── +layout.ts       # Layout load function
│   ├── auth/
│   │   └── +page.svelte # Authentication page (login/register)
│   └── dashboard/
│       ├── +layout.svelte # Dashboard layout with auth protection
│       ├── +layout.ts     # Dashboard layout load function
│       └── +page.svelte   # Dashboard page
```

## Environment Variables (Optional)

For production, you can use environment variables by creating `.env.local`:

```env
PUBLIC_FIREBASE_API_KEY=your-api-key
PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=your-project-id
PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
PUBLIC_FIREBASE_APP_ID=your-app-id
```

Then update `firebase.ts` to use these variables.

## Troubleshooting

### Common Issues

1. **"Firebase not initialized"**: Make sure your Firebase config is correct
2. **"Auth domain not authorized"**: Add your domain to Firebase Auth settings
3. **"Invalid API key"**: Double-check your API key in Firebase console
4. **CORS errors**: Make sure your domain is added to Firebase authorized domains

### Firebase Console Settings

1. **Authentication > Settings > Authorized domains**: Add your deployment domain
2. **Authentication > Sign-in method**: Ensure Email/Password is enabled
3. **Project settings > General**: Verify your web app configuration

## Next Steps

- Add password reset functionality
- Implement email verification
- Add Google/social sign-in
- Add user profile management
- Implement role-based access control

## Support

If you encounter any issues, check:
1. Firebase Console for any configuration errors
2. Browser developer tools for JavaScript errors
3. Network tab for failed API requests
4. Firebase documentation: https://firebase.google.com/docs/auth
