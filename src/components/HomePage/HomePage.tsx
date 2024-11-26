import { FC } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { HeroSection } from './HeroSection';
import { NFTBuilderSection } from './NFTBuilderSection';
import { RaidBossesSection } from './RaidBossesSection';
import { QuestSection } from './QuestSection';
import { GuildSection } from './GuildSection';
import { CommunitySection } from './CommunitySection';
import { FAQSection } from './FAQSection';
import { CallToActionSection } from './CallToActionSection';

// Reusable section wrapper component with different styles
const SectionWrapper: FC<{ 
  children: React.ReactNode; 
  className?: string;
  variant?: 'default' | 'gradient' | 'dark' | 'highlight';
  fullWidth?: boolean;
}> = ({ children, className = '', variant = 'default', fullWidth = false }) => {
  const baseStyles = "backdrop-blur-md rounded-3xl transition-all duration-300 overflow-hidden";
  
  const variantStyles = {
    default: `bg-sand-100/95 dark:bg-black/40 
      border border-sand-300/50 dark:border-white/5 
      shadow-lg shadow-sand-400/20 dark:shadow-primary-500/20 
      hover:border-primary-500/20 dark:hover:border-primary-500/20
      hover:shadow-primary-500/10 dark:hover:shadow-primary-500/30`,
    gradient: `bg-gradient-to-br from-primary-500/20 via-sand-200/20 to-transparent 
      border border-primary-500/30 dark:border-primary-500/20
      shadow-xl shadow-primary-500/30 
      hover:shadow-primary-500/40 hover:border-primary-500/40`,
    dark: `bg-background-900/95 dark:bg-black/60
      border border-background-800/50 dark:border-white/10
      shadow-2xl shadow-black/40
      hover:border-primary-500/30 hover:shadow-primary-500/30`,
    highlight: `bg-gradient-to-br from-primary-500/30 via-sand-200/30 to-transparent
      border border-primary-500/40 dark:border-primary-500/30
      shadow-2xl shadow-primary-500/30
      hover:shadow-primary-500/50 hover:border-primary-500/50
      dark:from-primary-950 dark:via-background-900 dark:to-background-950`
  };

  const containerStyles = fullWidth ? 'w-full' : 'max-w-7xl mx-auto px-3 sm:px-6 lg:px-8';

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      <div className={`relative p-4 sm:p-8 lg:p-10 ${containerStyles}`}>
        {children}
      </div>
    </div>
  );
};

export const HomePage: FC = () => {
  return (
    <div className="relative space-y-12 sm:space-y-16 lg:space-y-24 pb-12 sm:pb-16 lg:pb-24">
      {/* Hero Section - Full width */}
      <section className="relative">
        <HeroSection />
      </section>

      {/* NFT Builder Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionWrapper variant="highlight">
          <NFTBuilderSection />
        </SectionWrapper>
      </section>

      {/* Raid Bosses Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionWrapper variant="highlight">
          <RaidBossesSection />
        </SectionWrapper>
      </section>

      {/* Quest Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionWrapper variant="highlight">
          <QuestSection />
        </SectionWrapper>
      </section>

      {/* Guild Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionWrapper variant="highlight">
          <GuildSection />
        </SectionWrapper>
      </section>

      {/* Community Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionWrapper variant="highlight">
          <CommunitySection />
        </SectionWrapper>
      </section>

      {/* FAQ Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionWrapper variant="highlight">
          <FAQSection />
        </SectionWrapper>
      </section>

      {/* Call to Action Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionWrapper variant="highlight">
          <CallToActionSection />
        </SectionWrapper>
      </section>
    </div>
  );
};