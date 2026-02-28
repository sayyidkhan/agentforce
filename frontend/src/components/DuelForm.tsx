import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import duelApi from '../api/duel';
import type { DuelResponse } from '../types';
import { DotaLoadingScreen } from './DotaLoadingScreen';
import { soundFX } from '../utils/SoundFX';

function SparkParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 5,
      duration: 2.5 + Math.random() * 4,
      delay: Math.random() * 8,
      color: ['#8B5CF6', '#EC4899', '#F59E0B', '#3B82F6', '#FFD700', '#FF6B35', '#FF4500'][Math.floor(Math.random() * 7)],
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

function FireEmbers() {
  const embers = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 3 + Math.random() * 6,
      duration: 4 + Math.random() * 6,
      delay: Math.random() * 10,
      color: ['#FF4500', '#FF6B35', '#FF8C00', '#FFD700', '#EF4444', '#F97316'][Math.floor(Math.random() * 6)],
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
            boxShadow: `0 0 ${e.size * 2}px ${e.color}, 0 0 ${e.size * 4}px ${e.color}, 0 0 ${e.size * 8}px rgba(255, 69, 0, 0.3)`,
            animationDuration: `${e.duration}s`,
            animationDelay: `${e.delay}s`,
          }}
        />
      ))}
    </>
  );
}

function LightningBolts() {
  const bolts = useMemo(() => [
    { top: '5%', left: '8%', rotate: 15, delay: 0, scale: 0.8 },
    { top: '15%', right: '10%', rotate: -20, delay: 1.2, scale: 0.6 },
    { top: '60%', left: '3%', rotate: 10, delay: 2.5, scale: 0.7 },
    { top: '50%', right: '5%', rotate: -10, delay: 0.8, scale: 0.9 },
    { top: '80%', left: '15%', rotate: 25, delay: 3.2, scale: 0.5 },
    { top: '75%', right: '12%', rotate: -15, delay: 1.8, scale: 0.65 },
    { top: '30%', left: '20%', rotate: -5, delay: 4.0, scale: 0.55 },
    { top: '40%', right: '18%', rotate: 12, delay: 2.0, scale: 0.75 },
    { top: '10%', left: '45%', rotate: -8, delay: 5.5, scale: 0.4 },
    { top: '70%', right: '35%', rotate: 18, delay: 3.8, scale: 0.5 },
  ], []);

  return (
    <>
      {bolts.map((b, i) => (
        <svg
          key={i}
          className="lightning-bolt"
          style={{
            top: b.top,
            left: (b as any).left,
            right: (b as any).right,
            transform: `rotate(${b.rotate}deg) scale(${b.scale})`,
            animationName: 'bolt-flash',
            animationDuration: `${2.5 + i * 0.5}s`,
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
            fill={`url(#bolt-grad-${i})`}
          />
          <defs>
            <linearGradient id={`bolt-grad-${i}`} x1="20" y1="0" x2="20" y2="90" gradientUnits="userSpaceOnUse">
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

function MegaLightning() {
  return (
    <>
      {/* Large dramatic bolt - left side */}
      <svg
        className="mega-lightning"
        style={{ top: '0', left: '12%', animationName: 'mega-bolt', animationDuration: '8s', animationIterationCount: 'infinite', animationTimingFunction: 'linear' }}
        width="60" height="300" viewBox="0 0 60 300" fill="none"
      >
        <path d="M35 0L15 110h18L0 300l55-160H30L60 0H35z" fill="url(#mega-grad-1)" />
        <defs>
          <linearGradient id="mega-grad-1" x1="30" y1="0" x2="30" y2="300" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.2" stopColor="#C7D2FE" />
            <stop offset="0.5" stopColor="#818CF8" />
            <stop offset="1" stopColor="#4F46E5" stopOpacity="0.5" />
          </linearGradient>
        </defs>
      </svg>
      {/* Large dramatic bolt - right side */}
      <svg
        className="mega-lightning"
        style={{ top: '5%', right: '15%', transform: 'scaleX(-1)', animationName: 'mega-bolt', animationDuration: '11s', animationDelay: '4s', animationIterationCount: 'infinite', animationTimingFunction: 'linear' }}
        width="50" height="250" viewBox="0 0 60 300" fill="none"
      >
        <path d="M35 0L15 110h18L0 300l55-160H30L60 0H35z" fill="url(#mega-grad-2)" />
        <defs>
          <linearGradient id="mega-grad-2" x1="30" y1="0" x2="30" y2="300" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.2" stopColor="#FBCFE8" />
            <stop offset="0.5" stopColor="#EC4899" />
            <stop offset="1" stopColor="#9333EA" stopOpacity="0.5" />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
}

function HorizontalArcs() {
  return (
    <>
      {/* Crackling arc - top area */}
      <svg className="h-electric-arc" style={{ top: '18%', left: '5%', width: '90%', animationName: 'h-arc', animationDuration: '4s', animationIterationCount: 'infinite' }} viewBox="0 0 800 30" fill="none" preserveAspectRatio="none">
        <path d="M0,15 L80,12 L120,5 L160,18 L200,8 L280,22 L340,10 L400,15 L460,5 L520,20 L580,8 L640,18 L700,12 L800,15" stroke="url(#arc1)" strokeWidth="2" fill="none" />
        <defs><linearGradient id="arc1" x1="0" y1="0" x2="800" y2="0"><stop stopColor="transparent"/><stop offset="0.3" stopColor="#93C5FD"/><stop offset="0.5" stopColor="#FFFFFF"/><stop offset="0.7" stopColor="#93C5FD"/><stop offset="1" stopColor="transparent"/></linearGradient></defs>
      </svg>
      {/* Crackling arc - bottom area */}
      <svg className="h-electric-arc" style={{ bottom: '15%', left: '5%', width: '90%', animationName: 'h-arc', animationDuration: '5s', animationDelay: '2s', animationIterationCount: 'infinite' }} viewBox="0 0 800 30" fill="none" preserveAspectRatio="none">
        <path d="M0,15 L100,20 L150,3 L220,18 L300,8 L380,25 L440,5 L500,15 L560,22 L620,8 L700,20 L800,15" stroke="url(#arc2)" strokeWidth="1.5" fill="none" />
        <defs><linearGradient id="arc2" x1="0" y1="0" x2="800" y2="0"><stop stopColor="transparent"/><stop offset="0.2" stopColor="#C084FC"/><stop offset="0.5" stopColor="#E0E7FF"/><stop offset="0.8" stopColor="#C084FC"/><stop offset="1" stopColor="transparent"/></linearGradient></defs>
      </svg>
    </>
  );
}

function VSEffects() {
  return (
    <div className="relative flex items-center justify-center">
      <div className="energy-burst" />
      <div className="shockwave-ring" style={{ borderColor: '#F59E0B', animationDelay: '0s' }} />
      <div className="shockwave-ring" style={{ borderColor: '#EC4899', animationDelay: '0.7s' }} />
      <div className="shockwave-ring" style={{ borderColor: '#8B5CF6', animationDelay: '1.4s' }} />
      <span className="relative z-10 text-4xl font-black vs-text vs-energy-text">VS</span>
    </div>
  );
}

interface DuelFormProps {
  onDuelComplete: (duel: DuelResponse) => void;
}

interface ProgressEvent {
  stage: string;
  message: string;
  progress: number;
  timestamp: string;
  data?: any;
}

const SUGGESTED_PROFILES = [
  { name: 'Sayyid Khan',    url: 'https://www.linkedin.com/in/sayyidkhan92/',                platform: 'linkedin' as const },
  { name: 'Hisyam J',       url: 'https://www.linkedin.com/in/hisyamj/',                     platform: 'linkedin' as const },
  { name: 'Shashiguru K',   url: 'https://www.linkedin.com/in/shashiguru-keluth-765129154/', platform: 'linkedin' as const },
  { name: 'Devon Sun',      url: 'https://www.linkedin.com/in/devonsun/',                    platform: 'linkedin' as const },
  { name: 'Ketan Parikh',   url: 'https://www.linkedin.com/in/ketan-parikh-2173b4117/',      platform: 'linkedin' as const },
  { name: 'Nilesh Kanawade',url: 'https://www.linkedin.com/in/nilesh-kanawade/',             platform: 'linkedin' as const },
  { name: 'Ankaili',        url: 'https://www.linkedin.com/in/ankaili/',                     platform: 'linkedin' as const },
  { name: 'Tanveer Riaz',   url: 'https://www.linkedin.com/in/tanveerriaz/',                 platform: 'linkedin' as const },
  { name: 'Khali Saiman',   url: 'https://www.linkedin.com/in/khalisaiman/',                 platform: 'linkedin' as const },
  { name: 'Khai Ee Tan',    url: 'https://www.linkedin.com/in/khai-ee-tan-4348a8314/',       platform: 'linkedin' as const },
  { name: 'HisyamJ',        url: 'https://github.com/hisyamj',                               platform: 'github' as const },
  { name: 'Sayyid Khan',    url: 'https://github.com/sayyidkhan',                            platform: 'github' as const },
  { name: 'Linus Torvalds', url: 'https://github.com/torvalds',                              platform: 'github' as const },
  { name: 'Elon Musk',      url: 'https://en.wikipedia.org/wiki/Elon_Musk',                  platform: 'wikipedia' as const },
  { name: 'Ada Lovelace',   url: 'https://en.wikipedia.org/wiki/Ada_Lovelace',               platform: 'wikipedia' as const },
  { name: 'Alan Turing',    url: 'https://en.wikipedia.org/wiki/Alan_Turing',                platform: 'wikipedia' as const },
  { name: 'Mark Zuckerberg',url: 'https://en.wikipedia.org/wiki/Mark_Zuckerberg',            platform: 'wikipedia' as const },
  { name: 'Dario Amodei',   url: 'https://en.wikipedia.org/wiki/Dario_Amodei',               platform: 'wikipedia' as const },
  { name: 'Sundar Pichai',  url: 'https://en.wikipedia.org/wiki/Sundar_Pichai',              platform: 'wikipedia' as const },
  { name: 'Satya Nadella',  url: 'https://en.wikipedia.org/wiki/Satya_Nadella',              platform: 'wikipedia' as const },
  { name: 'Bill Gates',     url: 'https://en.wikipedia.org/wiki/Bill_Gates',                 platform: 'wikipedia' as const },
  { name: 'Sam Altman',     url: 'https://en.wikipedia.org/wiki/Sam_Altman',                 platform: 'wikipedia' as const },
];

const LinkedInIcon = () => (
  <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const WikipediaIcon = () => (
  <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.09 13.119c-.936 1.932-2.217 4.548-2.853 5.728-.616 1.074-1.127.931-1.532.029-1.406-3.321-4.293-9.144-5.651-12.409-.251-.601-.441-.987-.619-1.139-.181-.15-.554-.24-1.122-.271C.103 5.033 0 4.982 0 4.898v-.455l.052-.045c.924-.005 5.401 0 5.401 0l.051.045v.434c0 .119-.075.176-.225.176l-.564.031c-.485.029-.727.164-.727.407 0 .2.11.559.329 1.075L7.1 13.011l1.752-3.537-1.46-3.075c-.395-.867-.629-1.347-.702-1.438-.149-.182-.467-.278-.954-.287l-.468-.01c-.15 0-.225-.067-.225-.201v-.434l.052-.045h4.839l.051.045v.434c0 .134-.075.201-.225.201l-.189.01c-.514.025-.706.181-.575.466l1.663 3.43 1.747-3.35c.235-.46.353-.791.353-.994 0-.38-.22-.583-.66-.611l-.377-.02c-.15 0-.224-.067-.224-.201v-.434l.051-.045s3.025-.005 3.95 0l.05.045v.434c0 .119-.074.176-.224.176l-.247.015c-.57.036-.921.263-1.052.681l-2.218 4.39 1.882 3.856 2.697-5.555c.262-.543.392-.928.392-1.156 0-.393-.216-.603-.648-.628l-.457-.02c-.15 0-.225-.067-.225-.201v-.434l.052-.045h3.455l.051.045v.434c0 .134-.075.201-.225.201h-.189c-.539.025-.934.345-1.186.96l-3.92 8.108c-.581 1.207-1.073 2.392-1.478 3.557-.286.726-.74.665-1.073-.022L12.09 13.12z"/>
  </svg>
);

const WS_URL = (import.meta.env.VITE_WS_URL || 'ws://localhost:3001');

export function DuelForm({ onDuelComplete }: DuelFormProps) {
  const [url1, setUrl1] = useState('');
  const [url2, setUrl2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<ProgressEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter1, setFilter1] = useState<'linkedin' | 'github' | 'wikipedia'>('linkedin');
  const [filter2, setFilter2] = useState<'linkedin' | 'github' | 'wikipedia'>('linkedin');
  const [customProfiles, setCustomProfiles] = useState<typeof SUGGESTED_PROFILES>([]);
  const [showAddModal1, setShowAddModal1] = useState(false);
  const [showAddModal2, setShowAddModal2] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newPlatform, setNewPlatform] = useState<'linkedin' | 'github' | 'wikipedia'>('linkedin');
  const wsRef = useRef<WebSocket | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const allProfiles = [...SUGGESTED_PROFILES, ...customProfiles];

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const cleanup = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.play('bloop');
    if (!url1 || !url2 || isLoading) return;

    setIsLoading(true);
    setProgress(0);
    setLogs([]);
    setError(null);

    try {
      const { id: sessionId } = await duelApi.startDuel({ url1, url2 });

      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: 'subscribe', sessionId }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'progress') {
            setProgress(data.progress);
            setLogs((prev) => [...prev, {
              stage: data.stage,
              message: data.message,
              progress: data.progress,
              timestamp: data.timestamp,
              data: data.data
            }]);

            if (data.stage === 'complete') {
              duelApi.getDuel(sessionId).then((result) => {
                cleanup();
                onDuelComplete(result);
              });
            }

            if (data.stage === 'error') {
              setError(data.message);
              setIsLoading(false);
              cleanup();
            }
          }
        } catch { /* ignore parse errors */ }
      };

      ws.onerror = () => {
        console.warn('[WS] Connection error, falling back to polling');
        pollForResult(sessionId);
      };

      ws.onclose = () => {
        wsRef.current = null;
      };

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start battle');
      setIsLoading(false);
      cleanup();
    }
  };

  const pollForResult = async (sessionId: string) => {
    const poll = async () => {
      try {
        const result = await duelApi.getDuel(sessionId);
        if (result.status === 'complete') {
          onDuelComplete(result);
          return;
        }
        if (result.status === 'error') {
          setError('Battle failed');
          setIsLoading(false);
          return;
        }
        setTimeout(poll, 2000);
      } catch {
        setTimeout(poll, 3000);
      }
    };
    poll();
  };

  const detectPlatform = (url: string): 'linkedin' | 'github' | 'wikipedia' | 'other' | null => {
    if (!url) return null;
    if (url.includes('linkedin.com')) return 'linkedin';
    if (url.includes('github.com')) return 'github';
    if (url.includes('wikipedia.org')) return 'wikipedia';
    return 'other';
  };

  const getPlatformIcon = (platform: 'linkedin' | 'github' | 'wikipedia' | 'other' | null) => {
    switch (platform) {
      case 'linkedin':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        );
      case 'github':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        );
      case 'wikipedia':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.09 13.119c-.936 1.932-2.217 4.548-2.853 5.728-.616 1.074-1.127.931-1.532.029-1.406-3.321-4.293-9.144-5.651-12.409-.251-.601-.441-.987-.619-1.139-.181-.15-.554-.24-1.122-.271C.103 5.033 0 4.982 0 4.898v-.455l.052-.045c.924-.005 5.401 0 5.401 0l.051.045v.434c0 .119-.075.176-.225.176l-.564.031c-.485.029-.727.164-.727.407 0 .2.11.559.329 1.075L7.1 13.011l1.752-3.537-1.46-3.075c-.395-.867-.629-1.347-.702-1.438-.149-.182-.467-.278-.954-.287l-.468-.01c-.15 0-.225-.067-.225-.201v-.434l.052-.045h4.839l.051.045v.434c0 .134-.075.201-.225.201l-.189.01c-.514.025-.706.181-.575.466l1.663 3.43 1.747-3.35c.235-.46.353-.791.353-.994 0-.38-.22-.583-.66-.611l-.377-.02c-.15 0-.224-.067-.224-.201v-.434l.051-.045s3.025-.005 3.95 0l.05.045v.434c0 .119-.074.176-.224.176l-.247.015c-.57.036-.921.263-1.052.681l-2.218 4.39 1.882 3.856 2.697-5.555c.262-.543.392-.928.392-1.156 0-.393-.216-.603-.648-.628l-.457-.02c-.15 0-.225-.067-.225-.201v-.434l.052-.045h3.455l.051.045v.434c0 .134-.075.201-.225.201h-.189c-.539.025-.934.345-1.186.96l-3.92 8.108c-.581 1.207-1.073 2.392-1.478 3.557-.286.726-.74.665-1.073-.022L12.09 13.12z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        );
    }
  };

  const platform1 = detectPlatform(url1);
  const platform2 = detectPlatform(url2);

  const getFilteredProfiles = (filter: 'linkedin' | 'github' | 'wikipedia') =>
    allProfiles.filter(p => p.platform === filter);

  const handleAddProfile = (side: 1 | 2) => {
    if (!newName.trim() || !newUrl.trim()) return;
    const newProfile = { name: newName, url: newUrl, platform: newPlatform };
    setCustomProfiles([...customProfiles, newProfile]);
    setNewName('');
    setNewUrl('');
    if (side === 1) setShowAddModal1(false);
    else setShowAddModal2(false);
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: 'url(/devs-battle.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]" />

      {/* Edge fire glow */}
      <div className="edge-fire-left z-[1]" />
      <div className="edge-fire-right z-[1]" />

      {/* Fire embers layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
        <FireEmbers />
      </div>

      {/* Spark particles layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[3]">
        <SparkParticles />
      </div>

      {/* Lightning bolts layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[4]">
        <LightningBolts />
      </div>

      {/* Mega lightning bolts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
        <MegaLightning />
      </div>

      {/* Horizontal electric arcs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[6]">
        <HorizontalArcs />
      </div>
      <div className="relative z-10 w-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
          >
            <DotaLoadingScreen progress={progress} logs={logs} />
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-5xl"
          >
            {/* Header */}
            <div className="text-center mb-24 mt-16">
              <motion.h1
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="text-5xl md:text-6xl font-black mb-4"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-anime-purple via-anime-pink to-anime-gold">
                  DevDuel
                </span>
              </motion.h1>
              <p className="text-gray-400 text-lg">
                Anime-Style Professional Profile Battle
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Enter two profile URLs to start an epic showdown!
              </p>
            </div>

            {/* Form card with animated border */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Fighters side by side */}
              <div className="flex items-start gap-4">
                {/* Fighter 1 */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative flex-1"
                >
                  <label className="block text-anime-purple font-semibold mb-2">
                    Fighter 1
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={url1}
                      onChange={(e) => setUrl1(e.target.value)}
                      placeholder="LinkedIn, GitHub, or Wikipedia URL..."
                      className="w-full px-4 py-4 pl-12 bg-battle-card border border-anime-purple border-opacity-30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-anime-purple focus:ring-2 focus:ring-anime-purple focus:ring-opacity-30 transition-all"
                      disabled={isLoading}
                    />
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${platform1 === 'linkedin' ? 'text-blue-500' : platform1 === 'github' ? 'text-white' : platform1 === 'wikipedia' ? 'text-gray-300' : 'text-gray-500'}`}>
                      {getPlatformIcon(platform1)}
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex gap-1 items-center">
                      {(['linkedin', 'github', 'wikipedia'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setFilter1(tab)}
                          className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                            filter1 === tab
                              ? 'bg-anime-purple text-white border border-anime-purple'
                              : 'bg-transparent text-gray-400 border border-gray-600 hover:border-anime-purple hover:text-anime-purple'
                          }`}
                        >
                          {tab === 'linkedin' && 'LinkedIn'}
                          {tab === 'github' && 'GitHub'}
                          {tab === 'wikipedia' && 'Wiki'}
                        </button>
                      ))}
                      <button
                        onClick={() => setShowAddModal1(true)}
                        className="ml-auto px-3 py-1 text-xs font-medium rounded-full bg-anime-purple/20 text-anime-purple border border-anime-purple hover:bg-anime-purple/40 transition-all"
                      >
                        + Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {getFilteredProfiles(filter1).filter(p => p.url !== url2).map((profile) => (
                        <button
                          key={profile.url}
                          type="button"
                          onClick={() => setUrl1(profile.url)}
                          disabled={isLoading}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-all backdrop-blur-sm ${
                            url1 === profile.url
                              ? 'bg-anime-purple/80 text-white border-anime-purple shadow-[0_0_10px_rgba(139,92,246,0.6)]'
                              : 'bg-black/50 text-white border-white/30 hover:border-anime-purple hover:bg-anime-purple/20 hover:shadow-[0_0_8px_rgba(139,92,246,0.4)]'
                          }`}
                        >
                          {profile.platform === 'linkedin' && <LinkedInIcon />}
                          {profile.platform === 'github' && <GitHubIcon />}
                          {profile.platform === 'wikipedia' && <WikipediaIcon />}
                          {profile.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* VS Divider with energy effects */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                  className="flex flex-col items-center justify-start pt-4 gap-0 shrink-0"
                >
                  <div className="w-px h-6 bg-gradient-to-b from-transparent via-anime-purple to-transparent" />
                  <VSEffects />
                  <div className="w-px h-6 bg-gradient-to-b from-transparent via-anime-pink to-transparent" />
                </motion.div>

                {/* Fighter 2 */}
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="relative flex-1"
                >
                  <label className="block text-anime-pink font-semibold mb-2">
                    Fighter 2
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={url2}
                      onChange={(e) => setUrl2(e.target.value)}
                      placeholder="LinkedIn, GitHub, or Wikipedia URL..."
                      className="w-full px-4 py-4 pl-12 bg-battle-card border border-anime-pink border-opacity-30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-anime-pink focus:ring-2 focus:ring-anime-pink focus:ring-opacity-30 transition-all"
                      disabled={isLoading}
                    />
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${platform2 === 'linkedin' ? 'text-blue-500' : platform2 === 'github' ? 'text-white' : platform2 === 'wikipedia' ? 'text-gray-300' : 'text-gray-500'}`}>
                      {getPlatformIcon(platform2)}
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex gap-1 items-center">
                      {(['linkedin', 'github', 'wikipedia'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setFilter2(tab)}
                          className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                            filter2 === tab
                              ? 'bg-anime-pink text-white border border-anime-pink'
                              : 'bg-transparent text-gray-400 border border-gray-600 hover:border-anime-pink hover:text-anime-pink'
                          }`}
                        >
                          {tab === 'linkedin' && 'LinkedIn'}
                          {tab === 'github' && 'GitHub'}
                          {tab === 'wikipedia' && 'Wiki'}
                        </button>
                      ))}
                      <button
                        onClick={() => setShowAddModal2(true)}
                        className="ml-auto px-3 py-1 text-xs font-medium rounded-full bg-anime-pink/20 text-anime-pink border border-anime-pink hover:bg-anime-pink/40 transition-all"
                      >
                        + Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {getFilteredProfiles(filter2).filter(p => p.url !== url1).map((profile) => (
                        <button
                          key={profile.url}
                          type="button"
                          onClick={() => setUrl2(profile.url)}
                          disabled={isLoading}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-all backdrop-blur-sm ${
                            url2 === profile.url
                              ? 'bg-anime-pink/80 text-white border-anime-pink shadow-[0_0_10px_rgba(236,72,153,0.6)]'
                              : 'bg-black/50 text-white border-white/30 hover:border-anime-pink hover:bg-anime-pink/20 hover:shadow-[0_0_8px_rgba(236,72,153,0.4)]'
                          }`}
                        >
                          {profile.platform === 'linkedin' && <LinkedInIcon />}
                          {profile.platform === 'github' && <GitHubIcon />}
                          {profile.platform === 'wikipedia' && <WikipediaIcon />}
                          {profile.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading || !url1 || !url2}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                  isLoading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-anime-purple to-anime-pink hover:from-purple-600 hover:to-pink-600 glow-purple btn-energy'
                } text-white`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Battle in Progress...
                  </span>
                ) : (
                  'Start Battle!'
                )}
              </motion.button>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-300 text-center"
                >
                  Battle failed: {error}
                </motion.div>
              )}

              {/* Add Profile Modal - Fighter 1 */}
              {showAddModal1 && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="bg-gray-900 border border-anime-purple/50 rounded-2xl p-6 w-96 space-y-4">
                    <h3 className="text-lg font-bold text-anime-purple">Add Profile</h3>
                    <input
                      type="text"
                      placeholder="Name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-anime-purple"
                    />
                    <input
                      type="url"
                      placeholder="URL"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-anime-purple"
                    />
                    <select
                      value={newPlatform}
                      onChange={(e) => setNewPlatform(e.target.value as 'linkedin' | 'github' | 'wikipedia')}
                      className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-anime-purple"
                    >
                      <option value="linkedin">LinkedIn</option>
                      <option value="github">GitHub</option>
                      <option value="wikipedia">Wikipedia</option>
                    </select>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setShowAddModal1(false)}
                        className="px-4 py-2 rounded-lg border border-gray-600 text-gray-400 hover:border-gray-500 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleAddProfile(1)}
                        className="px-4 py-2 rounded-lg bg-anime-purple hover:bg-anime-purple/80 text-white font-medium transition-all"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Add Profile Modal - Fighter 2 */}
              {showAddModal2 && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="bg-gray-900 border border-anime-pink/50 rounded-2xl p-6 w-96 space-y-4">
                    <h3 className="text-lg font-bold text-anime-pink">Add Profile</h3>
                    <input
                      type="text"
                      placeholder="Name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-anime-pink"
                    />
                    <input
                      type="url"
                      placeholder="URL"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-anime-pink"
                    />
                    <select
                      value={newPlatform}
                      onChange={(e) => setNewPlatform(e.target.value as 'linkedin' | 'github' | 'wikipedia')}
                      className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-anime-pink"
                    >
                      <option value="linkedin">LinkedIn</option>
                      <option value="github">GitHub</option>
                      <option value="wikipedia">Wikipedia</option>
                    </select>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setShowAddModal2(false)}
                        className="px-4 py-2 rounded-lg border border-gray-600 text-gray-400 hover:border-gray-500 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleAddProfile(2)}
                        className="px-4 py-2 rounded-lg bg-anime-pink hover:bg-anime-pink/80 text-white font-medium transition-all"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>

            {/* Supported Platforms */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8 text-center"
            >
              <p className="text-gray-500 text-sm mb-2">Supported Platforms</p>
              <div className="flex justify-center gap-4">
                <span className="flex items-center gap-2 text-gray-400">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </span>
                <span className="flex items-center gap-2 text-gray-400">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </span>
                <span className="flex items-center gap-2 text-gray-400">
                  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.09 13.119c-.936 1.932-2.217 4.548-2.853 5.728-.616 1.074-1.127.931-1.532.029-1.406-3.321-4.293-9.144-5.651-12.409-.251-.601-.441-.987-.619-1.139-.181-.15-.554-.24-1.122-.271C.103 5.033 0 4.982 0 4.898v-.455l.052-.045c.924-.005 5.401 0 5.401 0l.051.045v.434c0 .119-.075.176-.225.176l-.564.031c-.485.029-.727.164-.727.407 0 .2.11.559.329 1.075L7.1 13.011l1.752-3.537-1.46-3.075c-.395-.867-.629-1.347-.702-1.438-.149-.182-.467-.278-.954-.287l-.468-.01c-.15 0-.225-.067-.225-.201v-.434l.052-.045h4.839l.051.045v.434c0 .134-.075.201-.225.201l-.189.01c-.514.025-.706.181-.575.466l1.663 3.43 1.747-3.35c.235-.46.353-.791.353-.994 0-.38-.22-.583-.66-.611l-.377-.02c-.15 0-.224-.067-.224-.201v-.434l.051-.045s3.025-.005 3.95 0l.05.045v.434c0 .119-.074.176-.224.176l-.247.015c-.57.036-.921.263-1.052.681l-2.218 4.39 1.882 3.856 2.697-5.555c.262-.543.392-.928.392-1.156 0-.393-.216-.603-.648-.628l-.457-.02c-.15 0-.225-.067-.225-.201v-.434l.052-.045h3.455l.051.045v.434c0 .134-.075.201-.225.201h-.189c-.539.025-.934.345-1.186.96l-3.92 8.108c-.581 1.207-1.073 2.392-1.478 3.557-.286.726-.74.665-1.073-.022L12.09 13.12z"/>
                  </svg>
                  Wikipedia
                </span>
                <span className="flex items-center gap-2 text-gray-400">
                  <svg className="w-5 h-5 text-anime-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Portfolio
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}

export default DuelForm;
