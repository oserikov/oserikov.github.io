# Plan — remove ACL paper entry

## Success observation

The writing-sample page no longer contains the ACL Anthology paper link or its supplied description.

## Verification method

Check that the exact URL and description are absent from the source, then push the removal and check the public page.

## Pass criteria

The source and public page return no match for `https://aclanthology.org/2022.blackboxnlp-1.37/` or its blurb, while the public page still returns HTTP 200.

## Steps

1. [x] Remove the exact ACL paper paragraph from `link-to-a-writing-sample/index.html`.
   > **Agent:** None — foreground in the main session, without worktree isolation or model override; this is an exact reversal of the prior two-line addition.
2. [x] Verify the source and focused diff.
   > **Agent:** None — foreground in the main session, without worktree isolation or model override; the checks are immediate and guard the unrelated dirty file.
3. [x] Commit only the target page, push `main`, and verify removal from production.
   > **Agent:** None — foreground in the main session, without worktree isolation or model override; deployment is required to undo the public change.
