import React from 'react';
import Link from 'next/link';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Our Team', href: '/team' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' }
  ];

  const serviceLinks = [
    { name: 'Buy Properties', href: '/buy' },
    { name: 'Sell Properties', href: '/sell' },
    { name: 'Property Management', href: '/management' },
    { name: 'Investment Advisory', href: '/investment' }
  ];

  const resourceLinks = [
    { name: 'Market Reports', href: '/reports' },
    { name: 'Neighborhood Guide', href: '/neighborhoods' },
    { name: 'Financing Options', href: '/financing' },
    { name: 'Legal Resources', href: '/legal' }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Accessibility', href: '/accessibility' }
  ];

  return (
    <footer className={`professional-footer ${className}`}>
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          <div className="footer-grid">
            {/* Company Info */}
            <div className="footer-section company-section">
              <div className="footer-logo">
                <h3 className="logo-text">Million Properties</h3>
                <p className="logo-subtitle">Premium Real Estate</p>
              </div>
              <p className="company-description">
                Your trusted partner in luxury real estate. We specialize in connecting discerning clients 
                with exceptional properties that define modern living.
              </p>
              <div className="contact-info">
                <div className="contact-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="contact-icon">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span>123 Luxury Avenue, Elite District</span>
                </div>
                <div className="contact-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="contact-icon">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="contact-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="contact-icon">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span>contact@millionproperties.com</span>
                </div>
              </div>
            </div>

            {/* Company Links */}
            <div className="footer-section">
              <h4 className="footer-title">Company</h4>
              <ul className="footer-links">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="footer-link">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Links */}
            <div className="footer-section">
              <h4 className="footer-title">Services</h4>
              <ul className="footer-links">
                {serviceLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="footer-link">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div className="footer-section">
              <h4 className="footer-title">Resources</h4>
              <ul className="footer-links">
                {resourceLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="footer-link">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <div className="newsletter-info">
              <h4 className="newsletter-title">Stay Updated</h4>
              <p className="newsletter-subtitle">
                Get the latest market insights and exclusive property listings delivered to your inbox.
              </p>
            </div>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email address"
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-btn">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              <span>&copy; {currentYear} Million Properties. All rights reserved.</span>
            </div>
            <div className="legal-links">
              {legalLinks.map((link, index) => (
                <React.Fragment key={link.name}>
                  <Link href={link.href} className="legal-link">
                    {link.name}
                  </Link>
                  {index < legalLinks.length - 1 && <span className="separator">•</span>}
                </React.Fragment>
              ))}
            </div>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" stroke="currentColor" strokeWidth="2"/>
                  <rect x="2" y="9" width="4" height="12" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;