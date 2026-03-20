import React from 'react';
import { useUI } from '../hooks/useUI';
import { useAuth } from '../hooks/useAuth';
import { chatService } from '../services/chatService';

export default function LandingPage() {
  const { openLoginModal, openSignUpModal, openPrivacyModal, openTermsModal, openSupportModal } = useUI();
  const { setUser } = useAuth();

  const continueAsDemo = () => {
    const demoUser = {
      uid: 'demo-user',
      displayName: 'Demo User',
      email: 'demo@example.com',
      isDemo: true
    };
    setUser(demoUser);
    chatService.seedDemoChats(demoUser);
  };

  return (
    <div className="landing-page">
      <div className="landing-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="logo-section">
              <div className="logo-icon">💬</div>
              <h1 className="app-title">EchoDynamo</h1>
              <p className="app-tagline">Secure, fast, and feature-rich messaging app</p>
            </div>

            <div className="hero-features">
              <div className="feature-item">
                <div className="feature-icon">🔐</div>
                <h3>Enterprise Security</h3>
                <p>End-to-end encrypted chats with biometric & 2FA</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎥</div>
                <h3>Voice & Video Calls</h3>
                <p>WebRTC calling with screen sharing built-in</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">💼</div>
                <h3>Business & Family Ready</h3>
                <p>Stripe payments plus parental controls</p>
              </div>
            </div>

            <div className="cta-buttons" style={{ marginTop: '2rem' }}>
              <button className="btn btn-primary btn-large" onClick={openSignUpModal} data-testid="get-started-btn">
                Create Account
              </button>
              <button className="btn btn-secondary btn-large" onClick={openLoginModal} data-testid="sign-in-btn">
                Sign In
              </button>
              <button className="btn btn-secondary btn-large" onClick={continueAsDemo} data-testid="try-demo-btn">
                Try Demo
              </button>
            </div>
          </div>
        </section>

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
                const interval = setInterval(() => {
                      setActiveFeature(i => (i + 1) % FEATURES.length);
          }, 3200);
              return () => clearInterval(interval);
          }, []);
          
            const continueAsDemo = () => {
                const demoUser = { uid: 'demo-user', displayName: 'Demo User', email: 'demo@example.com', isDemo: true };
              setUser(demoUser);
              chatService.seedDemoChats(demoUser);
          };
          
            return (
              <div className={`landing-page${visible ? ' landing-visible' : ''}`}>
                      <div className="landing-container">
                      
                        {/* ── Hero ── */}
                              <section className="hero-section">
                                        <div className="hero-badge">🔒 End-to-end encrypted by default</div>div>
                              
                                        <div className="hero-logo-wrap">
                                                    <div className="hero-logo-ring">
                                                                  <div className="hero-logo-inner">💬</div>div>
                                                    </div>div>
                                        </div>div>
                              
                                        <h1 className="hero-title">
                                                    <span className="hero-title-main">EchoDynamo</span>span>
                                                    <span className="hero-title-sub">Messaging that means business</span>span>
                                        </h1>h1>
                              
                                        <p className="hero-desc">
                                                    Secure, encrypted conversations with voice &amp; video calls, built-in payments,
                                                    family safety tools, and a native app experience — all in one place.
                                        </p>p>
                              
                                        <div className="hero-cta">
                                                    <button className="btn btn-primary btn-hero" onClick={openSignUpModal} data-testid="get-started-btn">
                                                                  Get started free
                                                    </button>button>
                                                    <button className="btn btn-ghost btn-hero" onClick={openLoginModal} data-testid="sign-in-btn">
                                                                  Sign in
                                                    </button>button>
                                        </div>div>
                              
                                        <button className="hero-demo-link" onClick={continueAsDemo} data-testid="try-demo-btn">
                                                    Try the live demo — no account needed →
                                        </button>button>
                              
                                {/* Stats strip */}
                                        <div className="hero-stats">
                                          {STATS.map(s => (
                    <div className="hero-stat" key={s.label}>
                                    <span className="hero-stat-value">{s.value}</span>span>
                                    <span className="hero-stat-label">{s.label}</span>span>
                    </div>div>
                  ))}
                                        </div>div>
                              </section>section>
                      
                        {/* ── Feature spotlight ── */}
                              <section className="spotlight-section">
                                        <div className="spotlight-tabs">
                                          {FEATURES.map((f, i) => (
                    <button
                                      key={f.title}
                                      className={`spotlight-tab${i === activeFeature ? ' active' : ''}`}
                                      onClick={() => setActiveFeature(i)}
                                    >
                                    <span className="spotlight-tab-icon">{f.icon}</span>span>
                                    <span className="spotlight-tab-title">{f.title}</span>span>
                    </button>button>
                  ))}
                                        </div>div>
                                        <div className="spotlight-panel">
                                                    <div className="spotlight-icon">{FEATURES[activeFeature].icon}</div>div>
                                                    <div className="spotlight-content">
                                                                  <h3 className="spotlight-title">{FEATURES[activeFeature].title}</h3>h3>
                                                                  <p className="spotlight-desc">{FEATURES[activeFeature].desc}</p>p>
                                                    </div>div>
                                        </div>div>
                              </section>section>
                      
                        {/* ── Feature grid ── */}
                              <section className="features-section">
                                        <h2 className="section-heading">Everything you need, nothing you don't</h2>h2>
                                        <div className="features-grid">
                                          {FEATURES.map((f, i) => (
                    <div className="feature-card" key={f.title} style={{ animationDelay: `${i * 0.07}s` }}>
                                    <div className="feature-icon-large">{f.icon}</div>div>
                                    <h3>{f.title}</h3>h3>
                                    <p>{f.desc}</p>p>
                    </div>div>
                  ))}
                                        </div>div>
                              </section>section>
                      
                        {/* ── CTA ── */}
                              <section className="cta-section">
                                        <div className="cta-content">
                                                    <h2>Ready to make the switch?</h2>h2>
                                                    <p>Join thousands of users who chose privacy without compromise.</p>p>
                                                    <div className="cta-buttons">
                                                                  <button className="btn btn-primary btn-large" onClick={openSignUpModal}>
                                                                                  Create free account
                                                                  </button>button>
                                                                  <button className="btn btn-secondary btn-large" onClick={continueAsDemo}>
                                                                                  Explore the demo
                                                                  </button>button>
                                                    </div>div>
                                        </div>div>
                              </section>section>
                      
                        {/* ── Footer ── */}
                              <footer className="landing-footer">
                                        <div className="footer-content">
                                                    <p>© 2025 EchoDynamo · Bradley Virtual Solutions, LLC · Secure messaging for everyone.</p>p>
                                                    <div className="footer-links">
                                                                  <a href="#" onClick={e => { e.preventDefault(); openPrivacyModal(); }}>Privacy</a>a>
                                                                  <a href="#" onClick={e => { e.preventDefault(); openTermsModal(); }}>Terms</a>a>
                                                                  <a href="#" onClick={e => { e.preventDefault(); openSupportModal(); }}>Support</a>a>
                                                    </div>div>
                                        </div>div>
                              </footer>footer>
                      
                      </div>div>
              </div>div>
          );
          }</div>{/* Features Section */}
        <section className="features-section">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-large">💬</div>
              <h3>Rich Messaging</h3>
              <p>Share images, videos, voice notes, GIFs, polls, reactions, and more in real time.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-large">📞</div>
              <h3>Live Collaboration</h3>
              <p>Hop into voice or video calls and share your screen without leaving the chat.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-large">💸</div>
              <h3>Payments Built-In</h3>
              <p>Send or request money with Stripe Connect, track cashouts, and manage subscriptions.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-large">🛡️</div>
              <h3>Family Safety</h3>
              <p>Link parent and child accounts, approve contacts, and monitor activity with safety alerts.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-large">⚙️</div>
              <h3>Productivity Tools</h3>
              <p>Pin, forward, schedule, and search messages with responsive layouts across every device.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-large">📲</div>
              <h3>Installable PWA</h3>
              <p>Use EchoDynamo offline, receive push notifications, and enjoy a native app experience.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to get started?</h2>
            <p>Join thousands of users enjoying secure, fast messaging</p>
            <div className="cta-buttons">
              <button className="btn btn-primary btn-large" onClick={openSignUpModal}>
                Sign Up Now
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="landing-footer">
          <div className="footer-content">
            <p>© 2025 EchoDynamo is a product of Bradley Virtual Solutions, LLC. Secure messaging for everyone.</p>
            <div className="footer-links">
              <a href="#" onClick={(e) => { e.preventDefault(); openPrivacyModal(); }}>Privacy</a>
              <a href="#" onClick={(e) => { e.preventDefault(); openTermsModal(); }}>Terms</a>
              <a href="#" onClick={(e) => { e.preventDefault(); openSupportModal(); }}>Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

