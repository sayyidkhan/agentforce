import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import type { BattleCommentary, RoastRound } from '../types';
import { soundFX } from '../utils/SoundFX';

interface RoastDialogueProps {
  commentary: BattleCommentary;
  onComplete?: () => void;
}

export function RoastDialogue({ commentary, onComplete }: RoastDialogueProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [displayedRounds, setDisplayedRounds] = useState<RoastRound[]>([]);

  useEffect(() => {
    if (currentRound < commentary.rounds.length) {
      const timer = setTimeout(() => {
        setDisplayedRounds(prev => [...prev, commentary.rounds[currentRound]]);
        setCurrentRound(prev => prev + 1);
        soundFX.play('hit');
      }, 2000); // 2 second delay between rounds
      return () => clearTimeout(timer);
    } else {
      if (onComplete) {
        const timer = setTimeout(onComplete, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [currentRound, commentary.rounds, onComplete]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 p-4 bg-black/40 rounded-xl border border-anime-purple/30"
      >
        <p className="text-xl italic text-gray-200">"{commentary.introduction}"</p>
      </motion.div>

      {/* Rounds */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {displayedRounds.map((round, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: round.attacker === 'profile1' ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${round.attacker === 'profile1' ? 'justify-start' : 'justify-end'}`}
            >
              <div 
                className={`max-w-[80%] p-6 rounded-2xl border ${
                  round.attacker === 'profile1' 
                    ? 'bg-anime-purple/10 border-anime-purple/50 rounded-tl-none' 
                    : 'bg-anime-pink/10 border-anime-pink/50 rounded-tr-none'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold uppercase ${
                    round.attacker === 'profile1' ? 'text-anime-purple' : 'text-anime-pink'
                  }`}>
                    Round {round.roundNumber}
                  </span>
                  <span className="text-xs text-gray-500">Damage: {round.damage}</span>
                </div>
                <p className="text-lg md:text-xl font-medium text-white mb-3">
                  "{round.roast}"
                </p>
                <p className="text-sm text-gray-400 italic">
                  * {round.reaction} *
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Verdict */}
      {currentRound === commentary.rounds.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-8 bg-gradient-to-r from-anime-purple/20 to-anime-pink/20 rounded-2xl border border-white/10 text-center"
        >
          <h3 className="text-2xl font-bold text-anime-gold mb-4">THE VERDICT</h3>
          <p className="text-xl text-white">{commentary.verdict}</p>
        </motion.div>
      )}
    </div>
  );
}
