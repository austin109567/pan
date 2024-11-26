import { FC, useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { Menu, X } from 'lucide-react';
import { navigationItems } from './navigationItems';
import { WalletConnect } from '../WalletConnect';
import { ThemeToggle } from '../ThemeToggle';

export const Navigation: FC = () => {
  const { connected, publicKey } = useWallet();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const isAdmin = publicKey?.toString() === "8jN1XtgiuWeyNjzysYVqGZ1mPAG37sjmuCTnENz66wrs";

  const menuItems = [
    ...navigationItems.public,
    ...(connected ? navigationItems.protected : []),
    ...(isAdmin ? navigationItems.admin : []),
  ];

  // Close menu on route change
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

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
        <ul className="flex items-center gap-8">
          {menuItems.map(({ label, path }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `text-base font-medium transition-colors duration-300
                   ${isActive 
                     ? 'text-primary-main dark:text-orange-500' 
                     : 'text-text-light-primary dark:text-white/90 hover:text-primary-main dark:hover:text-orange-500'
                   }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Menu Button */}
      <button 
        onClick={toggleMenu}
        className="lg:hidden p-2 text-primary-main dark:text-orange-500 hover:bg-primary-main/10 rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMenu}
          />
          <div className="absolute right-0 top-0 h-full w-[280px] bg-white dark:bg-background-900 shadow-xl transform transition-transform duration-200">
            <div className="flex flex-col h-full">
              <div className="p-4">
                <button 
                  onClick={closeMenu}
                  className="ml-auto p-2 text-primary-main dark:text-orange-500 hover:bg-primary-main/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-4">
                <ul className="space-y-2">
                  {menuItems.map(({ label, path }) => (
                    <li key={path}>
                      <NavLink
                        to={path}
                        onClick={closeMenu}
                        className={({ isActive }) =>
                          `block px-4 py-3 rounded-lg transition-colors duration-300
                           ${isActive 
                             ? 'bg-primary-main/10 text-primary-main dark:text-orange-500' 
                             : 'text-text-light-primary dark:text-white/90 hover:bg-primary-main/5 hover:text-primary-main dark:hover:text-orange-500'
                           }`
                        }
                      >
                        {label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Mobile Menu Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex flex-col gap-4">
                  <WalletConnect className="w-full" />
                  <div className="flex justify-center">
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};