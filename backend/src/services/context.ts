import { AcontextClient } from '@acontext/acontext';
import { 
  DuelSession, 
  ProcessingLog, 
  AnimeProfile, 
  BattleCommentary, 
  DuelStatus,
  ProfileData,
  ScrapedData 
} from '../types';
import { v4 as uuidv4 } from 'uuid';

export class ContextService {
  private client: AcontextClient | null = null;
  private localStore: Map<string, DuelSession> = new Map();

  constructor() {
    const apiKey = process.env.ACONTEXT;
    if (apiKey) {
      this.client = new AcontextClient({ apiKey });
    } else {
      console.warn('[Acontext] API key not set, using local storage fallback');
    }
  }

  /**
   * Initialize context service
   */
  async initialize(): Promise<void> {
    if (!this.client) return;

    try {
      // Verify connection with a ping
      const pong = await this.client.ping();
      console.log('[Acontext] Connected:', pong);
    } catch (error) {
      console.warn('[Acontext] Connection check failed, continuing with local fallback:', (error as Error).message);
      this.client = null;
    }
  }

  /**
   * Create a new duel session
   */
  async createDuelSession(url1: string, url2: string): Promise<DuelSession> {
    const sessionId = uuidv4();

    const session: DuelSession = {
      id: sessionId,
      createdAt: new Date(),
      status: 'pending',
      url1,
      url2,
      processingLogs: [],
    };

    // Store locally
    this.localStore.set(sessionId, session);

    // Try to create in Acontext
    if (this.client) {
      try {
        await this.client.sessions.create({
          useUuid: sessionId,
          configs: { type: 'duel', url1, url2 },
        });
        console.log('[Acontext] Session created:', sessionId);
      } catch (error) {
        console.error('[Acontext] Failed to create session:', (error as Error).message);
      }
    }

    return session;
  }

  /**
   * Update duel session status
   */
  async updateSessionStatus(
    sessionId: string,
    status: DuelStatus,
    message: string
  ): Promise<void> {
    const session = this.localStore.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    session.status = status;
    session.processingLogs.push({
      timestamp: new Date(),
      stage: status,
      message,
    });
    this.localStore.set(sessionId, session);

    if (this.client) {
      try {
        await this.client.sessions.storeMessage(sessionId, {
          role: 'assistant',
          content: `[${status.toUpperCase()}] ${message}`,
        }, { format: 'openai' });
      } catch (error) {
        // Silent fail - local store is source of truth
      }
    }
  }

  /**
   * Store scraped profile data as artifact
   */
  async storeProfileData(
    sessionId: string,
    profileNum: 1 | 2,
    data: ScrapedData
  ): Promise<void> {
    if (this.client) {
      try {
        await this.client.sessions.storeMessage(sessionId, {
          role: 'tool',
          content: JSON.stringify({
            type: 'scraped_data',
            profileNum,
            url: data.url,
            scrapedAt: data.scrapedAt.toISOString(),
          }),
        }, { format: 'openai' });
      } catch (error) {
        // Silent fail
      }
    }
  }

  /**
   * Store normalized profile
   */
  async storeNormalizedProfile(
    sessionId: string,
    profileNum: 1 | 2,
    profile: ProfileData
  ): Promise<void> {
    if (this.client) {
      try {
        await this.client.sessions.storeMessage(sessionId, {
          role: 'tool',
          content: `Normalized profile ${profileNum}: ${profile.name} (${profile.title})`,
        }, { format: 'openai' });
      } catch (error) {
        // Silent fail
      }
    }
  }

  /**
   * Store anime-transformed profile
   */
  async storeAnimeProfile(
    sessionId: string,
    profileNum: 1 | 2,
    animeProfile: AnimeProfile
  ): Promise<void> {
    const session = this.localStore.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    if (profileNum === 1) session.profile1 = animeProfile;
    else session.profile2 = animeProfile;
    this.localStore.set(sessionId, session);

    if (this.client) {
      try {
        await this.client.sessions.storeMessage(sessionId, {
          role: 'assistant',
          content: `Anime profile ${profileNum}: ${animeProfile.profile.name} - ${animeProfile.archetype} (Power: ${animeProfile.totalPower})`,
        }, { format: 'openai' });
      } catch (error) {
        // Silent fail
      }
    }
  }

  /**
   * Store battle commentary
   */
  async storeCommentary(
    sessionId: string,
    commentary: BattleCommentary
  ): Promise<void> {
    const session = this.localStore.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    session.commentary = commentary;
    this.localStore.set(sessionId, session);

    if (this.client) {
      try {
        await this.client.sessions.storeMessage(sessionId, {
          role: 'assistant',
          content: `BATTLE COMMENTARY:\n${commentary.introduction}\n\n${commentary.verdict}`,
        }, { format: 'openai' });
      } catch (error) {
        // Silent fail
      }
    }
  }

  /**
   * Store duel result
   */
  async storeDuelResult(
    sessionId: string,
    winner: 'profile1' | 'profile2' | 'draw',
    winnerName: string
  ): Promise<void> {
    const session = this.localStore.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    session.winner = winner;
    session.winnerName = winnerName;
    session.status = 'complete';
    this.localStore.set(sessionId, session);

    if (this.client) {
      try {
        await this.client.sessions.storeMessage(sessionId, {
          role: 'assistant',
          content: `DUEL COMPLETE! Winner: ${winnerName}`,
        }, { format: 'openai' });
      } catch (error) {
        // Silent fail
      }
    }
  }

  /**
   * Get duel session by ID
   */
  async getDuelSession(sessionId: string): Promise<DuelSession | null> {
    return this.localStore.get(sessionId) || null;
  }

  /**
   * Add a processing log entry
   */
  async addLog(
    sessionId: string,
    stage: DuelStatus,
    message: string,
    data?: unknown
  ): Promise<void> {
    const session = this.localStore.get(sessionId);
    if (!session) return;

    session.processingLogs.push({
      timestamp: new Date(),
      stage,
      message,
      data,
    });
    this.localStore.set(sessionId, session);
  }

  /**
   * Get processing logs for a session
   */
  async getLogs(sessionId: string): Promise<ProcessingLog[]> {
    return this.localStore.get(sessionId)?.processingLogs || [];
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    if (!this.client) return false;
    try {
      await this.client.ping();
      return true;
    } catch {
      return false;
    }
  }
}

export const contextService = new ContextService();
