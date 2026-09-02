# Plan — publish AI paper cost report 2

## Success observation

The newest downloaded paper-cost analysis is readable at `https://oserikov.github.io/ai-paper-costs-report-2`.

## Verification method

Check source fidelity and local HTTP output, then push one focused commit and fetch production.

## Pass criteria

- The route preserves the downloaded report's sections and links.
- Local and production routes return HTTP 200 with the report title and `$75` central estimate.
- The unrelated untracked `img/` directory remains untouched.

## Steps

1. [x] Generate the static report route and preserve its Markdown source.
   > **Agent:** None — foreground in the main session, without worktree isolation or model override; one small static route is fastest serially.
2. [x] Run source and local HTTP checks.
   > **Agent:** None — foreground in the main session, without worktree isolation or model override; focused checks cover this static publication.
3. [/] Commit, push, and verify production.
   > **Agent:** None — foreground in the main session, without worktree isolation or model override; the existing GitHub Pages boundary is required.
