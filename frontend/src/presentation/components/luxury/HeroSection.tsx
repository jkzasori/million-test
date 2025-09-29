import React from 'react';
import styles from './HeroSection.module.css';

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
    <section className={`${styles.professionalHero} ${className}`}>
      <div className={styles.heroContent}>
        <div className={styles.heroBadge}>
          <span className={styles.badgeText}>Premium Real Estate Collection</span>
        </div>

        <h1 className={`${styles.heroTitle} font-display`}>
          {title}
        </h1>
        
        <p className={styles.heroSubtitle}>
          {subtitle}
        </p>

        <div className={styles.heroActions}>
          <button className="btn-primary" onClick={() => document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' })}>
            Explore Properties
          </button>
          <button className="btn-secondary" onClick={() => console.log('Schedule Consultation clicked')}>
            Schedule Consultation
          </button>
        </div>
        
        <div className={styles.statsContainer}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>{stat.label}</div>
                <div className={`${styles.statValue} text-accent`}>{stat.value}</div>
                <div className={styles.statDescription}>{stat.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;