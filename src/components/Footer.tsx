import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Twitter, MessageCircle, Github, ExternalLink } from 'lucide-react';
import { SOCIAL_LINKS } from '../config/constants';
import { useTheme } from '../contexts/ThemeContext';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';

export const Footer: FC = () => {
  const { theme } = useTheme();
  const { connected, publicKey } = useWallet();
  const location = useLocation();
  const currentYear = new Date().getFullYear();
  const isAdmin = publicKey?.toString() === "8jN1XtgiuWeyNjzysYVqGZ1mPAG37sjmuCTnENz66wrs";

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'NFT Builder', path: '/nft-builder' },
    { label: 'Leaderboards', path: '/leaderboards' },
    { label: 'Info', path: '/info' },
  ];

  const communityLinks = [
    { label: 'Raid', path: '/raid' },
    { label: 'Guild', path: '/guild' },
    { label: 'Profile', path: '/profile' },
    { label: 'Marketplace', path: '/marketplace' },
  ];

  const resourceLinks = [
    { label: 'Documentation', href: SOCIAL_LINKS.docs },
    { label: 'GitHub', href: SOCIAL_LINKS.github },
    { label: 'Discord', href: SOCIAL_LINKS.discord },
    { label: 'Twitter', href: SOCIAL_LINKS.twitter },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    return path !== '/' && location.pathname.startsWith(path);
  };

  const FooterSection: FC<{
    title: string;
    links: Array<{ label: string; path?: string; href?: string }>;
  }> = ({ title, links }) => (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold text-sand-800 dark:text-sand-200">{title}</h3>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.label}>
            {link.path ? (
              <Link
                to={link.path}
                className={`flex items-center gap-2 text-sm transition-colors duration-200
                  ${isActive(link.path)
                    ? 'text-primary-500 font-medium'
                    : 'text-sand-600 hover:text-primary-500 dark:text-sand-400 dark:hover:text-primary-400'
                  }`}
              >
                {link.label}
              </Link>
            ) : (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-sand-600 hover:text-primary-500 dark:text-sand-400 dark:hover:text-primary-400 transition-colors duration-200"
              >
                {link.label}
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="relative mt-auto border-t border-sand-200/50 dark:border-white/5">
      <div className="absolute inset-0 bg-sand-100/80 dark:bg-background-900/80 backdrop-blur-sm" />
      
      <div className="relative container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold tracking-wider text-sand-900 dark:text-sand-100">
                Pan <span className="text-primary-500">Da Pan</span>
              </div>
            </div>
            <p className="text-sm text-sand-600 dark:text-sand-400">
              Join the next generation of NFT gaming. Raid, collect, and earn together.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <FooterSection title="Quick Links" links={quickLinks} />
          </motion.div>

          {/* Community Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <FooterSection title="Community" links={communityLinks} />
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <FooterSection title="Resources" links={resourceLinks} />
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-sand-200/50 dark:border-white/5"
        >
          <div className="text-sm text-sand-600 dark:text-sand-400">
            {currentYear} Pan Da Pan. All rights reserved.
          </div>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href={SOCIAL_LINKS.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl hover:bg-primary-500/10 text-sand-600 hover:text-primary-500 dark:text-sand-400 dark:hover:text-primary-400 transition-all duration-300"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href={SOCIAL_LINKS.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl hover:bg-primary-500/10 text-sand-600 hover:text-primary-500 dark:text-sand-400 dark:hover:text-primary-400 transition-all duration-300"
              aria-label="Discord"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl hover:bg-primary-500/10 text-sand-600 hover:text-primary-500 dark:text-sand-400 dark:hover:text-primary-400 transition-all duration-300"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};