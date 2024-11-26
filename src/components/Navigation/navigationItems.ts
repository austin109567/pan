import { Home, Info, Settings, Sword, Palette, Trophy, User, Users } from 'lucide-react';

export const navigationItems = {
  public: [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Info, label: 'Info', path: '/info' },
    { icon: Palette, label: 'NFT Builder', path: '/builder' },
    { icon: Trophy, label: 'Leaderboards', path: '/leaderboards' },
  ],
  protected: [
    { icon: Sword, label: 'Raid', path: '/raid' },
    { icon: Users, label: 'Guild', path: '/guild' },
    { icon: User, label: 'Raid Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ],
  admin: [
    { icon: Settings, label: 'Admin Panel', path: '/admin' },
  ],
} as const;
