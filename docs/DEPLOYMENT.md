# Deployment Guide

This guide covers deploying the Zavala Software Portfolio to Vercel.

## Prerequisites

- GitHub repository: https://github.com/zavalatechlabs/zavala-software-portfolio
- Vercel account (free tier is sufficient)
- Environment variables (if using Resend for contact form)

## Vercel Deployment Steps

### 1. Import Project to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import `zavalatechlabs/zavala-software-portfolio`

### 2. Configure Build Settings

Vercel should auto-detect Next.js settings:

- **Framework Preset:** Next.js
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install` (auto-detected)
- **Development Command:** `npm run dev` (auto-detected)

### 3. Configure Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

```bash
# Required for contact form (once implemented)
RESEND_API_KEY=re_your_api_key_here

# Optional: Site URL for metadata
NEXT_PUBLIC_BASE_URL=https://your-vercel-domain.vercel.app
```

**Note:** Environment variables are optional for Phase 2. Contact form will be implemented in Phase 3.

### 4. Deploy

1. Click "Deploy"
2. Wait for build to complete (~1-2 minutes)
3. Vercel will provide a preview URL: `https://zavala-software-portfolio-xxx.vercel.app`

### 5. Verify Deployment

Visit your deployment URL and check:

- ✅ Homepage loads
- ✅ Navigation works (About, Projects, Contact)
- ✅ Project pages render correctly
- ✅ Styling looks correct
- ✅ No console errors

## Automatic Deployments

Once connected, Vercel will automatically:

- Deploy every push to `main` branch → Production
- Deploy every PR → Preview deployment with unique URL
- Run type checks and linting
- Generate build logs

## Custom Domain (Optional)

To add a custom domain (e.g., `zavalatechlabs.com`):

1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records (Vercel provides instructions)
4. SSL certificate is automatic

## Rollback

If a deployment fails or has issues:

1. Go to Deployments tab
2. Find previous working deployment
3. Click "⋯" menu → Promote to Production

## Monitoring

Vercel provides:

- **Analytics:** Page views, performance, Web Vitals
- **Logs:** Real-time function logs
- **Insights:** Performance metrics and suggestions

Access via Project Dashboard.

## Troubleshooting

### Build Fails

1. Check build logs in Vercel dashboard
2. Verify build works locally: `npm run build`
3. Check Node.js version (18.x or higher)
4. Ensure all dependencies are in `package.json`

### Environment Variables Not Working

1. Verify variables are set in Vercel dashboard
2. Redeploy after adding variables
3. Check variable names (typos?)
4. Use `NEXT_PUBLIC_` prefix for client-side variables

### Styling Issues

1. Clear browser cache
2. Check Tailwind CSS is configured correctly
3. Verify `postcss.config.js` exists
4. Run `npm run build` locally to test

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel CLI](https://vercel.com/docs/cli) - Optional for command-line deployments

## Status

- **Current Deployment:** Not yet deployed
- **Target URL:** TBD
- **Production URL:** TBD

Once deployed, update this section with actual URLs.
