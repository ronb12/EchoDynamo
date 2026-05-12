# EchoDynamo Current Architecture Status

This repository is in a transition state.

## Current default operational path

- Frontend and public deployment should be treated as Vercel-first.
- Monitoring for the live app should treat EchoDynamo as a `Vercel + Neon` property.
- Neon project: `EchoDynamo` (`rough-lab-13633561`) with database `echodynamo`.
- Production health check: `https://echodynamo.vercel.app/api/health` verifies the Vercel serverless API can query Neon.
- Root deployment commands now default to Vercel:
  - `npm run deploy`
  - `npm run deploy:vercel`
  - `npm run deploy:vercel:alias`

## Legacy or transitional assets still in the repo

- `firebase.json`
- `firestore.rules`
- `firestore.indexes.json`
- `storage.rules`
- `functions/`
- `src/services/firebaseConfig.js`
- Firebase-backed services under `src/services/`

These files are not proof that Firebase is still the intended production platform. They are retained because parts of the application code and older operational workflows have not been fully migrated yet.

## How to read the repo

- Use the root README for the current deployment entrypoint.
- Use `server/` for the actively maintained server-side Stripe/API workflow.
- Treat `functions/` and Firebase deployment commands as legacy reference or rollback material unless a migration task explicitly says otherwise.

## Migration note

This cleanup does not fully migrate authentication, chat storage, or media storage from Firebase to Neon. The current Neon-backed production surface is the server/API health and monitoring layer; remaining Firebase-backed client services should be treated as a separate staged migration project.
