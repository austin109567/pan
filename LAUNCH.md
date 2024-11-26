# Pan Da Pan Launch Guide

## Prerequisites

- Node.js 18.0.0 or higher
- npm 7.0.0 or higher

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_HELIUS_API_KEY=your_helius_api_key
```

3. Start the development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

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
```