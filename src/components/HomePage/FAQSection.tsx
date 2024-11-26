import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { GlassPanel } from '../GlassPanel';

const faqs = [
  {
    question: 'What is RaidRally?',
    answer: 'RaidRally is a Web3 gaming platform where players create, battle, and earn with unique NFT raid bosses. Join epic battles, build your collection, and earn rewards in our thriving community.'
  },
  {
    question: 'How do I start playing?',
    answer: 'Getting started is easy! Connect your wallet, mint or purchase your first raid boss NFT, and join ongoing raids. You can also create your own raid boss using our NFT Builder.'
  },
  {
    question: 'What are $RAID tokens?',
    answer: '$RAID is our in-game currency earned through participating in raids, winning battles, and contributing to the community. Use them for minting NFTs, upgrading raid bosses, or trade on exchanges.'
  },
  {
    question: 'How do raids work?',
    answer: 'Raids are collaborative battles where players team up to defeat powerful raid bosses. Success depends on strategy, timing, and coordination. Rewards are distributed based on contribution and performance.'
  },
  {
    question: 'Can I create my own raid boss?',
    answer: 'Yes! Use our NFT Builder to design unique raid bosses with custom attributes, abilities, and visual effects. Your creations can be used in battles or traded in our marketplace.'
  },
  {
    question: 'What makes RaidRally unique?',
    answer: 'RaidRally combines NFT creation, strategic gameplay, and community-driven rewards in a seamless Web3 experience. Every raid boss is unique, and every player contribution is valued and rewarded.'
  }
];

export const FAQSection: FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p 
            className="text-base sm:text-lg text-gray-600 dark:text-sand-300 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Find answers to common questions about RaidRally
          </motion.p>
        </div>

        {/* FAQ Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
            >
              <GlassPanel 
                className="h-full group hover:border-primary-500/50 transition-all duration-300"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <HelpCircle className="w-5 h-5 text-primary-500" />
                      </div>
                      <span className="text-base sm:text-lg font-medium text-gray-900 dark:text-sand-100">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-sand-500 transform transition-transform duration-200 flex-shrink-0 mt-1
                              ${openIndex === index ? 'rotate-180' : ''}`}
                    />
                  </div>
                  
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-4 pl-9"
                      >
                        <div className="text-sm sm:text-base text-gray-600 dark:text-sand-400">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};