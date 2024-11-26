# Pan Da Pan Setup Guide

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables (see below)
4. Start development server: `npm run dev`

## Environment Setup

Create a `.env` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Solana Configuration
VITE_SOLANA_RPC_URL=your_rpc_url
VITE_SOLANA_NETWORK=mainnet-beta

# Helius Configuration (Transaction Relayer)
VITE_HELIUS_API_KEY=your_helius_api_key
```

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project"
3. Follow the setup wizard
4. Enable Google Analytics (optional)

### 2. Configure Authentication

1. In Firebase Console, go to Authentication
2. Click "Get Started"
3. Enable the following providers:
   - Anonymous (for guest access)
   - Custom Authentication (for wallet sign-in)

### 3. Set Up Firestore Database

1. Go to Firestore Database
2. Click "Create Database"
3. Choose production or test mode
4. Select a location

### 4. Create Collections

Set up the following collections with their respective schemas:

#### Users Collection
```typescript
interface User {
  wallet: string;            // Primary key
  username: string | null;   // Optional username
  handle: string | null;     // Social media handle
  profilePicture: string | null;
  experience: number;
  dateJoined: number;
  questsCompleted: number;
  raidBossesDefeated: number;
  lastQuestCompletionTime: number;
  showWallet: boolean;
  guild: string | null;      // Guild ID
  archetype: string | null;  // Player archetype
  discordHandle: string | null;
  sessionKey?: string;       // For guest accounts
}
```

#### Quests Collection
```typescript
interface Quest {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'raid-boss';
  title: string;
  description: string;
  xpReward: number;
  dateCreated: Timestamp;
  dateAvailable: Timestamp;
  dateExpires: Timestamp;
  status: 'available' | 'completed' | 'expired';
  completedBy: string[];
  isAutomatic?: boolean;
  imageUrl?: string;
  questUrl?: string;
}
```

#### Guilds Collection
```typescript
interface Guild {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  members: string[];
  leaders: string[];
  totalXp: number;
  dateCreated: Timestamp;
  archetype: GuildArchetype;
  isCore: boolean;
  bank?: {
    address: string;
    balance: number;
    weeklyReward: number;
    lastRewardDate: Timestamp;
  };
}
```

#### Raids Collection
```typescript
interface Raid {
  id: string;
  boss: {
    id: string;
    name: string;
    level: number;
    health: number;
    maxHealth: number;
    defense: number;
    imageUrl: string;
    description: string;
    quests: RaidQuest[];
    rewards: {
      xp: number;
      bonusXp: number;
    };
  };
  participants: RaidParticipant[];
  startTime: Timestamp;
  endTime: Timestamp;
  status: 'preparing' | 'active' | 'completed' | 'failed';
  questCompletions: number;
}
```

### 5. Set Up Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isAdmin() {
      return isAuthenticated() && exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }

    // User profiles
    match /users/{userId} {
      allow read: if true;
      allow create: if isOwner(userId);
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }

    // Quests
    match /quests/{questId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();

      match /submissions/{submissionId} {
        allow read: if true;
        allow create: if isAuthenticated();
        allow update, delete: if isAdmin();
      }
    }

    // Guilds
    match /guilds/{guildId} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update: if request.auth.uid in resource.data.leaders || isAdmin();
      allow delete: if isAdmin();
    }

    // Raids
    match /raids/{raidId} {
      allow read: if true;
      allow create: if isAdmin();
      allow update: if isAuthenticated();
      allow delete: if isAdmin();
    }
  }
}
```

### 6. Create Indexes

Create the following composite indexes:

1. Users collection:
   - Fields: guild (Ascending) + experience (Descending)
   - Query scope: Collection

2. Quests collection:
   - Fields: type (Ascending) + status (Ascending) + dateExpires (Ascending)
   - Query scope: Collection

3. Raids collection:
   - Fields: status (Ascending) + startTime (Descending)
   - Query scope: Collection

4. Guilds collection:
   - Fields: isCore (Ascending) + totalXp (Descending)
   - Query scope: Collection

## Development Mode

The development server will start at `http://localhost:5173`. The page will automatically reload if you make changes to the code.

## Production Build

To create a production build:

1. Run the build command:
```bash
npm run build
```

2. The built files will be in the `dist` directory

3. To preview the production build:
```bash
npm run preview