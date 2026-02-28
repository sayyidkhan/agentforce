// Profile data extracted from scraping
export interface ProfileData {
  name: string;
  title: string;
  avatar?: string;
  location?: string;
  skills: string[];
  years_experience: number;
  leadership_roles: string[];
  projects: Project[];
  achievements: string[];
  activity_metrics: ActivityMetrics;
  certifications: string[];
  companies: Company[];
  education: Education[];
  summary?: string;
  sourceUrl: string;
  sourceType: 'linkedin' | 'github' | 'wikipedia' | 'portfolio' | 'unknown';
}

export interface Project {
  name: string;
  description: string;
  technologies?: string[];
  url?: string;
  stars?: number;
  forks?: number;
}

export interface ActivityMetrics {
  commits?: number;
  contributions?: number;
  followers?: number;
  following?: number;
  repositories?: number;
  pullRequests?: number;
  issues?: number;
  posts?: number;
  connections?: number;
}

export interface Company {
  name: string;
  role: string;
  duration?: string;
  current: boolean;
}

export interface Education {
  institution: string;
  degree?: string;
  field?: string;
  year?: number;
}

// Battle stats (0-100 scale)
export interface BattleStats {
  technical: number;    // Technical skill depth
  strategy: number;     // Strategic thinking (projects, achievements)
  execution: number;    // Execution speed (activity metrics)
  leadership: number;   // Leadership experience
  impact: number;       // Overall impact
  experience: number;   // Years of experience
}

// Anime-transformed profile
export interface AnimeProfile {
  profile: ProfileData;
  stats: BattleStats;
  totalPower: number;
  archetype: AnimeArchetype;
  techniques: string[];      // Skills as anime abilities
  guild: string;             // Current company as guild
  guildHistory: string[];    // Past companies
  battleExperience: string;  // Experience level description
  legendaryScrolls: string[]; // Certifications
  missions: AnimeMission[];   // Projects as missions
  specialAbility: string;    // Unique trait based on top skill
}

export type AnimeArchetype = 
  | 'The Strategist'     // High strategy + leadership
  | 'The Executor'       // High execution + technical
  | 'The Visionary'      // High impact + strategy
  | 'The Warrior'        // Balanced all stats
  | 'The Prodigy'        // High technical, lower experience
  | 'The Veteran'        // High experience + leadership
  | 'The Shadow'         // High technical, low visibility
  | 'The Commander';     // Highest leadership

export interface AnimeMission {
  name: string;
  rank: 'S' | 'A' | 'B' | 'C' | 'D';
  description: string;
}

// Duel session
export interface DuelSession {
  id: string;
  createdAt: Date;
  status: DuelStatus;
  url1: string;
  url2: string;
  profile1?: AnimeProfile;
  profile2?: AnimeProfile;
  commentary?: BattleCommentary;
  winner?: 'profile1' | 'profile2' | 'draw';
  winnerName?: string;
  processingLogs: ProcessingLog[];
}

export type DuelStatus = 
  | 'pending'
  | 'scraping'
  | 'normalizing'
  | 'scoring'
  | 'transforming'
  | 'generating_commentary'
  | 'complete'
  | 'error';

export interface ProcessingLog {
  timestamp: Date;
  stage: DuelStatus;
  message: string;
  data?: unknown;
}

// Battle commentary from LLM
export interface BattleCommentary {
  introduction: string;       // Opening narration
  rounds: RoastRound[];       // Turn-based roasts
  verdict: string;            // Winner explanation
  winner: 'profile1' | 'profile2' | 'draw';
}

export interface RoastRound {
  roundNumber: number;
  attacker: 'profile1' | 'profile2';
  roast: string;              // The roast content
  damage: number;             // 0-100 impact score
  reaction: string;           // Opponent's reaction description
}

// API Request/Response types
export interface StartDuelRequest {
  url1: string;
  url2: string;
}

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
  id: string;
  status: DuelStatus;
  logs: ProcessingLog[];
  progress: number; // 0-100
}

// Service interfaces
export interface ScrapedData {
  html?: string;
  json?: Record<string, unknown>;
  screenshot?: string;
  url: string;
  scrapedAt: Date;
}

export interface ScoringWeights {
  skillsDepth: number;    // 0.30
  experience: number;     // 0.20
  impact: number;         // 0.25
  leadership: number;     // 0.15
  activity: number;       // 0.10
}

export const DEFAULT_WEIGHTS: ScoringWeights = {
  skillsDepth: 0.30,
  experience: 0.20,
  impact: 0.25,
  leadership: 0.15,
  activity: 0.10,
};
