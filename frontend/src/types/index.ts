// Battle stats (0-100 scale)
export interface BattleStats {
  technical: number;
  strategy: number;
  execution: number;
  leadership: number;
  impact: number;
  experience: number;
}

// Profile data
export interface ProfileData {
  name: string;
  title: string;
  avatar?: string;
  skills: string[];
  years_experience: number;
  sourceUrl: string;
  sourceType: 'linkedin' | 'github' | 'portfolio' | 'unknown';
}

// Mission (project)
export interface AnimeMission {
  name: string;
  rank: 'S' | 'A' | 'B' | 'C' | 'D';
  description: string;
}

// Anime archetype
export type AnimeArchetype = 
  | 'The Strategist'
  | 'The Executor'
  | 'The Visionary'
  | 'The Warrior'
  | 'The Prodigy'
  | 'The Veteran'
  | 'The Shadow'
  | 'The Commander';

// Anime-transformed profile
export interface AnimeProfile {
  profile: ProfileData;
  stats: BattleStats;
  totalPower: number;
  archetype: AnimeArchetype;
  techniques: string[];
  guild: string;
  guildHistory: string[];
  battleExperience: string;
  legendaryScrolls: string[];
  missions: AnimeMission[];
  specialAbility: string;
}

// Battle commentary
export interface BattleCommentary {
  introduction: string;
  rounds: RoastRound[];
  verdict: string;
  winner: 'profile1' | 'profile2' | 'draw';
}

export interface RoastRound {
  roundNumber: number;
  attacker: 'profile1' | 'profile2';
  roast: string;
  damage: number;
  reaction: string;
}

// Duel status
export type DuelStatus = 
  | 'pending'
  | 'scraping'
  | 'normalizing'
  | 'scoring'
  | 'transforming'
  | 'generating_commentary'
  | 'complete'
  | 'error';

// Processing log
export interface ProcessingLog {
  timestamp: string;
  stage: DuelStatus;
  message: string;
}

// API Response types
export interface DuelResponse {
  id: string;
  status: DuelStatus;
  profile1?: AnimeProfile;
  profile2?: AnimeProfile;
  commentary?: BattleCommentary;
  winner?: 'profile1' | 'profile2' | 'draw';
  winnerName?: string;
}

export interface DuelStatusResponse {
  status: DuelStatus;
  progress: number;
  logs: ProcessingLog[];
}

export interface StartDuelRequest {
  url1: string;
  url2: string;
}
