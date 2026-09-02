# Plan — publish the AI paper cost report

## Success observation

The downloaded Brinkmann paper-cost analysis is available as a readable web report at `https://oserikov.github.io/ai-paper-costs-report-1`.

## Verification method

Validate the report source and generated HTML, serve the site locally and fetch the requested route, then push the focused commit and poll the public URL.

## Pass criteria

- The published report preserves the downloaded Markdown's title, estimates, tables, links, and sections.
- `/ai-paper-costs-report-1/` returns HTTP 200 locally and on GitHub Pages.
- The served HTML contains the report title and central `$620` estimate.
- The focused commit excludes the unrelated untracked `img/` directory.
- Checks complete in under one minute, excluding GitHub Pages deployment latency.

## Steps

1. [x] Create the report route from the downloaded Markdown with a responsive reading layout.
   > **Agent:** None — foreground in the main session, without worktree isolation or model override; this is one self-contained static route and parallel edits would add coordination overhead.
2. [x] Verify content fidelity, HTML structure, responsive styling, and local HTTP behavior.
   > **Agent:** None — foreground in the main session, without worktree isolation or model override; a focused source-and-boundary check is the fastest reliable verification.
3. [x] Commit only the report and task artifacts, push `main`, and verify the public URL.
   > **Agent:** None — foreground in the main session, without worktree isolation or model override; publication requires the existing repository's GitHub Pages deployment boundary.
