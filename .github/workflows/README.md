# CI/CD Workflows

## Enabling CI

The workflow is **disabled by default** (manual trigger only via `workflow_dispatch`).

To enable automatic CI, edit `.github/workflows/ci.yml` and uncomment the `push` and `pull_request` triggers near the top of the file:

```yaml
push:
  branches: [main]
pull_request:
  branches: [main]
```

## Jobs

| Job                    | Purpose                                                           | Depends on         |
| ---------------------- | ----------------------------------------------------------------- | ------------------ |
| **lint-and-typecheck** | Runs `next lint` and `tsc --noEmit`                               | --                 |
| **test**               | Runs Jest with `--coverage --no-cache`, uploads coverage artifact | lint-and-typecheck |
| **build**              | Runs `next build` to verify production build                      | test               |

## Security measures

| Measure                           | Why                                                                                               |
| --------------------------------- | ------------------------------------------------------------------------------------------------- |
| **SHA-pinned actions**            | Prevents tag-hijacking attacks where a malicious commit is force-pushed to a tag like `v4`.       |
| **`permissions: contents: read`** | Least-privilege; the workflow cannot write to the repo, create releases, or access other scopes.  |
| **No secrets in env**             | The build works without environment variables. No secrets are exposed to logs or forked-PR runs.  |
| **Concurrency control**           | Cancels in-progress runs for the same branch, saving runner minutes and avoiding race conditions. |
| **`timeout-minutes: 10`**         | Prevents runaway jobs from consuming unlimited minutes.                                           |
| **`npm ci`**                      | Deterministic installs from the lockfile; prevents supply-chain drift.                            |
| **Only official `actions/*`**     | No third-party actions; reduces the trusted-code surface area.                                    |
| **Dependabot**                    | Automatically opens PRs when action or npm dependency updates are available.                      |
| **Artifact retention: 7 days**    | Keeps coverage reports accessible without accumulating storage bloat.                             |

## Adding secrets later

If you add a Vercel deploy step or need API keys at build time:

1. Go to **Settings > Secrets and variables > Actions** in the GitHub repo.
2. Add repository secrets (e.g., `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`).
3. Reference them in the workflow:
   ```yaml
   env:
     VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
   ```
4. Never hard-code secrets in the workflow file.
