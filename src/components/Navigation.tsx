import { FC, useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { Menu, Home, Info, Settings, Swords, Palette, Trophy, User, Users } from 'lucide-react';

// Navigation items configuration
const navigationItems = {
  public: [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Info, label: 'Info', path: '/info' },
    { icon: Palette, label: 'NFT Builder', path: '/nft-builder' },
    { icon: Trophy, label: 'Leaderboards', path: '/leaderboards' },
  ],
  protected: [
    { icon: Swords, label: 'Raid', path: '/raid' },
    { icon: Users, label: 'Guild', path: '/guild' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ],
  admin: [
    { icon: Settings, label: 'Admin Panel', path: '/admin' },
  ],
};

export const Navigation: FC = () => {
  const { connected, publicKey } = useWallet();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const isAdmin = publicKey?.toString() === "8jN1XtgiuWeyNjzysYVqGZ1mPAG37sjmuCTnENz66wrs";

  const menuItems = [
    ...navigationItems.public,
    ...(connected ? navigationItems.protected : []),
    ...(isAdmin ? navigationItems.admin : []),
  ];

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    document.body.style.overflow = !isOpen ? 'hidden' : 'unset';
  };

  const closeMenu = () => {
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block">
        <ul className="flex items-center justify-center gap-6">
          {menuItems.map(({ icon: Icon, label, path }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-colors duration-300
                   ${isActive 
                     ? 'text-primary-main dark:text-orange-500 bg-primary-main/10' 
                     : 'text-text-light-primary dark:text-white/90 hover:text-primary-main dark:hover:text-orange-500 hover:bg-primary-main/5'
                   }`
                }
              >
                <Icon className="w-5 h-5" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <button 
          onClick={toggleMenu}
          className="p-2 text-primary-main dark:text-orange-500 hover:bg-primary-main/10 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeMenu}
            />
            
            {/* Bottom Navigation Bar */}
            <div 
              ref={menuRef}
              className="relative bg-white dark:bg-background-900 shadow-xl rounded-t-xl"
            >
              {/* Navigation Icons */}
              <nav className="p-4">
                <ul className="flex items-center justify-around gap-1 overflow-x-auto px-2">
                  {menuItems.map(({ icon: Icon, label, path }) => (
                    <li key={path}>
                      <NavLink
                        to={path}
                        onClick={closeMenu}
                        className={({ isActive }) =>
                          `flex flex-col items-center gap-0.5 p-2 rounded-lg transition-all duration-300 min-w-[56px]
                           ${isActive 
                             ? 'text-primary-main dark:text-orange-500 bg-primary-main/10 scale-110 shadow-lg' 
                             : 'text-text-light-primary dark:text-white/90 hover:text-primary-main dark:hover:text-orange-500 hover:bg-primary-main/5'
                           }`
                        }
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[10px] font-medium whitespace-nowrap">{label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Safe Area Spacing for Mobile */}

            </div>
          </div>
        )}
      </div>
    </>
  );
};