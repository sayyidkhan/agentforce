import { motion, type Variants } from 'framer-motion';

export type RobotState = 'idle' | 'entering' | 'attacking' | 'hit' | 'defeated' | 'winner';

interface RobotFighterProps {
  avatarUrl?: string;
  name: string;
  side: 'left' | 'right';
  state: RobotState;
  accentColor: string;
}

// --- BODY (whole robot) ---
const bodyVariants: Variants = {
  entering: { opacity: 0, x: 0, y: 0, rotate: 0 },
  idle: {
    opacity: 1,
    x: [0, 4, 0, -3, 0],
    y: [0, -5, -2, -7, 0],
    rotate: [0, 1, 0, -1, 0],
    transition: {
      x: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
      y: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
      rotate: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
    },
  },
  attacking: {
    opacity: 1,
    x: [0, -15, 70],
    y: [0, 4, -6],
    rotate: [0, 3, -4],
    transition: {
      duration: 0.4,
      times: [0, 0.25, 1],
      ease: 'easeOut',
    },
  },
  hit: {
    opacity: 1,
    x: [0, -35, -20, -28, -10, 0],
    y: [0, 6, -2, 3, 0],
    rotate: [0, -6, 3, -2, 0],
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  defeated: {
    opacity: 0.45,
    x: -10,
    y: 30,
    rotate: 18,
    filter: 'grayscale(0.9)',
    transition: { duration: 1, ease: 'easeIn' },
  },
  winner: {
    opacity: 1,
    x: [0, 3, -3, 0],
    y: [0, -18, -4, -18, 0],
    rotate: [0, -2, 2, -2, 0],
    transition: {
      y: { duration: 0.7, repeat: Infinity, ease: 'easeInOut' },
      x: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' },
      rotate: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' },
    },
  },
};

// --- HEAD ---
const headVariants: Variants = {
  idle: {
    rotate: [0, 3, 0, -2, 0],
    y: [0, -1, 1, -1, 0],
    transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
  },
  attacking: {
    rotate: [0, 5, -8],
    y: [0, 0, -3],
    transition: { duration: 0.35, times: [0, 0.3, 1] },
  },
  hit: {
    rotate: [0, -12, 6, -3, 0],
    y: [0, 4, -2, 1, 0],
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  defeated: {
    rotate: 25, y: 8,
    transition: { duration: 1 },
  },
  winner: {
    rotate: [0, -5, 5, 0],
    y: [0, -3, -3, 0],
    transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
  },
};

// --- TORSO ---
const torsoVariants: Variants = {
  idle: {
    scaleY: [1, 1.015, 1, 0.99, 1],
    rotate: [0, 0.5, 0, -0.5, 0],
    transition: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' },
  },
  attacking: {
    scaleY: [1, 0.95, 1.04],
    rotate: [0, 2, -6],
    transition: { duration: 0.35, times: [0, 0.3, 1] },
  },
  hit: {
    scaleY: [1, 0.92, 1.02, 1],
    rotate: [0, 4, -2, 0],
    transition: { duration: 0.4 },
  },
  defeated: { scaleY: 0.92, rotate: 5, transition: { duration: 1 } },
  winner: {
    scaleY: [1, 1.04, 1],
    transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' },
  },
};

// --- LEAD ARM (punching arm) ---
const leadArmVariants: Variants = {
  idle: {
    rotate: [-15, -25, -15, -20, -15],
    x: [0, 2, 0, -1, 0],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
  attacking: {
    rotate: [-15, 10, -110],
    x: [0, -5, 28],
    y: [0, 2, -8],
    transition: { duration: 0.4, times: [0, 0.3, 1], ease: 'easeOut' },
  },
  hit: {
    rotate: [-15, 30, 10, -15],
    x: [0, -6, -2, 0],
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  defeated: { rotate: 50, x: -5, y: 10, transition: { duration: 1 } },
  winner: {
    rotate: [-150, -140, -150],
    x: [0, 3, 0],
    transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
  },
};

// --- REAR ARM (guard arm) ---
const rearArmVariants: Variants = {
  idle: {
    rotate: [10, 18, 10, 14, 10],
    x: [0, -1, 0, 1, 0],
    transition: { duration: 2.3, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
  },
  attacking: {
    rotate: [10, 25, 5],
    x: [0, 2, -3],
    transition: { duration: 0.35, times: [0, 0.3, 1] },
  },
  hit: {
    rotate: [10, -20, 5, 10],
    x: [0, -4, 0, 0],
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  defeated: { rotate: 40, x: 5, y: 8, transition: { duration: 1 } },
  winner: {
    rotate: [150, 140, 150],
    x: [0, -3, 0],
    transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
  },
};

// --- FRONT LEG ---
const frontLegVariants: Variants = {
  idle: {
    rotate: [0, -4, 0, 2, 0],
    y: [0, 1, 0, -1, 0],
    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
  },
  attacking: {
    rotate: [0, 5, -18],
    y: [0, 0, -4],
    transition: { duration: 0.35, times: [0, 0.3, 1] },
  },
  hit: {
    rotate: [0, 10, -4, 0],
    y: [0, 3, 0, 0],
    transition: { duration: 0.4 },
  },
  defeated: { rotate: 15, y: 5, transition: { duration: 1 } },
  winner: {
    rotate: [0, -6, 0],
    transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' },
  },
};

// --- BACK LEG ---
const backLegVariants: Variants = {
  idle: {
    rotate: [0, 3, 0, -3, 0],
    y: [0, -1, 0, 1, 0],
    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
  },
  attacking: {
    rotate: [0, -8, 12],
    y: [0, -2, 2],
    transition: { duration: 0.35, times: [0, 0.3, 1] },
  },
  hit: {
    rotate: [0, -6, 8, 0],
    y: [0, -2, 1, 0],
    transition: { duration: 0.4 },
  },
  defeated: { rotate: 25, y: 3, transition: { duration: 1 } },
  winner: {
    rotate: [0, 5, 0],
    transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay: 0.15 },
  },
};

// --- FIST GLOW ---
const fistGlowVariants: Variants = {
  idle: { scale: 0, opacity: 0 },
  attacking: {
    scale: [0, 1.8, 1, 1.5, 1.2],
    opacity: [0, 1, 0.6, 0.9, 0.7],
    transition: { duration: 0.5, repeat: Infinity, repeatDelay: 0.1 },
  },
  hit: { scale: 0, opacity: 0 },
  defeated: { scale: 0, opacity: 0 },
  winner: {
    scale: [1, 1.4, 1],
    opacity: [0.5, 0.2, 0.5],
    transition: { duration: 1, repeat: Infinity },
  },
};

export function RobotFighter({ avatarUrl, name, side, state, accentColor }: RobotFighterProps) {
  const isLeft = side === 'left';
  const animState = state === 'entering' ? 'idle' : state;
  const mirrorX = isLeft ? 1 : -1;
  const metalBase = 'linear-gradient(180deg, #d4d4d8 0%, #a1a1aa 40%, #71717a 100%)';
  const metalDark = 'linear-gradient(180deg, #a1a1aa 0%, #71717a 50%, #52525b 100%)';
  const metalChest = `linear-gradient(180deg, #e4e4e7 0%, #a1a1aa 30%, ${accentColor}33 100%)`;

  return (
    <div className="flex flex-col items-center" style={{ minWidth: 160 }}>
      <motion.div
        variants={bodyVariants}
        initial="entering"
        animate={animState}
        className="relative"
        style={{ scaleX: mirrorX, width: 160, height: 260 }}
      >
        {/* Hit flash overlay */}
        {state === 'hit' && (
          <motion.div
            className="absolute inset-0 rounded-xl z-50 pointer-events-none"
            initial={{ opacity: 0.7, scale: 1.1 }}
            animate={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.45 }}
            style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.6) 0%, rgba(239,68,68,0.2) 40%, transparent 70%)' }}
          />
        )}

        {/* Impact sparks on hit */}
        {state === 'hit' && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full z-50 pointer-events-none"
                style={{
                  top: 90 + Math.random() * 40,
                  left: isLeft ? 20 + Math.random() * 30 : 100 + Math.random() * 30,
                  width: 4 + Math.random() * 4,
                  height: 4 + Math.random() * 4,
                  background: i % 2 === 0 ? '#fbbf24' : accentColor,
                }}
                initial={{ opacity: 1, scale: 1 }}
                animate={{
                  opacity: 0,
                  scale: 0,
                  x: (Math.random() - 0.5) * 60,
                  y: (Math.random() - 0.5) * 40,
                }}
                transition={{ duration: 0.35 + Math.random() * 0.2 }}
              />
            ))}
          </>
        )}

        {/* === HEAD === */}
        <motion.div
          variants={headVariants}
          animate={animState}
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: 0, width: 72, height: 72, transformOrigin: 'center bottom' }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: metalBase,
              boxShadow: `0 0 12px ${accentColor}66, inset 0 2px 4px rgba(255,255,255,0.4), 0 4px 8px rgba(0,0,0,0.5)`,
            }}
          />
          <div
            className="absolute rounded-full overflow-hidden"
            style={{ top: 4, left: 4, width: 64, height: 64 }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-2xl font-black text-white"
                style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)` }}
              >
                {name.charAt(0)}
              </div>
            )}
          </div>
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              top: 4, left: 4, width: 64, height: 32,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)',
              borderRadius: '64px 64px 0 0',
            }}
          />
          <motion.div
            className="absolute rounded-full"
            style={{
              top: 30, left: 10, width: 6, height: 6,
              background: accentColor,
              boxShadow: `0 0 8px ${accentColor}, 0 0 16px ${accentColor}88`,
            }}
            animate={state === 'hit'
              ? { opacity: [1, 0, 1, 0, 1], scale: [1, 0.5, 1.3, 0.8, 1] }
              : { opacity: [1, 0.3, 1] }}
            transition={state === 'hit'
              ? { duration: 0.3 }
              : { duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="absolute rounded-full"
            style={{
              top: 30, right: 10, width: 6, height: 6,
              background: accentColor,
              boxShadow: `0 0 8px ${accentColor}, 0 0 16px ${accentColor}88`,
            }}
            animate={state === 'hit'
              ? { opacity: [1, 0, 1, 0, 1], scale: [1, 0.5, 1.3, 0.8, 1] }
              : { opacity: [1, 0.3, 1] }}
            transition={state === 'hit'
              ? { duration: 0.3, delay: 0.05 }
              : { duration: 1.5, repeat: Infinity, delay: 0.2 }}
          />
        </motion.div>

        {/* === NECK === */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: 68, width: 18, height: 14,
            background: metalDark,
            borderRadius: 4,
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.2)',
          }}
        />

        {/* === TORSO === */}
        <motion.div
          variants={torsoVariants}
          animate={animState}
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: 80, width: 80, height: 80,
            background: metalChest,
            borderRadius: '12px 12px 8px 8px',
            transformOrigin: 'center center',
            boxShadow: `0 0 20px ${accentColor}33, inset 0 2px 6px rgba(255,255,255,0.3), 0 6px 12px rgba(0,0,0,0.5)`,
          }}
        >
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: 12, width: 36, height: 20,
              background: `linear-gradient(180deg, ${accentColor}44 0%, ${accentColor}11 100%)`,
              borderRadius: 6,
              border: `1px solid ${accentColor}66`,
              boxShadow: `0 0 10px ${accentColor}44`,
            }}
          >
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: 8, height: 8,
                background: accentColor,
                boxShadow: `0 0 12px ${accentColor}, 0 0 24px ${accentColor}88`,
              }}
              animate={state === 'attacking'
                ? { opacity: [1, 0.2, 1, 0.2, 1], scale: [1, 1.5, 0.8, 1.5, 1] }
                : { opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }}
              transition={state === 'attacking'
                ? { duration: 0.4, repeat: Infinity }
                : { duration: 2, repeat: Infinity }}
            />
          </div>
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{ height: 8, background: metalDark, borderRadius: '0 0 8px 8px' }}
          />
          {/* Shoulder joints */}
          <motion.div
            className="absolute rounded-full"
            style={{
              top: -4, left: -6, width: 14, height: 14,
              background: metalBase,
              boxShadow: `0 0 6px ${accentColor}44, inset 0 1px 2px rgba(255,255,255,0.4)`,
            }}
            animate={{ rotate: [0, 10, 0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute rounded-full"
            style={{
              top: -4, right: -6, width: 14, height: 14,
              background: metalBase,
              boxShadow: `0 0 6px ${accentColor}44, inset 0 1px 2px rgba(255,255,255,0.4)`,
            }}
            animate={{ rotate: [0, -10, 0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
        </motion.div>

        {/* === LEAD ARM (punching arm) === */}
        <motion.div
          variants={leadArmVariants}
          animate={animState}
          className="absolute"
          style={{
            top: 84, left: isLeft ? 112 : undefined, right: isLeft ? undefined : 112,
            width: 22, height: 60,
            background: metalBase,
            borderRadius: '8px 8px 6px 6px',
            transformOrigin: 'top center',
            boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.3), 0 4px 6px rgba(0,0,0,0.4)',
          }}
        >
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-full"
            style={{
              top: 28, width: 10, height: 10,
              background: accentColor,
              boxShadow: `0 0 6px ${accentColor}88`,
            }}
          />
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: 42, width: 18, height: 28,
              background: metalDark,
              borderRadius: '4px 4px 10px 10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
            }}
          />
          <motion.div
            variants={fistGlowVariants}
            animate={animState}
            className="absolute left-1/2 -translate-x-1/2 rounded-full"
            style={{
              top: 56, width: 30, height: 30,
              background: `radial-gradient(circle, ${accentColor}88 0%, transparent 70%)`,
            }}
          />
        </motion.div>

        {/* === REAR ARM (guard arm) === */}
        <motion.div
          variants={rearArmVariants}
          animate={animState}
          className="absolute"
          style={{
            top: 84, left: isLeft ? 26 : undefined, right: isLeft ? undefined : 26,
            width: 22, height: 56,
            background: metalBase,
            borderRadius: '8px 8px 6px 6px',
            transformOrigin: 'top center',
            boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.3), 0 4px 6px rgba(0,0,0,0.4)',
            opacity: 0.85,
          }}
        >
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-full"
            style={{
              top: 26, width: 8, height: 8,
              background: accentColor,
              boxShadow: `0 0 4px ${accentColor}66`,
              opacity: 0.7,
            }}
          />
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: 38, width: 16, height: 24,
              background: metalDark,
              borderRadius: '4px 4px 8px 8px',
              opacity: 0.85,
            }}
          />
        </motion.div>

        {/* === FRONT LEG === */}
        <motion.div
          variants={frontLegVariants}
          animate={animState}
          className="absolute"
          style={{
            top: 158, left: isLeft ? 86 : 52, width: 22, height: 52,
            background: metalBase,
            borderRadius: '6px 6px 4px 4px',
            transformOrigin: 'top center',
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.2), 0 4px 6px rgba(0,0,0,0.4)',
          }}
        >
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-full"
            style={{ top: 24, width: 8, height: 8, background: accentColor, opacity: 0.6 }}
          />
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: 36, width: 20, height: 28,
              background: metalDark,
              borderRadius: '4px 4px 6px 6px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
            }}
          />
          <div
            className="absolute"
            style={{
              top: 62, left: -2, width: 26, height: 10,
              background: metalDark,
              borderRadius: '2px 2px 6px 6px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}
          />
        </motion.div>

        {/* === BACK LEG === */}
        <motion.div
          variants={backLegVariants}
          animate={animState}
          className="absolute"
          style={{
            top: 158, left: isLeft ? 52 : 86, width: 22, height: 52,
            background: metalBase,
            borderRadius: '6px 6px 4px 4px',
            transformOrigin: 'top center',
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.2), 0 4px 6px rgba(0,0,0,0.4)',
            opacity: 0.85,
          }}
        >
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-full"
            style={{ top: 24, width: 8, height: 8, background: accentColor, opacity: 0.5 }}
          />
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: 36, width: 20, height: 28,
              background: metalDark,
              borderRadius: '4px 4px 6px 6px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
            }}
          />
          <div
            className="absolute"
            style={{
              top: 62, left: -2, width: 26, height: 10,
              background: metalDark,
              borderRadius: '2px 2px 6px 6px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}
          />
        </motion.div>

        {/* === GROUND SHADOW === */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{
            bottom: -8, width: 100, height: 14,
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)',
          }}
          animate={
            state === 'defeated'
              ? { opacity: 0.2, scaleX: 1.3 }
              : state === 'attacking'
                ? { opacity: [0.5, 0.3], scaleX: [1, 0.7], x: [0, 30] }
                : { opacity: [0.5, 0.3, 0.5], scaleX: [1, 0.95, 1] }
          }
          transition={
            state === 'defeated'
              ? { duration: 1 }
              : state === 'attacking'
                ? { duration: 0.35 }
                : { duration: 2.5, repeat: Infinity }
          }
        />

        {/* === WINNER AURA === */}
        {state === 'winner' && (
          <>
            <motion.div
              className="absolute -inset-8 rounded-full pointer-events-none z-0"
              style={{
                background: `radial-gradient(circle, ${accentColor}33 0%, transparent 60%)`,
              }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.25, 0.6], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            {/* Orbiting energy particles */}
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full pointer-events-none z-10"
                style={{
                  top: 110, left: 70,
                  width: 6, height: 6,
                  background: accentColor,
                  boxShadow: `0 0 10px ${accentColor}`,
                }}
                animate={{
                  x: [0, 50, 0, -50, 0],
                  y: [-60, 0, 60, 0, -60],
                  opacity: [0.8, 0.4, 0.8, 0.4, 0.8],
                  scale: [1, 0.6, 1, 0.6, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: i * 0.5,
                }}
              />
            ))}
          </>
        )}
      </motion.div>

      <h3 className="text-white font-bold text-sm md:text-lg mt-3 text-center">{name}</h3>
    </div>
  );
}

export default RobotFighter;
