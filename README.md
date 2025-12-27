# Stock News Sentiment Dashboard

A React-based dashboard that displays real-time stock news updates with sentiment analysis for each article. Users can subscribe to stocks, view news categorized by industry, and authenticate using Google, GitHub, or email/password.

## Features

- 🔐 **Multiple Authentication Options**
  - Google Sign-In
  - GitHub Sign-In
  - Email/Password Authentication

- 📊 **My Stocks Page**
  - Subscribe to stocks of interest
  - View consolidated news feed from all subscribed stocks
  - Real-time sentiment analysis (Positive, Negative, Neutral)
  - Easy stock subscription management

- 🌐 **All Stocks Page**
  - Browse all available stocks
  - Filter by industry and sector
  - View detailed news for any stock
  - Subscribe/unsubscribe to stocks

- 📰 **News Features**
  - Real-time news updates
  - Sentiment analysis with confidence scores
  - Source attribution and timestamps
  - External links to full articles

## Tech Stack

- **Frontend Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v7
- **State Management:** TanStack Query (React Query)
- **Authentication:** Firebase Auth
- **Database:** Firebase Firestore
- **Styling:** CSS Modules with custom styles
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account (free tier works)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ElliottBolan/stock-news-sentiment.git
   cd stock-news-sentiment
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Firebase:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use existing one
   - Enable Authentication (Google, GitHub, Email/Password)
   - Enable Firestore Database
   - Copy your Firebase config from Project Settings

4. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Import the project on [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables in Netlify dashboard
6. Deploy!

## Firebase Setup Details

### Enable Authentication Providers

1. Go to Firebase Console > Authentication > Sign-in method
2. Enable **Google** provider
3. Enable **GitHub** provider (requires GitHub OAuth app)
4. Enable **Email/Password** provider

### Firestore Database Rules

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

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Layout.tsx     # Main layout with navigation
│   ├── NewsCard.tsx   # News article card
│   └── ProtectedRoute.tsx
├── contexts/          # React contexts
│   └── AuthContext.tsx
├── hooks/             # Custom React hooks
│   └── useSubscriptions.ts
├── pages/             # Page components
│   ├── Login.tsx      # Authentication page
│   ├── MyStocks.tsx   # Subscribed stocks page
│   └── AllStocks.tsx  # All stocks browser
├── services/          # API and service layers
│   ├── firebase.ts    # Firebase configuration
│   ├── stockApi.ts    # Stock news API
│   └── subscriptions.ts
├── types/             # TypeScript type definitions
│   └── index.ts
└── App.tsx            # Main application component
```

## Future Enhancements

- Integration with real stock news APIs (Alpha Vantage, Finnhub, News API)
- Real-time price data
- Advanced sentiment analysis using ML models
- Stock price charts
- Push notifications for subscribed stocks
- Portfolio tracking
- Export and sharing features
- Dark mode

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Stock data is currently mocked for demonstration purposes
- Sentiment analysis is simulated; integrate with real NLP services for production
- Icons from [Lucide](https://lucide.dev/)
