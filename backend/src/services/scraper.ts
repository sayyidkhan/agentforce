import axios, { AxiosError } from 'axios';
import { ProfileData, ScrapedData } from '../types';

const BRIGHTDATA_API_KEY = process.env.BRIGHTDATA_API_KEY;
const BRIGHTDATA_BASE_URL = 'https://api.brightdata.com/datasets/v3';

// Bright Data dataset IDs for different platforms
const DATASET_IDS = {
  linkedin_profile: 'gd_l1viktl72bvl7bjuj0', // LinkedIn Person Profile
  github_profile: 'gd_lwdb4vjm1ehb499uxs',   // GitHub User Profile
  generic_web: 'gd_l1viktkq1w3g0xd5bq',      // Generic web scraper
};

interface BrightDataResponse {
  snapshot_id: string;
  status?: string;
}

interface BrightDataResult {
  data: Record<string, unknown>[];
  errors?: { url: string; error: string }[];
}

export class ScraperService {
  private apiKey: string;

  constructor() {
    this.apiKey = BRIGHTDATA_API_KEY || '';
    if (!this.apiKey) {
      console.warn('[ScraperService] BRIGHTDATA_API_KEY is not set - using mock data');
    }
  }

  /**
   * Detect the platform type from URL
   */
  detectPlatform(url: string): 'linkedin' | 'github' | 'wikipedia' | 'portfolio' | 'unknown' {
    const urlLower = url.toLowerCase();
    
    if (urlLower.includes('linkedin.com')) {
      return 'linkedin';
    }
    if (urlLower.includes('github.com')) {
      return 'github';
    }
    if (urlLower.includes('wikipedia.org')) {
      return 'wikipedia';
    }
    if (urlLower.includes('portfolio') || urlLower.includes('personal') || urlLower.includes('.dev') || urlLower.includes('.io')) {
      return 'portfolio';
    }
    
    return 'unknown';
  }

  /**
   * Scrape a profile URL using Bright Data (LinkedIn & generic sites)
   */
  async scrapeProfile(url: string): Promise<ScrapedData> {
    const platform = this.detectPlatform(url);
    
    console.log(`[BrightData] Scraping ${platform} profile: ${url}`);
    
    try {
      let result: Record<string, unknown>;
      
      switch (platform) {
        case 'linkedin':
          result = await this.scrapeLinkedIn(url);
          break;
        default:
          result = await this.scrapeGeneric(url);
      }
      
      return {
        json: result,
        url,
        scrapedAt: new Date(),
      };
    } catch (error) {
      console.error(`[BrightData] Error scraping ${url}:`, error);
      throw error;
    }
  }

  /**
   * Scrape LinkedIn profile using Bright Data's LinkedIn scraper
   */
  private async scrapeLinkedIn(url: string): Promise<Record<string, unknown>> {
    const response = await axios.post<Record<string, unknown>[]>(
      `${BRIGHTDATA_BASE_URL}/scrape`,
      [{ url }],
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        params: {
          dataset_id: DATASET_IDS.linkedin_profile,
          format: 'json',
        },
        timeout: 120000, // 2 minute timeout
      }
    );

    if (response.data && response.data.length > 0) {
      return response.data[0];
    }

    throw new Error('No data returned from LinkedIn scraper');
  }

  /**
   * Scrape GitHub profile using Bright Data's GitHub scraper
   */
  private async scrapeGitHub(url: string): Promise<Record<string, unknown>> {
    const response = await axios.post<Record<string, unknown>[]>(
      `${BRIGHTDATA_BASE_URL}/scrape`,
      [{ url }],
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        params: {
          dataset_id: DATASET_IDS.github_profile,
          format: 'json',
        },
        timeout: 120000,
      }
    );

    if (response.data && response.data.length > 0) {
      return response.data[0];
    }

    throw new Error('No data returned from GitHub scraper');
  }

  /**
   * Scrape generic website using Bright Data's web scraper
   */
  private async scrapeGeneric(url: string): Promise<Record<string, unknown>> {
    const response = await axios.post<Record<string, unknown>[]>(
      `${BRIGHTDATA_BASE_URL}/scrape`,
      [{ url }],
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        params: {
          dataset_id: DATASET_IDS.generic_web,
          format: 'json',
        },
        timeout: 120000,
      }
    );

    if (response.data && response.data.length > 0) {
      return response.data[0];
    }

    throw new Error('No data returned from generic scraper');
  }

  /**
   * Trigger async scraping job (for larger tasks)
   */
  async triggerAsyncScrape(urls: string[], datasetId: string): Promise<string> {
    const response = await axios.post<BrightDataResponse>(
      `${BRIGHTDATA_BASE_URL}/trigger`,
      urls.map(url => ({ url })),
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        params: {
          dataset_id: datasetId,
        },
      }
    );

    return response.data.snapshot_id;
  }

  /**
   * Get async scrape results by snapshot ID
   */
  async getAsyncResults(snapshotId: string): Promise<BrightDataResult> {
    const response = await axios.get<BrightDataResult>(
      `${BRIGHTDATA_BASE_URL}/snapshot/${snapshotId}`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        params: {
          format: 'json',
        },
      }
    );

    return response.data;
  }

  /**
   * Check status of async scrape job
   */
  async checkJobStatus(snapshotId: string): Promise<string> {
    const response = await axios.get<{ status: string }>(
      `${BRIGHTDATA_BASE_URL}/progress/${snapshotId}`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      }
    );

    return response.data.status;
  }

  /**
   * Extract GitHub username from URL
   */
  private extractGitHubUsername(url: string): string {
    const match = url.match(/github\.com\/([^\/\?]+)/);
    return match ? match[1] : '';
  }

  /**
   * Normalize scraped LinkedIn data to ProfileData format
   */
  normalizeLinkedInData(data: Record<string, unknown>): ProfileData {
    const experiences = (data.experience as Array<Record<string, unknown>>) || [];
    const currentCompany = data.current_company as Record<string, unknown> | null;
    const certs = (data.certifications as Array<Record<string, unknown>>) || [];
    const orgs = (data.organizations as Array<Record<string, unknown>>) || [];

    const position = (data.position as string) || '';
    const companyName = (data.current_company_name as string)
      || (currentCompany?.name as string)
      || '';
    const title = position
      || (companyName ? `Professional at ${companyName}` : '');

    const skillsFromCerts = certs
      .map(c => (c.title as string) || '')
      .filter(Boolean);

    const companies: ProfileData['companies'] = [];
    if (companyName) {
      companies.push({ name: companyName, role: position || 'Professional', current: true, duration: '' });
    }
    for (const exp of experiences) {
      companies.push({
        name: (exp.company as string) || (exp.company_name as string) || '',
        role: (exp.title as string) || '',
        duration: (exp.duration as string) || '',
        current: (exp.is_current as boolean) || false,
      });
    }

    const educationRaw = data.education as Array<Record<string, unknown>> | null;
    const educationStr = data.educations_details as string | null;
    const education: ProfileData['education'] = educationRaw
      ? educationRaw.map(edu => ({
          institution: (edu.school_name as string) || (edu.school as string) || '',
          degree: (edu.degree as string),
          field: (edu.field_of_study as string),
        }))
      : educationStr
        ? [{ institution: educationStr }]
        : [];

    const langs = (data.languages as Array<Record<string, unknown>>) || [];

    return {
      name: (data.name as string) || (data.full_name as string)
        || [data.first_name, data.last_name].filter(Boolean).join(' ')
        || 'Unknown',
      title,
      avatar: (data.avatar as string) || (data.profile_picture as string),
      location: (data.city as string) || (data.location as string) || '',
      skills: [
        ...skillsFromCerts,
        ...langs.map(l => (l.title as string) || '').filter(Boolean),
      ].slice(0, 20),
      years_experience: experiences.length > 0
        ? this.calculateYearsExperience(experiences)
        : Math.max(certs.length, orgs.length, companies.length) > 0 ? 3 : 0,
      leadership_roles: this.extractLeadershipRoles(experiences),
      projects: [],
      achievements: certs.map(c => (c.title as string) || '').filter(Boolean),
      activity_metrics: {
        connections: (data.connections as number) || 0,
        followers: (data.followers as number) || 0,
        posts: 0,
      },
      certifications: certs.map(c => {
        const certTitle = (c.title as string) || '';
        const issuer = (c.subtitle as string) || '';
        return issuer ? `${certTitle} (${issuer})` : certTitle;
      }).filter(Boolean),
      companies,
      education,
      summary: (data.about as string) || (data.summary as string),
      sourceUrl: (data.url as string) || (data.input_url as string) || '',
      sourceType: 'linkedin',
    };
  }

  /**
   * Normalize GitHub data (from ActionBook + GitHub REST API) to ProfileData format
   */
  normalizeGitHubData(data: Record<string, unknown>): ProfileData {
    const repos = (data.repositories as Array<Record<string, unknown>>) || [];
    const topRepos = [...repos]
      .sort((a, b) => ((b.stargazers_count as number) || 0) - ((a.stargazers_count as number) || 0))
      .slice(0, 10);

    return {
      name: (data.name as string) || (data.login as string) || 'Unknown',
      title: (data.bio as string) || 'Developer',
      avatar: (data.avatar_url as string),
      location: (data.location as string) || '',
      skills: this.extractSkillsFromRepos(repos),
      years_experience: this.estimateGitHubExperience(data),
      leadership_roles: [],
      projects: topRepos.map(repo => ({
        name: (repo.name as string) || '',
        description: (repo.description as string) || '',
        technologies: ((repo.language as string) ? [repo.language as string] : []),
        url: (repo.html_url as string) || (repo.url as string),
        stars: (repo.stargazers_count as number) || 0,
        forks: (repo.forks_count as number) || 0,
      })),
      achievements: this.extractGitHubAchievements(data, repos),
      activity_metrics: {
        repositories: (data.public_repos as number) || repos.length,
        followers: (data.followers as number) || 0,
        following: (data.following as number) || 0,
        contributions: (data.contributions as number) || 0,
        commits: this.sumCommits(repos),
      },
      certifications: [],
      companies: (data.company as string) ? [{
        name: (data.company as string).replace(/^@/, ''),
        role: 'Developer',
        current: true,
      }] : [],
      education: [],
      summary: (data.bio as string),
      sourceUrl: (data.html_url as string) || '',
      sourceType: 'github',
    };
  }

  /**
   * Normalize Wikipedia data (from REST API + MediaWiki infobox + ActionBook) to ProfileData format
   */
  normalizeWikipediaData(data: Record<string, unknown>): ProfileData {
    const name = (data.title as string) || (data.name as string) || 'Unknown';
    const intro = (data.intro as string) || (data.first_paragraph as string) || '';
    const description = (data.description as string) || '';
    const infobox = (data.infobox as Record<string, unknown>) || {};

    const ib = (key: string): string => {
      const variations = [key, key.toLowerCase(), key.replace(/ /g, '_'), key.replace(/ /g, '_').toLowerCase()];
      for (const k of variations) {
        if (infobox[k]) return String(infobox[k]);
      }
      return '';
    };

    const born = ib('Born') || ib('birth_date') || (data.born as string) || '';
    const occupation = ib('Occupation') || ib('occupation') || ib('Title') || ib('title')
      || (data.occupation as string) || '';
    const nationality = ib('Nationality') || ib('Citizenship') || ib('citizenship')
      || (data.nationality as string) || '';
    const education = ib('Education') || ib('Alma mater') || ib('alma_mater') || '';
    const awards = ib('Awards') || ib('honors') || (data.awards as string) || '';
    const employer = ib('Employer') || ib('Organization') || ib('organization') || '';
    const knownFor = ib('Known for') || ib('known_for') || '';
    const spouses = ib('Spouse') || ib('Spouses') || '';
    const children = ib('Children') || '';
    const netWorth = ib('Net worth') || ib('net_worth') || '';
    const titleField = ib('Title') || '';

    const titleFromOccupation = occupation.split(/[,\n]/).map(s => s.trim()).filter(Boolean)[0];
    const titleFromDescription = description
      ? description.charAt(0).toUpperCase() + description.slice(1)
      : '';
    const displayTitle = titleFromOccupation || titleFromDescription || 'Notable Figure';

    const locationFromNationality = nationality;
    const locationFromDescription = this.extractNationalityFromDescription(description);
    const location = locationFromNationality || locationFromDescription || '';

    const skills = [
      ...occupation.split(/[,;&\n]/).map(s => s.trim()).filter(Boolean),
      ...knownFor.split(/[,;&\n]/).map(s => s.trim()).filter(Boolean),
    ].filter(s => s.length > 1 && s.length < 80).slice(0, 20);

    const achievementList = awards
      ? awards.split(/[,;\n]/).map(a => a.trim()).filter(a => a.length > 2)
      : [];

    const companies: ProfileData['companies'] = [];
    if (employer) {
      for (const e of employer.split(/[,;&\n]/)) {
        const trimmed = e.trim();
        if (trimmed) companies.push({ name: trimmed, role: displayTitle, current: true });
      }
    }
    if (titleField && !employer) {
      for (const t of titleField.split(/[,;\n]/)) {
        const trimmed = t.trim();
        if (trimmed) companies.push({ name: trimmed, role: displayTitle, current: true });
      }
    }
    this.extractCompaniesFromIntro(intro, companies);

    const educationList: ProfileData['education'] = education
      ? education.split(/[,;&\n]/).map(e => ({
          institution: e.trim(),
        })).filter(e => e.institution && e.institution.length > 1)
      : [];

    const yearsActive = this.estimateWikipediaExperience(born, intro);

    return {
      name: name.replace(/ - Wikipedia$/, ''),
      title: displayTitle,
      avatar: (data.image as string) || (data.thumbnail as string) || (infobox.image as string),
      location,
      skills,
      years_experience: yearsActive,
      leadership_roles: this.extractWikipediaLeadership(intro, occupation),
      projects: [],
      achievements: achievementList.slice(0, 10),
      activity_metrics: {
        followers: 0,
        posts: 0,
      },
      certifications: [],
      companies,
      education: educationList,
      summary: intro.slice(0, 500),
      sourceUrl: (data.url as string) || '',
      sourceType: 'wikipedia',
    };
  }

  private extractNationalityFromDescription(description: string): string {
    if (!description) return '';
    const nationalities = ['American', 'British', 'Canadian', 'Indian', 'Chinese', 'French',
      'German', 'Japanese', 'South African', 'Australian', 'Israeli', 'Korean', 'Brazilian',
      'Russian', 'Italian', 'Spanish', 'Dutch', 'Swedish', 'Norwegian', 'Swiss', 'Irish',
      'Scottish', 'New Zealand', 'Taiwanese', 'Singaporean', 'Malaysian', 'Indonesian'];
    for (const nat of nationalities) {
      if (description.includes(nat)) return nat;
    }
    return '';
  }

  private extractCompaniesFromIntro(intro: string, companies: ProfileData['companies']): void {
    const existingNames = new Set(companies.map(c => c.name.toLowerCase()));
    const companyPatterns = [
      { pattern: /(?:CEO|chief executive officer) of (\w[\w\s]*)/gi, role: 'CEO' },
      { pattern: /(?:co-?founder|founder) of (\w[\w\s]*)/gi, role: 'Founder' },
      { pattern: /(?:chairman|chair) of (\w[\w\s]*)/gi, role: 'Chairman' },
      { pattern: /(?:president) of (\w[\w\s]*)/gi, role: 'President' },
      { pattern: /(?:CTO|chief technology officer) of (\w[\w\s]*)/gi, role: 'CTO' },
    ];

    for (const { pattern, role } of companyPatterns) {
      let match;
      while ((match = pattern.exec(intro)) !== null) {
        const companyName = match[1].trim().replace(/[.,;]$/, '').trim();
        if (companyName && companyName.length < 50 && !existingNames.has(companyName.toLowerCase())) {
          companies.push({ name: companyName, role, current: true });
          existingNames.add(companyName.toLowerCase());
        }
      }
    }
  }

  private estimateWikipediaExperience(born: string, intro: string): number {
    const yearMatch = born.match(/(\d{4})/);
    if (yearMatch) {
      const birthYear = parseInt(yearMatch[1]);
      const careerStart = birthYear + 22;
      return Math.max(1, new Date().getFullYear() - careerStart);
    }
    if (intro.toLowerCase().includes('veteran') || intro.toLowerCase().includes('pioneer')) return 25;
    if (intro.toLowerCase().includes('senior') || intro.toLowerCase().includes('experienced')) return 15;
    return 10;
  }

  private extractWikipediaLeadership(intro: string, occupation: string): string[] {
    const roles: string[] = [];
    const combined = `${intro} ${occupation}`.toLowerCase();
    const keywords = ['founder', 'ceo', 'president', 'chairman', 'director', 'chief', 'inventor', 'creator', 'pioneer'];
    for (const kw of keywords) {
      if (combined.includes(kw)) roles.push(kw.charAt(0).toUpperCase() + kw.slice(1));
    }
    return roles;
  }

  private extractGitHubAchievements(data: Record<string, unknown>, repos: Array<Record<string, unknown>>): string[] {
    const achievements: string[] = [];
    const totalStars = repos.reduce((sum, r) => sum + ((r.stargazers_count as number) || 0), 0);
    const followers = (data.followers as number) || 0;
    const publicRepos = (data.public_repos as number) || repos.length;

    if (totalStars >= 1000) achievements.push(`${totalStars.toLocaleString()} total GitHub stars`);
    if (followers >= 100) achievements.push(`${followers.toLocaleString()} GitHub followers`);
    if (publicRepos >= 50) achievements.push(`${publicRepos} public repositories`);
    if (repos.some(r => (r.stargazers_count as number) >= 100)) achievements.push('Maintains popular open source project');

    return achievements;
  }

  /**
   * Calculate years of experience from work history
   */
  private calculateYearsExperience(experiences: Array<Record<string, unknown>>): number {
    if (!experiences.length) return 0;
    
    let totalMonths = 0;
    for (const exp of experiences) {
      const duration = exp.duration as string;
      if (duration) {
        // Parse duration strings like "2 yrs 3 mos" or "1 year"
        const years = duration.match(/(\d+)\s*(year|yr)/i);
        const months = duration.match(/(\d+)\s*(month|mo)/i);
        
        if (years) totalMonths += parseInt(years[1]) * 12;
        if (months) totalMonths += parseInt(months[1]);
      }
    }
    
    return Math.round(totalMonths / 12);
  }

  /**
   * Extract leadership roles from experiences
   */
  private extractLeadershipRoles(experiences: Array<Record<string, unknown>>): string[] {
    const leadershipKeywords = ['lead', 'manager', 'director', 'head', 'chief', 'vp', 'president', 'founder', 'cto', 'ceo', 'coo'];
    
    return experiences
      .filter(exp => {
        const title = ((exp.title as string) || '').toLowerCase();
        return leadershipKeywords.some(keyword => title.includes(keyword));
      })
      .map(exp => exp.title as string);
  }

  /**
   * Extract skills from GitHub repositories
   */
  private extractSkillsFromRepos(repos: Array<Record<string, unknown>>): string[] {
    const skillSet = new Set<string>();
    
    for (const repo of repos) {
      const languages = (repo.languages as string[]) || [];
      const topics = (repo.topics as string[]) || [];
      
      languages.forEach(lang => skillSet.add(lang));
      topics.forEach(topic => skillSet.add(topic));
    }
    
    return Array.from(skillSet).slice(0, 20);
  }

  /**
   * Estimate years of experience from GitHub account
   */
  private estimateGitHubExperience(data: Record<string, unknown>): number {
    const createdAt = data.created_at as string;
    if (!createdAt) return 0;
    
    const accountAge = new Date().getFullYear() - new Date(createdAt).getFullYear();
    return Math.max(1, accountAge);
  }

  /**
   * Sum commits across repositories
   */
  private sumCommits(repos: Array<Record<string, unknown>>): number {
    return repos.reduce((sum, repo) => {
      return sum + ((repo.commits_count as number) || 0);
    }, 0);
  }
}

export const scraperService = new ScraperService();
