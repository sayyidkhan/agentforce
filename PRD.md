# DevDuel Agent – Anime-Style 1v1 Professional Profile Battle  

---

## 1. Product Overview

**Product Name:** DevDuel Agent  
**Category:** AI Agent Application (Track 2 Hackathon)  
**Core Idea:**  
DevDuel Agent allows users to compare two public professional profiles (LinkedIn, GitHub, portfolio, etc.) in an anime-style 1v1 battle format (inspired by dramatic "versus" scenes like elite anime character showdowns).

The system autonomously:
- Collects public data
- Enriches and normalizes it
- Scores both profiles
- Generates anime-style stats
- Renders a cinematic battle interface
- Produces AI battle commentary
- Declares a winner

---

## 2. Problem Statement

Traditional professional profile comparison is:
- Static
- Boring
- Hard to visualize
- Lacking storytelling

Recruiters, developers, and communities want:
- Engaging comparisons
- Visual skill breakdown
- Fast evaluation
- Social-shareable content

---

## 3. Vision

Transform professional profiles into:
- Data-driven anime battle characters
- Ranked skill archetypes
- Shareable, interactive duels

Positioned as:
- Hiring comparison tool
- Community engagement tool
- Developer branding tool
- Hackathon-grade AI agent demo

---

## 4. Target Users

1. Developers comparing skillsets
2. Recruiters evaluating candidates
3. Tech communities
4. Hackathon judges
5. Content creators

---

## 5. Core Features (MVP)

### 5.1 Input

- User enters two public URLs:
  - LinkedIn (public profile)
  - GitHub
  - Portfolio
  - Company page

---

### 5.2 Agent Pipeline

#### Step 1: Data Collection

- Scrape public content
- Handle dynamic pages
- Capture structured information

#### Step 2: Data Normalization

Convert raw data into:

```json
{
  "name": "",
  "title": "",
  "skills": [],
  "years_experience": 0,
  "leadership_roles": [],
  "projects": [],
  "achievements": [],
  "activity_metrics": {}
}
```

#### Step 3: Scoring Engine

Generate weighted stats (0–100):

- ⚔️ Technical Skill
- 🧠 Strategy
- 🔥 Execution Speed
- 👑 Leadership
- 💎 Impact
- 🕒 Experience Level

#### Step 4: Anime Transformation

Map professional attributes to anime concepts:

| Professional Field | Anime Version |
|--------------------|---------------|
| Skills | Techniques |
| Experience | Battle Experience |
| Certifications | Legendary Scrolls |
| Companies | Guilds |
| Projects | Missions |
| Leadership | Command Rank |

#### Step 5: AI Commentary

LLM generates:
- Battle narration
- Strength comparisons
- Tactical insights
- Winner explanation

---

### 5.3 Battle UI

Split-screen anime layout:

```
[ Profile A ] ⚡ VS ⚡ [ Profile B ]
```

Each side displays:
- Anime avatar
- Name & title
- Radar stat chart
- Power meter animation
- Special abilities list

Winner reveal animation:
- Aura burst
- Power surge
- AI verdict

---

## 6. Track 2 Integration (Mandatory)

### 6.1 Bright Data

**Purpose:**
- Scrape public profile pages
- Handle proxy rotation
- Avoid rate limits

**Usage:**
- Fetch HTML
- Extract structured data
- Capture SERP or page snapshot

---

### 6.2 ActionBook

**Purpose:**
- Perform reliable DOM actions
- Handle dynamic JS-heavy sites
- Automate login (if demo account used)
- Capture specific DOM fields

**Usage:**
- Navigate profile page
- Extract skill sections
- Take screenshot artifacts

---

### 6.3 Acontext

**Purpose:**
- Persist agent session state
- Store raw artifacts (HTML, JSON, screenshots)
- Maintain memory of processed profiles
- Track task status & observability

**Usage:**
- Store extraction results
- Save scoring results
- Maintain duel session history

---

## 7. System Architecture

### 7.1 Backend (Node.js + TypeScript)

**Modules:**
- Orchestrator Service
- Scraping Service (Bright Data)
- Action Automation Service (ActionBook)
- Context Store (Acontext)
- Scoring Engine
- LLM Commentary Service

---

### 7.2 Frontend

**Recommended:**
- Angular 17 or React
- Radar chart (amCharts)
- Anime gradient CSS
- Split layout
- Lottie/Canvas animations

---

## 8. Scoring Model

### 8.1 Weight Distribution

| Category | Weight |
|-----------|--------|
| Skills Depth | 30% |
| Experience | 20% |
| Impact | 25% |
| Leadership | 15% |
| Activity | 10% |

### 8.2 Formula

```
score =
  (skillWeight * skillsScore) +
  (expWeight * experienceScore) +
  (impactWeight * achievementsScore) +
  (leadershipWeight * leadershipScore) +
  (activityWeight * activityScore)
```

Normalized to 0–100.

---

## 9. Demo Flow (2-Minute Judge Demo)

1. Enter two URLs.
2. Show live agent activity logs:
   - Bright Data fetch
   - ActionBook automation
   - Acontext storage
3. Display anime duel screen.
4. Show radar comparison.
5. Play AI commentary.
6. Reveal winner.
7. Explain sponsor integrations.

---

## 10. Non-Functional Requirements

- Respect public data usage only
- No scraping private data
- Handle rate limits gracefully
- Fallback to pre-scraped demo profiles if needed
- Fast rendering (<10 seconds ideal)

---

## 11. Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| Rate limits | Proxy rotation |
| Dynamic site changes | ActionBook DOM reliability |
| Live demo failure | Pre-cached fallback |
| Slow scoring | Precomputed weights |

---

## 12. Future Enhancements

- Community leaderboard
- Clan-based ranking
- Public shareable duel links
- Recruiter dashboard
- AI archetype classification (Strategist, Executor, Visionary)
- Avatar generator customization
- Historical duel archive

---

## 13. Monetization Potential

- Recruiter subscription tool
- Developer premium profile enhancement
- Branded corporate battles
- API access for HR platforms
- Community gamification features

---

## 14. Success Metrics

**Hackathon Success:**
- All 3 sponsor tools integrated
- Fully working duel demo
- Clear AI agent pipeline
- Engaging UI

**Post-Hackathon Success:**
- User signups
- Shared duel links
- Recruiter interest
- Community traction

---

## 15. Elevator Pitch

DevDuel Agent is an AI-powered autonomous system that transforms public professional profiles into anime-style battle characters, automatically scrapes and enriches data, scores skill dimensions, generates cinematic commentary, and delivers an engaging 1v1 duel experience — built using Bright Data, ActionBook, and Acontext.
