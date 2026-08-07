# Plan — merge `main` into postcard homepage branch

## Success observation

The current redesign branch contains all commits and assets from `main`, while the homepage remains the postcard redesign and its top card shows the small feedback link with the live response count.

## Verification method

Check Git ancestry and merge-parent structure, run JavaScript syntax and source checks, then serve the merged branch locally and inspect the rendered top card and feedback route.

## Pass criteria

- `main` is an ancestor of the current branch and HEAD is a two-parent merge commit.
- `feedback/index.html`, `feedback-count.js`, and the redesigned `homepage.js` coexist.
- The rendered top card contains `Leave feedback on me / see what others said: link (10 feedbacks so far)`.
- The checks complete in under one minute.

## Steps

1. [x] Commit the focused homepage feedback change before merging.
   > **Agent:** None — foreground in the main session, without worktree isolation or model override; a clean product commit prevents the merge from obscuring uncommitted work.
2. [x] Merge `main` and resolve homepage conflicts in favor of the redesign plus feedback integration.
   > **Agent:** None — foreground in the main session, without worktree isolation or model override; both sides modify the same homepage files and must be combined deliberately.
3. [x] Complete the merge commit and verify ancestry, assets, syntax, and the live render.
   > **Agent:** None — foreground in the main session, without worktree isolation or model override; the requested result is observable directly in the merged checkout.
4. [x] Make the feedback count script resolve relative to `index.html` and verify root and nested-preview URLs.
   > **Agent:** None — foreground in the main session, without worktree isolation or model override; this is a one-line path correction with two fast integration checks.
