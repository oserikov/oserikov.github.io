# Plan — promote postcard homepage to `main`

## Success observation

Local `main` points to the committed postcard homepage branch tip and contains the user's latest `homepage.md` copy together with all accumulated rendering fixes.

## Verification method

Run JavaScript syntax and whitespace checks, fetch the homepage sources through the local HTTP server, then verify branch identity and a clean worktree after the fast-forward.

## Pass criteria

- `node --check homepage.js && node --check feedback-count.js` passes.
- `git diff --check` passes before commit.
- Local HTTP requests for `/`, `/homepage.md`, and `/feedback/` return 200.
- `main` and `homepage-postcards-backup-20260602` resolve to the same commit.
- The checks complete in under one minute.

## Steps

1. [x] Review and prepare the complete homepage diff for promotion.
   > **Agent:** None — foreground in the main session, without worktree isolation or model override; the dirty text and rendering changes must remain together exactly as reviewed.
2. [x] Commit the approved homepage state on the redesign branch.
   > **Agent:** None — foreground in the main session, without worktree isolation or model override; one commit provides an auditable promotion point while preserving the existing merge ancestry.
3. [x] Fast-forward `main` and verify syntax, served assets, branch identity, and worktree state.
   > **Agent:** None — foreground in the main session, without worktree isolation or model override; `main` is already an ancestor, so a local fast-forward is the smallest safe integration.
