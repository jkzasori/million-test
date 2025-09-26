import React from 'react';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  stats?: {
    label: string;
    value: string;
    description: string;
  }[];
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = "Million Properties",
  subtitle = "Discover exceptional luxury properties that redefine modern living",
  stats = [
    { label: "PREMIUM", value: "1,200+", description: "PROPERTIES AVAILABLE" },
    { label: "MORE THAN", value: "$2.1B", description: "IN SALES" }
  ],
  className = ''
}) => {
  return (
    <section className={`professional-hero ${className}`}>
      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-text">Premium Real Estate Collection</span>
        </div>

        <h1 className="hero-title font-display">
          {title}
        </h1>
        
        <p className="hero-subtitle">
          {subtitle}
        </p>

        <div className="hero-actions">
          <a href="#search" className="btn-primary">
            Explore Properties
          </a>
          <a href="/contact" className="btn-secondary">
            Schedule Consultation
          </a>
        </div>
        
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-content">
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value text-accent">{stat.value}</div>
                <div className="stat-description">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .professional-hero {
          position: relative;
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-image: url('/hero-background.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          overflow: hidden;
        }

        .professional-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.6) 0%,
            rgba(0, 0, 0, 0.3) 50%,
            rgba(0, 0, 0, 0.5) 100%
          );
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          color: white;
          text-align: center;
          max-width: 800px;
          padding: var(--spacing-xl);
          animation: fadeIn 1s ease-out;
        }

        .hero-badge {
          display: inline-block;
          margin-bottom: var(--spacing-lg);
          padding: var(--spacing-sm) var(--spacing-lg);
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
          animation: slideUp 1s ease-out 0.2s both;
        }

        .badge-text {
          font-size: 0.875rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--color-accent);
        }

        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 300;
          margin-bottom: var(--spacing-lg);
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
          color: white;
          animation: slideUp 1s ease-out 0.4s both;
        }

        .hero-subtitle {
          font-size: clamp(1rem, 2.5vw, 1.25rem);
          margin-bottom: var(--spacing-xxl);
          opacity: 0.9;
          color: white;
          line-height: 1.6;
          animation: slideUp 1s ease-out 0.6s both;
        }

        .hero-actions {
          display: flex;
          gap: var(--spacing-md);
          justify-content: center;
          margin-bottom: var(--spacing-xxl);
          flex-wrap: wrap;
          animation: slideUp 1s ease-out 0.8s both;
        }

        .stats-container {
          display: flex;
          justify-content: center;
          gap: var(--spacing-xxl);
          flex-wrap: wrap;
          animation: slideUp 1s ease-out 1s both;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          min-width: 160px;
          transition: var(--transition-normal);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          background: rgba(255, 255, 255, 0.15);
          box-shadow: var(--shadow-lg);
        }

        .stat-content {
          text-align: center;
        }

        .stat-label {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 1px;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: var(--spacing-xs);
          text-transform: uppercase;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: var(--spacing-xs);
          font-family: var(--font-display);
        }

        .stat-description {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.7);
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        @media (max-width: 768px) {
          .professional-hero {
            min-height: 60vh;
            padding: var(--spacing-lg);
          }

          .hero-content {
            padding: var(--spacing-lg);
          }

          .hero-actions {
            flex-direction: column;
            align-items: center;
          }

          .hero-actions .btn-primary,
          .hero-actions .btn-secondary {
            width: 100%;
            max-width: 280px;
          }

          .stats-container {
            flex-direction: column;
            align-items: center;
            gap: var(--spacing-lg);
          }

          .stat-card {
            max-width: 200px;
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .professional-hero {
            min-height: 50vh;
          }

          .hero-badge {
            padding: var(--spacing-xs) var(--spacing-md);
          }

          .badge-text {
            font-size: 0.75rem;
          }

          .stat-card {
            padding: var(--spacing-md);
          }

          .stat-value {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;