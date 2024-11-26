import { FC } from 'react';
import { motion } from 'framer-motion';
import { Sword, Trophy, Target, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Quest {
  title: string;
  description: string;
  reward: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Legendary';
  type: 'Daily' | 'Weekly' | 'Special';
  icon: typeof Sword;
}

const quests: Quest[] = [
  {
    title: "Twitter Warrior",
    description: "Like and Retweet 5 RaidRally community posts",
    reward: "50 $RAID",
    difficulty: "Easy",
    type: "Daily",
    icon: Target
  },
  {
    title: "Discord Champion",
    description: "Participate in 3 community discussions",
    reward: "100 $RAID",
    difficulty: "Medium",
    type: "Daily",
    icon: Users
  },
  {
    title: "Raid Leader",
    description: "Successfully complete 5 raids with your guild",
    reward: "500 $RAID",
    difficulty: "Hard",
    type: "Weekly",
    icon: Sword
  },
  {
    title: "Tournament Victor",
    description: "Win a RaidRally community tournament",
    reward: "1000 $RAID",
    difficulty: "Legendary",
    type: "Special",
    icon: Trophy
  }
];

const difficultyColors = {
  Easy: 'bg-green-500/10 text-green-500',
  Medium: 'bg-yellow-500/10 text-yellow-500',
  Hard: 'bg-orange-500/10 text-orange-500',
  Legendary: 'bg-purple-500/10 text-purple-500'
};

const typeColors = {
  Daily: 'bg-blue-500/10 text-blue-500',
  Weekly: 'bg-indigo-500/10 text-indigo-500',
  Special: 'bg-rose-500/10 text-rose-500'
};

export const QuestSection: FC = () => {
  const navigate = useNavigate();
  return (
    <div className="py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Available Quests
          </motion.h2>
          <motion.p 
            className="text-base sm:text-lg text-gray-600 dark:text-sand-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Complete quests to earn $RAID tokens and climb the ranks
          </motion.p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Quest Grid - Left Side */}
          <motion.div 
            className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {quests.map((quest, index) => (
              <motion.div
                key={quest.title}
                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden 
                         border border-sand-200/20 dark:border-white/10 
                         hover:border-primary-500/50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <div className="p-6">
                  {/* Quest Icon */}
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl 
                              bg-primary-500/10 group-hover:bg-primary-500/20 transition-colors mb-4">
                    <quest.icon className="w-6 h-6 text-primary-500" />
                  </div>

                  {/* Quest Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-sand-100 mb-2">
                    {quest.title}
                  </h3>

                  {/* Quest Description */}
                  <p className="text-gray-600 dark:text-sand-400 mb-4">
                    {quest.description}
                  </p>

                  {/* Quest Metadata */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {/* Difficulty Badge */}
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${difficultyColors[quest.difficulty]}`}>
                      {quest.difficulty}
                    </span>

                    {/* Type Badge */}
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${typeColors[quest.type]}`}>
                      {quest.type}
                    </span>

                    {/* Reward Badge */}
                    <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-primary-500/10 text-primary-500">
                      {quest.reward}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quest Summary - Right Side */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-sand-200/20 dark:border-white/10">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-sand-100 mb-4">
                Quest Breakdown
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-sand-100 mb-2">Difficulty Levels</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(difficultyColors).map(([difficulty, color]) => (
                      <div key={difficulty} className={`px-3 py-2 rounded-lg ${color} text-sm`}>
                        {difficulty}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-sand-100 mb-2">Quest Types</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(typeColors).map(([type, color]) => (
                      <div key={type} className={`px-3 py-2 rounded-lg ${color} text-sm`}>
                        {type}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-sand-100 mb-2">Rewards</h4>
                  <p className="text-gray-600 dark:text-sand-400">
                    Complete quests to earn $RAID tokens. Higher difficulty quests offer greater rewards, ranging from 50 to 1000 $RAID tokens.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Raid Navigation Button */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-sand-200/20 dark:border-white/10">
              <button 
                onClick={() => navigate('/raid')}
                className="w-full py-3 px-6 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <Sword className="w-5 h-5" />
                <span>View All Raids</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
