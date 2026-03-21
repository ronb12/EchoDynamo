import React, { useEffect, useRef } from 'react';
import { useUI } from '../hooks/useUI';

const SECTIONS = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: `By accessing or using EchoDynamo ("the Service"), operated by Bradley Virtual Solutions, LLC ("Company," "we," "us," or "our"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service.

These Terms apply to all users of EchoDynamo, including registered users, demo users, and visitors. Your continued use of the Service constitutes your ongoing acceptance of these Terms.`
  },
  {
    id: 'eligibility',
    title: '2. Eligibility',
    content: `You must be at least 13 years of age to use EchoDynamo. Users between 13 and 17 years of age must have verifiable parental or guardian consent. Users under 13 years of age are prohibited from using this Service.

By using EchoDynamo, you represent and warrant that you meet the eligibility requirements stated above and that all information you provide is accurate and complete.`
  },
  {
    id: 'account',
    title: '3. Account Registration & Security',
    content: `To access the full features of EchoDynamo, you must register for an account. You agree to:

• Provide accurate, current, and complete registration information
• Maintain and update your information to keep it accurate
• Keep your password confidential and not share it with anyone
• Notify us immediately of any unauthorized use of your account
• Accept responsibility for all activities that occur under your account

We reserve the right to terminate accounts that violate these Terms or that have been inactive for an extended period.`
  },
  {
    id: 'conduct',
    title: '4. Acceptable Use',
    content: `You agree to use EchoDynamo only for lawful purposes and in accordance with these Terms. You agree NOT to:

• Transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable
• Impersonate any person or entity or falsely represent your affiliation with any person or entity
• Upload or transmit viruses, malware, or any other malicious code
• Attempt to gain unauthorized access to any part of the Service or its related systems
• Use the Service to send unsolicited messages (spam) or engage in phishing
• Collect or harvest personal data from other users without consent
• Violate any applicable local, state, national, or international law or regulation
• Use the Service to facilitate illegal transactions of any kind
• Interfere with or disrupt the integrity or performance of the Service`
  },
  {
    id: 'content',
    title: '5. User Content',
    content: `EchoDynamo allows you to create, send, store, and share messages, files, and other content ("User Content"). You retain ownership of your User Content.

By submitting User Content, you grant Bradley Virtual Solutions, LLC a limited, non-exclusive, royalty-free license to store and transmit that content solely for the purpose of providing the Service to you.

You are solely responsible for your User Content and the consequences of sharing it. We do not endorse any User Content or any opinion, recommendation, or advice expressed therein.

We reserve the right, but are not obligated, to remove User Content that violates these Terms or that we determine is otherwise objectionable.`
  },
  {
    id: 'encryption',
    title: '6. encrypted & Privacy',
    content: `EchoDynamo provides encrypted for messages. This means that message contents are encrypted on your device and can only be decrypted by the intended recipient. We do not have access to the content of your encrypted messages.

While we implement strong security measures, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security of your data.

Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference.`
  },
  {
    id: 'payments',
    title: '7. Payments & Subscriptions',
    content: `EchoDynamo offers premium subscription plans and built-in payment features powered by Stripe. By using payment features, you agree to Stripe's Terms of Service in addition to these Terms.

• Subscription fees are billed in advance on a monthly or annual basis
• A 7-day free trial is available for new subscribers; you will be charged at the end of the trial period unless you cancel
• All fees are non-refundable except as required by applicable law
• We reserve the right to change our pricing with 30 days' notice
• You are responsible for all taxes applicable to your subscription

Send Money features are subject to additional verification requirements and applicable financial regulations.`
  },
  {
    id: 'minors',
    title: '8. Parental Controls & Minor Accounts',
    content: `EchoDynamo offers parental control features that allow parents or guardians to link and monitor minor accounts. Parents and guardians are responsible for:

• Supervising their minor child's use of the Service
• Reviewing and approving their child's contacts
• Monitoring activity as enabled by the parental controls feature
• Ensuring their child uses the Service in compliance with these Terms

We comply with the Children's Online Privacy Protection Act (COPPA) and do not knowingly collect personal information from children under 13.`
  },
  {
    id: 'intellectual-property',
    title: '9. Intellectual Property',
    content: `The EchoDynamo name, logo, and all related marks, designs, and software are the property of Bradley Virtual Solutions, LLC and are protected by intellectual property laws.

You may not copy, modify, distribute, sell, or lease any part of the Service or its software, nor may you reverse engineer or attempt to extract the source code, except as permitted by applicable law or with our written consent.`
  },
  {
    id: 'disclaimers',
    title: '10. Disclaimers & Limitation of Liability',
    content: `THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.

TO THE MAXIMUM EXTENT PERMITTED BY LAW, BRADLEY VIRTUAL SOLUTIONS, LLC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.

OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING UNDER THESE TERMS SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM.`
  },
  {
    id: 'termination',
    title: '11. Termination',
    content: `We may suspend or terminate your account and access to the Service at our sole discretion, with or without notice, for conduct that we believe violates these Terms or is harmful to other users, us, third parties, or the law.

You may terminate your account at any time by contacting us or using the account deletion feature in Settings. Upon termination, your right to use the Service ceases immediately.

Provisions that by their nature should survive termination will survive, including ownership provisions, warranty disclaimers, and limitations of liability.`
  },
  {
    id: 'governing-law',
    title: '12. Governing Law & Disputes',
    content: `These Terms shall be governed by and construed in accordance with the laws of the State of [Your State], without regard to its conflict of law provisions.

Any dispute arising from these Terms or your use of the Service shall first be attempted to be resolved through informal negotiation. If not resolved within 30 days, disputes shall be submitted to binding arbitration in accordance with the American Arbitration Association rules.`
  },
  {
    id: 'accessibility',
    title: '13. Accessibility',
    content: `Bradley Virtual Solutions, LLC is committed to ensuring that EchoDynamo is accessible to individuals with disabilities in accordance with the Americans with Disabilities Act (ADA) and Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.

If you experience accessibility barriers while using EchoDynamo, please contact us at accessibility@echodynamo.com. We will make reasonable efforts to address accessibility issues promptly.

We welcome feedback on how we can improve accessibility of our Service.`
  },
  {
    id: 'changes',
    title: '14. Changes to Terms',
    content: `We reserve the right to modify these Terms at any time. We will notify you of material changes by:

• Sending an in-app notification
• Displaying a prominent notice on the Service
• Sending an email to your registered email address

Your continued use of the Service after changes become effective constitutes your acceptance of the revised Terms. If you do not agree to the updated Terms, you must stop using the Service.`
  },
  {
    id: 'contact',
    title: '15. Contact Information',
    content: `If you have any questions, concerns, or feedback regarding these Terms of Service, please contact us:

Bradley Virtual Solutions, LLC
Email: legal@echodynamo.com
Accessibility: accessibility@echodynamo.com
Support: support@echodynamo.com

We aim to respond to all inquiries within 2 business days.`
  }
];

export default function TermsOfServiceModal() {
  const { showTermsModal, closeTermsModal } = useUI();
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const lastFocusedRef = useRef(null);

  // Trap focus inside modal when open (ADA/WCAG 2.1 — Focus Management)
  useEffect(() => {
    if (showTermsModal) {
      lastFocusedRef.current = document.activeElement;
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    } else if (lastFocusedRef.current) {
      lastFocusedRef.current.focus();
    }
  }, [showTermsModal]);

  // Close on Escape (WCAG 2.1 — Keyboard Accessible)
  useEffect(() => {
    if (!showTermsModal) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') closeTermsModal();
      // Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [showTermsModal, closeTermsModal]);

  if (!showTermsModal) return null;

  const LAST_UPDATED = 'March 20, 2026';

  return (
    <div
      className="modal active"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tos-title"
      aria-describedby="tos-description"
      onClick={(e) => e.target === e.currentTarget && closeTermsModal()}
    >
      <div
        className="modal-content tos-modal-content"
        ref={modalRef}
        style={{ maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Sticky header */}
        <div
          className="modal-header"
          style={{ position: 'sticky', top: 0, background: 'var(--background-color)', zIndex: 10, borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}
        >
          <h2 id="tos-title" style={{ margin: 0 }}>Terms of Service</h2>
          <button
            ref={closeButtonRef}
            className="modal-close"
            onClick={closeTermsModal}
            aria-label="Close Terms of Service"
          >
            &times;
          </button>
        </div>

        {/* Scrollable body */}
        <div
          className="modal-body"
          style={{ padding: '1.5rem 2rem', overflowY: 'auto', flex: 1 }}
          tabIndex={0}
          aria-label="Terms of Service content"
        >
          <p id="tos-description" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            <strong>Last Updated:</strong> {LAST_UPDATED}
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Please read these Terms of Service carefully before using EchoDynamo. These terms constitute a legally binding agreement between you and Bradley Virtual Solutions, LLC.
          </p>

          {/* Table of contents — skip link for screen readers */}
          <nav aria-label="Terms of Service sections" style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(0,132,255,0.06)', borderRadius: '10px', border: '1px solid rgba(0,132,255,0.12)' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-color)' }}>Table of Contents</h3>
            <ol style={{ margin: 0, paddingLeft: '1.25rem', columns: 2, columnGap: '1rem' }}>
              {SECTIONS.map(s => (
                <li key={s.id} style={{ marginBottom: '0.3rem' }}>
                  <a
                    href={`#tos-${s.id}`}
                    style={{ color: 'var(--primary-color, #0084ff)', fontSize: '0.82rem', textDecoration: 'underline' }}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(`tos-${s.id}`)?.scrollIntoView({ behavior: 'smooth' });
                      document.getElementById(`tos-${s.id}`)?.focus();
                    }}
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Sections */}
          {SECTIONS.map(s => (
            <section
              key={s.id}
              id={`tos-${s.id}`}
              aria-labelledby={`tos-heading-${s.id}`}
              tabIndex={-1}
              style={{ marginBottom: '2rem', outline: 'none' }}
            >
              <h3
                id={`tos-heading-${s.id}`}
                style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary-color, #0084ff)', lineHeight: 1.3 }}
              >
                {s.title}
              </h3>
              {s.content.split('\n\n').map((para, i) => (
                <p key={i} style={{ marginBottom: '0.75rem', lineHeight: 1.75, fontSize: '0.92rem', color: 'var(--text-color)', whiteSpace: 'pre-line' }}>
                  {para}
                </p>
              ))}
            </section>
          ))}

          {/* Accessibility statement banner */}
          <div
            role="complementary"
            aria-label="Accessibility commitment"
            style={{ marginTop: '2rem', padding: '1rem 1.25rem', background: 'rgba(0,132,255,0.07)', border: '1px solid rgba(0,132,255,0.2)', borderRadius: '10px' }}
          >
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              <strong style={{ color: 'var(--text-color)' }}>♿ Accessibility Commitment:</strong> EchoDynamo is built to WCAG 2.1 Level AA standards. If you need this document in an alternative format or experience any accessibility barriers, contact us at <a href="mailto:accessibility@echodynamo.com" style={{ color: 'var(--primary-color, #0084ff)' }}>accessibility@echodynamo.com</a>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="modal-footer"
          style={{ padding: '1rem 2rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, gap: '1rem', flexWrap: 'wrap' }}
        >
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            © 2025 Bradley Virtual Solutions, LLC. All rights reserved.
          </p>
          <button
            className="btn btn-primary"
            onClick={closeTermsModal}
            aria-label="Accept and close Terms of Service"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}