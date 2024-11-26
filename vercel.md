# Deploying Raid Rally to Vercel

This guide will walk you through deploying the Raid Rally application to Vercel.

## Prerequisites

1. A GitHub account
2. A Vercel account (you can sign up at [vercel.com](https://vercel.com) using your GitHub account)
3. Your project pushed to a GitHub repository

## Environment Variables

Before deploying, make sure to set up the following environment variables in Vercel:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SOLANA_NETWORK=devnet
```

## Deployment Steps

1. **Prepare Your Repository**
   - Ensure your code is pushed to GitHub
   - Make sure your `package.json` has the correct build script:
     ```json
     {
       "scripts": {
         "build": "vite build"
       }
     }
     ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..."
   - Select "Project"
   - Choose your GitHub repository

3. **Configure Project**
   - Framework Preset: Select "Vite"
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Development Command: `npm run dev`

4. **Environment Variables**
   - In the Vercel project settings, go to "Environment Variables"
   - Add all required environment variables listed above
   - Make sure to add them to all environments (Production, Preview, Development)

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

## Post-Deployment

1. **Verify Environment**
   - Check if all features are working correctly
   - Test wallet connections
   - Verify quest submissions and interactions

2. **Domain Setup (Optional)**
   - In project settings, go to "Domains"
   - Add your custom domain if desired
   - Follow Vercel's DNS configuration instructions

## Troubleshooting

If you encounter any issues:

1. **Build Failures**
   - Check build logs in Vercel dashboard
   - Verify all dependencies are correctly installed
   - Ensure environment variables are properly set

2. **Runtime Errors**
   - Check browser console for errors
   - Verify Supabase connection
   - Check Solana wallet connectivity

3. **Common Issues**
   - Missing environment variables
   - Incorrect build output directory
   - Node.js version conflicts

## Automatic Deployments

Vercel will automatically deploy:
- Every push to the main branch
- Pull request previews (for reviewing changes)

## Development Workflow

1. **Local Development**
   ```bash
   npm run dev
   ```

2. **Testing Production Build**
   ```bash
   npm run build
   npm run preview
   ```

3. **Deploying Updates**
   - Push changes to GitHub
   - Vercel will automatically deploy

## Security Notes

1. Never commit sensitive environment variables
2. Use Vercel's environment variable encryption
3. Regularly rotate API keys and update them in Vercel

## Support

If you need help with your deployment:
1. Check [Vercel Documentation](https://vercel.com/docs)
2. Visit [Vite Documentation](https://vitejs.dev/guide/)
3. Review [Supabase Documentation](https://supabase.io/docs)

## Monitoring

1. **Vercel Analytics**
   - Enable in project settings
   - Monitor performance metrics
   - Track deployment success

2. **Error Tracking**
   - Use Vercel Error Tracking
   - Monitor console errors
   - Set up alerts for critical issues
