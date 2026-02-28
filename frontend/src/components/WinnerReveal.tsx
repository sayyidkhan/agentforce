import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { soundFX } from '../utils/SoundFX';

interface WinnerRevealProps {
  winner: string;
  isDraw: boolean;
  closingStatement: string;
}

export function WinnerReveal({ winner, isDraw, closingStatement }: WinnerRevealProps) {
  useEffect(() => {
    soundFX.play('win');
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="relative overflow-hidden"
    >
      {/* Aura Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-anime-purple via-anime-gold to-anime-pink opacity-20 blur-3xl" />
      
      <div className="relative bg-black bg-opacity-60 rounded-2xl p-8 md:p-12 border-2 border-anime-gold shadow-2xl">
        {/* Trophy/Crown Icon */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-6"
        >
          <span className="text-6xl md:text-8xl">
            {isDraw ? '🤝' : '👑'}
          </span>
        </motion.div>

        {/* Winner Announcement */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          className="text-center"
        >
          <h2 className="text-xl md:text-2xl text-anime-gold font-semibold mb-2 uppercase tracking-wider">
            {isDraw ? 'Epic Draw!' : 'Victory!'}
          </h2>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4"
          >
            {isDraw ? 'Both Warriors Triumph!' : winner}
          </motion.h1>

          {!isDraw && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-anime-gold text-lg md:text-xl font-semibold"
            >
              Claims Victory in DevDuel!
            </motion.p>
          )}
        </motion.div>

        {/* Closing Statement */}
        {closingStatement && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-8 p-4 bg-gray-900 bg-opacity-50 rounded-xl"
          >
            <p className="text-gray-200 text-center italic">
              "{closingStatement}"
            </p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-anime-purple hover:bg-purple-600 text-white font-semibold rounded-lg transition-all hover:scale-105"
          >
            New Battle
          </button>
          <button
            onClick={() => {
              const shareText = isDraw 
                ? `Epic DevDuel ended in a draw! Two legendary warriors proved equally matched!`
                : `${winner} just won an epic DevDuel battle! The power levels were off the charts!`;
              
              if (navigator.share) {
                navigator.share({
                  title: 'DevDuel Battle Result',
                  text: shareText,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
                alert('Battle result copied to clipboard!');
              }
            }}
            className="px-6 py-3 bg-anime-gold hover:bg-yellow-500 text-black font-semibold rounded-lg transition-all hover:scale-105"
          >
            Share Result
          </button>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-anime-purple opacity-10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-anime-pink opacity-10 rounded-full blur-2xl translate-x-1/2 translate-y-1/2" />
      </div>
    </motion.div>
  );
}

export default WinnerReveal;
