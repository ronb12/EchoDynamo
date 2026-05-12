# EchoChat API (Legacy Firebase Functions Reference)

This directory contains the older Firebase Functions implementation that remains in the repository for reference and rollback support.

## Status

- This is not the default production deployment path for the current repo.
- Root deploy commands now target Vercel first.
- Keep this directory only for legacy maintenance, comparison, or staged migration work.

## Structure

```
functions/
├── index.js          # All API endpoints (Express app)
└── package.json      # Dependencies
```

## Current API Endpoints

### Stripe Integration
- `POST /api/stripe/create-account` - Create Stripe account
- `GET /api/stripe/account-status/:userId` - Get account status
- `POST /api/stripe/create-account-link` - Create onboarding link
- `POST /api/stripe/create-payment-intent` - Create payment intent
- `GET /api/stripe/subscription/:userId` - Get subscription
- `POST /api/stripe/create-checkout-session` - Create checkout
- `POST /api/stripe/create-portal-session` - Customer portal
- `POST /api/stripe/webhook` - Stripe webhooks

### Health Check
- `GET /api/health` - Server health

## Adding New Endpoints

### Example: Add Custom Endpoint

```javascript
// In functions/index.js

/**
 * Your custom endpoint
 * GET /api/custom-endpoint
 */
app.get('/api/custom-endpoint', async (req, res) => {
  try {
    // Your logic here
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Example: Firestore Integration

```javascript
/**
 * Get user data
 * GET /api/users/:userId
 */
app.get('/api/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const userDoc = await admin.firestore()
      .collection('profiles')
      .doc(userId)
      .get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      success: true,
      user: userDoc.data()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Legacy deployment

```bash
# Deploy legacy functions
firebase deploy --only functions

# Or deploy all legacy Firebase resources
firebase deploy
```

## Local legacy development

```bash
# Start emulators
firebase emulators:start --only functions

# Functions available at:
# http://localhost:5001/YOUR_PROJECT/us-central1/api
```

## Configuration

Set environment variables:

```bash
firebase functions:config:set stripe.secret_key="sk_live_..."
firebase functions:config:set stripe.webhook_secret="whsec_..."
firebase functions:config:set app.frontend_url="https://echochat-messaging.web.app"
```

## Accessing Config in Code

```javascript
const stripeKey = functions.config().stripe?.secret_key;
const frontendUrl = functions.config().app?.frontend_url;
```

## API URL

Legacy Firebase endpoints were exposed at:
- Production: `https://echochat-messaging.web.app/api/*`
- Local: `http://localhost:5001/YOUR_PROJECT/us-central1/api`

For current repo operations, prefer the Vercel deployment path documented in the root README and [`docs/CURRENT_ARCHITECTURE.md`](../docs/CURRENT_ARCHITECTURE.md).

## Adding More Features

Just add more routes to `functions/index.js`! The Express app handles all routing.

