import { FC } from 'react';
import { Twitter, MessageCircle, Github, Users, Star, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const socialLinks = [
  {
    icon: Twitter,
    title: 'Follow on Twitter',
    description: 'Get the latest updates and announcements',
    href: '#',
    color: 'text-blue-400'
  },
  {
    icon: MessageCircle,
    title: 'Join Discord',
    description: 'Chat with players and share strategies',
    href: '#',
    color: 'text-indigo-400'
  },
  {
    icon: Github,
    title: 'Contribute on GitHub',
    description: 'Help shape the future of the platform',
    href: '#',
    color: 'text-gray-400'
  }
];

const stats = [
  {
    icon: Users,
    value: '10K+',
    label: 'Active Players',
    color: 'text-blue-400'
  },
  {
    icon: Star,
    value: '50K+',
    label: 'NFTs Minted',
    color: 'text-yellow-400'
  },
  {
    icon: Heart,
    value: '95%',
    label: 'Player Satisfaction',
    color: 'text-red-400'
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
    <div className="py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 sm:mb-16"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-400">
          Join Our Community
        </h2>
        <p className="mt-4 text-lg text-gray-700 dark:text-sand-300 max-w-2xl mx-auto">
          Connect with fellow raiders, share strategies, and stay updated with the latest news
        </p>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            className="group relative bg-sand-100/5 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-sand-200/10 hover:border-primary-500/30 transition-colors duration-300"
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-sand-100">{stat.value}</div>
                <p className="mt-1 text-gray-600 dark:text-sand-400 text-sm">
                  {stat.label}
                </p>
              </div>
            </div>
            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-primary-500/30 transition-colors duration-300" />
          </motion.div>
        ))}
      </motion.div>

      {/* Social Links */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
      >
        {socialLinks.map((link) => (
          <motion.a
            key={link.title}
            href={link.href}
            variants={itemVariants}
            className="group relative bg-sand-100/5 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-sand-200/10 hover:border-primary-500/30 transition-colors duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                <link.icon className={`w-6 h-6 ${link.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-sand-100 group-hover:text-primary-400 transition-colors duration-300">
                  {link.title}
                </h3>
                <p className="mt-1 text-gray-600 dark:text-sand-400 text-sm">
                  {link.description}
                </p>
              </div>
            </div>
            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-primary-500/30 transition-colors duration-300" />
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
};
