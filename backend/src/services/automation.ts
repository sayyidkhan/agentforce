import axios from 'axios';
import { ScrapedData } from '../types';

const ACTIONBOOK_API_KEY = process.env.ACTION_BOOK;
const ACTIONBOOK_API_URL = 'https://api.actionbook.dev/v1';
const GITHUB_API_URL = 'https://api.github.com';

export class AutomationService {
  private apiKey: string;

  constructor() {
    this.apiKey = ACTIONBOOK_API_KEY || '';
    if (!this.apiKey) {
      console.warn('[AutomationService] ACTION_BOOK API key not set - some features may be limited');
    }
  }

  /**
   * Scrape a GitHub profile using ActionBook for DOM extraction + GitHub REST API
   */
  async scrapeGitHubProfile(url: string): Promise<ScrapedData> {
    const username = this.extractGitHubUsername(url);
    if (!username) {
      throw new Error(`Could not extract GitHub username from URL: ${url}`);
    }

    console.log(`[ActionBook] Scraping GitHub profile for: ${username}`);

    const [actionBookData, githubApiData, reposData] = await Promise.all([
      this.extractGitHubDom(url).catch(err => {
        console.warn(`[ActionBook] DOM extraction failed: ${err.message}`);
        return {} as Record<string, unknown>;
      }),
      this.fetchGitHubApi(username).catch(err => {
        console.warn(`[ActionBook] GitHub API fetch failed: ${err.message}`);
        return {} as Record<string, unknown>;
      }),
      this.fetchGitHubRepos(username).catch(err => {
        console.warn(`[ActionBook] GitHub repos fetch failed: ${err.message}`);
        return [] as Record<string, unknown>[];
      }),
    ]);

    const merged: Record<string, unknown> = {
      ...githubApiData,
      ...actionBookData,
      repositories: reposData,
      _sources: {
        actionbook: Object.keys(actionBookData).length > 0,
        githubApi: Object.keys(githubApiData).length > 0,
        repos: (reposData as unknown[]).length,
      },
    };

    if (!merged.login && !merged.name) {
      throw new Error('No GitHub profile data retrieved from any source');
    }

    console.log(`[ActionBook] GitHub data merged — ActionBook: ${Object.keys(actionBookData).length > 0}, API: ${Object.keys(githubApiData).length > 0}, Repos: ${(reposData as unknown[]).length}`);

    return {
      json: merged,
      url,
      scrapedAt: new Date(),
    };
  }

  /**
   * Use ActionBook extract API to pull DOM elements from GitHub profile page
   */
  private async extractGitHubDom(url: string): Promise<Record<string, unknown>> {
    const selectors = {
      name: '.vcard-fullname',
      bio: '.p-note.user-profile-bio',
      location: '.p-label',
      company: '.p-org',
      pinned_repos: '.pinned-item-list-item-content .repo',
      contributions: '.js-yearly-contributions h2',
    };

    console.log(`[ActionBook] Extracting DOM elements from: ${url}`);

    const response = await axios.post(
      `${ACTIONBOOK_API_URL}/extract`,
      { url, selectors },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    return response.data || {};
  }

  /**
   * Fetch user profile from GitHub's public REST API
   */
  private async fetchGitHubApi(username: string): Promise<Record<string, unknown>> {
    const response = await axios.get(`${GITHUB_API_URL}/users/${username}`, {
      headers: { 'Accept': 'application/vnd.github.v3+json' },
      timeout: 15000,
    });
    return response.data;
  }

  /**
   * Fetch user repositories from GitHub's public REST API
   */
  private async fetchGitHubRepos(username: string): Promise<Record<string, unknown>[]> {
    const response = await axios.get(`${GITHUB_API_URL}/users/${username}/repos`, {
      headers: { 'Accept': 'application/vnd.github.v3+json' },
      params: { sort: 'stargazers_count', direction: 'desc', per_page: 20 },
      timeout: 15000,
    });
    return response.data;
  }

  /**
   * Scrape a Wikipedia article using Wikipedia REST API + MediaWiki API for infobox,
   * with ActionBook DOM extraction as supplementary source.
   */
  async scrapeWikipediaProfile(url: string): Promise<ScrapedData> {
    const title = this.extractWikipediaTitle(url);
    if (!title) {
      throw new Error(`Could not extract Wikipedia article title from URL: ${url}`);
    }

    console.log(`[Wikipedia] Scraping article for: ${title}`);

    const [wikiApiData, infoboxData, actionBookData] = await Promise.all([
      this.fetchWikipediaApi(title).catch(err => {
        console.warn(`[Wikipedia] REST API fetch failed: ${err.message}`);
        return {} as Record<string, unknown>;
      }),
      this.fetchWikipediaInfobox(title).catch(err => {
        console.warn(`[Wikipedia] Infobox fetch failed: ${err.message}`);
        return {} as Record<string, unknown>;
      }),
      this.extractWikipediaDom(url).catch(err => {
        console.warn(`[ActionBook] Wikipedia DOM extraction failed: ${err.message}`);
        return {} as Record<string, unknown>;
      }),
    ]);

    const merged: Record<string, unknown> = {
      ...actionBookData,
      ...wikiApiData,
      infobox: {
        ...((actionBookData.infobox as Record<string, unknown>) || {}),
        ...(infoboxData as Record<string, unknown>),
      },
      _sources: {
        actionbook: Object.keys(actionBookData).length > 0,
        wikiApi: Object.keys(wikiApiData).length > 0,
        infobox: Object.keys(infoboxData).length > 0,
      },
    };

    if (!merged.title && !merged.name && !merged.intro && !merged.first_paragraph) {
      throw new Error('No Wikipedia data retrieved from any source');
    }

    console.log(`[Wikipedia] Data merged — REST API: ${Object.keys(wikiApiData).length > 0}, Infobox: ${Object.keys(infoboxData).length > 0}, ActionBook: ${Object.keys(actionBookData).length > 0}`);

    return {
      json: merged,
      url,
      scrapedAt: new Date(),
    };
  }

  private async extractWikipediaDom(url: string): Promise<Record<string, unknown>> {
    const selectors = {
      title: '#firstHeading',
      first_paragraph: '#mw-content-text .mw-parser-output > p:not(.mw-empty-elt)',
      image: '.infobox img',
      infobox_rows: '.infobox tr',
    };

    console.log(`[ActionBook] Extracting DOM elements from Wikipedia: ${url}`);

    const response = await axios.post(
      `${ACTIONBOOK_API_URL}/extract`,
      { url, selectors },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    return response.data || {};
  }

  private async fetchWikipediaApi(title: string): Promise<Record<string, unknown>> {
    const response = await axios.get('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(title), {
      headers: { 'Accept': 'application/json', 'User-Agent': 'DevDuel/1.0' },
      timeout: 15000,
    });

    const data = response.data;
    return {
      title: data.title,
      name: data.title,
      description: data.description,
      intro: data.extract,
      image: data.originalimage?.source || data.thumbnail?.source,
      thumbnail: data.thumbnail?.source,
      url: data.content_urls?.desktop?.page,
    };
  }

  /**
   * Fetch structured infobox data from Wikipedia via MediaWiki API wikitext parsing.
   */
  private async fetchWikipediaInfobox(title: string): Promise<Record<string, string>> {
    const response = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'parse',
        page: title,
        prop: 'wikitext',
        section: 0,
        format: 'json',
        origin: '*',
      },
      headers: { 'User-Agent': 'DevDuel/1.0' },
      timeout: 15000,
    });

    const wikitext: string = response.data?.parse?.wikitext?.['*'] || '';
    return this.parseInfoboxFromWikitext(wikitext);
  }

  private parseInfoboxFromWikitext(wikitext: string): Record<string, string> {
    const infobox: Record<string, string> = {};

    const infoboxMatch = wikitext.match(/\{\{Infobox[^\n]*\n([\s\S]*?)\n\}\}\s*$/m);
    if (!infoboxMatch) return infobox;

    const content = infoboxMatch[1];
    const lines = content.split('\n');
    let currentKey = '';
    let currentValue = '';

    for (const line of lines) {
      const fieldMatch = line.match(/^\s*\|\s*([A-Za-z_\s]+?)\s*=\s*(.*)/);
      if (fieldMatch) {
        if (currentKey) {
          infobox[currentKey] = this.cleanWikiMarkup(currentValue);
        }
        currentKey = fieldMatch[1].trim();
        currentValue = fieldMatch[2];
      } else if (currentKey) {
        currentValue += ' ' + line.trim();
      }
    }
    if (currentKey) {
      infobox[currentKey] = this.cleanWikiMarkup(currentValue);
    }

    return infobox;
  }

  private cleanWikiMarkup(text: string): string {
    let clean = text;
    clean = clean.replace(/\{\{(?:flatlist|Flatlist|hlist|Hlist)\s*\|/gi, '');
    clean = clean.replace(/\{\{(?:unbulleted list|Unbulleted list)\s*\|/gi, '');
    clean = clean.replace(/\{\{start date and age\|(\d{4})\|(\d+)\|(\d+)[^}]*\}\}/gi, '$2/$3/$1');
    clean = clean.replace(/\{\{birth date and age\|(\d{4})\|(\d+)\|(\d+)[^}]*\}\}/gi, '$2/$3/$1 (born $1)');
    clean = clean.replace(/\{\{birth date\|(\d{4})\|(\d+)\|(\d+)[^}]*\}\}/gi, '$2/$3/$1');
    clean = clean.replace(/\{\{(?:circa|c\.)\|(\d+)\}\}/gi, 'c. $1');
    clean = clean.replace(/\{\{(?:URL|url)\|([^}|]+)[^}]*\}\}/gi, '$1');
    clean = clean.replace(/\{\{(?:nowrap|small)\|([^}]+)\}\}/gi, '$1');
    clean = clean.replace(/\{\{[^}]*\}\}/g, '');
    clean = clean.replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, '$1');
    clean = clean.replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, '');
    clean = clean.replace(/<ref[^/]*\/>/gi, '');
    clean = clean.replace(/<br\s*\/?>/gi, ', ');
    clean = clean.replace(/<[^>]*>/g, '');
    clean = clean.replace(/'{2,3}/g, '');
    clean = clean.replace(/\s{2,}/g, ' ');
    return clean.trim();
  }

  private extractWikipediaTitle(url: string): string {
    const match = url.match(/wikipedia\.org\/wiki\/([^#\?]+)/);
    return match ? decodeURIComponent(match[1].replace(/_/g, ' ')) : '';
  }

  private extractGitHubUsername(url: string): string {
    const match = url.match(/github\.com\/([^\/\?#]+)/);
    return match ? match[1] : '';
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${ACTIONBOOK_API_URL}/health`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` },
        timeout: 5000,
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }
}

export const automationService = new AutomationService();
