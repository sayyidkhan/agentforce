import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useMemo } from 'react';
import { CuteBotLeft, CuteBotRight } from './MechaBodies';

function LoadingSparkParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 4,
      duration: 2.5 + Math.random() * 4,
      delay: Math.random() * 8,
      color: ['#8B5CF6', '#EC4899', '#F59E0B', '#FF6B35', '#FFD700', '#3B82F6', '#FF4500'][Math.floor(Math.random() * 7)],
    })), []);

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="spark-particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}, 0 0 ${p.size * 6}px ${p.color}`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </>
  );
}

function LoadingFireEmbers() {
  const embers = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 3 + Math.random() * 5,
      duration: 4 + Math.random() * 5,
      delay: Math.random() * 8,
      color: ['#FF4500', '#FF6B35', '#FF8C00', '#FFD700', '#EF4444'][Math.floor(Math.random() * 5)],
    })), []);

  return (
    <>
      {embers.map((e) => (
        <div
          key={e.id}
          className="fire-ember"
          style={{
            left: e.left,
            width: e.size,
            height: e.size,
            backgroundColor: e.color,
            boxShadow: `0 0 ${e.size * 2}px ${e.color}, 0 0 ${e.size * 5}px ${e.color}`,
            animationDuration: `${e.duration}s`,
            animationDelay: `${e.delay}s`,
          }}
        />
      ))}
    </>
  );
}

function LoadingLightningBolts() {
  const bolts = useMemo(() => [
    { top: '5%', left: '5%', rotate: 12, delay: 0, scale: 0.7 },
    { top: '20%', left: '25%', rotate: -18, delay: 1.5, scale: 0.5 },
    { top: '50%', left: '10%', rotate: 8, delay: 3.0, scale: 0.6 },
    { top: '70%', left: '40%', rotate: -10, delay: 2.0, scale: 0.55 },
    { top: '15%', left: '55%', rotate: 20, delay: 4.0, scale: 0.45 },
    { top: '60%', left: '60%', rotate: -15, delay: 0.8, scale: 0.65 },
    { top: '35%', left: '70%', rotate: 5, delay: 5.0, scale: 0.5 },
    { top: '80%', left: '20%', rotate: -22, delay: 1.2, scale: 0.4 },
  ], []);

  return (
    <>
      {bolts.map((b, i) => (
        <svg
          key={i}
          className="lightning-bolt"
          style={{
            top: b.top,
            left: b.left,
            transform: `rotate(${b.rotate}deg) scale(${b.scale})`,
            animationName: 'bolt-flash',
            animationDuration: `${2.5 + i * 0.6}s`,
            animationDelay: `${b.delay}s`,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
          }}
          width="40"
          height="90"
          viewBox="0 0 40 90"
          fill="none"
        >
          <path
            d="M22 0L8 38h12L6 90l30-50H22L36 0H22z"
            fill={`url(#load-bolt-${i})`}
          />
          <defs>
            <linearGradient id={`load-bolt-${i}`} x1="20" y1="0" x2="20" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="0.3" stopColor="#E0E7FF" />
              <stop offset="0.6" stopColor="#93C5FD" />
              <stop offset="1" stopColor="#6366F1" />
            </linearGradient>
          </defs>
        </svg>
      ))}
    </>
  );
}

function LoadingMegaBolt() {
  return (
    <>
      <svg
        className="mega-lightning"
        style={{ top: '0', left: '30%', animationName: 'mega-bolt', animationDuration: '7s', animationIterationCount: 'infinite', animationTimingFunction: 'linear' }}
        width="50" height="280" viewBox="0 0 60 300" fill="none"
      >
        <path d="M35 0L15 110h18L0 300l55-160H30L60 0H35z" fill="url(#load-mega1)" />
        <defs>
          <linearGradient id="load-mega1" x1="30" y1="0" x2="30" y2="300" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" /><stop offset="0.3" stopColor="#C7D2FE" /><stop offset="0.6" stopColor="#818CF8" /><stop offset="1" stopColor="#4F46E5" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>
      <svg
        className="mega-lightning"
        style={{ top: '10%', left: '65%', transform: 'scaleX(-1)', animationName: 'mega-bolt', animationDuration: '10s', animationDelay: '3s', animationIterationCount: 'infinite', animationTimingFunction: 'linear' }}
        width="45" height="240" viewBox="0 0 60 300" fill="none"
      >
        <path d="M35 0L15 110h18L0 300l55-160H30L60 0H35z" fill="url(#load-mega2)" />
        <defs>
          <linearGradient id="load-mega2" x1="30" y1="0" x2="30" y2="300" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" /><stop offset="0.3" stopColor="#FBCFE8" /><stop offset="0.6" stopColor="#EC4899" /><stop offset="1" stopColor="#9333EA" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
}

interface DotaLoadingScreenProps {
  progress: number;
  logs: Array<{
    stage: string;
    message: string;
    timestamp: string;
    data?: any;
  }>;
}

export function DotaLoadingScreen({ progress, logs }: DotaLoadingScreenProps) {
  const [fighter1, setFighter1] = useState<{ name?: string; avatar?: string }>({});
  const [fighter2, setFighter2] = useState<{ name?: string; avatar?: string }>({});
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Watch logs for avatar data
  useEffect(() => {
    logs.forEach(log => {
      if (log.data) {
        if (log.data.fighter === 1) {
          setFighter1({ name: log.data.name, avatar: log.data.avatar });
        } else if (log.data.fighter === 2) {
          setFighter2({ name: log.data.name, avatar: log.data.avatar });
        }
      }
    });
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="w-full h-screen bg-[#0a0a12] text-white overflow-hidden flex font-sans">
      
      {/* LEFT: VS BATTLE ARENA (75%) */}
      <div className="flex-grow relative h-full flex overflow-hidden">

        {/* Spark particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
          <LoadingSparkParticles />
        </div>

        {/* Fire embers */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[6]">
          <LoadingFireEmbers />
        </div>

        {/* Lightning bolts */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[7]">
          <LoadingLightningBolts />
        </div>

        {/* Mega lightning */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[8]">
          <LoadingMegaBolt />
        </div>

        {/* Edge fire glow */}
        <div className="edge-fire-left z-[4]" />
        <div className="edge-fire-right z-[4]" />
        
        {/* Background Split - Radiant Side (Left) */}
        <div className="absolute inset-0 w-[55%] h-full bg-gradient-to-br from-[#1e1b4b] to-[#0f172a] z-0 transform -skew-x-12 origin-bottom-left scale-110 translate-x-[-10%]" />
        
        {/* Background Split - Dire Side (Right) */}
        <div className="absolute inset-0 w-[55%] h-full bg-gradient-to-bl from-[#3f1015] to-[#1a0505] z-0 left-auto right-0 transform -skew-x-12 origin-top-right scale-110 translate-x-[10%]" />

        {/* VS Divider Line */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="h-[120%] w-[2px] bg-gradient-to-b from-transparent via-white to-transparent transform -skew-x-12 opacity-30" />
        </div>

        {/* Fighter 1 Area */}
        <div className="w-1/2 h-full relative z-20 flex flex-col items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative w-full max-w-[340px] aspect-[400/420]"
          >
            <div className="w-full h-full" style={{ transform: 'perspective(800px) rotateY(15deg)' }}>
              <CuteBotLeft avatarUrl={fighter1.avatar} />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center z-30"
          >
            <h2 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 uppercase tracking-tighter drop-shadow-lg">
              {fighter1.name || 'Scanning...'}
            </h2>
            <p className="text-blue-300/60 text-xs md:text-sm tracking-[0.2em] font-bold mt-1">
              RADIANT WARRIOR
            </p>
          </motion.div>
        </div>

        {/* VS Logo Center */}
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <motion.div 
            initial={{ scale: 0, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative"
          >
            <span className="text-8xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-[0_0_30px_rgba(234,179,8,0.6)] pr-4">
              VS
            </span>
          </motion.div>
        </div>

        {/* Fighter 2 Area */}
        <div className="w-1/2 h-full relative z-20 flex flex-col items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative w-full max-w-[340px] aspect-[400/420]"
          >
            <div className="w-full h-full" style={{ transform: 'perspective(800px) rotateY(-15deg)' }}>
              <CuteBotRight avatarUrl={fighter2.avatar} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center z-30"
          >
            <h2 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-300 uppercase tracking-tighter drop-shadow-lg">
              {fighter2.name || 'Scanning...'}
            </h2>
            <p className="text-red-300/60 text-xs md:text-sm tracking-[0.2em] font-bold mt-1">
              DIRE CHALLENGER
            </p>
          </motion.div>
        </div>
      </div>

      {/* RIGHT: PROCESSING INTERFACE (25%) */}
      <div className="w-[350px] h-full bg-[#050508] border-l border-white/10 flex flex-col relative z-40 shadow-2xl">
        
        {/* Header - Progress Circle */}
        <div className="p-8 border-b border-white/5 flex flex-col items-center justify-center bg-[#0a0a12]/50 backdrop-blur-sm">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="60" fill="none" stroke="#1e293b" strokeWidth="8" />
              <motion.circle 
                cx="64" cy="64" r="60" fill="none" stroke="#8b5cf6" strokeWidth="8" 
                strokeDasharray="377" 
                strokeDashoffset={377 - (377 * progress) / 100}
                strokeLinecap="round"
                initial={{ strokeDashoffset: 377 }}
                animate={{ strokeDashoffset: 377 - (377 * progress) / 100 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{Math.round(progress)}%</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Status</span>
            </div>
          </div>
          
          <div className="mt-6 w-full space-y-2">
            <div className="flex justify-between text-xs text-gray-400 uppercase tracking-wider">
              <span>System</span>
              <span className="text-green-400">Online</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400 uppercase tracking-wider">
              <span>Network</span>
              <span className="text-green-400">Stable</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400 uppercase tracking-wider">
              <span>Data Link</span>
              <span className="text-blue-400">Active</span>
            </div>
          </div>
        </div>

        {/* Logs Area */}
        <div className="flex-grow overflow-hidden flex flex-col bg-[#020203]">
          <div className="p-3 bg-[#0f172a] text-[10px] text-gray-400 uppercase tracking-widest border-b border-white/5 font-bold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            System Activity Log
          </div>
          
          <div className="flex-grow p-4 overflow-y-auto space-y-3 custom-scrollbar font-mono text-xs">
            {logs.length === 0 && (
              <div className="text-gray-600 italic text-center mt-10">Waiting for input stream...</div>
            )}
            {logs.map((log, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="border-l-2 border-white/10 pl-3 py-1 hover:bg-white/5 transition-colors"
              >
                <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                  <span>{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}</span>
                  <span className={`${getStageColor(log.stage)} font-bold`}>{log.stage.toUpperCase()}</span>
                </div>
                <div className="text-gray-300 leading-relaxed break-words">
                  {log.message}
                </div>
              </motion.div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 text-center">
          <p className="text-[10px] text-gray-600 uppercase tracking-[0.3em]">
            AgentForce Engine v2.0
          </p>
        </div>
      </div>
    </div>
  );
}

function getStageColor(stage: string) {
  switch (stage) {
    case 'scraping': return 'text-blue-400';
    case 'normalizing': return 'text-cyan-400';
    case 'scoring': return 'text-yellow-400';
    case 'transforming': return 'text-purple-400';
    case 'generating_commentary': return 'text-pink-400';
    case 'complete': return 'text-green-400';
    case 'error': return 'text-red-400';
    default: return 'text-gray-400';
  }
}
