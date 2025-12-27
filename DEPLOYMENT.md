# Deployment Guide

This guide will help you deploy the Stock News Sentiment Dashboard to free hosting platforms.

## Prerequisites

1. A Firebase account (free tier)
2. A GitHub account
3. Your code pushed to a GitHub repository

## Step 1: Set Up Firebase

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "stock-news-sentiment")
4. Disable Google Analytics (optional for this project)
5. Click "Create project"

### Enable Authentication

1. In Firebase Console, go to **Build** > **Authentication**
2. Click "Get started"
3. Enable the following sign-in methods:
   - **Email/Password**: Toggle to enable
   - **Google**: Enable and select support email
   - **GitHub**: 
     - Go to GitHub > Settings > Developer settings > OAuth Apps
     - Create new OAuth App
     - Copy Authorization callback URL from Firebase
     - Paste Client ID and Client Secret into Firebase

### Set Up Firestore Database

1. In Firebase Console, go to **Build** > **Firestore Database**
2. Click "Create database"
3. Select production mode or test mode (test mode for development)
4. Choose a location closest to your users
5. Click "Enable"

### Configure Security Rules

In Firestore Database, go to **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /subscriptions/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Click "Publish"

### Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click the web icon (`</>`) to add a web app
4. Register app with nickname (e.g., "stock-dashboard")
5. Copy the configuration object:

```javascript
{
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
}
```

## Step 2: Deploy to Vercel (Recommended)

### Option A: Deploy via Vercel Dashboard

1. Go to [Vercel](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New..." > "Project"
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add Environment Variables:
   - Click "Environment Variables"
   - Add each variable from your Firebase config:
     ```
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```
7. Click "Deploy"

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Create .env.production file with Firebase config
cat > .env.production << EOF
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
EOF

# Deploy
vercel --prod
```

## Step 3: Deploy to Netlify (Alternative)

### Option A: Deploy via Netlify Dashboard

1. Go to [Netlify](https://netlify.com)
2. Sign in with GitHub
3. Click "Add new site" > "Import an existing project"
4. Choose GitHub and select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click "Show advanced"
7. Click "New variable" and add environment variables:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
8. Click "Deploy site"

### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Create .env.production file (same as Vercel)

# Deploy
netlify deploy --prod
```

## Step 4: Configure Firebase for Production

### Add Authorized Domains

1. In Firebase Console, go to **Authentication** > **Settings** > **Authorized domains**
2. Add your production domain:
   - For Vercel: `your-app.vercel.app`
   - For Netlify: `your-app.netlify.app`
3. Click "Add domain"

### Update OAuth Redirect URIs (for GitHub)

If using GitHub authentication:

1. Go to GitHub > Settings > Developer settings > OAuth Apps
2. Edit your OAuth app
3. Add your production URL to "Authorization callback URL":
   - `https://your-project.firebaseapp.com/__/auth/handler`

## Step 5: Verify Deployment

1. Visit your deployed URL
2. Test login with:
   - Email/Password (create new account)
   - Google Sign-In
   - GitHub Sign-In
3. Subscribe to stocks and verify functionality
4. Check news feed updates
5. Test industry filtering on All Stocks page

## Troubleshooting

### Authentication Errors

- **"auth/unauthorized-domain"**: Add your domain to Firebase authorized domains
- **"auth/popup-blocked"**: Enable popups in browser for OAuth
- **GitHub OAuth fails**: Check redirect URI in GitHub OAuth app settings

### Build Errors

- **"Cannot find module"**: Run `npm install` locally and verify package.json
- **Environment variables not working**: Ensure they're prefixed with `VITE_`
- **Build timeout**: Increase build timeout in hosting platform settings

### Runtime Errors

- **Firebase not initialized**: Verify all environment variables are set
- **CORS errors**: Check Firebase configuration and authorized domains
- **News not loading**: Check browser console for errors

## Updating Environment Variables

### Vercel

1. Go to project settings
2. Navigate to "Environment Variables"
3. Edit or add variables
4. Redeploy to apply changes

### Netlify

1. Go to Site settings > Build & deploy > Environment
2. Edit variables
3. Trigger new deploy

## Custom Domain (Optional)

### Vercel

1. Go to project settings > Domains
2. Add your custom domain
3. Configure DNS as instructed
4. Update Firebase authorized domains

### Netlify

1. Go to Domain settings
2. Add custom domain
3. Configure DNS as instructed
4. Update Firebase authorized domains

## Monitoring and Analytics

### Vercel Analytics

- Enable in project settings
- View traffic and performance metrics

### Netlify Analytics

- Available on paid plans
- Provides traffic insights

### Firebase Analytics

- Enable in Firebase Console
- Track user engagement
- Monitor authentication success rates

## Cost Considerations

All services used offer generous free tiers:

- **Firebase**: 
  - Auth: 50,000 MAU free
  - Firestore: 1 GB storage, 50,000 reads/day free
  
- **Vercel**: 
  - 100 GB bandwidth/month
  - Unlimited deployments
  
- **Netlify**: 
  - 100 GB bandwidth/month
  - Unlimited deployments

Typical usage for this app stays well within free limits.

## Next Steps

After deployment:

1. **Integrate Real APIs**: Replace mock data with real stock news APIs
2. **Add Analytics**: Integrate Firebase Analytics or Google Analytics
3. **Enable Monitoring**: Set up error tracking with Sentry
4. **Performance**: Add service workers for offline support
5. **Features**: Add notifications, dark mode, export features

## Support

For issues or questions:

1. Check Firebase Console logs
2. Review browser console errors
3. Check Vercel/Netlify deployment logs
4. Refer to the main README.md for architecture details
