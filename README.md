# Raid Rally - Quest Management System

A blockchain-based quest tracking platform built with React, TypeScript, Supabase, and Solana integration.

## Features

- Dynamic quest submission and completion system
- Blockchain-based verification using Solana
- Real-time quest status tracking
- User profile management
- Pending submissions tracking
- Quest completion analytics

## Tech Stack

- Frontend: React + TypeScript
- Backend: Supabase
- Database: PostgreSQL
- Blockchain: Solana
- Build Tool: Vite
- Deployment: Vercel

## Quick Start

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Set up environment variables:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SOLANA_NETWORK=devnet
```
4. Start development server:
```bash
npm run dev
```

## Supabase Setup

1. Create a new Supabase project
2. Run the database setup scripts from `supabase/migrations`
3. Configure Row Level Security (RLS) policies
4. Set up the required database functions:
   - submit_quest
   - reject_quest_submission
   - get_available_quests

For detailed database setup instructions, check the SQL files in the `supabase/` directory.

## Development

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm run preview
```

## Deployment

We use Vercel for deployment. See [vercel.md](./vercel.md) for detailed deployment instructions.

Key deployment steps:
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy

## Project Structure

```
├── src/
│   ├── components/
│   │   └── Raid/           # Quest-related components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── types/              # TypeScript definitions
├── supabase/
│   ├── migrations/         # Database migration files
│   └── functions/          # Database functions
└── public/                 # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Testing

Run tests:
```bash
npm run test
```

## Linting

Run ESLint:
```bash
npm run lint
```

## License

MIT License - see LICENSE file for details