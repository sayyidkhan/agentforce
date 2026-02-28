import {
  ProfileData,
  BattleStats,
  AnimeProfile,
  AnimeArchetype,
  AnimeMission,
  DEFAULT_WEIGHTS,
  ScoringWeights,
} from '../types';

// Skill tier mappings for technical scoring
const SKILL_TIERS: Record<string, number> = {
  // Tier S (10 points) - Advanced/Specialized
  'kubernetes': 10, 'machine learning': 10, 'deep learning': 10, 'rust': 10,
  'system design': 10, 'distributed systems': 10, 'blockchain': 10, 'ai': 10,
  'mlops': 10, 'data engineering': 10, 'cloud architecture': 10,
  
  // Tier A (8 points) - Senior level
  'typescript': 8, 'go': 8, 'scala': 8, 'python': 8, 'java': 8,
  'react': 8, 'aws': 8, 'gcp': 8, 'azure': 8, 'docker': 8,
  'postgresql': 8, 'mongodb': 8, 'graphql': 8, 'microservices': 8,
  
  // Tier B (6 points) - Mid level
  'javascript': 6, 'node.js': 6, 'ruby': 6, 'php': 6, 'c#': 6,
  'vue': 6, 'angular': 6, 'mysql': 6, 'redis': 6, 'elasticsearch': 6,
  'jenkins': 6, 'terraform': 6, 'kafka': 6,
  
  // Tier C (4 points) - Junior level
  'html': 4, 'css': 4, 'sql': 4, 'git': 4, 'linux': 4,
  'rest api': 4, 'agile': 4, 'scrum': 4, 'jira': 4,
  
  // Tier D (2 points) - Basic
  'excel': 2, 'word': 2, 'powerpoint': 2, 'communication': 2,
};

// Anime technique name mappings
const TECHNIQUE_NAMES: Record<string, string> = {
  'javascript': 'Thunder Script Jutsu',
  'typescript': 'Type Guardian Shield',
  'python': 'Serpent Code Strike',
  'java': 'Ancient Coffee Technique',
  'react': 'Component Manifestation',
  'vue': 'Progressive Binding Art',
  'angular': 'Framework Fortress',
  'node.js': 'Server Spirit Summoning',
  'aws': 'Cloud Domain Expansion',
  'docker': 'Container Dimension',
  'kubernetes': 'Orchestration Infinity',
  'machine learning': 'Neural Network Enlightenment',
  'ai': 'Artificial Intelligence Awakening',
  'rust': 'Memory Safe Armor',
  'go': 'Goroutine Flash Step',
  'postgresql': 'Relational Memory Palace',
  'mongodb': 'Document Chaos Control',
  'graphql': 'Query Manipulation Art',
  'git': 'Version Control Time Travel',
  'linux': 'Penguin Spirit Form',
};

export class ScoringEngine {
  private weights: ScoringWeights;

  constructor(weights: ScoringWeights = DEFAULT_WEIGHTS) {
    this.weights = weights;
  }

  /**
   * Calculate battle stats from profile data
   */
  calculateStats(profile: ProfileData): BattleStats {
    return {
      technical: this.scoreTechnical(profile),
      strategy: this.scoreStrategy(profile),
      execution: this.scoreExecution(profile),
      leadership: this.scoreLeadership(profile),
      impact: this.scoreImpact(profile),
      experience: this.scoreExperience(profile),
    };
  }

  /**
   * Score technical skills (0-100)
   */
  private scoreTechnical(profile: ProfileData): number {
    const skills = profile.skills.map(s => s.toLowerCase());
    let totalScore = 0;
    let maxPossible = 0;

    for (const skill of skills) {
      const tier = this.findSkillTier(skill);
      totalScore += tier;
      maxPossible += 10; // Max possible per skill
    }

    // Also consider project technologies
    for (const project of profile.projects) {
      if (project.technologies) {
        for (const tech of project.technologies) {
          const tier = this.findSkillTier(tech.toLowerCase());
          totalScore += tier * 0.5; // Half weight for project tech
          maxPossible += 5;
        }
      }
    }

    // Consider GitHub stars as technical validation
    const totalStars = profile.projects.reduce((sum, p) => sum + (p.stars || 0), 0);
    if (totalStars > 1000) totalScore += 20;
    else if (totalStars > 500) totalScore += 15;
    else if (totalStars > 100) totalScore += 10;
    else if (totalStars > 10) totalScore += 5;

    maxPossible += 20;

    // Normalize to 0-100
    const normalized = maxPossible > 0 
      ? Math.min(100, (totalScore / maxPossible) * 100) 
      : 0;

    return Math.round(normalized);
  }

  /**
   * Find skill tier score
   */
  private findSkillTier(skill: string): number {
    // Direct match
    if (SKILL_TIERS[skill]) {
      return SKILL_TIERS[skill];
    }

    // Partial match
    for (const [key, value] of Object.entries(SKILL_TIERS)) {
      if (skill.includes(key) || key.includes(skill)) {
        return value;
      }
    }

    // Default score for unknown skills
    return 3;
  }

  /**
   * Score strategic thinking based on projects and achievements
   */
  private scoreStrategy(profile: ProfileData): number {
    let score = 0;

    // Projects demonstrate strategic thinking
    const projectCount = profile.projects.length;
    score += Math.min(30, projectCount * 6); // Up to 30 points for 5+ projects

    // Project complexity (description length as proxy)
    const avgDescLength = profile.projects.reduce(
      (sum, p) => sum + (p.description?.length || 0), 0
    ) / Math.max(1, projectCount);
    
    if (avgDescLength > 200) score += 15;
    else if (avgDescLength > 100) score += 10;
    else if (avgDescLength > 50) score += 5;

    // Achievements indicate strategic outcomes
    score += Math.min(30, profile.achievements.length * 10);

    // Certifications show planned skill development
    score += Math.min(15, profile.certifications.length * 5);

    // Education contributes to strategic foundation
    score += Math.min(10, profile.education.length * 5);

    return Math.min(100, score);
  }

  /**
   * Score execution speed based on activity metrics
   */
  private scoreExecution(profile: ProfileData): number {
    const metrics = profile.activity_metrics;
    let score = 0;

    // GitHub activity
    if (metrics.commits) {
      if (metrics.commits > 5000) score += 30;
      else if (metrics.commits > 1000) score += 25;
      else if (metrics.commits > 500) score += 20;
      else if (metrics.commits > 100) score += 15;
      else score += 10;
    }

    if (metrics.contributions) {
      if (metrics.contributions > 2000) score += 25;
      else if (metrics.contributions > 500) score += 20;
      else if (metrics.contributions > 100) score += 15;
      else score += 10;
    }

    if (metrics.pullRequests) {
      score += Math.min(15, metrics.pullRequests);
    }

    // Repository count
    if (metrics.repositories) {
      if (metrics.repositories > 100) score += 15;
      else if (metrics.repositories > 50) score += 12;
      else if (metrics.repositories > 20) score += 8;
      else score += 5;
    }

    // Social activity (LinkedIn)
    if (metrics.posts) {
      score += Math.min(10, metrics.posts);
    }

    // Fallback based on projects if no activity metrics
    if (score === 0 && profile.projects.length > 0) {
      score = profile.projects.length * 10;
    }

    return Math.min(100, score);
  }

  /**
   * Score leadership experience
   */
  private scoreLeadership(profile: ProfileData): number {
    let score = 0;

    // Leadership roles
    const leadershipKeywords = ['lead', 'manager', 'director', 'head', 'chief', 
                                'vp', 'president', 'founder', 'cto', 'ceo', 'coo',
                                'principal', 'staff', 'architect'];

    for (const role of profile.leadership_roles) {
      const roleLower = role.toLowerCase();
      for (const keyword of leadershipKeywords) {
        if (roleLower.includes(keyword)) {
          if (['ceo', 'cto', 'coo', 'chief', 'president', 'founder'].some(k => roleLower.includes(k))) {
            score += 25;
          } else if (['director', 'vp', 'head'].some(k => roleLower.includes(k))) {
            score += 20;
          } else if (['lead', 'manager', 'principal', 'staff'].some(k => roleLower.includes(k))) {
            score += 15;
          } else {
            score += 10;
          }
          break;
        }
      }
    }

    // Check company roles for leadership titles
    for (const company of profile.companies) {
      const roleLower = company.role.toLowerCase();
      for (const keyword of leadershipKeywords) {
        if (roleLower.includes(keyword)) {
          score += 10;
          break;
        }
      }
    }

    // Followers indicate thought leadership
    if (profile.activity_metrics.followers) {
      if (profile.activity_metrics.followers > 10000) score += 20;
      else if (profile.activity_metrics.followers > 5000) score += 15;
      else if (profile.activity_metrics.followers > 1000) score += 10;
      else if (profile.activity_metrics.followers > 500) score += 5;
    }

    return Math.min(100, score);
  }

  /**
   * Score overall impact
   */
  private scoreImpact(profile: ProfileData): number {
    let score = 0;

    // Project stars (open source impact)
    const totalStars = profile.projects.reduce((sum, p) => sum + (p.stars || 0), 0);
    if (totalStars > 10000) score += 40;
    else if (totalStars > 5000) score += 35;
    else if (totalStars > 1000) score += 30;
    else if (totalStars > 500) score += 25;
    else if (totalStars > 100) score += 20;
    else if (totalStars > 10) score += 10;

    // Forks indicate project usefulness
    const totalForks = profile.projects.reduce((sum, p) => sum + (p.forks || 0), 0);
    if (totalForks > 1000) score += 20;
    else if (totalForks > 500) score += 15;
    else if (totalForks > 100) score += 10;
    else if (totalForks > 10) score += 5;

    // Connections/Network size
    if (profile.activity_metrics.connections) {
      if (profile.activity_metrics.connections > 10000) score += 20;
      else if (profile.activity_metrics.connections > 5000) score += 15;
      else if (profile.activity_metrics.connections > 1000) score += 10;
      else if (profile.activity_metrics.connections > 500) score += 5;
    }

    // Company prestige (simple heuristic)
    const prestigeCompanies = ['google', 'meta', 'facebook', 'amazon', 'apple', 
                               'microsoft', 'netflix', 'tesla', 'openai', 'anthropic',
                               'stripe', 'airbnb', 'uber', 'coinbase', 'databricks'];
    
    for (const company of profile.companies) {
      if (prestigeCompanies.some(p => company.name.toLowerCase().includes(p))) {
        score += 15;
        break;
      }
    }

    // Achievements
    score += Math.min(15, profile.achievements.length * 5);

    return Math.min(100, score);
  }

  /**
   * Score years of experience
   */
  private scoreExperience(profile: ProfileData): number {
    const years = profile.years_experience;
    
    // Logarithmic scaling - diminishing returns after certain years
    if (years >= 20) return 100;
    if (years >= 15) return 90;
    if (years >= 10) return 80;
    if (years >= 7) return 70;
    if (years >= 5) return 60;
    if (years >= 3) return 45;
    if (years >= 2) return 35;
    if (years >= 1) return 25;
    return 15;
  }

  /**
   * Calculate total power score
   */
  calculateTotalPower(stats: BattleStats): number {
    return Math.round(
      stats.technical * this.weights.skillsDepth +
      stats.strategy * 0.20 +
      stats.execution * this.weights.activity +
      stats.leadership * this.weights.leadership +
      stats.impact * this.weights.impact +
      stats.experience * this.weights.experience
    );
  }

  /**
   * Determine anime archetype based on stats
   */
  determineArchetype(stats: BattleStats): AnimeArchetype {
    const { technical, strategy, execution, leadership, impact, experience } = stats;

    // Find dominant stats
    const statsArray = [
      { name: 'technical', value: technical },
      { name: 'strategy', value: strategy },
      { name: 'execution', value: execution },
      { name: 'leadership', value: leadership },
      { name: 'impact', value: impact },
      { name: 'experience', value: experience },
    ].sort((a, b) => b.value - a.value);

    const top1 = statsArray[0];
    const top2 = statsArray[1];
    
    // Check for balanced warrior
    const avg = (technical + strategy + execution + leadership + impact + experience) / 6;
    const variance = statsArray.reduce((sum, s) => sum + Math.abs(s.value - avg), 0) / 6;
    
    if (variance < 10) {
      return 'The Warrior';
    }

    // Archetype selection based on top stats
    if (leadership >= 70) {
      return 'The Commander';
    }

    if (top1.name === 'technical' && experience < 50) {
      return 'The Prodigy';
    }

    if (top1.name === 'technical' && leadership < 30 && impact < 40) {
      return 'The Shadow';
    }

    if (top1.name === 'experience' && leadership >= 50) {
      return 'The Veteran';
    }

    if (top1.name === 'impact' && strategy >= 60) {
      return 'The Visionary';
    }

    if (top1.name === 'strategy' && leadership >= 50) {
      return 'The Strategist';
    }

    if (top1.name === 'execution' || top1.name === 'technical') {
      return 'The Executor';
    }

    return 'The Warrior';
  }

  /**
   * Transform profile to anime version
   */
  transformToAnime(profile: ProfileData, stats: BattleStats): AnimeProfile {
    const archetype = this.determineArchetype(stats);
    const totalPower = this.calculateTotalPower(stats);

    return {
      profile,
      stats,
      totalPower,
      archetype,
      techniques: this.generateTechniques(profile.skills),
      guild: this.formatGuild(profile.companies),
      guildHistory: profile.companies.map(c => c.name),
      battleExperience: this.formatBattleExperience(profile.years_experience),
      legendaryScrolls: profile.certifications,
      missions: this.formatMissions(profile.projects),
      specialAbility: this.generateSpecialAbility(profile.skills, stats),
    };
  }

  /**
   * Generate anime technique names for skills
   */
  private generateTechniques(skills: string[]): string[] {
    return skills.slice(0, 6).map(skill => {
      const skillLower = skill.toLowerCase();
      return TECHNIQUE_NAMES[skillLower] || this.generateGenericTechnique(skill);
    });
  }

  /**
   * Generate generic anime technique name
   */
  private generateGenericTechnique(skill: string): string {
    const prefixes = ['Ultimate', 'Divine', 'Ancient', 'Forbidden', 'Sacred', 'Mystic'];
    const suffixes = ['Strike', 'Art', 'Technique', 'Jutsu', 'Style', 'Form'];
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    return `${prefix} ${skill} ${suffix}`;
  }

  /**
   * Format current company as guild name
   */
  private formatGuild(companies: ProfileData['companies']): string {
    const current = companies.find(c => c.current);
    if (current) {
      return `${current.name} Guild`;
    }
    return companies.length > 0 ? `${companies[0].name} Guild` : 'Independent Fighter';
  }

  /**
   * Format years of experience as battle experience
   */
  private formatBattleExperience(years: number): string {
    if (years >= 20) return 'Legendary Veteran (20+ years of battle)';
    if (years >= 15) return 'Master Warrior (15+ years of battle)';
    if (years >= 10) return 'Elite Fighter (10+ years of battle)';
    if (years >= 7) return 'Seasoned Warrior (7+ years of battle)';
    if (years >= 5) return 'Experienced Fighter (5+ years of battle)';
    if (years >= 3) return 'Rising Warrior (3+ years of battle)';
    if (years >= 1) return 'Young Fighter (1+ years of battle)';
    return 'Newcomer (Beginning their journey)';
  }

  /**
   * Format projects as anime missions
   */
  private formatMissions(projects: ProfileData['projects']): AnimeMission[] {
    return projects.slice(0, 5).map(project => {
      const rank = this.determineMissionRank(project);
      return {
        name: project.name,
        rank,
        description: project.description || 'A mysterious mission',
      };
    });
  }

  /**
   * Determine mission rank based on project metrics
   */
  private determineMissionRank(project: ProfileData['projects'][0]): AnimeMission['rank'] {
    const stars = project.stars || 0;
    const forks = project.forks || 0;
    const score = stars + forks * 2;

    if (score > 1000) return 'S';
    if (score > 500) return 'A';
    if (score > 100) return 'B';
    if (score > 10) return 'C';
    return 'D';
  }

  /**
   * Generate special ability based on top skills
   */
  private generateSpecialAbility(skills: string[], stats: BattleStats): string {
    const topSkill = skills[0] || 'coding';
    const archetype = this.determineArchetype(stats);
    
    const abilityTemplates: Record<AnimeArchetype, string> = {
      'The Strategist': `Strategic ${topSkill} Mastery - Can see through any technical challenge`,
      'The Executor': `Rapid ${topSkill} Deployment - Executes with lightning speed`,
      'The Visionary': `${topSkill} Innovation - Creates solutions others can't imagine`,
      'The Warrior': `Balanced ${topSkill} Combat - Adapts to any battle situation`,
      'The Prodigy': `Innate ${topSkill} Genius - Natural talent beyond years`,
      'The Veteran': `Ancient ${topSkill} Wisdom - Experience that never fails`,
      'The Shadow': `Hidden ${topSkill} Power - True strength revealed in critical moments`,
      'The Commander': `${topSkill} Leadership Aura - Inspires and leads armies of developers`,
    };

    return abilityTemplates[archetype];
  }

  /**
   * Determine the winner between two profiles
   */
  determineWinner(
    profile1: AnimeProfile, 
    profile2: AnimeProfile
  ): { winner: 'profile1' | 'profile2' | 'draw'; margin: number } {
    const power1 = profile1.totalPower;
    const power2 = profile2.totalPower;
    const margin = Math.abs(power1 - power2);

    // Draw if within 5% difference
    if (margin <= 5) {
      return { winner: 'draw', margin };
    }

    return {
      winner: power1 > power2 ? 'profile1' : 'profile2',
      margin,
    };
  }
}

export const scoringEngine = new ScoringEngine();
