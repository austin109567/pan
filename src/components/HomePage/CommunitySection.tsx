import { FC } from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, Coins, MessageSquare, Shield, Target } from 'lucide-react';

interface Stat {
  icon: typeof Users;
  label: string;
  value: string;
  suffix?: string;
  description: string;
}

const stats: Stat[] = [
  {
    icon: Users,
    label: 'Active Raiders',
    value: '50',
    suffix: 'K+',
    description: 'Join our growing community of dedicated players'
  },
  {
    icon: Trophy,
    label: 'Raids Completed',
    value: '1',
    suffix: 'M+',
    description: 'Successfully completed raids and counting'
  },
  {
    icon: Coins,
    label: '$RAID Distributed',
    value: '100',
    suffix: 'M+',
    description: 'Rewards earned by our community members'
  }
];

export const CommunitySection: FC = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header - Centered Above */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Join Our Community
          </motion.h2>
          <motion.p 
            className="text-base sm:text-lg text-gray-600 dark:text-sand-300 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Connect with fellow raiders and stay updated on the latest news and events
          </motion.p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left Column - Image */}
          <motion.div 
            className="relative h-[400px] sm:h-[500px] lg:h-full mx-auto w-full max-w-sm lg:max-w-none"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-primary-500/10 h-full">
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background-900/80 via-background-900/20 to-transparent z-10" />
              
              {/* Image */}
              <img 
                src="/assets/social.png" 
                alt="Join our community" 
                className="absolute inset-0 w-full h-full object-cover object-center transform hover:scale-110 transition-transform duration-700"
              />
              
              {/* Decorative Elements */}
              <div className="absolute inset-0 bg-primary-500/10 mix-blend-overlay" />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-white/20" />
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <div className="space-y-6 sm:space-y-8">
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-base sm:text-lg text-gray-600 dark:text-sand-300">
                RaidRally brings together gamers, NFT enthusiasts, and crypto lovers in an exciting Web3 gaming experience.
              </p>
              <p className="text-base sm:text-lg text-gray-600 dark:text-sand-300">
                Collaborate with fellow raiders, strategize for epic boss battles, and earn valuable rewards. Our community-driven platform ensures every player's contribution is valued and rewarded.
              </p>
            </motion.div>

            {/* Stats Grid with Buttons */}
            <div className="space-y-6 lg:space-y-8">
              {/* Stats Grid */}
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    variants={itemVariants}
                    className={`group relative bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-2xl overflow-hidden 
                             border border-sand-200/20 dark:border-white/10 
                             hover:border-primary-500/50 transition-all duration-300
                             ${index === 2 ? 'col-span-2 sm:col-span-1' : ''}`}
                  >
                    <div className="p-3 sm:p-4 text-center">
                      <div className="inline-flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 mb-2 sm:mb-3 rounded-xl 
                                  bg-primary-500/10 group-hover:bg-primary-500/20 transition-colors">
                        <stat.icon className="w-4 h-4 sm:w-6 sm:h-6 text-primary-500" />
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-sand-100">
                        {stat.value}
                        <span className="text-primary-500">{stat.suffix}</span>
                      </div>
                      <div className="text-sm sm:text-base text-gray-600 dark:text-sand-400 font-medium mb-1 sm:mb-2">
                        {stat.label}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-sand-400">
                        {stat.description}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Call to Action Buttons - Now part of the grid */}
                <motion.div
                  variants={itemVariants}
                  className="col-span-2 sm:col-span-1 flex flex-col sm:flex-row lg:justify-center gap-4 items-stretch min-h-[48px]"
                >
                  <button 
                    className="flex-1 lg:flex-initial lg:w-40 inline-flex items-center justify-center px-6 py-3 rounded-xl 
                             bg-primary-500 hover:bg-primary-600 active:bg-primary-700
                             text-white font-semibold text-base
                             transition-all duration-200 ease-in-out
                             shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30
                             transform hover:-translate-y-0.5"
                  >
                    Join Discord
                  </button>
                  <button 
                    className="flex-1 lg:flex-initial lg:w-40 inline-flex items-center justify-center px-6 py-3 rounded-xl
                             bg-white/5 hover:bg-white/10 active:bg-white/15
                             text-gray-900 dark:text-sand-100 font-semibold text-base
                             transition-all duration-200 ease-in-out
                             border-2 border-sand-200/20 dark:border-white/10
                             hover:border-sand-200/30 dark:hover:border-white/20
                             shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10
                             transform hover:-translate-y-0.5"
                  >
                    Learn More
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};