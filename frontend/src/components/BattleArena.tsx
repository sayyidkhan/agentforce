import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo, useRef } from 'react';
import ProfileCard from './ProfileCard';
import StatsRadarChart from './RadarChart';
import { RobotFighter, type RobotState } from './RobotFighter';
import type { DuelResponse, RoastRound } from '../types';
import { soundFX } from '../utils/SoundFX';

function TypewriterText({ text, className }: { text: string; className?: string }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, 40);
    return () => clearInterval(timer);
  }, [text]);

  return (
    <p className={className}>
      &ldquo;{displayed}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block ml-0.5 font-normal not-italic"
        >|</motion.span>
      )}
      &rdquo;
    </p>
  );
}

interface BattleArenaProps {
  duel: DuelResponse;
}

const getHpColor = (hp: number): string => {
  if (hp > 60) return '#22C55E';
  if (hp > 30) return '#EAB308';
  return '#EF4444';
};

function HealthBar({ name, hp, side, archetype }: {
  name: string;
  hp: number;
  side: 'left' | 'right';
  archetype: string;
}) {
  const color = getHpColor(hp);
  const isCritical = hp <= 25 && hp > 0;

  return (
    <div className={`flex-1 ${side === 'right' ? 'text-right' : ''}`}>
      <div className={`flex items-center gap-2 mb-1 ${side === 'right' ? 'flex-row-reverse' : ''}`}>
        <span className="text-white font-bold text-xs md:text-sm uppercase tracking-wider truncate">
          {name}
        </span>
        <span className="text-gray-500 text-[10px] md:text-xs hidden sm:inline">{archetype}</span>
      </div>
      <div className={`h-5 md:h-7 bg-gray-900/80 rounded-sm border border-gray-600/60 overflow-hidden relative ${
        side === 'right' ? 'flex justify-end' : ''
      } ${isCritical ? 'hp-critical' : ''}`}>
        <motion.div
          className="h-full rounded-sm relative"
          style={{ backgroundColor: color }}
          initial={{ width: '100%' }}
          animate={{ width: `${Math.max(0, hp)}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent" style={{ height: '50%' }} />
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-[10px] md:text-xs font-bold drop-shadow-lg">
            {Math.round(Math.max(0, hp))}%
          </span>
        </div>
      </div>
    </div>
  );
}

export function BattleArena({ duel }: BattleArenaProps) {
  const { profile1, profile2, commentary, winner, winnerName } = duel;

  // Battle orchestration states
  const [showFighters, setShowFighters] = useState(false);
  const [showHealthBars, setShowHealthBars] = useState(false);
  const [fightText, setFightText] = useState(false);
  const [screenFlash, setScreenFlash] = useState(false);
  const [roundAnnounce, setRoundAnnounce] = useState<number | null>(null);
  const [currentRoast, setCurrentRoast] = useState<RoastRound | null>(null);
  const [activeAttacker, setActiveAttacker] = useState<'profile1' | 'profile2' | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [damagePopup, setDamagePopup] = useState<{ side: 'left' | 'right'; amount: number } | null>(null);
  const [koText, setKoText] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [showAnalysisBtn, setShowAnalysisBtn] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisTab, setAnalysisTab] = useState<'overview' | 'statistics' | 'transcript'>('overview');
  const [hp1, setHp1] = useState(100);
  const [hp2, setHp2] = useState(100);
  const [battleLog, setBattleLog] = useState<{ round: number; attacker: string; text: string }[]>([]);
  const [robot1State, setRobot1State] = useState<RobotState>('entering');
  const [robot2State, setRobot2State] = useState<RobotState>('entering');

  const analysisRef = useRef<HTMLDivElement>(null);
  const rounds = commentary?.rounds || [];
  const isDraw = winner === 'draw';

  const damageScale = useMemo(() => {
    if (!rounds.length) return 0.15;
    const dmgToP1 = rounds.filter(r => r.attacker === 'profile2').reduce((s, r) => s + r.damage, 0);
    const dmgToP2 = rounds.filter(r => r.attacker === 'profile1').reduce((s, r) => s + r.damage, 0);
    const maxDmg = Math.max(dmgToP1, dmgToP2, 1);
    // Loser ends at ~10-20% HP, winner ends at ~25-45% HP
    return 85 / maxDmg;
  }, [rounds]);

  // Battle sequence orchestration
  useEffect(() => {
    if (!profile1 || !profile2 || !commentary) return;

    // Reset all visual state for clean replay (handles React StrictMode remount)
    setShowFighters(false);
    setShowHealthBars(false);
    setFightText(false);
    setScreenFlash(false);
    setRoundAnnounce(null);
    setCurrentRoast(null);
    setActiveAttacker(null);
    setIsShaking(false);
    setDamagePopup(null);
    setKoText(false);
    setShowVictory(false);
    setShowAnalysisBtn(false);
    setShowAnalysis(false);
    setHp1(100);
    setHp2(100);
    setBattleLog([]);
    setRobot1State('entering');
    setRobot2State('entering');

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const at = (fn: () => void, delay: number) => {
      timeouts.push(setTimeout(fn, delay));
    };

    let t = 50;

    // --- Intro: fighters slide in ---
    at(() => {
      setShowFighters(true);
      setRobot1State('idle');
      setRobot2State('idle');
      soundFX.play('start');
    }, t);

    t += 1200;
    at(() => setShowHealthBars(true), t);

    t += 800;

    // --- FIGHT!! ---
    at(() => {
      setScreenFlash(true);
      setFightText(true);
      soundFX.play('fight');
    }, t);
    t += 150;
    at(() => setScreenFlash(false), t);
    t += 1850;
    at(() => setFightText(false), t);
    t += 500;

    // --- Battle rounds ---
    rounds.forEach((round, idx) => {
      const isP1Attacking = round.attacker === 'profile1';
      const setAttackerState = isP1Attacking ? setRobot1State : setRobot2State;
      const setDefenderState = isP1Attacking ? setRobot2State : setRobot1State;

      // Round announce — both idle
      at(() => {
        setRoundAnnounce(round.roundNumber || idx + 1);
        setCurrentRoast(null);
        setActiveAttacker(null);
        setRobot1State('idle');
        setRobot2State('idle');
        soundFX.play('round');
      }, t);
      t += 1600;
      at(() => setRoundAnnounce(null), t);
      t += 200;

      // Roast appears — attacker lunges with slight delay for anticipation
      at(() => {
        setCurrentRoast(round);
        setActiveAttacker(round.attacker);
        setBattleLog(prev => [...prev, {
          round: round.roundNumber || idx + 1,
          attacker: round.attacker,
          text: round.roast,
        }]);
      }, t);
      t += 400;

      // Attacker lunges after roast text starts appearing
      at(() => {
        setAttackerState('attacking');
      }, t);
      const roastDisplayTime = Math.max(5500, round.roast.length * 38 + 1800);
      t += roastDisplayTime;

      // Hit lands — defender recoils
      at(() => {
        soundFX.play('hit');
        setIsShaking(true);
        setDefenderState('hit');
        const dmg = round.damage * damageScale;
        if (isP1Attacking) {
          setHp2(prev => Math.max(0, prev - dmg));
          setDamagePopup({ side: 'right', amount: Math.round(round.damage) });
        } else {
          setHp1(prev => Math.max(0, prev - dmg));
          setDamagePopup({ side: 'left', amount: Math.round(round.damage) });
        }
      }, t);
      t += 500;
      at(() => {
        setIsShaking(false);
        setAttackerState('idle');
      }, t);
      t += 400;
      at(() => setDefenderState('idle'), t);
      t += 350;
      at(() => {
        setDamagePopup(null);
        setCurrentRoast(null);
        setActiveAttacker(null);
      }, t);
      t += 1800;
    });

    // --- K.O. ---
    at(() => {
      setScreenFlash(true);
      setKoText(true);
      soundFX.play('ko');
    }, t);
    t += 150;
    at(() => setScreenFlash(false), t);
    t += 2350;
    at(() => setKoText(false), t);
    t += 600;

    // --- Victory ---
    at(() => {
      setShowVictory(true);
      soundFX.play('win');
      if (winner === 'profile1') {
        setRobot1State('winner');
        setRobot2State('defeated');
      } else if (winner === 'profile2') {
        setRobot2State('winner');
        setRobot1State('defeated');
      } else {
        setRobot1State('idle');
        setRobot2State('idle');
      }
    }, t);
    t += 3000;
    at(() => setShowAnalysisBtn(true), t);
    t += 500;
    at(() => {
      setShowAnalysis(true);
      setTimeout(() => analysisRef.current?.scrollIntoView({ behavior: 'smooth' }), 200);
    }, t);

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [profile1, profile2, commentary, rounds, damageScale]);

  const handleShowAnalysis = () => {
    setShowAnalysis(true);
    setTimeout(() => {
      analysisRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Fallback: if no commentary, skip battle animation and jump to analysis
  useEffect(() => {
    if (profile1 && profile2 && !commentary) {
      setShowFighters(true);
      setShowHealthBars(true);
      setShowVictory(true);
      setShowAnalysisBtn(true);
    }
  }, [profile1, profile2, commentary]);

  if (!profile1 || !profile2) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Loading battle data...</p>
      </div>
    );
  }

  const name1 = profile1.profile.name;
  const name2 = profile2.profile.name;
  const isP1Winner = winner === 'profile1';
  const isP2Winner = winner === 'profile2';

  return (
    <div className="min-h-screen bg-battle-gradient">
      {/* ===== BATTLE ARENA (Full Viewport) ===== */}
      <div className={`h-screen flex flex-col relative overflow-hidden ${isShaking ? 'screen-shake' : ''}`}>
        {/* Arena background effects */}
        <div className="absolute inset-0 arena-floor pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 30%, rgba(139,92,246,0.06) 0%, transparent 50%)',
          }}
        />

        {/* --- Top: Health Bars --- */}
        <AnimatePresence>
          {showHealthBars && (
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-20 px-4 md:px-8 pt-4"
            >
              <div className="flex items-center gap-3 md:gap-6 max-w-5xl mx-auto">
                <HealthBar name={name1} hp={hp1} side="left" archetype={profile1.archetype} />
                <div className="flex flex-col items-center shrink-0">
                  <span className="text-gray-500 text-[10px] uppercase tracking-widest">VS</span>
                </div>
                <HealthBar name={name2} hp={hp2} side="right" archetype={profile2.archetype} />
              </div>

              {/* Round counter */}
              {battleLog.length > 0 && (
                <div className="text-center mt-2">
                  <span className="text-gray-600 text-[10px] md:text-xs uppercase tracking-widest">
                    Round {battleLog.length} / {rounds.length}
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- Center: Robot Fighters --- */}
        <div className="flex-1 flex items-center justify-between px-4 md:px-12 lg:px-20 relative z-10">
          {showFighters && (
            <>
              <RobotFighter
                avatarUrl={profile1.profile.avatar}
                name={name1}
                side="left"
                state={robot1State}
                accentColor="#8B5CF6"
              />

              <div className="relative flex-1" />

              <RobotFighter
                avatarUrl={profile2.profile.avatar}
                name={name2}
                side="right"
                state={robot2State}
                accentColor="#EC4899"
              />
            </>
          )}

          {/* Damage popup */}
          <AnimatePresence>
            {damagePopup && (
              <motion.div
                key={`dmg-${Date.now()}`}
                initial={{ opacity: 1, y: 0, scale: 0.5 }}
                animate={{ opacity: 0, y: -80, scale: 1.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9 }}
                className={`absolute top-1/3 z-30 ${
                  damagePopup.side === 'left' ? 'left-[15%] md:left-[20%]' : 'right-[15%] md:right-[20%]'
                }`}
              >
                <span
                  className="text-4xl md:text-7xl font-black text-red-500 mk-text-stroke"
                  style={{ textShadow: '0 0 30px rgba(239,68,68,0.8), 0 4px 0 #991b1b' }}
                >
                  -{damagePopup.amount}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- Center: Roast Display (overlay) --- */}
        <div className="absolute inset-x-0 bottom-0 z-30 flex items-end justify-center px-4 pb-4 pointer-events-none" style={{ top: '55%' }}>
          <AnimatePresence mode="wait">
            {currentRoast && (
              <motion.div
                key={`roast-${currentRoast.roundNumber}`}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.95 }}
                transition={{ duration: 0.4, type: 'spring', bounce: 0.3 }}
                className="max-w-xl w-full pointer-events-auto"
              >
                <motion.div
                  className={`p-3 md:p-4 rounded-xl border-2 backdrop-blur-md relative overflow-hidden ${
                    currentRoast.attacker === 'profile1'
                      ? 'border-purple-500/70 bg-purple-500/10'
                      : 'border-pink-500/70 bg-pink-500/10'
                  }`}
                  animate={{
                    boxShadow: currentRoast.attacker === 'profile1'
                      ? [
                          '0 0 15px rgba(139,92,246,0.2)',
                          '0 0 35px rgba(139,92,246,0.55)',
                          '0 0 15px rgba(139,92,246,0.2)',
                        ]
                      : [
                          '0 0 15px rgba(236,72,153,0.2)',
                          '0 0 35px rgba(236,72,153,0.55)',
                          '0 0 15px rgba(236,72,153,0.2)',
                        ],
                  }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {/* Subtle shimmer strip */}
                  <motion.div
                    className={`absolute top-0 left-0 right-0 h-[2px] ${
                      currentRoast.attacker === 'profile1'
                        ? 'bg-gradient-to-r from-transparent via-purple-400 to-transparent'
                        : 'bg-gradient-to-r from-transparent via-pink-400 to-transparent'
                    }`}
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />

                  <div className="flex items-center gap-2 mb-2">
                    {/* Attacker icon */}
                    <motion.span
                      className="text-lg"
                      animate={{ scale: [1, 1.25, 1], rotate: [0, -8, 8, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      {currentRoast.attacker === 'profile1' ? '⚔️' : '🗡️'}
                    </motion.span>

                    <span className={`w-2 h-2 rounded-full ${
                      currentRoast.attacker === 'profile1' ? 'bg-purple-400' : 'bg-pink-400'
                    }`} />
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      currentRoast.attacker === 'profile1' ? 'text-purple-400' : 'text-pink-400'
                    }`}>
                      {currentRoast.attacker === 'profile1' ? name1 : name2}
                    </span>

                    {/* Damage emoji badge */}
                    <motion.span
                      className="ml-auto text-base"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: 'spring', bounce: 0.6 }}
                    >
                      {currentRoast.damage >= 30
                        ? '💥🔥'
                        : currentRoast.damage >= 20
                        ? '⚡😤'
                        : '💬😏'}
                    </motion.span>
                  </div>

                  <TypewriterText
                    text={currentRoast.roast}
                    className="text-white text-sm md:text-base font-medium italic leading-relaxed"
                  />

                  {currentRoast.reaction && (
                    <motion.p
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.8 }}
                      className="text-gray-400 text-xs md:text-sm mt-2 italic flex items-center gap-1"
                    >
                      <span>😮</span>
                      <span>* {currentRoast.reaction} *</span>
                    </motion.p>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ===== OVERLAYS ===== */}

        {/* Screen flash */}
        <AnimatePresence>
          {screenFlash && (
            <motion.div
              className="absolute inset-0 bg-white z-50 pointer-events-none"
              initial={{ opacity: 0.9 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>

        {/* FIGHT!! overlay */}
        <AnimatePresence>
          {fightText && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.h1
                initial={{ scale: 4, opacity: 0, rotate: -5 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                className="text-7xl md:text-[10rem] lg:text-[14rem] font-black mk-text-stroke select-none"
                style={{
                  background: 'linear-gradient(180deg, #FFD700 0%, #FF4500 40%, #DC143C 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 40px rgba(255,69,0,0.7)) drop-shadow(0 8px 0 rgba(0,0,0,0.5))',
                }}
              >
                FIGHT!!
              </motion.h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ROUND X overlay */}
        <AnimatePresence>
          {roundAnnounce !== null && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                className="text-center"
              >
                <p className="text-gray-400 text-lg md:text-2xl uppercase tracking-[0.3em] mb-1">Round</p>
                <p
                  className="text-6xl md:text-9xl font-black mk-text-stroke"
                  style={{
                    background: 'linear-gradient(180deg, #ffffff 0%, #a0a0a0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3)) drop-shadow(0 4px 0 rgba(0,0,0,0.5))',
                  }}
                >
                  {roundAnnounce}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* K.O. overlay */}
        <AnimatePresence>
          {koText && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-40 bg-black/50 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.h1
                initial={{ scale: 5, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.3, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                className="text-7xl md:text-[10rem] lg:text-[14rem] font-black mk-text-stroke select-none"
                style={{
                  background: isDraw
                    ? 'linear-gradient(180deg, #FFD700 0%, #FFA500 100%)'
                    : 'linear-gradient(180deg, #FF0000 0%, #8B0000 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 50px rgba(239,68,68,0.8)) drop-shadow(0 8px 0 rgba(0,0,0,0.6))',
                }}
              >
                {isDraw ? 'DRAW!' : 'K.O.'}
              </motion.h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Victory banner */}
        <AnimatePresence>
          {showVictory && (
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black via-black/90 to-transparent pt-16 pb-8 px-4"
            >
              <div className="text-center max-w-2xl mx-auto">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-yellow-400 text-sm md:text-base uppercase tracking-[0.4em] mb-2"
                >
                  {isDraw ? 'DOUBLE K.O.' : 'WINNER'}
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="text-white text-3xl md:text-5xl lg:text-6xl font-black mb-3"
                  style={{ textShadow: '0 0 30px rgba(255,255,255,0.2)' }}
                >
                  {isDraw ? 'Both Warriors Stand!' : winnerName}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-gray-300 text-sm md:text-base italic max-w-xl mx-auto leading-relaxed"
                >
                  &ldquo;{commentary?.verdict}&rdquo;
                </motion.p>

                <AnimatePresence>
                  {showAnalysisBtn && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 flex flex-col sm:flex-row gap-3 justify-center"
                    >
                      <button
                        onClick={handleShowAnalysis}
                        className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-sm md:text-base transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30"
                      >
                        View Battle Analysis
                      </button>
                      <button
                        onClick={() => window.location.href = '/'}
                        className="px-8 py-3 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-bold rounded-lg text-sm md:text-base transition-all hover:scale-105"
                      >
                        New Battle
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===== ANALYSIS SECTION (Tabbed) ===== */}
      <AnimatePresence>
        {showAnalysis && (
          <motion.div
            ref={analysisRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-battle-gradient py-10 px-4"
          >
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-1">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
                    Battle Analysis
                  </span>
                </h2>
                <p className="text-gray-500 text-sm">Detailed breakdown of the battle</p>
              </div>

              {/* Tab Bar */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex bg-black/50 rounded-xl p-1 border border-white/10">
                  {([
                    { id: 'overview' as const, label: 'Overview' },
                    { id: 'statistics' as const, label: 'Statistics' },
                    { id: 'transcript' as const, label: 'Transcript' },
                  ]).map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setAnalysisTab(tab.id)}
                      className={`px-5 md:px-8 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
                        analysisTab === tab.id
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {/* ── OVERVIEW TAB ── */}
                {analysisTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-2 gap-4 md:gap-6">
                      <ProfileCard profile={profile1} side="left" isWinner={isP1Winner} />
                      <ProfileCard profile={profile2} side="right" isWinner={isP2Winner} />
                    </div>

                    {/* Verdict card */}
                    <div className="p-6 md:p-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-white/10 text-center max-w-3xl mx-auto">
                      <h3 className="text-lg font-bold text-yellow-400 mb-3 uppercase tracking-wider">
                        The Verdict
                      </h3>
                      <p className="text-white text-base md:text-lg italic leading-relaxed">
                        {commentary?.verdict}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* ── STATISTICS TAB ── */}
                {analysisTab === 'statistics' && (
                  <motion.div
                    key="statistics"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-8"
                  >
                    {/* Radar Chart */}
                    <div className="bg-black/40 rounded-xl p-6 border border-gray-700/50 max-w-4xl mx-auto">
                      <h3 className="text-lg font-bold text-white text-center mb-4">
                        Skill Comparison
                      </h3>
                      <StatsRadarChart
                        stats1={profile1.stats}
                        stats2={profile2.stats}
                        name1={name1}
                        name2={name2}
                      />
                    </div>

                    {/* Side-by-side stat bars */}
                    <div className="bg-black/40 rounded-xl p-6 border border-gray-700/50 max-w-4xl mx-auto">
                      <h3 className="text-lg font-bold text-white text-center mb-6">
                        Head-to-Head
                      </h3>
                      <div className="space-y-4">
                        {(Object.keys(profile1.stats) as Array<keyof typeof profile1.stats>).map((key) => {
                          const v1 = profile1.stats[key];
                          const v2 = profile2.stats[key];
                          const max = Math.max(v1, v2, 1);
                          return (
                            <div key={key} className="space-y-1.5">
                              <div className="flex justify-between text-xs uppercase tracking-wider">
                                <span className="text-purple-400 font-bold">{v1}</span>
                                <span className="text-gray-400 capitalize">{key}</span>
                                <span className="text-pink-400 font-bold">{v2}</span>
                              </div>
                              <div className="flex gap-1 h-3">
                                <div className="flex-1 flex justify-end bg-gray-800 rounded-l-full overflow-hidden">
                                  <motion.div
                                    className="h-full bg-purple-500 rounded-l-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(v1 / max) * 100}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                  />
                                </div>
                                <div className="flex-1 bg-gray-800 rounded-r-full overflow-hidden">
                                  <motion.div
                                    className="h-full bg-pink-500 rounded-r-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(v2 / max) * 100}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between mt-4 text-xs text-gray-500">
                        <span className="text-purple-400 font-semibold">{name1}</span>
                        <span className="text-pink-400 font-semibold">{name2}</span>
                      </div>
                    </div>

                    {/* Power comparison */}
                    <div className="bg-black/40 rounded-xl p-6 border border-gray-700/50 max-w-4xl mx-auto">
                      <h3 className="text-lg font-bold text-white text-center mb-4">
                        Total Power
                      </h3>
                      <div className="flex items-center gap-6 justify-center">
                        <div className="text-center">
                          <p className="text-4xl md:text-5xl font-black text-purple-400">{profile1.totalPower}</p>
                          <p className="text-gray-400 text-sm mt-1">{name1}</p>
                        </div>
                        <span className="text-gray-600 text-2xl font-bold">vs</span>
                        <div className="text-center">
                          <p className="text-4xl md:text-5xl font-black text-pink-400">{profile2.totalPower}</p>
                          <p className="text-gray-400 text-sm mt-1">{name2}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── TRANSCRIPT TAB ── */}
                {analysisTab === 'transcript' && (
                  <motion.div
                    key="transcript"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                    className="max-w-4xl mx-auto space-y-6"
                  >
                    {/* Introduction */}
                    {commentary?.introduction && (
                      <div className="p-5 bg-black/40 rounded-xl border border-gray-700/50 text-center">
                        <p className="text-gray-300 italic text-base md:text-lg">
                          &ldquo;{commentary.introduction}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Rounds */}
                    <div className="space-y-4">
                      {rounds.map((round, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: round.attacker === 'profile1' ? -20 : 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.08 }}
                          className={`flex ${round.attacker === 'profile1' ? 'justify-start' : 'justify-end'}`}
                        >
                          <div className={`max-w-[85%] p-5 rounded-2xl border ${
                            round.attacker === 'profile1'
                              ? 'bg-purple-500/10 border-purple-500/40 rounded-tl-none'
                              : 'bg-pink-500/10 border-pink-500/40 rounded-tr-none'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xs font-bold uppercase ${
                                round.attacker === 'profile1' ? 'text-purple-400' : 'text-pink-400'
                              }`}>
                                Round {round.roundNumber || idx + 1} — {round.attacker === 'profile1' ? name1 : name2}
                              </span>
                              <span className="text-red-400 text-xs font-bold">DMG {round.damage}</span>
                            </div>
                            <p className="text-white text-base md:text-lg font-medium mb-2 italic">
                              &ldquo;{round.roast}&rdquo;
                            </p>
                            <p className="text-gray-500 text-xs italic">* {round.reaction} *</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Verdict */}
                    <div className="p-6 md:p-8 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-2xl border border-white/10 text-center">
                      <h3 className="text-lg font-bold text-yellow-400 mb-3 uppercase tracking-wider">
                        The Verdict
                      </h3>
                      <p className="text-white text-base md:text-lg italic leading-relaxed">
                        {commentary?.verdict}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action buttons (always visible) */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-10 pb-8">
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-all hover:scale-105"
                >
                  New Battle
                </button>
                <button
                  onClick={() => {
                    const text = isDraw
                      ? 'Epic DevDuel ended in a draw!'
                      : `${winnerName} just won an epic DevDuel roast battle!`;
                    if (navigator.share) {
                      navigator.share({ title: 'DevDuel Result', text, url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(`${text} ${window.location.href}`);
                    }
                  }}
                  className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition-all hover:scale-105"
                >
                  Share Result
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BattleArena;
