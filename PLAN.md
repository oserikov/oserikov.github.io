# Plan — make the oversized cover fully swipeable on phones

## Success observation

At phone widths, the oversized horizontal cover begins within the document's left edge and all of its overflow extends to the right, making every part reachable through horizontal swiping. Wider layouts remain centered.

## Verification method

Check the responsive CSS structure and JavaScript syntax, then fetch the page and stylesheet through the local HTTP server.

## Pass criteria

- Desktop `.postcard-grid` and `.postcard-cover` centering rules remain intact.
- Below the two-card width, the grid uses `justify-content: start` and the cover uses `justify-self: start`.
- `/` and `/styles.css` return HTTP 200 and the served stylesheet contains both mobile overrides.
- Checks complete in under one minute.

## Steps

1. [x] Add a narrow-screen start-alignment override for the grid and cover.
   > **Agent:** None — foreground in the main session, without worktree isolation or model override; the defect is caused by two coupled CSS alignment declarations.
2. [x] Verify the responsive source, served assets, and unchanged desktop alignment.
   > **Agent:** None — foreground in the main session, without worktree isolation or model override; fast source and HTTP checks cover this localized stylesheet change.
3. [x] Commit and publish the mobile overflow fix to `main`.
   > **Agent:** None — foreground in the main session, without worktree isolation or model override; the reported defect is on the deployed GitHub Pages site.
