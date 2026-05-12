# EchoDynamo - Advanced Secure Messaging Platform

EchoDynamo is a cutting-edge messaging application that combines enterprise-grade security, business features, and family safety controls in one powerful platform. The repository is currently in transition: the operational deployment target is Vercel-first, while parts of the application code and legacy assets still reference Firebase.

## Current Platform Status

- Default deployment path: Vercel (`npm run deploy`, `npm run deploy:vercel`)
- Monitoring classification: `Vercel + Neon`
- Neon health check: `GET https://echodynamo.vercel.app/api/health`
- Legacy Firebase assets remain in-repo for staged migration and rollback support
- Do not treat `firebase.json` or `functions/` as the primary production path without an explicit migration task
- Architecture notes: [`docs/CURRENT_ARCHITECTURE.md`](./docs/CURRENT_ARCHITECTURE.md)

### Dependency & security hygiene (maint. pass — Mar 2026)
- **`npm audit`:** clean for the **root SPA**, **`/functions`**, and **`/server`** after this refresh (run `npm install` in each folder on a fresh clone).
- **Root app:** removed unused **`jspdf`** (critical advisory surface); bumped **`firebase`**; moved **`firebase-admin`** to **devDependencies** (only scripts/tooling need it — the Vite client does not bundle it). Added **`baseline-browser-mapping`** for up-to-date baseline data with Vite legacy builds. **`overrides`** pin **`@tootallnate/once`** for patched transitive dependencies.
- **Cloud Functions:** **`firebase-admin@^12.7.0`** aligns with **`firebase-functions@5`** peer range; same **`overrides`** applied. Consider upgrading to **`firebase-functions@7`** later for first-class Admin 13 peers (requires API review).
- **Server:** Stripe/Express stack updated via **`npm audit fix`** (lockfile refreshed).

## 🚀 Key Features

### 💬 Messaging & Collaboration
- Real-time 1:1 and group chats backed by Firebase Firestore
- Rich media support for images, videos, voice notes, documents, stickers, and GIFs
- Message reactions, editing, deletion (self or everyone), forwarding, pinning, and disappearing timers
- Built-in polls, message scheduling, and powerful search across conversation history
- Read receipts, typing indicators, online presence, and handy keyboard shortcuts (Cmd/Ctrl+K for new chat, Cmd/Ctrl+F for search)

### 📞 Calls & Live Collaboration
- WebRTC voice and video calling with in-call mute/video controls and connection state monitoring
- Screen sharing for collaborative sessions directly from the chat
- Call invitations surfaced through `CallModal` for seamless transitions from messaging to live conversations

### 🔐 Security & Privacy
- End-to-end AES-256-GCM encryption with per-chat session keys and automatic rotation for forward secrecy
- Zero-knowledge IndexedDB key storage and optional disappearing messages
- Biometric unlock (Face ID / Touch ID) plus SMS-based two-factor authentication
- Privacy protections such as contact-only mode for minors and granular safety checks

### 💼 Business & Payments
- Stripe Connect integration for sending or requesting money, complete with fee calculators
- Cashout flows, transaction history, and subscription management (trial + recurring billing)
- Business profiles with hours, status, auto-replies, and reusable quick-reply templates
- Customer portal launchers and in-app analytics for response times, conversations, and satisfaction

### 👨‍👩‍👧 Family Safety Controls
- Parent and child account types with secure linking and verification
- Parent dashboard for contact approvals, safety alerts, and visibility into activity
- Automatic enforcement of contact-only mode and policy checks for minors

### ✨ Productivity & Experience
- Installable PWA with offline messaging, background sync, and push notifications
- Responsive layout for mobile, tablet, and desktop with light/dark themes
- Media gallery, emoji picker, sticker packs, and rich toast/error messaging
- Context menus, copy-to-clipboard, and other small touches that speed daily use

### 📊 Feedback & Administration
- In-app ratings, feature requests, and support ticket workflows
- Admin dashboard for triaging feedback, monitoring stats, and managing the queue

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18+ with Hooks
- **Build Tool**: Vite 7+
- **Styling**: CSS3 with CSS Variables for theming
- **State Management**: React Context API
- **Routing**: React Router (if needed)

### Backend & Services
- **Current deployment target**: Vercel-hosted frontend and server workflows
- **Operational monitoring target**: Vercel + Neon
- **Legacy runtime still present in source**: Firebase Authentication, Firestore, Storage, and Cloud Messaging
- **Payments**: Stripe Connect API
- **Encryption**: Web Crypto API (AES-256-GCM, PBKDF2)

### Infrastructure
- **Primary deployment path**: Vercel
- **Legacy deployment assets retained**: Firebase Hosting / Functions configs
- **SSL**: Managed by hosting platform
- **PWA**: Service Workers, Web App Manifest

## 📱 Progressive Web App (PWA)

EchoDynamo is a fully functional PWA that can be installed on any device:

- **Installable**: Add to home screen on mobile/desktop
- **Offline Support**: Works without internet connection
- **Push Notifications**: Native notification support
- **Background Sync**: Sync data when connection is restored
- **App-like Experience**: Full-screen, native feel
- **Service Worker**: Enhanced service worker with caching strategies

## 🎨 Responsive Design

EchoDynamo automatically adapts to all screen sizes:

- **Mobile**: Optimized for phones (320px+)
- **Tablet**: Perfect for tablets (768px+)
- **Desktop**: Full desktop experience (1024px+)
- **Large Screens**: Enhanced for large displays (1440px+)

## 🔒 Security Features

### Encryption (Better Than Signal)
- **Algorithm**: AES-256-GCM (using Web Crypto API - native, hardware-accelerated)
- **Key Derivation**: PBKDF2 with 600,000 iterations (6x more secure than Signal)
- **Perfect Forward Secrecy**: Automatic key rotation every 100 messages
- **Key Storage**: IndexedDB with zero-knowledge architecture
- **Authentication**: 128-bit authentication tags (maximum security)
- **Key Isolation**: Per-chat session keys for better security

### Privacy
- **No Data Collection**: Zero data harvesting
- **Local Encryption**: All encryption happens on device
- **Secure Storage**: Encrypted local storage
- **Privacy Controls**: Granular privacy settings
- **Contact-Only Mode**: Optional for adults, mandatory for minors

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Vercel account for the current deployment path
- Stripe account (for business features)
- Firebase account only if you are intentionally working on the legacy runtime pieces
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ronb12/EchoDynamo.git
   cd EchoDynamo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Review platform status before configuring services**
   - Read [`docs/CURRENT_ARCHITECTURE.md`](./docs/CURRENT_ARCHITECTURE.md)
   - Use Vercel as the default deployment target
   - Treat Firebase setup as legacy or transitional unless your task is specifically migrating or maintaining those flows

4. **Configure Stripe** (for business features)
   - Create a Stripe account
   - Get your API keys (test and live)
   - Update `.env` with Stripe keys:
     ```
     VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
     STRIPE_SECRET_KEY=sk_test_...
     ```

5. **Configure Environment Variables**
   Create a `.env` file:
   ```
   DATABASE_URL=postgresql://...
   POSTGRES_URL=postgresql://...
   NEON_DATABASE_URL=postgresql://...
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   VITE_API_BASE_URL=https://your-api-url.com
   ```

   On Vercel, the database URL aliases should be configured for Production, Preview, and Development. Production and Preview are stored as sensitive variables.

   Add Firebase variables only if you are maintaining the legacy client-side Firebase flows that still exist in `src/services/firebaseConfig.js`.

6. **Build the project**
   ```bash
   npm run build
   ```

7. **Deploy using the current default path**
   ```bash
   npm run deploy
   ```

   Legacy Firebase deployment commands remain available under `legacy:*` npm scripts for rollback or migration work.

### Development

1. **Start development server**
   ```bash
   npm run dev
   ```

2. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
EchoDynamo/
├── src/
│   ├── components/          # React components
│   │   ├── AdminDashboard.jsx
│   │   ├── AppHeader.jsx
│   │   ├── CallModal.jsx
│   │   ├── CashoutModal.jsx
│   │   ├── ChatArea.jsx
│   │   ├── ContactRequestModal.jsx
│   │   ├── FeatureRequestModal.jsx
│   │   ├── GroupChatModal.jsx
│   │   ├── LinkChildModal.jsx
│   │   ├── NewChatModal.jsx
│   │   ├── ParentDashboard.jsx
│   │   ├── RatingModal.jsx
│   │   ├── SendMoneyModal.jsx
│   │   ├── SettingsModal.jsx
│   │   ├── SignUpModal.jsx
│   │   └── ...
│   ├── services/            # Business logic services
│   │   ├── adminService.js
│   │   ├── authService.js
│   │   ├── biometricService.js
│   │   ├── businessService.js
│   │   ├── callService.js
│   │   ├── chatService.js
│   │   ├── contactService.js
│   │   ├── encryptionService.js
│   │   ├── feedbackService.js
│   │   ├── firebaseConfig.js
│   │   ├── minorSafetyService.js
│   │   ├── parentLinkService.js
│   │   └── ...
│   ├── contexts/            # React contexts
│   │   ├── AuthContext.jsx
│   │   ├── ChatContext.jsx
│   │   └── UIContext.jsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useChat.js
│   │   └── useUI.js
│   └── App.jsx              # Main app component
├── functions/               # Legacy Firebase Cloud Functions reference
│   ├── index.js            # Older Express.js API path
│   └── package.json
├── server/                  # Current server-side workflow
│   ├── server.js
│   └── README.md
├── public/                  # Static assets
│   ├── icons/              # App icons
│   ├── sw.js              # Service worker
│   └── manifest.json      # PWA manifest
├── firebase.json           # Legacy Firebase deployment configuration
├── firestore.rules         # Legacy Firestore security rules
├── storage.rules           # Legacy Storage security rules
├── vite.config.js          # Vite configuration
└── package.json            # Dependencies
```

## 🔧 Configuration

### Firebase Setup
Only do this when you are intentionally maintaining or migrating the legacy Firebase-backed flows that still remain in source.

### Stripe Setup
1. Create a Stripe account
2. Get API keys (test and live)
3. Configure webhooks for payment events
4. Update environment variables
5. Deploy Firebase Functions for API endpoints

### Environment Variables
Create a `.env` file (see Installation section above)

## 📱 Account Types

### Personal Account
- Standard messaging features
- Contact management
- File sharing
- Group chats
- All core features

### Business Account
- All personal account features
- Stripe payment integration
- Send/request money
- Cashout functionality
- Business profile
- Auto-reply and quick replies
- Business hours
- Analytics dashboard
- 7-day free trial, then subscription

### Parent Account
- All personal account features
- Link child accounts
- Parent dashboard
- Contact approval for children
- Activity monitoring
- Safety alerts

## 🔐 Security Best Practices

1. **HTTPS Only**: All connections encrypted
2. **Content Security Policy**: Strict CSP headers
3. **Secure Headers**: Security headers implemented
4. **Input Validation**: All inputs validated
5. **XSS Protection**: Cross-site scripting prevention
6. **CSRF Protection**: Cross-site request forgery prevention
7. **Firestore Rules**: Strict security rules
8. **Storage Rules**: Secure file upload rules

## 🚀 Deployment

### Vercel Production
```bash
# Default production deployment path
npm run deploy

# Alias-based Vercel deployment
npm run deploy:prod
```

### Legacy Firebase Deployments
```bash
# Legacy hosting
npm run legacy:deploy:hosting

# Legacy functions
npm run legacy:deploy:functions
```

### Custom Domain
Manage the current production domain through Vercel project settings and DNS.

## 🌐 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3s

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: See project wiki
- **Issues**: [GitHub Issues](https://github.com/ronb12/EchoDynamo/issues)
- **Email**: ronellbradley@bradleyvs.com (Admin)

## 🎯 Roadmap

- [x] End-to-end encryption
- [x] Business features with Stripe
- [x] Parent/Child accounts
- [x] Contact request system
- [x] Biometric authentication
- [x] Admin dashboard
- [x] Feedback system
- [x] Video calling (WebRTC integration)
- [x] Screen sharing
- [ ] Advanced search filters (date ranges, attachment filters)
- [ ] Custom themes & branding controls
- [ ] Multi-language support
- [ ] Voice message transcription
- [ ] Message translation
- [ ] Advanced group management (roles & permissions)
- [ ] Bot / automation integrations

## 📈 API Architecture

### EchoDynamo API
- **Current deployment intent**: Vercel-hosted API surface
- **Legacy API reference**: Firebase Functions artifacts remain in `functions/`
- **Health Check**: `GET /api/health` on Vercel, `GET /health` when running the server directly
- **Database Health**: The health response verifies Neon reachability when a database URL env var is configured
- **Stripe Endpoints**: `/api/stripe/*`
- **Payment Processing**: Stripe Connect integration
- **Webhooks**: Stripe webhook handling

## 🔄 Updates

EchoDynamo automatically updates:
- **Background Updates**: Seamless updates
- **Version Control**: Version management
- **Rollback Support**: Easy rollback if needed
- **Update Notifications**: User-friendly update notifications

---

**EchoDynamo** - The future of secure messaging. Built with ❤️ by Bradley Virtual Solutions, LLC.

**Primary deployment path**: Vercel

**Legacy live URL reference**: https://echochat-messaging.web.app

**Repository**: https://github.com/ronb12/EchoDynamo
