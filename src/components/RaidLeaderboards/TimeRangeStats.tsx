import { FC } from 'react';
import { Trophy, Star, Users } from 'lucide-react';
import { playerService } from '../../services/playerService';
import { motion } from 'framer-motion';

interface TimeRangeStatsProps {
  timeRange: 'daily' | 'weekly' | 'monthly' | 'allTime';
  onTimeRangeChange: (range: 'daily' | 'weekly' | 'monthly' | 'allTime') => void;
}

const StatCard: FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
    className="relative bg-white/40 dark:bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-sand-300/20 dark:border-sand-200/10 hover:border-primary-500/30 transition-colors duration-300"
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-primary-500/10 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-sand-600 dark:text-sand-400">{label}</p>
        <p className="text-lg font-bold text-sand-900 dark:text-white">{value}</p>
      </div>
    </div>
  </motion.div>
);

const TimeRangeButton: FC<{
  range: 'daily' | 'weekly' | 'monthly' | 'allTime';
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ range, label, active, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`
      relative px-4 py-2 rounded-lg font-medium transition-all duration-200
      ${active
        ? 'text-white shadow-lg'
        : 'text-sand-700 dark:text-sand-300 hover:text-primary-500 dark:hover:text-primary-400'
      }
    `}
  >
    {label}
    {active && (
      <motion.div
        layoutId="activeTimeRange"
        className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-primary-500 to-primary-400"
      />
    )}
  </motion.button>
);

export const TimeRangeStats: FC<TimeRangeStatsProps> = ({ timeRange, onTimeRangeChange }) => {
  const stats = playerService.getTimeRangeStats(timeRange);

  return (
    <div className="space-y-6">
      {/* Time Range Selection */}
      <div className="flex justify-center gap-2 p-1 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-xl border border-sand-300/20 dark:border-sand-200/10">
        <TimeRangeButton
          range="daily"
          label="Daily"
          active={timeRange === 'daily'}
          onClick={() => onTimeRangeChange('daily')}
        />
        <TimeRangeButton
          range="weekly"
          label="Weekly"
          active={timeRange === 'weekly'}
          onClick={() => onTimeRangeChange('weekly')}
        />
        <TimeRangeButton
          range="monthly"
          label="Monthly"
          active={timeRange === 'monthly'}
          onClick={() => onTimeRangeChange('monthly')}
        />
        <TimeRangeButton
          range="allTime"
          label="All Time"
          active={timeRange === 'allTime'}
          onClick={() => onTimeRangeChange('allTime')}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<Trophy className="w-6 h-6 text-primary-500" />}
          label="Top Raider"
          value={stats.topRaider?.username || 
            `${stats.topRaider?.wallet.slice(0, 4)}...${stats.topRaider?.wallet.slice(-4)}`}
        />
        <StatCard
          icon={<Star className="w-6 h-6 text-primary-500" />}
          label="Total XP"
          value={stats.totalXP.toLocaleString()}
        />
        <StatCard
          icon={<Users className="w-6 h-6 text-primary-500" />}
          label="Active Raiders"
          value={stats.activeRaiders.toString()}
        />
      </div>
    </div>
  );
};