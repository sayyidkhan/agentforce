import OpenAI from 'openai';
import { AnimeProfile, BattleCommentary, RoastRound } from '../types';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export class CommentaryService {
  private openai: OpenAI | null = null;

  constructor() {
    if (OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: OPENAI_API_KEY,
      });
    } else {
      console.warn('[Commentary] OPENAI_API_KEY not set, using fallback commentary');
    }
  }

  /**
   * Generate savage turn-based roast battle
   */
  async generateCommentary(
    profile1: AnimeProfile,
    profile2: AnimeProfile,
    winner: 'profile1' | 'profile2' | 'draw'
  ): Promise<BattleCommentary> {
    if (!this.openai) {
      return this.generateFallbackCommentary(profile1, profile2, winner);
    }

    try {
      const prompt = this.buildPrompt(profile1, profile2);
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45000);

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an AI Roast Master organizing a savage rap-battle style professional roast.
Your goal is to have two professionals roast each other based on their LinkedIn/GitHub profiles.
Focus on:
- "Cringe" content (influencer wannabe, generic motivational posts)
- Job hopping or staying too long at boring companies
- Buzzword overuse (e.g., "Thought Leader", "Visionary")
- Tech stack shaming (e.g., "Oh, you're a 'Java Guru'? Enjoy your boilerplate.")
- Gap years or weird career pivots

CRITICAL RULES:
- Generate exactly 6 rounds.
- Rounds MUST strictly alternate: profile1, profile2, profile1, profile2, profile1, profile2.
- The "attacker" field MUST be the literal string "profile1" or "profile2" — NEVER the person's actual name.
- Damage values should range from 40 to 95. Vary them — not every hit is a crit.
- Each roast should target the OTHER person (the defender), not the attacker.

Return ONLY valid JSON matching this exact structure:
{
  "introduction": "Hype up the crowd for the battle (1-2 sentences)",
  "rounds": [
    { "roundNumber": 1, "attacker": "profile1", "roast": "profile1 roasts profile2", "damage": 70, "reaction": "profile2's reaction" },
    { "roundNumber": 2, "attacker": "profile2", "roast": "profile2 counter-roasts profile1", "damage": 65, "reaction": "profile1's reaction" },
    { "roundNumber": 3, "attacker": "profile1", "roast": "profile1 escalates", "damage": 80, "reaction": "profile2's reaction" },
    { "roundNumber": 4, "attacker": "profile2", "roast": "profile2 fires back harder", "damage": 85, "reaction": "profile1's reaction" },
    { "roundNumber": 5, "attacker": "profile1", "roast": "profile1 goes for the kill", "damage": 90, "reaction": "profile2's reaction" },
    { "roundNumber": 6, "attacker": "profile2", "roast": "profile2's final stand", "damage": 75, "reaction": "profile1's reaction" }
  ],
  "verdict": "Explanation of who won and why",
  "winner": "profile1" or "profile2" or "draw"
}`
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.9,
        max_tokens: 1500,
      }, { signal: controller.signal });

      clearTimeout(timeout);

      const content = response.choices[0]?.message?.content;
      if (content) {
        try {
          const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim();
          const parsed = JSON.parse(jsonStr) as BattleCommentary;
          parsed.rounds = this.enforceAlternation(parsed.rounds, profile1, profile2);
          return parsed;
        } catch (parseError) {
          console.error('[Commentary] Failed to parse LLM response:', parseError);
          return this.generateFallbackCommentary(profile1, profile2, winner);
        }
      }

      return this.generateFallbackCommentary(profile1, profile2, winner);
    } catch (error) {
      console.error('[Commentary] LLM call failed:', error);
      return this.generateFallbackCommentary(profile1, profile2, winner);
    }
  }

  /**
   * Build the prompt for LLM
   */
  private buildPrompt(
    profile1: AnimeProfile,
    profile2: AnimeProfile
  ): string {
    return `
ROAST BATTLE MATCHUP:

CONTENDER 1: ${profile1.profile.name}
- Title: ${profile1.profile.title}
- Company: ${profile1.guild}
- Skills: ${profile1.profile.skills.join(', ')}
- Bio/Summary: ${profile1.profile.summary || 'No summary provided (boring?)'}
- Years Exp: ${profile1.profile.years_experience}
- Activity: ${profile1.profile.activity_metrics.posts} posts (Influencer score), ${profile1.profile.activity_metrics.followers} followers

CONTENDER 2: ${profile2.profile.name}
- Title: ${profile2.profile.title}
- Company: ${profile2.guild}
- Skills: ${profile2.profile.skills.join(', ')}
- Bio/Summary: ${profile2.profile.summary || 'No summary provided (mysterious or lazy?)'}
- Years Exp: ${profile2.profile.years_experience}
- Activity: ${profile2.profile.activity_metrics.posts} posts, ${profile2.profile.activity_metrics.followers} followers

Generate a 6-round roast battle (alternating profile1 → profile2 → profile1 → profile2 → profile1 → profile2) where they tear each other apart based on these facts. Be savage but funny. Remember: "attacker" must be exactly "profile1" or "profile2".`;
  }

  /**
   * Fix LLM output: force strict profile1/profile2 alternation and fix name-based attacker fields
   */
  private enforceAlternation(rounds: RoastRound[], profile1: AnimeProfile, profile2: AnimeProfile): RoastRound[] {
    const name1 = profile1.profile.name.toLowerCase();
    const name2 = profile2.profile.name.toLowerCase();

    return rounds.map((round, idx) => {
      const expectedAttacker: 'profile1' | 'profile2' = idx % 2 === 0 ? 'profile1' : 'profile2';

      let attacker = round.attacker;
      if (attacker !== 'profile1' && attacker !== 'profile2') {
        const val = String(attacker).toLowerCase();
        if (val.includes(name1) || val.includes('1') || val.includes('contender 1')) {
          attacker = 'profile1';
        } else if (val.includes(name2) || val.includes('2') || val.includes('contender 2')) {
          attacker = 'profile2';
        } else {
          attacker = expectedAttacker;
        }
      }

      // Force alternation regardless
      return {
        ...round,
        roundNumber: idx + 1,
        attacker: expectedAttacker,
        damage: Math.max(30, Math.min(95, round.damage || 60)),
      };
    });
  }

  /**
   * Generate fallback commentary
   */
  private generateFallbackCommentary(
    profile1: AnimeProfile,
    profile2: AnimeProfile,
    winner: 'profile1' | 'profile2' | 'draw'
  ): BattleCommentary {
    const n1 = profile1.profile.name;
    const n2 = profile2.profile.name;
    return {
      introduction: `The microphone is live! ${n1} versus ${n2} — two professionals enter, only one leaves with their dignity intact!`,
      rounds: [
        {
          roundNumber: 1,
          attacker: 'profile1',
          roast: `Hey ${n2}, I saw your resume. It reads like a LinkedIn buzzword bingo card that nobody won.`,
          damage: 65,
          reaction: `${n2} forces an awkward smile.`
        },
        {
          roundNumber: 2,
          attacker: 'profile2',
          roast: `That's rich coming from someone whose greatest achievement is being "proficient in Microsoft Office." Welcome to 2026, ${n1}.`,
          damage: 70,
          reaction: `${n1} clutches their chest dramatically.`
        },
        {
          roundNumber: 3,
          attacker: 'profile1',
          roast: `At least I have achievements. Your LinkedIn says "Thought Leader" but your last post was sharing a motivational quote from 2019.`,
          damage: 75,
          reaction: `${n2} nervously checks their phone.`
        },
        {
          roundNumber: 4,
          attacker: 'profile2',
          roast: `You call yourself a tech expert but your GitHub has more forks than original code. Even your commits are copy-paste.`,
          damage: 80,
          reaction: `${n1} looks visibly shaken.`
        },
        {
          roundNumber: 5,
          attacker: 'profile1',
          roast: `Bold words from someone who lists "synergy" as a skill. The only thing you've disrupted is the coffee machine at your coworking space.`,
          damage: 85,
          reaction: `The crowd goes wild. ${n2} is stunned.`
        },
        {
          roundNumber: 6,
          attacker: 'profile2',
          roast: `Nice try, but your career trajectory looks like a stock chart from 2008. At least my failures are in private repos.`,
          damage: 70,
          reaction: `${n1} takes a deep breath, knowing that one stung.`
        },
      ],
      verdict: "It was a brutal exchange. Both fighters left it all on the stage, but one came out with slightly more dignity.",
      winner
    };
  }

  /**
   * Generate quick one-liner for status updates
   */
  async generateQuickLine(context: string): Promise<string> {
    if (!this.openai) {
      return 'Preparing the roast...';
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Generate a short, hype-building intro line for a roast battle (max 10 words).' },
          { role: 'user', content: context },
        ],
        temperature: 0.9,
        max_tokens: 30,
      });
      return response.choices[0]?.message?.content || 'Heating up the mic...';
    } catch {
      return 'Heating up the mic...';
    }
  }

  async healthCheck(): Promise<boolean> {
    if (!this.openai) return false;
    try {
      await this.openai.models.list();
      return true;
    } catch {
      return false;
    }
  }
}

export const commentaryService = new CommentaryService();
