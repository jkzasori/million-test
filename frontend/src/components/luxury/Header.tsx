import React, { useState } from 'react';
import Link from 'next/link';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Properties', href: '/' },
    { name: 'Buy', href: '/buy' },
    { name: 'Sell', href: '/sell' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <header className={`professional-header ${className}`}>
      <nav className="nav-container">
        <div className="nav-content">
          {/* Logo */}
          <div className="logo">
            <Link href="/" className="logo-link">
              <span className="logo-text">Million Properties Test</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="desktop-nav">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="nav-link"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="nav-cta">
            <Link href="/contact" className="btn-accent">
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <div className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-nav-content">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/contact"
              className="btn-accent mobile-cta"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <style jsx>{`
        .professional-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 var(--spacing-lg);
        }

        .nav-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-lg) 0;
        }

        .logo {
          flex-shrink: 0;
        }

        .logo-link {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
        }

        .logo-text {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-primary);
          line-height: 1;
        }


        .desktop-nav {
          display: flex;
          align-items: center;
          gap: var(--spacing-xl);
        }

        .nav-link {
          color: var(--color-text-primary);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-md);
          transition: var(--transition-normal);
          position: relative;
        }

        .nav-link:hover {
          color: var(--color-accent);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background: var(--color-accent);
          transition: var(--transition-normal);
        }

        .nav-link:hover::after {
          width: 80%;
        }

        .nav-cta {
          flex-shrink: 0;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--spacing-sm);
          z-index: 101;
        }

        .hamburger {
          position: relative;
          width: 24px;
          height: 18px;
        }

        .hamburger span {
          display: block;
          position: absolute;
          height: 2px;
          width: 100%;
          background: var(--color-primary);
          border-radius: 1px;
          opacity: 1;
          left: 0;
          transform: rotate(0deg);
          transition: var(--transition-normal);
        }

        .hamburger span:nth-child(1) {
          top: 0px;
        }

        .hamburger span:nth-child(2) {
          top: 8px;
        }

        .hamburger span:nth-child(3) {
          top: 16px;
        }

        .hamburger.active span:nth-child(1) {
          top: 8px;
          transform: rotate(135deg);
        }

        .hamburger.active span:nth-child(2) {
          opacity: 0;
          left: -60px;
        }

        .hamburger.active span:nth-child(3) {
          top: 8px;
          transform: rotate(-135deg);
        }

        .mobile-nav {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border-bottom: 1px solid var(--color-border);
          box-shadow: var(--shadow-lg);
          transform: translateY(-100%);
          opacity: 0;
          transition: var(--transition-normal);
          z-index: 99;
        }

        .mobile-nav.open {
          transform: translateY(0);
          opacity: 1;
        }

        .mobile-nav-content {
          padding: var(--spacing-lg);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .mobile-nav-link {
          color: var(--color-text-primary);
          text-decoration: none;
          font-weight: 500;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          transition: var(--transition-normal);
          border: 1px solid transparent;
        }

        .mobile-nav-link:hover {
          color: var(--color-accent);
          border-color: var(--color-accent);
          background: rgba(201, 169, 110, 0.05);
        }

        .mobile-cta {
          margin-top: var(--spacing-md);
          text-align: center;
          width: 100%;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        @media (max-width: 1024px) {
          .desktop-nav {
            gap: var(--spacing-lg);
          }
        }

        @media (max-width: 768px) {
          .nav-content {
            padding: var(--spacing-md) 0;
          }

          .desktop-nav {
            display: none;
          }

          .nav-cta {
            display: none;
          }

          .mobile-menu-btn {
            display: block;
          }

          .mobile-nav {
            display: block;
          }

          .logo-text {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;