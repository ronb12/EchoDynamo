import React, { useState, useEffect } from 'react';
import { useUI } from '../hooks/useUI';
import { useAuth } from '../hooks/useAuth';
import { chatService } from '../services/chatService';

const FEATURES = [
  { icon: '🔐', title: 'End-to-End Encryption', desc: 'Every message encrypted with AES-256. No one — not even us — can read your chats.' },
  { icon: '🎥', title: 'HD Voice & Video', desc: 'Crystal-clear WebRTC calls with screen sharing, right inside the conversation.' },
  { icon: '💸', title: 'Built-in Payments', desc: 'Send money, split bills, and manage subscriptions via Stripe — without leaving the app.' },
  { icon: '🛡️', title: 'Family Safety', desc: 'Parent-child linked accounts, contact approvals, and real-time activity monitoring.' },
  { icon: '📊', title: 'Polls & Reactions', desc: 'Run group polls, react with emoji, pin important messages, and schedule sends.' },
  { icon: '📲', title: 'Works Everywhere', desc: 'Installable PWA with offline support and push notifications on any device.' },
];

const STATS = [
  { value: '256-bit', label: 'AES Encryption' },
  { value: '< 100ms', label: 'Message Latency' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: 'Zero', label: 'Ads, Ever' },
];

export default function LandingPage() {
  const { openLoginModal, openSignUpModal, openPrivacyModal, openTermsModal, openSupportModal } = useUI();
  const { setUser } = useAuth();
  const [activeFeature, setActiveFeature] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setActiveFeature(i => (i + 1) % FEATURES.length), 3200);
    return () => clearInterval(interval);
  }, []);

  const continueAsDemo = () => {
    const demoUser = { uid: 'demo-user', displayName: 'Demo User', email: 'demo@example.com', isDemo: true };
    setUser(demoUser);
    chatService.seedDemoChats(demoUser);
  };

  return (
    <div className={`landing-page${visible ? ' landing-visible' : ''}`}>
      {/* Skip to main content — WCAG 2.4.1 Bypass Blocks */}
      <a
        href="#main-content"
        className="skip-link"
        style={{
          position: 'absolute', left: '-9999px', top: 'auto',
          width: '1px', height: '1px', overflow: 'hidden',
          zIndex: 9999, background: 'var(--primary-color, #0084ff)',
          color: '#fff', padding: '8px 16px', borderRadius: '0 0 8px 0',
          fontWeight: 600, textDecoration: 'none',
        }}
        onFocus={e => { e.target.style.left = '0'; e.target.style.width = 'auto'; e.target.style.height = 'auto'; }}
        onBlur={e => { e.target.style.left = '-9999px'; e.target.style.width = '1px'; e.target.style.height = '1px'; }}
      >
        Skip to main content
      </a>

      <main id="main-content" className="landing-container" tabIndex={-1}>

        {/* ── Hero ── */}
        <section className="hero-section" aria-labelledby="hero-heading">
          <div className="hero-badge" role="note" aria-label="Security notice">
            🔒 End-to-end encrypted by default
          </div>
          <div className="hero-logo-wrap" aria-hidden="true">
            <div className="hero-logo-ring">
              <div className="hero-logo-inner">💬</div>
            </div>
          </div>
          <h1 className="hero-title" id="hero-heading">
            <span className="hero-title-main">EchoDynamo</span>
            <span className="hero-title-sub">Messaging that means business</span>
          </h1>
          <p className="hero-desc">
            Secure, encrypted conversations with voice &amp; video calls, built-in payments,
            family safety tools, and a native app experience — all in one place.
          </p>
          <div className="hero-cta" role="group" aria-label="Get started options">
            <button className="btn btn-primary btn-hero" onClick={openSignUpModal} data-testid="get-started-btn">
              Get started free
            </button>
            <button className="btn btn-ghost btn-hero" onClick={openLoginModal} data-testid="sign-in-btn">
              Sign in
            </button>
          </div>
          <button className="hero-demo-link" onClick={continueAsDemo} data-testid="try-demo-btn">
            Try the live demo — no account needed →
          </button>
          <div className="hero-stats" role="list" aria-label="Key statistics">
            {STATS.map(s => (
              <div className="hero-stat" key={s.label} role="listitem">
                <span className="hero-stat-value" aria-label={`${s.value} ${s.label}`}>{s.value}</span>
                <span className="hero-stat-label" aria-hidden="true">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Feature spotlight ── */}
        <section className="spotlight-section" aria-labelledby="spotlight-heading">
          <h2 id="spotlight-heading" className="sr-only">Feature highlights</h2>
          <div className="spotlight-tabs" role="tablist" aria-label="Feature categories">
            {FEATURES.map((f, i) => (
              <button
                key={f.title}
                role="tab"
                aria-selected={i === activeFeature}
                aria-controls={`spotlight-panel-${i}`}
                id={`spotlight-tab-${i}`}
                className={`spotlight-tab${i === activeFeature ? ' active' : ''}`}
                onClick={() => setActiveFeature(i)}
              >
                <span className="spotlight-tab-icon" aria-hidden="true">{f.icon}</span>
                <span className="spotlight-tab-title">{f.title}</span>
              </button>
            ))}
          </div>
          <div
            className="spotlight-panel"
            role="tabpanel"
            id={`spotlight-panel-${activeFeature}`}
            aria-labelledby={`spotlight-tab-${activeFeature}`}
          >
            <div className="spotlight-icon" aria-hidden="true">{FEATURES[activeFeature].icon}</div>
            <div className="spotlight-content">
              <h3 className="spotlight-title">{FEATURES[activeFeature].title}</h3>
              <p className="spotlight-desc">{FEATURES[activeFeature].desc}</p>
            </div>
          </div>
        </section>

        {/* ── Feature grid ── */}
        <section className="features-section" aria-labelledby="features-heading">
          <h2 id="features-heading" className="section-heading">Everything you need, nothing you don't</h2>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <article
                className="feature-card"
                key={f.title}
                style={{ animationDelay: `${i * 0.07}s` }}
                aria-label={f.title}
              >
                <div className="feature-icon-large" aria-hidden="true">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-section" aria-labelledby="cta-heading">
          <div className="cta-content">
            <h2 id="cta-heading">Ready to make the switch?</h2>
            <p>Join thousands of users who chose privacy without compromise.</p>
            <div className="cta-buttons" role="group" aria-label="Sign up options">
              <button className="btn btn-primary btn-large" onClick={openSignUpModal}>
                Create free account
              </button>
              <button className="btn btn-secondary btn-large" onClick={continueAsDemo}>
                Explore the demo
              </button>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="landing-footer" role="contentinfo">
          <div className="footer-content">
            <p>© 2025 EchoDynamo · Bradley Virtual Solutions, LLC · Secure messaging for everyone.</p>
            <nav className="footer-links" aria-label="Footer navigation">
              <a href="#" onClick={e => { e.preventDefault(); openPrivacyModal(); }}>Privacy Policy</a>
              <a href="#" onClick={e => { e.preventDefault(); openTermsModal(); }}>Terms of Service</a>
              <a href="#" onClick={e => { e.preventDefault(); openSupportModal(); }}>Support</a>
            </nav>
          </div>
        </footer>

      </main>
    </div>
  );
}