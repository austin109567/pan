import { FC } from 'react';
import { Gamepad2, Trophy, Coins, Users, Shield, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Gamepad2,
    title: 'Play to Earn',
    description: 'Earn rewards by participating in raids and tournaments',
    iconColor: 'text-purple-400'
  },
  {
    icon: Trophy,
    title: 'Competitive Leagues',
    description: 'Climb the ranks and compete with the best raiders',
    iconColor: 'text-yellow-400'
  },
  {
    icon: Coins,
    title: 'NFT Marketplace',
    description: 'Trade unique in-game assets and collectibles',
    iconColor: 'text-green-400'
  },
  {
    icon: Users,
    title: 'Guild System',
    description: 'Form alliances and tackle challenges together',
    iconColor: 'text-blue-400'
  },
  {
    icon: Shield,
    title: 'Secure Platform',
    description: 'Built on Solana for fast and secure transactions',
    iconColor: 'text-red-400'
  },
  {
    icon: Rocket,
    title: 'Regular Updates',
    description: 'New content and features added regularly',
    iconColor: 'text-indigo-400'
  }
];

export const FeaturesSection: FC = () => {
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
    <div className="py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 sm:mb-16"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-400">
          Platform Features
        </h2>
        <p className="mt-4 text-lg text-gray-700 dark:text-sand-300 max-w-2xl mx-auto">
          Experience the future of gaming with our innovative features and rewards system
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
      >
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            variants={itemVariants}
            className="group relative bg-sand-100/5 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-sand-200/10 hover:border-primary-500/30 transition-colors duration-300"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-primary-500/10 flex items-center justify-center">
                <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-sand-100 group-hover:text-primary-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-sand-400 text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-primary-500/30 transition-colors duration-300" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
