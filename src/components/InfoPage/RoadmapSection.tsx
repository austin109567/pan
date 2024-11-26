import { FC } from 'react';
import { motion } from 'framer-motion';
import { Milestone, Rocket, Target, Users2, Zap, Brain, Sparkles } from 'lucide-react';

const roadmapData = [
  {
    icon: Rocket,
    phase: 'Phase 1',
    title: 'Launch & Core Features',
    items: [
      'Platform launch with basic raid mechanics',
      'NFT character system implementation',
      'Community building and social features',
      'Initial marketplace integration'
    ],
    status: 'completed',
    iconColor: 'text-green-400'
  },
  {
    icon: Target,
    phase: 'Phase 2',
    title: 'Expansion & Growth',
    items: [
      'Advanced raid mechanics and boss battles',
      'Guild system with governance features',
      'Token staking and rewards program',
      'Cross-chain integration'
    ],
    status: 'in-progress',
    iconColor: 'text-blue-400'
  },
  {
    icon: Brain,
    phase: 'Phase 3',
    title: 'AI Integration',
    items: [
      'AI Quest Master for dynamic quest generation',
      'Intelligent Raid Leader AI system',
      'Procedural lore and story generation',
      'AI-driven NPC interactions and dialogues'
    ],
    status: 'upcoming',
    iconColor: 'text-purple-400'
  },
  {
    icon: Sparkles,
    phase: 'Phase 4',
    title: 'Advanced AI Features',
    items: [
      'Adaptive difficulty AI for raids',
      'Personalized quest storylines',
      'Dynamic world events generation',
      'AI-powered guild strategy advisor'
    ],
    status: 'upcoming',
    iconColor: 'text-indigo-400'
  },
  {
    icon: Users2,
    phase: 'Phase 5',
    title: 'Community & DAO',
    items: [
      'DAO governance implementation',
      'Community-AI collaboration tools',
      'Advanced guild features',
      'Inter-guild tournaments with AI assistance'
    ],
    status: 'planned',
    iconColor: 'text-yellow-400'
  },
  {
    icon: Zap,
    phase: 'Phase 6',
    title: 'Future Innovation',
    items: [
      'Mobile app with AI integration',
      'Virtual reality raid experiences',
      'Advanced AI companion system',
      'Cross-game asset compatibility'
    ],
    status: 'planned',
    iconColor: 'text-red-400'
  }
];

export const RoadmapSection: FC = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-400/20 text-green-500 border-green-500/30';
      case 'in-progress':
        return 'bg-blue-400/20 text-blue-500 border-blue-500/30';
      case 'upcoming':
        return 'bg-purple-400/20 text-purple-500 border-purple-500/30';
      default:
        return 'bg-yellow-400/20 text-yellow-500 border-yellow-500/30';
    }
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
          Development Roadmap
        </h2>
        <p className="mt-4 text-lg text-gray-700 dark:text-sand-300 max-w-2xl mx-auto">
          Our journey to revolutionize blockchain gaming
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="space-y-8"
      >
        {roadmapData.map((phase, index) => (
          <motion.div
            key={phase.phase}
            variants={itemVariants}
            className="relative"
          >
            <div className="group relative bg-sand-100/5 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-sand-200/10 hover:border-primary-500/30 transition-colors duration-300">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-primary-500/10 flex items-center justify-center">
                    <phase.icon className={`w-8 h-8 ${phase.iconColor}`} />
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-sand-100">
                      {phase.phase} - {phase.title}
                    </h3>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(phase.status)}`}>
                      {phase.status.charAt(0).toUpperCase() + phase.status.slice(1)}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {phase.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <span className="mr-2 text-primary-500">•</span>
                        <span className="text-gray-600 dark:text-sand-400">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
