# Verification — merged postcard homepage

- [x] Git: `git merge-base --is-ancestor main HEAD` passes and HEAD has two parents
- [x] Assets: `feedback/index.html`, `feedback-count.js`, and `homepage.js` coexist
- [x] `node --check homepage.js && node --check feedback-count.js` passes
- [x] Smoke test: merged branch renders the feedback sentence and live count inside the top card
- [x] Integration: `/feedback/` returns HTTP 200 in the local merged site
- [x] Preview compatibility: the live count renders when the repository is served at `/` and at a nested path
