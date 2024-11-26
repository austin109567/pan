import { FC } from 'react';
import { ArrowRight, Coins, Mountain, Heart, PartyPopper, Users, Trophy, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const archetypes = [
  {
    icon: Coins,
    title: 'The Aureus Coven',
    description: 'Masters of financial wisdom and strategic wealth building.',
    iconColor: 'text-yellow-400'
  },
  {
    icon: Mountain,
    title: 'The Emberseekers',
    description: 'Daring explorers guided by ancient flames.',
    iconColor: 'text-green-400'
  },
  {
    icon: Heart,
    title: 'The Solacebound',
    description: 'Guardians of peace and community welfare.',
    iconColor: 'text-red-400'
  },
  {
    icon: PartyPopper,
    title: 'The Revelkin',
    description: 'Celebrants of joy and festive spirit.',
    iconColor: 'text-purple-400'
  }
];

export const GuildSection: FC = () => {
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
          Join a Guild
        </h2>
        <p className="mt-4 text-lg text-gray-700 dark:text-sand-300 max-w-2xl mx-auto">
          Unite with fellow raiders, compete in tournaments, and earn exclusive rewards together
        </p>
      </motion.div>

      {/* Guild Archetypes */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16"
      >
        {archetypes.map((archetype) => (
          <motion.div
            key={archetype.title}
            variants={itemVariants}
            className="group relative bg-sand-100/5 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-sand-200/10 hover:border-primary-500/30 transition-colors duration-300"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-primary-500/10 flex items-center justify-center">
                <archetype.icon className={`w-8 h-8 ${archetype.iconColor}`} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-sand-100 group-hover:text-primary-400 transition-colors duration-300">
                  {archetype.title}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-sand-400 text-sm">
                  {archetype.description}
                </p>
              </div>
            </div>
            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-primary-500/30 transition-colors duration-300" />
          </motion.div>
        ))}
      </motion.div>

      {/* Guild Benefits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2"
        >
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src="/assets/pandas/sittingpanda.PNG"
              alt="Guild Activities"
              className="w-full h-[300px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background-900/80 via-background-900/40 to-transparent" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-sand-100">Guild Benefits</h3>
          <ul className="space-y-4">
            <li className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-primary-400" />
              <span className="text-gray-700 dark:text-sand-300">Form powerful alliances</span>
            </li>
            <li className="flex items-center space-x-3">
              <Trophy className="w-5 h-5 text-primary-400" />
              <span className="text-gray-700 dark:text-sand-300">Compete in guild tournaments</span>
            </li>
            <li className="flex items-center space-x-3">
              <Star className="w-5 h-5 text-primary-400" />
              <span className="text-gray-700 dark:text-sand-300">Earn exclusive rewards</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};
