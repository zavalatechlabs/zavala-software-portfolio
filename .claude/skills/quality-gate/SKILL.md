---
name: quality-gate
description: Run the full quality check pipeline (type-check, lint, format-check, test, build). Use before committing or when you want to verify everything passes.
disable-model-invocation: false
allowed-tools: Bash(npm run type-check*) Bash(npm run lint*) Bash(npm run format:check*) Bash(npm test *) Bash(npm run build*)
argument-hint: '[fix] [skip-build]'
---

Run the full quality verification pipeline in order. Stop on first failure.

1. If "$ARGUMENTS" contains "fix": run `npm run lint:fix` and `npm run format` first
2. `npm run type-check`
3. `npm run lint`
4. `npm run format:check`
5. `npm test -- --passWithNoTests`
6. Unless "$ARGUMENTS" contains "skip-build": `RESEND_API_KEY=re_test_dummy npm run build`

Report a summary table showing PASS/FAIL per step with error details on failure.
