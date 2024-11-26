# Pan Da Pan - NFT Gaming Platform

Next generation frontend tooling with Vite. It's fast!

## Quick Start

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start development server:
```bash
npm run dev
```

## Firebase Setup

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Initialize Firebase Project
```bash
firebase init
```

Select the following options:
- Firestore
- Hosting
- Storage (optional)
- Emulators (recommended for local development)

### 4. Configure Firebase

Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Deploy to Firebase

Build the project:
```bash
npm run build
```

Deploy to Firebase:
```bash
firebase deploy
```

To deploy only specific features:
```bash
# Deploy only hosting
firebase deploy --only hosting

# Deploy only firestore rules
firebase deploy --only firestore:rules

# Deploy only storage rules
firebase deploy --only storage
```

## Development

### Local Development with Emulators

1. Start Firebase emulators:
```bash
firebase emulators:start
```

2. Start development server:
```bash
npm run dev
```

### Testing

Run tests:
```bash
npm run test
```

### Linting

Run ESLint:
```bash
npm run lint
```

## Project Structure

```
src/
├── components/     # React components
├── config/        # Configuration files
├── contexts/      # React contexts
├── hooks/         # Custom React hooks
├── services/      # Service layer
├── types/         # TypeScript types
└── utils/         # Utility functions
```

## Database Schema

### Firestore Collections

1. Users Collection:
```typescript
interface User {
  wallet: string;            // Primary key
  username: string | null;
  experience: number;
  level: number;
  questsCompleted: number;
  raidBossesDefeated: number;
  lastQuestCompletionTime: number;
  guild: string | null;
  archetype: string | null;
  inventory: string[];
  sessionKey?: string;
}
```

2. Quests Collection:
```typescript
interface Quest {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  description: string;
  xpReward: number;
  dateCreated: number;
  dateExpires: number;
  status: 'available' | 'completed' | 'expired';
  completedBy: string[];
}
```

3. Guilds Collection:
```typescript
interface Guild {
  id: string;
  name: string;
  description: string;
  members: string[];
  leaders: string[];
  totalXp: number;
  dateCreated: number;
  archetype: string;
}
```

## Security Rules

Update Firestore security rules in `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }
    
    // Quests
    match /quests/{questId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Guilds
    match /guilds/{guildId} {
      allow read: if true;
      allow write: if request.auth != null 
        && (resource == null 
            || resource.data.leaders.hasAny([request.auth.uid]));
    }
  }
}
```

## Environment Variables

Required environment variables:

```env
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Solana
VITE_SOLANA_RPC_URL=
VITE_SOLANA_NETWORK=

# Helius (Transaction Relayer)
VITE_HELIUS_API_KEY=
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details