import { FC } from 'react';
import { motion } from 'framer-motion';
import { Shield, Trophy, Users, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Guild {
  name: string;
  description: string;
  members: number;
  raidScore: number;
  specialization: string;
  icon: typeof Shield;
  banner: string;
}

const guilds: Guild[] = [
  {
    name: "Phoenix Raiders",
    description: "Elite raiders specializing in high-stakes missions",
    members: 150,
    raidScore: 9500,
    specialization: "High-Risk Raids",
    icon: Crown,
    banner: "bg-gradient-to-br from-orange-500 to-red-600"
  },
  {
    name: "Diamond Vanguard",
    description: "Strategic team focused on consistent raid victories",
    members: 120,
    raidScore: 8800,
    specialization: "Strategic Planning",
    icon: Shield,
    banner: "bg-gradient-to-br from-blue-500 to-purple-600"
  },
  {
    name: "Shadow Legion",
    description: "Stealth specialists with perfect raid execution",
    members: 100,
    raidScore: 8200,
    specialization: "Stealth Raids",
    icon: Users,
    banner: "bg-gradient-to-br from-gray-700 to-gray-900"
  },
  {
    name: "Crown Warriors",
    description: "Tournament champions and community leaders",
    members: 140,
    raidScore: 9200,
    specialization: "Tournament Play",
    icon: Trophy,
    banner: "bg-gradient-to-br from-yellow-400 to-yellow-600"
  }
];

export const GuildSection: FC = () => {
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
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Unite & Conquer Together
          </motion.h2>
          <motion.p 
            className="text-base sm:text-lg text-gray-600 dark:text-sand-300 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Form guilds with other players to tackle challenging raids and earn greater rewards
          </motion.p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Guild Info - Left Side */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-sand-200/20 dark:border-white/10">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-sand-100 mb-4">
                Guild Features
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 mt-1 text-primary-500" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-sand-100">Guild Chat & Team Coordination</h4>
                    <p className="text-gray-600 dark:text-sand-400">
                      Real-time communication and strategic planning with your guild members
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Trophy className="w-5 h-5 mt-1 text-primary-500" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-sand-100">Guild Rankings & Raids</h4>
                    <p className="text-gray-600 dark:text-sand-400">
                      Compete in guild rankings and participate in epic raid missions
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 mt-1 text-primary-500" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-sand-100">Guild Treasury</h4>
                    <p className="text-gray-600 dark:text-sand-400">
                      Share resources and rewards with your guild members
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-sand-200/20 dark:border-white/10">
              <button 
                onClick={() => navigate('/guild')}
                className="w-full py-3 px-6 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <Users className="w-5 h-5" />
                <span>Explore All Guilds</span>
              </button>
            </div>
          </motion.div>

          {/* Guild Grid - Right Side */}
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-sand-100 mb-4">Example Guilds</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {guilds.map((guild, index) => (
                <motion.div
                  key={guild.name}
                  className="bg-white/5 backdrop-blur-sm rounded-xl border border-sand-200/20 dark:border-white/10 overflow-hidden hover:border-primary-500/50 transition-colors cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <div className={`h-20 ${guild.banner} p-4 flex items-center justify-center`}>
                    <guild.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-sand-100">{guild.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-sand-400">{guild.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-sand-400">
                      <span>{guild.members} Members</span>
                      <span>{guild.specialization}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
