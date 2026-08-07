# Verification — postcard homepage promotion

- [x] `node --check homepage.js && node --check feedback-count.js` passes
- [x] `git diff --check` passes before commit
- [x] Smoke test: local HTTP serves `/`, `/homepage.md`, and `/feedback/` with status 200
- [x] Content: served Markdown contains the latest `Make public knowledge safer` section and hard-break syntax
- [x] Integration: `main` and `homepage-postcards-backup-20260602` point to the same commit
- [x] Repository: promotion leaves the `main` worktree clean
- [x] Publication: `origin/main` matches local `main` after push
