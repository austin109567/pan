import { FC } from 'react';
import { Wallet, PieChart, Coins, BarChart3, Lock, Gem } from 'lucide-react';
import { motion } from 'framer-motion';

const tokenomicsData = [
  {
    icon: Wallet,
    title: 'Player Rewards',
    percentage: '40%',
    description: 'Allocated for in-game rewards and achievements',
    iconColor: 'text-green-400'
  },
  {
    icon: Lock,
    title: 'Treasury',
    percentage: '20%',
    description: 'Reserved for platform development and maintenance',
    iconColor: 'text-blue-400'
  },
  {
    icon: Gem,
    title: 'Staking',
    percentage: '15%',
    description: 'Rewards for token staking and liquidity provision',
    iconColor: 'text-purple-400'
  },
  {
    icon: BarChart3,
    title: 'Team',
    percentage: '10%',
    description: 'Team allocation with vesting schedule',
    iconColor: 'text-red-400'
  },
  {
    icon: Coins,
    title: 'Community',
    percentage: '10%',
    description: 'Community initiatives and DAO governance',
    iconColor: 'text-yellow-400'
  },
  {
    icon: PieChart,
    title: 'Marketing',
    percentage: '5%',
    description: 'Marketing and partnership development',
    iconColor: 'text-indigo-400'
  }
];

export const TokenomicsSection: FC = () => {
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
          Tokenomics
        </h2>
        <p className="mt-4 text-lg text-gray-700 dark:text-sand-300 max-w-2xl mx-auto">
          Transparent and balanced token distribution designed for long-term sustainability
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
      >
        {tokenomicsData.map((item) => (
          <motion.div
            key={item.title}
            variants={itemVariants}
            className="group relative bg-sand-100/5 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-sand-200/10 hover:border-primary-500/30 transition-colors duration-300"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-primary-500/10 flex items-center justify-center">
                <item.icon className={`w-8 h-8 ${item.iconColor}`} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-sand-100 group-hover:text-primary-400 transition-colors duration-300">
                  {item.percentage}
                </h3>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-sand-200">
                  {item.title}
                </h4>
                <p className="mt-2 text-gray-600 dark:text-sand-400 text-sm">
                  {item.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
