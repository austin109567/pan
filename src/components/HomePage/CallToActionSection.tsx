import { FC } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../Button';
import { useNavigate } from 'react-router-dom';

export const CallToActionSection: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Main Title */}
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Ready to Start Your NFT Adventure?
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-base sm:text-lg text-gray-600 dark:text-sand-300 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join RaidRally today and become part of the next generation of Web3 gaming
          </motion.p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="primary"
              size="lg"
              className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-8 py-3 rounded-xl"
              onClick={() => navigate('/profile')}
            >
              Get Started Now
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="bg-white/50 dark:bg-black/10 hover:bg-white/60 dark:hover:bg-black/20 
                       text-sand-900 dark:text-sand-100 font-semibold px-8 py-3 rounded-xl
                       border border-sand-200/20 dark:border-white/10"
              onClick={() => {
                const element = document.getElementById('learn-more');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
