# Deployment

How to deploy the Zavala Software Portfolio to Vercel.

## Pre-Deployment Checklist

Before deploying, verify everything passes locally:

1. Run `/quality-gate` (type-check, lint, format, test, build)
2. Confirm all required environment variables are set in the Vercel dashboard
3. Ensure `vercel.json` is committed and up to date
4. Check that no `.env` files or API keys are staged

## Environment Variables

### Required

| Variable         | Purpose                                        | Example                |
| ---------------- | ---------------------------------------------- | ---------------------- |
| `RESEND_API_KEY` | Resend API key for contact form email delivery | `re_your_api_key_here` |
| `CONTACT_EMAIL`  | Destination address for form submissions       | `you@example.com`      |

### Optional

| Variable                   | Purpose                                        | Default / Notes                             |
| -------------------------- | ---------------------------------------------- | ------------------------------------------- |
| `FROM_EMAIL`               | Sender address shown in emails                 | `Portfolio Contact <onboarding@resend.dev>` |
| `NEXT_PUBLIC_BASE_URL`     | Site URL for meta tags and canonical URLs      | `https://your-domain.com`                   |
| `UPSTASH_REDIS_REST_URL`   | Upstash Redis URL for persistent rate limiting | Falls back to in-memory                     |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis auth token                       | Falls back to in-memory                     |
| `RATE_LIMIT_ENABLED`       | Disable rate limiting for development          | `true` (enabled by default)                 |

Set environment variables in: Vercel Dashboard > Project Settings > Environment Variables.
Redeploy after adding or changing variables.

## Vercel Configuration

The project ships a `vercel.json` at the repository root:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next",
  "regions": ["iad1"]
}
```

- **Region:** `iad1` (US East, Virginia)
- **Framework:** Next.js (auto-detected by Vercel)
- **Node.js:** 18.17.0 or higher (see `engines` in `package.json`)

## Build Command and Output

| Step    | Command         | Output                         |
| ------- | --------------- | ------------------------------ |
| Install | `npm install`   | `node_modules/`                |
| Build   | `npm run build` | `.next/` directory             |
| Start   | `next start`    | Production server on port 3000 |

The build runs `next build`, which performs TypeScript type checking, ESLint linting, and static generation of all pages. Build time is approximately 1-2 minutes.

## Deployment Steps

1. Import `zavalatechlabs/zavala-software-portfolio` in Vercel
2. Vercel auto-detects Next.js and reads `vercel.json`
3. Add environment variables in the dashboard
4. Click Deploy

### Automatic Deployments

Once connected, Vercel deploys automatically:

- Push to `main` -- production deployment
- Pull request -- preview deployment with a unique URL

## Custom Domain

1. Go to Project Settings > Domains
2. Add your domain (e.g., `zavalatechlabs.com`)
3. Configure DNS records per Vercel instructions
4. SSL certificate is provisioned automatically

## Monitoring and Rollback

**Monitoring** -- Vercel provides Analytics (page views, Web Vitals), real-time function logs, and performance insights via the project dashboard.

**Rollback** -- If a deployment has issues:

1. Go to the Deployments tab
2. Find the last working deployment
3. Open its menu and select Promote to Production

## Troubleshooting

| Problem                  | Fix                                                                        |
| ------------------------ | -------------------------------------------------------------------------- |
| Build fails              | Check Vercel build logs; run `npm run build` locally                       |
| Env vars not loading     | Redeploy after adding; check for typos; use `NEXT_PUBLIC_` for client-side |
| Styling broken           | Clear browser cache; verify `postcss.config.js` and `tailwind.config.ts`   |
| Contact form not sending | Confirm `RESEND_API_KEY` and `CONTACT_EMAIL` are set                       |

## See Also

- [Full deployment reference](../docs/DEPLOYMENT.md)
- [Troubleshooting](11-troubleshooting.md)
- [Quick Start](01-quick-start.md)
- [Security Posture](security-posture.md)

---

`tags: deployment, vercel, environment-variables, ci-cd, production, hosting`
