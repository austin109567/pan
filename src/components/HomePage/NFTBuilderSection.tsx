import { FC } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const NFTBuilderSection: FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-400"
        >
          Create Your Custom Panda PFP
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-lg text-sand-700 dark:text-sand-300 max-w-3xl mx-auto"
        >
          Dive into the world of creativity with our easy-to-use NFT Builder! This tool lets anyone design a personalized 
          panda profile picture (PFP) inspired by the traits and layers of our RaidRally collection. Mix and match traits 
          like expressions, accessories, and backgrounds to craft a digital panda that's uniquely yours. While these designs 
          are separate from our official NFT collection, you can download your custom creation to use as a PFP or share it 
          with friends!
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Side - 2x2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white/40 dark:bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-sand-300/20 dark:border-sand-200/10 hover:border-primary-500/30 transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-sand-900 dark:text-white mb-2">Start Designing</h3>
            <p className="text-sand-700 dark:text-sand-300">
              Choose from a variety of traits and layers to bring your panda vision to life.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white/40 dark:bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-sand-300/20 dark:border-sand-200/10 hover:border-primary-500/30 transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-sand-900 dark:text-white mb-2">Real-Time Preview</h3>
            <p className="text-sand-700 dark:text-sand-300">
              Watch your panda take shape as you add and adjust traits.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white/40 dark:bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-sand-300/20 dark:border-sand-200/10 hover:border-primary-500/30 transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-sand-900 dark:text-white mb-2">Download Your Creation</h3>
            <p className="text-sand-700 dark:text-sand-300">
              Save your personalized PFP directly to your device—completely free!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-white/40 dark:bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-sand-300/20 dark:border-sand-200/10 hover:border-primary-500/30 transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-sand-900 dark:text-white mb-2">Join the Community</h3>
            <p className="text-sand-700 dark:text-sand-300">
              Show off your design and connect with others who love the pandas as much as you do.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="sm:col-span-2 mt-4"
          >
            <Link
              to="/nft-builder"
              className="inline-flex items-center px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500 transition-all duration-200 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30"
            >
              Start Creating
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>

        {/* Right Content - NFT Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="relative flex items-center"
        >
          <div className="aspect-square w-full rounded-2xl overflow-hidden border-2 border-sand-300/20 dark:border-sand-200/10 shadow-2xl shadow-primary-500/20">
            <img
              src="assets/defaultpfp.jpg"
              alt="Sample Panda NFT"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-400 rounded-full opacity-50 blur-2xl" />
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-sand-400 to-sand-300 rounded-full opacity-30 blur-2xl dark:opacity-20" />
        </motion.div>
      </div>
    </div>
  );
};