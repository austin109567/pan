import { FC } from 'react';
import { motion } from 'framer-motion';
import { Sword, Users, Trophy, Target, Twitter, Heart, MessageCircle, Repeat } from 'lucide-react';

const raidBosses = [
  {
    name: 'Frank (DeGods)',
    difficulty: 'Extreme' as const,
    rewards: '5000-10000 $RAID',
    image: '/assets/raid/frank.jpg',
    description: 'Founder of DeGods & y00ts. Pioneer of the "DUST" ecosystem. Most influential builder in Solana NFTs.',
    twitter: '@frankdegods'
  },
  {
    name: 'Toly',
    difficulty: 'Extreme' as const,
    rewards: '5000-10000 $RAID',
    image: '/assets/raid/toly.jpg',
    description: 'Co-founder of Solana. Visionary behind the fastest blockchain in crypto.',
    twitter: '@aeyakovenko'
  },
  {
    name: 'PattyIce',
    difficulty: 'Hard' as const,
    rewards: '2500-5000 $RAID',
    image: '/assets/raid/pattyice.jpg',
    description: 'Elite NFT trader and market maker. Known for legendary calls and massive trades.',
    twitter: '@PattyIce_NFT'
  },
  {
    name: 'Cozy',
    difficulty: 'Hard' as const,
    rewards: '2500-5000 $RAID',
    image: '/assets/raid/cozypront.jpg',
    description: 'The Caller. Top alpha provider in the Solana ecosystem. Known for precise market insights.',
    twitter: '@cozypront'
  },
  {
    name: 'IcedKnife',
    difficulty: 'Hard' as const,
    rewards: '2500-5000 $RAID',
    image: '/assets/raid/icedknife.jpg',
    description: 'Prolific NFT trader and community leader. Sharp market analysis and consistent wins.',
    twitter: '@IcedKnife'
  },
  {
    name: 'EasyEats',
    difficulty: 'Hard' as const,
    rewards: '2500-5000 $RAID',
    image: '/assets/raid/easyeats.jpg',
    description: 'Bodega mastermind. High-volume trader with deep market expertise.',
    twitter: '@EasyEatsBodega'
  },
  {
    name: 'BAYC',
    difficulty: 'Extreme' as const,
    rewards: '5000-10000 $RAID',
    image: '/assets/raid/bored.jpg',
    description: 'The most prestigious NFT collection. Leading the way in Web3 culture and innovation.',
    twitter: '@BoredApeYC'
  },
  {
    name: 'Bonk!',
    difficulty: 'Hard' as const,
    rewards: '2500-5000 $RAID',
    image: '/assets/raid/bonk.jpg',
    description: 'The Solana meme coin that took the world by storm. Community-driven, fun-focused.',
    twitter: '@bonk_inu'
  }
];

const difficultyColors = {
  Easy: 'bg-green-500',
  Medium: 'bg-yellow-500',
  Hard: 'bg-orange-500',
  Extreme: 'bg-red-500',
};

export const RaidBossesSection: FC = () => {
  return (
    <div className="py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Epic Raid Bosses
          </motion.h2>
          <motion.p 
            className="text-base sm:text-lg text-gray-600 dark:text-sand-300 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Battle against the most influential figures in Web3
          </motion.p>
        </div>

        {/* How Raids Work Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white/50 dark:bg-black/10 backdrop-blur-sm rounded-2xl p-6 
                       border border-sand-200/20 dark:border-white/10">
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600">How Raids Work</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div 
                className="flex flex-col items-center text-center p-4 bg-white/30 dark:bg-black/30 rounded-xl cursor-pointer hover:bg-white/40 dark:hover:bg-black/40 transition-all duration-300"
                onClick={() => {
                  if (window.confirm('Would you like to view the Raid Boss\'s Twitter page?')) {
                    window.open('https://twitter.com/target_account', '_blank');
                  }
                }}
              >
                <Target className="w-10 h-10 text-primary-500 mb-3" />
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-sand-100">Select Target</h4>
                <p className="text-sm text-gray-600 dark:text-sand-400">Choose from influential figures and top NFT projects</p>
              </div>
              <div 
                className="flex flex-col items-center text-center p-4 bg-white/30 dark:bg-black/30 rounded-xl cursor-pointer hover:bg-white/40 dark:hover:bg-black/40 transition-all duration-300"
                onClick={() => {
                  if (window.confirm('Would you like to view the Raid Boss\'s Twitter page?')) {
                    window.open('https://twitter.com/raid_party', '_blank');
                  }
                }}
              >
                <Users className="w-10 h-10 text-primary-500 mb-3" />
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-sand-100">Form Raid Party</h4>
                <p className="text-sm text-gray-600 dark:text-sand-400">Team up with other raiders to increase your power</p>
              </div>
              <div 
                className="flex flex-col items-center text-center p-4 bg-white/30 dark:bg-black/30 rounded-xl cursor-pointer hover:bg-white/40 dark:hover:bg-black/40 transition-all duration-300"
                onClick={() => {
                  if (window.confirm('Would you like to view the Raid Boss\'s Twitter page?')) {
                    window.open('https://twitter.com/raid_attack', '_blank');
                  }
                }}
              >
                <Twitter className="w-10 h-10 text-primary-500 mb-3" />
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-sand-100">Launch Attack</h4>
                <p className="text-sm text-gray-600 dark:text-sand-400">Engage with social content to deal damage</p>
              </div>
              <div 
                className="flex flex-col items-center text-center p-4 bg-white/30 dark:bg-black/30 rounded-xl cursor-pointer hover:bg-white/40 dark:hover:bg-black/40 transition-all duration-300"
                onClick={() => {
                  if (window.confirm('Would you like to view the Raid Boss\'s Twitter page?')) {
                    window.open('https://twitter.com/raid_rewards', '_blank');
                  }
                }}
              >
                <Trophy className="w-10 h-10 text-primary-500 mb-3" />
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-sand-100">Earn Rewards</h4>
                <p className="text-sm text-gray-600 dark:text-sand-400">Claim $RAID tokens and special NFT rewards</p>
              </div>
            </div>

            <div className="space-y-4 text-gray-600 dark:text-sand-400">
              <p className="text-center mb-6">
                Raid bosses are Twitter influencers and NFT projects that players must team up to defeat. 
                Complete social quests to deal damage and earn rewards!
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 justify-center">
                  <Heart className="w-5 h-5 text-primary-500" />
                  <span className="text-sm text-gray-900 dark:text-sand-100">Like Posts</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Repeat className="w-5 h-5 text-primary-500" />
                  <span className="text-sm text-gray-900 dark:text-sand-100">Retweet</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <MessageCircle className="w-5 h-5 text-primary-500" />
                  <span className="text-sm text-gray-900 dark:text-sand-100">Comment</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Users className="w-5 h-5 text-primary-500" />
                  <span className="text-sm text-gray-900 dark:text-sand-100">Follow</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Types of Raid Bosses Title */}
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600">Types of Raid Bosses</h3>
          </div>
        </motion.div>

        {/* Raid Bosses Grid */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {raidBosses.map((boss, index) => (
            <motion.div
              key={boss.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group h-full cursor-pointer"
              onClick={() => {
                if (window.confirm('Would you like to view the Raid Boss\'s Twitter page?')) {
                  window.open(`https://twitter.com/${boss.twitter.substring(1)}`, '_blank');
                }
              }}
            >
              <div className="relative bg-sand-50/80 dark:bg-black/40 rounded-2xl overflow-hidden border border-sand-200/50 dark:border-white/5 hover:border-primary-500/30 dark:hover:border-primary-500/30 transition-all duration-300 h-full flex flex-col">
                <div className="aspect-[1/1] relative">
                  <img 
                    src={boss.image} 
                    alt={boss.name}
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background-900/80 to-transparent" />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1.5">
                    <div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-sand-100 mb-0.5">{boss.name}</h3>
                      <p className="text-xs text-gray-600 dark:text-sand-400">{boss.twitter}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0
                      ${difficultyColors[boss.difficulty]}/10 text-${difficultyColors[boss.difficulty]}`}>
                      {boss.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-sand-400 mb-3 flex-grow line-clamp-2">{boss.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-medium text-gray-900 dark:text-sand-100">{boss.rewards}</span>
                    <button className="px-3 py-1.5 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 
                                   text-primary-500 text-xs font-medium transition-colors">
                      Challenge
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};