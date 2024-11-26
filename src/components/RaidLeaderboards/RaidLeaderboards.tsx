import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { PlayerLeaderboards } from './PlayerLeaderboards';
import { GuildLeaderboards } from './GuildLeaderboards';
import { SectionWrapper } from '../SectionWrapper';


interface RaidLeaderboardsProps {
  variant?: 'default' | 'alternate';
}

export const RaidLeaderboards = ({ variant = 'default' }: RaidLeaderboardsProps) => {
  const [timeRange, setTimeRange] = useState<'allTime' | 'daily' | 'weekly' | 'monthly'>('allTime');
  const [activeTab, setActiveTab] = useState<'players' | 'guilds'>('players');

  return (
    <SectionWrapper variant={variant}>
    
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-400">
          Leaderboards
        </h1>
        <p className="text-lg text-sand-600 dark:text-sand-400 max-w-2xl mx-auto mt-2">
          Track your progress and compete with other players and guilds in Pan Da Pan.
        </p>
      </div>

      {/* Time Range Selector */}
      <Tabs value={timeRange} className="w-full max-w-4xl mx-auto mb-8" onValueChange={(value) => setTimeRange(value as typeof timeRange)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="allTime">All Time</TabsTrigger>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
      </Tabs>
          
      {/* Players/Guilds Tabs */}
      <Tabs value={activeTab} className="w-full max-w-4xl mx-auto" onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="players">Players</TabsTrigger>
          <TabsTrigger value="guilds">Guilds</TabsTrigger>
        </TabsList>

        <TabsContent value="players" className="focus-visible:outline-none">
          <PlayerLeaderboards timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="guilds" className="focus-visible:outline-none">
          <GuildLeaderboards timeRange={timeRange} />
        </TabsContent>
      </Tabs>
      
    </SectionWrapper>
  );
};