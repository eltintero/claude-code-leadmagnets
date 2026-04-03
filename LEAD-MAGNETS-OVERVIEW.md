# Lead Magnets — Internal Overview

Last updated: April 2026

---

## What We Built

Five lead magnets designed to convert Claude/AI blog traffic into qualified leads. Each captures email, sends a Slack notification, and optionally enrolls the contact into a Brevo email drip course.

### 1. AI Readiness Scorecard (`scorecard.html`)

**What it does:** A 10-question interactive quiz that scores a company's AI readiness across 5 dimensions (Documentation, Tools, Process Maturity, Knowledge Management, Leadership Readiness). Users answer multiple-choice questions, provide their email + company info, and receive a personalized score with tier breakdown and recommendations.

**Capture fields:** Name, email, company, role, company size, email course preference

**User flow:**
1. Intro screen with CTA
2. 10 multiple-choice questions (1 at a time, progress bar)
3. Email gate — "Your results are ready"
4. Animated results screen with score (0-100), tier, per-category breakdown, recommendations, CTA to book a call

**Published:** https://view.lowc.dev/k4R0YnF8oO

---

### 2. AI Employee Blueprint (`blueprint.html`)

**What it does:** A content-first gate page for Pratik's "Claude for Small Business Founders" guide. Shows the guide's hero, the first setup step (Install Claude), then blurs the remaining content and asks for email to unlock the full guide.

**Capture fields:** Email, company, email course preference

**User flow:**
1. Hero section with title, "what's inside" pills
2. Full Step 1 content visible (Install Claude correctly)
3. Steps 2-3 shown blurred with fade gradient
4. Email capture form with testimonial (Franklin Frith)
5. On unlock: full guide loads in iframe from `https://view.lowc.dev/j1tLQj9GR_`
6. Returning visitors skip the gate (localStorage)

---

### 3. 5 AI Agents Email Course (5-day drip)

**What it does:** A 5-day email course delivered via Brevo automation. Each day covers one AI agent concept with practical implementation steps.

**Emails (Brevo template IDs 266-270):**
- Day 1: Company Knowledge Agent
- Day 2: Meeting Prep Agent
- Day 3: Daily Briefing Agent
- Day 4: Sales Research Agent
- Day 5: Support Draft Agent

**Brevo list ID:** 27

**How users enroll:** Dropdown on any lead magnet form ("Also send me a free email course")

---

### 4. AI Readiness Voice Audit (`cheat-sheet.html`)

**What it does:** A voice-first AI readiness audit. Users answer 3 business questions by speaking (or typing), and Groq's Whisper + LLM processes their answers into a structured, personalized audit report with a readiness score, time-waster table, and actionable next steps.

**Capture fields:** Email, email course preference (collected on Step 3 of 4)

**User flow:**
1. Intro screen explaining the 3-step process
2. Step 1: Tell us about your company (voice or text, parsed by Groq LLM)
3. Step 2: Where does your team waste time? (voice or text)
4. Step 3: Email capture + course selection
5. Step 4: What knowledge lives in people's heads? (voice or text)
6. AI-generated audit report with: company overview, time-waster table, knowledge gaps, readiness score (0-10), next steps

**External APIs:** Groq Whisper (transcription), Groq LLM llama-3.3-70b-versatile (parsing + report generation)

---

### 5. Deploy Claude in 15 Days Email Course (15-day drip)

**What it does:** A 15-day email course delivered via Brevo automation. Three phases covering Claude foundations, skills, and scaling.

**Emails (Brevo template IDs 271-285):**
- Phase 1 — Foundation (Days 1-5): Knowledge base, brand voice, team & tools, process SOPs, share & validate
- Phase 2 — Skills (Days 6-10): Prompting, artifacts & skills, connect tools, Cowork, research mode
- Phase 3 — Scale (Days 11-15): The wall, document framework, time audit, custom AI tools, next move

**Brevo list ID:** 28

**How users enroll:** Same dropdown on any lead magnet form

---

## Integrations

### Brevo (Email Marketing)

**How it works:** Each lead magnet's form handler POSTs directly to `https://api.brevo.com/v3/contacts` using a client-side write-only API key. This creates or updates a contact with their attributes and optionally adds them to course lists.

**Contact attributes set:**
| Attribute | Set by |
|-----------|--------|
| FIRSTNAME | Scorecard (from name field) |
| LASTNAME | Scorecard |
| COMPANY | Scorecard, Blueprint (from company field), Cheat Sheet (from step 1 parse) |
| AI_READINESS_SCORE | Scorecard only |
| AI_READINESS_TIER | Scorecard only |
| ROLE | Scorecard only |
| COMPANY_SIZE | Scorecard only |

**Course list enrollment:**
| Dropdown selection | Lists added |
|-------------------|-------------|
| Both courses (recommended) | 27 + 28 |
| 5 AI Agents (5 days) | 27 |
| Deploy Claude (15 days) | 28 |
| No thanks | None |

**Brevo automation setup (manual):** Automations must be created in the Brevo UI — the API doesn't support workflow creation. For each course:
1. Create automation triggered by "Contact added to list [27 or 28]"
2. Add email steps using the pre-built templates (IDs 266-270 for 5-day, 271-285 for 15-day)
3. Set 1-day delay between each email

**Sender:** `hola@lowcode.agency`

### Slack (Notifications)

**How it works:** Each lead magnet sends a formatted message to a Slack Incoming Webhook on form submission.

**Webhook URL:** Configured in `env.md` (not committed to git)

**Channel:** The webhook is configured to post to a specific channel (set during webhook creation in Slack)

**Notification format:**
```
*New Lead Magnet Signup* :rocket:
>*Name:* Alex Morgan (scorecard only)
>*Email:* alex@company.com
>*Company:* Acme Inc.
>*Source:* [lead magnet name]
>*Course:* Both courses
```

The cheat-sheet sends a second, detailed notification when the audit report is generated, including the AI readiness score and time-waster summary.

### Groq (AI Processing — Cheat Sheet only)

**Whisper API:** Transcribes voice recordings via `https://api.groq.com/openai/v1/audio/transcriptions` (model: `whisper-large-v3`)

**LLM API:** Parses transcriptions into structured JSON and generates the final audit report via `https://api.groq.com/openai/v1/chat/completions` (model: `llama-3.3-70b-versatile`)

**Free tier:** Groq's free tier is sufficient for this use case.

---

## Hosting & Embedding

**Hosted on:** view.lowc.dev (uploaded as static HTML files)

**Embedded in Webflow blog via:**
```html
<iframe src="https://view.lowc.dev/[FILE_URL]" style="width:100%; height:100vh; border:none;" allow="clipboard-write; microphone"></iframe>
```

The `microphone` permission is only needed for the cheat-sheet (voice audit). Other lead magnets only need `clipboard-write`.

**Client logos** are hosted on GitHub and referenced via raw URLs:
`https://raw.githubusercontent.com/eltintero/claude-code-leadmagnets/main/client-logos/[filename]`

---

## Social Proof (All Lead Magnets)

Each lead magnet includes:
- **Client logo bar** — 7 logos displayed in grayscale, full color on hover
- **Testimonial** — "Working with LowCode Agency to implement AI at HRM was the best decision I made in 2025" — Franklin Frith, CEO at HRM

---

## API Keys

All keys are stored in `env.md` (local only, never committed). If keys need rotation:
1. Generate new keys in Brevo / Groq / Slack dashboards
2. Update `env.md`
3. Find and replace the old key values in each HTML file
