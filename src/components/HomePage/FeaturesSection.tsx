import React from 'react';
import { Sword, Shield, Trophy, Users, Gem, Zap } from 'lucide-react';

const features = [
  {
    icon: Sword,
    title: 'Epic Raid Battles',
    description: 'Challenge powerful raid bosses in intense strategic battles with your NFT team.',
  },
  {
    icon: Shield,
    title: 'Team Building',
    description: 'Create and customize your perfect raid team from unique NFT characters.',
  },
  {
    icon: Trophy,
    title: 'Rewards & Loot',
    description: 'Earn valuable rewards, rare NFTs, and tokens for completing raids.',
  },
  {
    icon: Users,
    title: 'Community Raids',
    description: 'Join forces with other players in cooperative raid events.',
  },
  {
    icon: Gem,
    title: 'NFT Marketplace',
    description: 'Trade and collect rare NFT characters in our integrated marketplace.',
  },
  {
    icon: Zap,
    title: 'Power Progression',
    description: 'Level up your characters and unlock powerful new abilities.',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-12 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 lg:mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-title text-center mb-4
                        text-primary-main dark:text-orange-500">
            Platform Features
          </h2>
          <p className="text-xl text-center mb-12 
                       text-text-light-secondary dark:text-white/90 
                       max-w-2xl mx-auto">
            Experience the next generation of social gaming with these powerful features
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={feature.title} 
                 className="bg-white/30 dark:bg-black/30 backdrop-blur-sm 
                        rounded-xl p-6 
                        border border-white/10
                        transform hover:scale-105 transition-all duration-300"
                 style={{ animationDelay: `${index * 100}ms` }}>
              <div className="text-primary-main dark:text-orange-500 mb-4">
                <feature.icon className="w-6 h-6 lg:w-7 lg:h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2 
                         text-text-light-primary dark:text-orange-500">
                {feature.title}
              </h3>
              <p className="text-text-light-secondary dark:text-white/90">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};