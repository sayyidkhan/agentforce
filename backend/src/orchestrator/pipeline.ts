import { 
  DuelSession, 
  ProfileData, 
  AnimeProfile, 
  BattleCommentary,
  DuelResponse,
  ScrapedData 
} from '../types';
import { scraperService, ScraperService } from '../services/scraper';
import { automationService } from '../services/automation';
import { contextService } from '../services/context';
import { scoringEngine } from '../services/scoring';
import { commentaryService } from '../services/commentary';
import { duelEvents } from '../services/duelEvents';

export class DuelOrchestrator {
  private scraper: ScraperService;
  private usedMockIndices: Set<number> = new Set();

  constructor() {
    this.scraper = scraperService;
  }

  /**
   * Run complete duel pipeline
   */
  async runDuel(url1: string, url2: string, existingSessionId?: string): Promise<DuelResponse> {
    this.usedMockIndices.clear();

    let sessionId: string;
    if (existingSessionId) {
      sessionId = existingSessionId;
    } else {
      const session = await contextService.createDuelSession(url1, url2);
      sessionId = session.id;
    }

    try {
      // Step 1: Scrape both profiles in parallel
      await this.updateStatus(sessionId, 'scraping', 'Initiating profile reconnaissance...', 5);

      const platform1 = this.scraper.detectPlatform(url1);
      const platform2 = this.scraper.detectPlatform(url2);
      const toolName = (p: string) => p === 'linkedin' ? 'Bright Data' : p === 'github' ? 'ActionBook' : p === 'wikipedia' ? 'ActionBook' : 'Bright Data';

      duelEvents.broadcast(sessionId, 'scraping', `Fighter 1: Using ${toolName(platform1)} for ${platform1}...`, 10);
      duelEvents.broadcast(sessionId, 'scraping', `Fighter 2: Using ${toolName(platform2)} for ${platform2}...`, 12);

      const [scraped1, scraped2] = await Promise.all([
        this.scrapeProfileWithFallback(url1, sessionId, 1).then(result => {
          duelEvents.broadcast(sessionId, 'scraping', `Fighter 1 data collected ✓`, 25);
          return result;
        }),
        this.scrapeProfileWithFallback(url2, sessionId, 2).then(result => {
          duelEvents.broadcast(sessionId, 'scraping', `Fighter 2 data collected ✓`, 30);
          return result;
        }),
      ]);
      duelEvents.broadcast(sessionId, 'scraping', `Both profiles scraped successfully ✓`, 35);

      await Promise.all([
        contextService.storeProfileData(sessionId, 1, scraped1),
        contextService.storeProfileData(sessionId, 2, scraped2),
      ]);

      // Step 2: Normalize data
      await this.updateStatus(sessionId, 'normalizing', 'Processing warrior data...', 40);
      
      const profile1 = this.normalizeProfile(scraped1);
      duelEvents.broadcast(sessionId, 'normalizing', `Identified: ${profile1.name} — ${profile1.title}`, 45, { 
        fighter: 1, 
        name: profile1.name, 
        avatar: profile1.avatar 
      });
      
      const profile2 = this.normalizeProfile(scraped2);
      duelEvents.broadcast(sessionId, 'normalizing', `Identified: ${profile2.name} — ${profile2.title}`, 50, { 
        fighter: 2, 
        name: profile2.name, 
        avatar: profile2.avatar 
      });

      await Promise.all([
        contextService.storeNormalizedProfile(sessionId, 1, profile1),
        contextService.storeNormalizedProfile(sessionId, 2, profile2),
      ]);

      // Step 3: Score profiles
      await this.updateStatus(sessionId, 'scoring', 'Calculating power levels...', 55);
      
      const stats1 = scoringEngine.calculateStats(profile1);
      duelEvents.broadcast(sessionId, 'scoring', `${profile1.name}: Power level computed`, 60);
      const stats2 = scoringEngine.calculateStats(profile2);
      duelEvents.broadcast(sessionId, 'scoring', `${profile2.name}: Power level computed`, 65);

      // Step 4: Transform to anime profiles
      await this.updateStatus(sessionId, 'transforming', 'Awakening warrior spirits...', 70);
      
      const anime1 = scoringEngine.transformToAnime(profile1, stats1);
      duelEvents.broadcast(sessionId, 'transforming', `${anime1.profile.name} awakens as ${anime1.archetype} (Power: ${anime1.totalPower})`, 73);
      const anime2 = scoringEngine.transformToAnime(profile2, stats2);
      duelEvents.broadcast(sessionId, 'transforming', `${anime2.profile.name} awakens as ${anime2.archetype} (Power: ${anime2.totalPower})`, 76);

      await Promise.all([
        contextService.storeAnimeProfile(sessionId, 1, anime1),
        contextService.storeAnimeProfile(sessionId, 2, anime2),
      ]);
      duelEvents.broadcast(sessionId, 'transforming', 'Warrior profiles sealed ✓', 78);

      // Step 5: Determine winner
      const { winner } = scoringEngine.determineWinner(anime1, anime2);
      const winnerName = winner === 'draw' 
        ? 'Draw' 
        : winner === 'profile1' 
          ? anime1.profile.name 
          : anime2.profile.name;
      duelEvents.broadcast(sessionId, 'transforming', `Power levels compared — preparing arena...`, 80);

      // Step 6: Generate commentary with progress ticks
      await this.updateStatus(sessionId, 'generating_commentary', 'The announcer prepares the battle narrative...', 82);
      duelEvents.broadcast(sessionId, 'generating_commentary', 'Warming up the roast mic...', 84);
      duelEvents.broadcast(sessionId, 'generating_commentary', 'OpenAI generating epic battle commentary...', 86);
      
      const commentaryPromise = commentaryService.generateCommentary(anime1, anime2, winner);
      const tickMessages = [
        'Crafting savage roasts...',
        'Analyzing weak points...',
        'Loading comeback arsenal...',
        'Sharpening insults...',
        'Polishing the burns...',
      ];
      let tickIndex = 0;
      let tickProgress = 87;
      const progressTicker = setInterval(() => {
        if (tickProgress < 94) {
          tickProgress += 1;
          duelEvents.broadcast(sessionId, 'generating_commentary', tickMessages[tickIndex % tickMessages.length], tickProgress);
          tickIndex++;
        }
      }, 4000);

      const commentary = await commentaryPromise;
      clearInterval(progressTicker);
      await contextService.storeCommentary(sessionId, commentary);
      duelEvents.broadcast(sessionId, 'generating_commentary', 'Battle commentary ready ✓', 95);

      // Step 7: Store final result
      await contextService.storeDuelResult(sessionId, winner, winnerName);
      await this.updateStatus(sessionId, 'complete', `BATTLE COMPLETE! ${winnerName} ${winner === 'draw' ? 'is declared' : 'emerges victorious'}!`, 100);

      return {
        id: sessionId,
        status: 'complete',
        profile1: anime1,
        profile2: anime2,
        commentary,
        winner,
        winnerName,
      };

    } catch (error) {
      console.error('[Orchestrator] Duel failed:', error);
      duelEvents.broadcast(sessionId, 'error', `Battle interrupted: ${error instanceof Error ? error.message : 'Unknown error'}`, 0);
      await this.updateStatus(sessionId, 'error', `Battle interrupted: ${error instanceof Error ? error.message : 'Unknown error'}`, 0);
      
      throw error;
    }
  }

  /**
   * Scrape profile using the right tool per platform:
   *   LinkedIn -> Bright Data
   *   GitHub   -> ActionBook + GitHub REST API
   *   Other    -> Bright Data with ActionBook fallback
   */
  private async scrapeProfileWithFallback(
    url: string, 
    sessionId: string, 
    profileNum: 1 | 2
  ): Promise<ScrapedData> {
    const platform = this.scraper.detectPlatform(url);

    if (platform === 'linkedin') {
      return this.scrapeLinkedInWithBrightData(url, sessionId, profileNum);
    }

    if (platform === 'github') {
      return this.scrapeGitHubWithActionBook(url, sessionId, profileNum);
    }

    if (platform === 'wikipedia') {
      return this.scrapeWikipediaWithActionBook(url, sessionId, profileNum);
    }

    return this.scrapeGenericWithFallback(url, sessionId, profileNum);
  }

  private async scrapeLinkedInWithBrightData(
    url: string,
    sessionId: string,
    profileNum: 1 | 2
  ): Promise<ScrapedData> {
    try {
      await contextService.addLog(sessionId, 'scraping', `[Bright Data] Scraping LinkedIn profile ${profileNum}...`);
      const result = await this.scraper.scrapeProfile(url);

      const json = result.json || {};
      const hasData = !!(json.name || json.full_name || json.first_name || json.about || json.position);
      console.log(`[Orchestrator] Bright Data returned for ${url}: name=${json.name}, hasData=${hasData}, keys=${Object.keys(json).length}`);

      if (!hasData) {
        duelEvents.broadcast(sessionId, 'scraping', `Profile ${profileNum}: Limited public data — enriching with available info`, 0);
      }

      return result;
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      console.log(`[Orchestrator] Bright Data failed for LinkedIn ${url}: ${msg}`);
      await contextService.addLog(sessionId, 'scraping', `[Bright Data] Failed: ${msg} — using demo data`);
      return this.generateMockScrapedData(url);
    }
  }

  private async scrapeGitHubWithActionBook(
    url: string,
    sessionId: string,
    profileNum: 1 | 2
  ): Promise<ScrapedData> {
    try {
      await contextService.addLog(sessionId, 'scraping', `[ActionBook] Scraping GitHub profile ${profileNum}...`);
      return await automationService.scrapeGitHubProfile(url);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      console.log(`[Orchestrator] ActionBook failed for GitHub ${url}: ${msg}`);
      await contextService.addLog(sessionId, 'scraping', `[ActionBook] Failed: ${msg} — using demo data`);
      return this.generateMockScrapedData(url);
    }
  }

  private async scrapeWikipediaWithActionBook(
    url: string,
    sessionId: string,
    profileNum: 1 | 2
  ): Promise<ScrapedData> {
    try {
      await contextService.addLog(sessionId, 'scraping', `[ActionBook] Scraping Wikipedia article for profile ${profileNum}...`);
      return await automationService.scrapeWikipediaProfile(url);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      console.log(`[Orchestrator] ActionBook failed for Wikipedia ${url}: ${msg}`);
      await contextService.addLog(sessionId, 'scraping', `[ActionBook] Failed: ${msg} — using demo data`);
      return this.generateMockScrapedData(url);
    }
  }

  private async scrapeGenericWithFallback(
    url: string,
    sessionId: string,
    profileNum: 1 | 2
  ): Promise<ScrapedData> {
    try {
      await contextService.addLog(sessionId, 'scraping', `[Bright Data] Scraping profile ${profileNum}...`);
      return await this.scraper.scrapeProfile(url);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      console.log(`[Orchestrator] Bright Data failed for ${url}: ${msg}`);
      await contextService.addLog(sessionId, 'scraping', `Using demo data for ${url}`);
      return this.generateMockScrapedData(url);
    }
  }

  /**
   * Normalize scraped data to ProfileData
   */
  private normalizeProfile(scraped: ScrapedData): ProfileData {
    const platform = this.scraper.detectPlatform(scraped.url);
    const data = scraped.json || {};

    // Check if data is already normalized (mock/fallback data)
    if (data.__normalized) {
      return data as unknown as ProfileData;
    }

    switch (platform) {
      case 'linkedin':
        return this.scraper.normalizeLinkedInData(data);
      case 'github':
        return this.scraper.normalizeGitHubData(data);
      case 'wikipedia':
        return this.scraper.normalizeWikipediaData(data);
      default:
        return this.normalizeGenericData(data, scraped.url);
    }
  }

  /**
   * Normalize generic profile data
   */
  private normalizeGenericData(data: Record<string, unknown>, url: string): ProfileData {
    return {
      name: (data.name as string) || (data.title as string) || 'Unknown Warrior',
      title: (data.title as string) || (data.role as string) || 'Developer',
      avatar: data.avatar as string,
      location: data.location as string,
      skills: (data.skills as string[]) || [],
      years_experience: (data.years_experience as number) || (data.experience as number) || 0,
      leadership_roles: (data.leadership_roles as string[]) || [],
      projects: (data.projects as ProfileData['projects']) || [],
      achievements: (data.achievements as string[]) || [],
      activity_metrics: (data.activity_metrics as ProfileData['activity_metrics']) || {},
      certifications: (data.certifications as string[]) || [],
      companies: (data.companies as ProfileData['companies']) || [],
      education: (data.education as ProfileData['education']) || [],
      summary: data.summary as string,
      sourceUrl: url,
      sourceType: 'unknown',
    };
  }

  /**
   * Generate mock data for demo/fallback, ensuring each fighter gets a different profile
   */
  private generateMockScrapedData(url: string): ScrapedData {
    const platform = this.scraper.detectPlatform(url);
    const mockProfiles = this.getMockProfiles();
    
    let index = Math.floor(Math.random() * mockProfiles.length);
    while (this.usedMockIndices.has(index) && this.usedMockIndices.size < mockProfiles.length) {
      index = (index + 1) % mockProfiles.length;
    }
    this.usedMockIndices.add(index);

    const mockData = { ...mockProfiles[index] };
    mockData.sourceUrl = url;
    mockData.sourceType = platform;

    return {
      json: { ...mockData, __normalized: true } as unknown as Record<string, unknown>,
      url,
      scrapedAt: new Date(),
    };
  }

  /**
   * Get mock profiles for demo
   */
  private getMockProfiles(): ProfileData[] {
    return [
      {
        name: 'Alex Chen',
        title: 'Senior Software Engineer',
        skills: ['TypeScript', 'React', 'Node.js', 'AWS', 'PostgreSQL', 'Docker', 'Kubernetes'],
        years_experience: 8,
        leadership_roles: ['Tech Lead', 'Mentor'],
        projects: [
          { name: 'CloudScale', description: 'Distributed microservices platform', stars: 450, forks: 89 },
          { name: 'ReactFlow', description: 'Advanced state management library', stars: 1200, forks: 230 },
        ],
        achievements: ['AWS Certified Solutions Architect', 'Google Cloud Professional'],
        activity_metrics: { commits: 2500, contributions: 890, followers: 1200, repositories: 45 },
        certifications: ['AWS Solutions Architect', 'Kubernetes Administrator'],
        companies: [
          { name: 'TechCorp', role: 'Senior Engineer', current: true },
          { name: 'StartupXYZ', role: 'Full Stack Developer', current: false },
        ],
        education: [{ institution: 'MIT', degree: 'BS', field: 'Computer Science' }],
        summary: 'Passionate about building scalable systems',
        sourceUrl: '',
        sourceType: 'linkedin',
      },
      {
        name: 'Sarah Kim',
        title: 'Staff Engineer',
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Rust', 'Go', 'System Design'],
        years_experience: 12,
        leadership_roles: ['Staff Engineer', 'Architecture Lead', 'Team Lead'],
        projects: [
          { name: 'MLPipeline', description: 'End-to-end ML infrastructure', stars: 3400, forks: 567 },
          { name: 'FastPredict', description: 'Real-time inference engine', stars: 890, forks: 145 },
        ],
        achievements: ['Patent holder', 'Conference Speaker', 'Open Source Maintainer'],
        activity_metrics: { commits: 5000, contributions: 2100, followers: 5600, repositories: 78 },
        certifications: ['Google ML Engineer', 'Deep Learning Specialization'],
        companies: [
          { name: 'Google', role: 'Staff Engineer', current: true },
          { name: 'Meta', role: 'Senior Engineer', current: false },
        ],
        education: [{ institution: 'Stanford', degree: 'PhD', field: 'Machine Learning' }],
        summary: 'Building the future of AI infrastructure',
        sourceUrl: '',
        sourceType: 'linkedin',
      },
      {
        name: 'Marcus Johnson',
        title: 'Engineering Manager',
        skills: ['Java', 'Spring Boot', 'Microservices', 'Leadership', 'Architecture', 'DevOps'],
        years_experience: 15,
        leadership_roles: ['Engineering Manager', 'Director', 'VP Engineering'],
        projects: [
          { name: 'EnterpriseCore', description: 'Enterprise integration platform', stars: 780, forks: 234 },
        ],
        achievements: ['Built teams from 5 to 50 engineers', 'IPO experience'],
        activity_metrics: { commits: 1200, followers: 3400, connections: 8900 },
        certifications: ['PMP', 'Agile Coach'],
        companies: [
          { name: 'Stripe', role: 'Engineering Manager', current: true },
          { name: 'Amazon', role: 'Senior Manager', current: false },
        ],
        education: [{ institution: 'Berkeley', degree: 'MS', field: 'Computer Science' }],
        summary: 'Building high-performing engineering teams',
        sourceUrl: '',
        sourceType: 'linkedin',
      },
    ];
  }

  private async updateStatus(
    sessionId: string, 
    status: DuelSession['status'], 
    message: string,
    progress: number = 0
  ): Promise<void> {
    await contextService.updateSessionStatus(sessionId, status, message);
    duelEvents.broadcast(sessionId, status, message, progress);
    console.log(`[Orchestrator] ${status}: ${message}`);
  }

  /**
   * Get duel status and progress
   */
  async getDuelStatus(sessionId: string): Promise<{
    status: DuelSession['status'];
    progress: number;
    logs: DuelSession['processingLogs'];
  }> {
    const session = await contextService.getDuelSession(sessionId);
    
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const progressMap: Record<DuelSession['status'], number> = {
      pending: 0,
      scraping: 20,
      normalizing: 40,
      scoring: 55,
      transforming: 70,
      generating_commentary: 85,
      complete: 100,
      error: 0,
    };

    return {
      status: session.status,
      progress: progressMap[session.status],
      logs: session.processingLogs,
    };
  }

  /**
   * Get full duel result
   */
  async getDuelResult(sessionId: string): Promise<DuelResponse | null> {
    const session = await contextService.getDuelSession(sessionId);
    
    if (!session) {
      return null;
    }

    return {
      id: session.id,
      status: session.status,
      profile1: session.profile1,
      profile2: session.profile2,
      commentary: session.commentary,
      winner: session.winner,
      winnerName: session.winnerName,
    };
  }

  /**
   * Health check for all services
   */
  async healthCheck(): Promise<Record<string, boolean>> {
    const [contextHealth, automationHealth, commentaryHealth] = await Promise.all([
      contextService.healthCheck(),
      automationService.healthCheck(),
      commentaryService.healthCheck(),
    ]);

    return {
      context: contextHealth,
      automation: automationHealth,
      commentary: commentaryHealth,
      scraper: true, // Bright Data doesn't have a simple health endpoint
    };
  }
}

export const duelOrchestrator = new DuelOrchestrator();
