# Lead Magnets — Technical Documentation

Last updated: April 2026

---

## Architecture

Each lead magnet is a **single self-contained HTML file** with no build step, no external JS dependencies, and no server-side code. Everything runs client-side:

- CSS is inlined in a `<style>` block
- JavaScript is inlined in a `<script>` block at the bottom
- Google Fonts (Inter) is the only external CSS dependency
- API calls (Brevo, Slack, Groq) are made directly from the browser via `fetch()`

This means each file can be dropped onto any static hosting (view.lowc.dev, Vercel, S3, etc.) and works immediately.

---

## Project Structure

```
claude-code-leadmagnets/
├── scorecard.html              # AI Readiness Scorecard (1396 lines)
├── blueprint.html              # Claude for Small Biz guide gate (603 lines)
├── cheat-sheet.html            # AI Readiness Voice Audit (2009 lines)
├── setup-brevo.js              # One-time script that created Brevo templates
├── env.md                      # API keys (NEVER commit)
├── client-logos/                # 7 logo files (SVG + AVIF)
├── emails/
│   ├── 5-day-agents-course/    # 5 HTML email templates
│   └── 15-day-claude-course/   # 15 HTML email templates
├── LEAD-MAGNETS-OVERVIEW.md    # Internal team overview
└── TECHNICAL-DOCS.md           # This file
```

**GitHub repo:** https://github.com/eltintero/claude-code-leadmagnets (public, logos only)

---

## Brand System

All lead magnets follow the LowCode brand:

```css
:root {
  --cream: #FAF9F6;       /* Background */
  --dark: #282828;         /* Primary text */
  --brown: #414141;        /* Secondary text */
  --accent: #705CF6;       /* Purple — CTAs, highlights */
  --accent-dark: #38327C;  /* Purple hover state */
  --accent-light: #C5BDFA; /* Light purple */
  --accent-pale: rgba(112, 92, 246, 0.08); /* Purple tint backgrounds */
  --accent-lime: #C5EF48;  /* Lime — testimonial boxes */
  --muted: #B5B5B5;        /* Tertiary text, labels */
  --rule: #D9D9D9;         /* Borders, dividers */
}
```

**Font:** Inter (300, 400, 500, 600, 700) via Google Fonts

**Logo:** `LOW / CODE` in text — the `/` is colored with `--accent`

---

## File-by-File Technical Breakdown

### scorecard.html

**Screen flow:** Intro → 10 Questions → Email Gate → Results

**State management:**
```javascript
var questions = [ /* 10 question objects */ ];
var currentQuestion = 0;
var answers = {};          // { questionIndex: selectedValue }
var categoryScores = {};   // computed from answers
```

**Question structure:**
Each question has `id`, `category`, `text`, and 4 `options` with `value` (0-4) and `label`. Categories: Documentation, Tools, Process Maturity, Knowledge Management, Leadership Readiness.

**Scoring:**
- Raw score = sum of all answer values (0-40 range)
- Normalized to 0-100 for display
- Per-category scores normalized to 0-100
- Tier thresholds: 0-39 = "Foundation Missing", 40-69 = "Almost There", 70-100 = "Ready to Scale"

**Key functions:**
| Function | Purpose |
|----------|---------|
| `startAssessment()` | Shows question screen, renders first question |
| `selectOption(value)` | Records answer, auto-advances to next question |
| `submitGate(event)` | Validates form, sends to Brevo + Slack, shows results |
| `showResults()` | Calculates scores, renders animated result bars |

**Results rendering:**
- Score circle uses CSS animation with `stroke-dashoffset`
- Category breakdown bars animate with staggered delays
- Recommendations are pre-written per tier level

**Email gate fields → Brevo attributes:**
| Field | Brevo Attribute |
|-------|----------------|
| Name | FIRSTNAME, LASTNAME (split on space) |
| Email | email (contact key) |
| Company | COMPANY |
| Role | ROLE |
| Company Size | COMPANY_SIZE |
| Score | AI_READINESS_SCORE |
| Tier | AI_READINESS_TIER |

---

### blueprint.html

**Screen flow:** Hero + Step 1 content visible → Blurred Steps 2-3 + Email Form → Iframe unlock

**Gate mechanism:**
```html
<!-- Visible content (hero + step 1) renders normally -->

<div class="gated-wrapper">
  <!-- Blurred teaser: Steps 2-3 shown with CSS blur + gradient fade -->
  <div class="blur-teaser">
    <!-- content with filter: blur(3px) -->
  </div>

  <!-- Email form appears below the blur -->
  <section class="gate-section">...</section>
</div>

<!-- Full guide iframe (hidden until unlock) -->
<div id="fullContent">
  <iframe src="" id="guideFrame"></iframe>
</div>
```

**Blur CSS:**
```css
.blur-teaser {
  position: relative;
  max-height: 200px;
  overflow: hidden;
}
.blur-teaser::after {
  /* Gradient fade from transparent to --cream */
  background: linear-gradient(to bottom, transparent 0%, var(--cream) 100%);
}
.blur-teaser p, .blur-teaser h3, .blur-teaser .step-card {
  filter: blur(3px);
  user-select: none;
}
```

**Unlock logic:**
```javascript
function unlockContent() {
  document.getElementById('gateWrapper').classList.add('gate-hidden');
  document.getElementById('fullContent').classList.add('unlocked');
  document.getElementById('guideFrame').src = GUIDE_URL;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
```

**localStorage persistence:** `blueprint_unlocked = 'true'` — returning visitors bypass the gate entirely.

**Guide URL:** `https://view.lowc.dev/j1tLQj9GR_` (Pratik's Claude for Small Biz guide)

---

### cheat-sheet.html

**Screen flow:** Intro → Step 1 (Business) → Step 2 (Time Wasters) → Step 3 (Email) → Step 4 (Knowledge Gaps) → Results

**State management:**
```javascript
var auditData = {
  step1: { companyOverview: '', teamSize: '', keyTools: '' },
  step2: { timeWasters: '', recurringQuestions: '', processGaps: '' },
  step3: { undocumentedKnowledge: '', singlePointsOfFailure: '', documentationStatus: '' },
  contact: { email: '', company: '', course: 'both' },
  report: null   // populated by generateReport()
};
```

**Voice recording flow (per step):**

1. User taps record button → `startRecording(step)`
2. `navigator.mediaDevices.getUserMedia({ audio: true })` → MediaRecorder starts
3. Waveform animation + timer shown
4. User taps stop → `stopRecording(step)` → blob assembled
5. `processAudio(blob, step)`:
   - POST blob to Groq Whisper API → transcript text
   - Pass transcript to `parseWithLLM(transcript, step)` → structured JSON
   - `populateResults(parsed, step)` fills editable text fields
6. User reviews/edits parsed results, clicks "Next"

**Text fallback:** If microphone is denied or user prefers typing, `showTextFallback(step)` reveals a textarea. `processTextInput(step)` sends the text directly to the LLM (skipping Whisper).

**LLM prompts (per step):**
- Step 1: Parse business description → `{ companyOverview, teamSize, keyTools }`
- Step 2: Parse time wasters → `{ timeWasters, recurringQuestions, processGaps }`
- Step 4: Parse knowledge gaps → `{ undocumentedKnowledge, singlePointsOfFailure, documentationStatus }`

**Report generation (`generateReport()`):**
Sends all 3 steps' data to the Groq LLM with a detailed prompt. Returns:
```json
{
  "overviewHTML": "<p>...</p>",
  "timeWasterTable": [{ "task": "...", "estimatedHours": "...", "aiCanHandle": "Yes|Partially|No" }],
  "knowledgeGapsHTML": "<p>...</p>",
  "score": 6,
  "scoreReasoning": "...",
  "nextSteps": ["...", "...", "..."]
}
```

**Dual Slack notifications:**
1. **On email capture (Step 3 → Step 4 transition):** Basic signup notification
2. **On report generation:** Detailed audit summary with score, time wasters, and knowledge gaps

**Supported audio formats:** `audio/webm;codecs=opus`, `audio/webm`, `audio/mp4`, `audio/ogg` (auto-detected via `MediaRecorder.isTypeSupported`)

**Course signup modal:** If user didn't provide email during the audit but clicks the course CTA on the results page, a modal collects email + course preference and submits to Brevo.

---

## Email Course Templates

### Format

Each email file is a standalone HTML file with table-based layout and fully inline CSS (for email client compatibility). Format:

```html
<!--SUBJECT: Day 1: Your Company Knowledge Agent-->
<!--PREHEADER: The first AI agent every business needs-->
<!DOCTYPE html>
<html>
<body>
  <table> <!-- table-based layout with inline styles --> </table>
</body>
</html>
```

### Brevo Template Mapping

| Course | Day | Template ID | File |
|--------|-----|-------------|------|
| 5-Day Agents | 1 | 266 | `emails/5-day-agents-course/day-1-company-knowledge-agent.html` |
| 5-Day Agents | 2 | 267 | `emails/5-day-agents-course/day-2-meeting-prep-agent.html` |
| 5-Day Agents | 3 | 268 | `emails/5-day-agents-course/day-3-daily-briefing-agent.html` |
| 5-Day Agents | 4 | 269 | `emails/5-day-agents-course/day-4-sales-research-agent.html` |
| 5-Day Agents | 5 | 270 | `emails/5-day-agents-course/day-5-support-draft-agent.html` |
| 15-Day Claude | 1 | 271 | `emails/15-day-claude-course/day-01-company-knowledge-base.html` |
| 15-Day Claude | 2 | 272 | `emails/15-day-claude-course/day-02-brand-voice.html` |
| 15-Day Claude | 3 | 273 | `emails/15-day-claude-course/day-03-team-and-tools.html` |
| 15-Day Claude | 4 | 274 | `emails/15-day-claude-course/day-04-process-sops.html` |
| 15-Day Claude | 5 | 275 | `emails/15-day-claude-course/day-05-share-and-validate.html` |
| 15-Day Claude | 6 | 276 | `emails/15-day-claude-course/day-06-prompting.html` |
| 15-Day Claude | 7 | 277 | `emails/15-day-claude-course/day-07-artifacts-and-skills.html` |
| 15-Day Claude | 8 | 278 | `emails/15-day-claude-course/day-08-connect-tools.html` |
| 15-Day Claude | 9 | 279 | `emails/15-day-claude-course/day-09-cowork.html` |
| 15-Day Claude | 10 | 280 | `emails/15-day-claude-course/day-10-research-mode.html` |
| 15-Day Claude | 11 | 281 | `emails/15-day-claude-course/day-11-the-wall.html` |
| 15-Day Claude | 12 | 282 | `emails/15-day-claude-course/day-12-14-document-framework.html` |
| 15-Day Claude | 13 | 283 | `emails/15-day-claude-course/day-13-time-audit.html` |
| 15-Day Claude | 14 | 284 | `emails/15-day-claude-course/day-14-custom-ai-tools.html` |
| 15-Day Claude | 15 | 285 | `emails/15-day-claude-course/day-15-next-move.html` |

### Brevo Automation Setup (Manual)

Automations must be created in the Brevo UI:

1. Go to Automations → Create an automation
2. Trigger: "A contact is added to a list" → select list 27 (5-day) or 28 (15-day)
3. Add action: "Send an email" → select template by ID
4. Add "Wait" step: 1 day
5. Repeat for each day's template
6. Activate the automation

---

## Integration Patterns

### Brevo Contact Creation

All lead magnets use the same pattern:

```javascript
var brevoPayload = {
  email: email,
  attributes: {
    FIRSTNAME: firstName || '',   // scorecard only
    COMPANY: company || ''
    // + any lead-magnet-specific attributes
  },
  updateEnabled: true  // update existing contacts, don't fail
};

// Only add to course lists if user opted in
if (listIds.length > 0) brevoPayload.listIds = listIds;

fetch('https://api.brevo.com/v3/contacts', {
  method: 'POST',
  headers: {
    'api-key': BREVO_KEY,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify(brevoPayload)
}).catch(function() {});  // fire-and-forget
```

**Key:** Write-only Brevo API key (stored in each HTML file). `updateEnabled: true` means existing contacts get updated rather than returning a duplicate error.

**List IDs:**
- 27 = 5 AI Agents Every Business Needs (5-day course)
- 28 = Deploy Claude Across Your Team (15-day course)

### Slack Webhook

```javascript
fetch(SLACK_HOOK, {
  method: 'POST',
  body: JSON.stringify({
    text: '*New Lead Magnet Signup* :rocket:\n>*Email:* ' + email + '\n>*Company:* ' + company + '\n>*Source:* [source name]\n>*Course:* ' + courseLabel
  })
}).catch(function() {});  // fire-and-forget
```

The webhook URL is an Incoming Webhook configured to post to a specific Slack channel. No bot token or channel ID needed.

### Groq API (Cheat Sheet only)

**Whisper (transcription):**
```javascript
var formData = new FormData();
formData.append('file', audioBlob, 'recording.' + ext);
formData.append('model', 'whisper-large-v3');
formData.append('language', 'en');

fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer ' + GROQ_KEY },
  body: formData
});
```

**LLM (parsing + report):**
```javascript
fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + GROQ_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: 'You parse spoken business descriptions into structured JSON...' },
      { role: 'user', content: stepPrompt }
    ],
    temperature: 0.1  // low temperature for structured output
  })
});
```

**Response parsing:** The LLM sometimes wraps JSON in markdown code fences, so we strip them:
```javascript
content = content.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '');
return JSON.parse(content);
```

---

## Building a New Lead Magnet

### Starter template

Copy this skeleton and customize:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Lead Magnet Name] | LowCode Agency</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --cream: #FAF9F6;
      --dark: #282828;
      --brown: #414141;
      --accent: #705CF6;
      --accent-dark: #38327C;
      --accent-light: #C5BDFA;
      --accent-pale: rgba(112, 92, 246, 0.08);
      --accent-lime: #C5EF48;
      --muted: #B5B5B5;
      --rule: #D9D9D9;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--cream);
      color: var(--dark);
      font-size: 15px;
      line-height: 1.7;
      -webkit-font-smoothing: antialiased;
    }
    /* Add your styles here */
  </style>
</head>
<body>
  <!-- Your content here -->

  <script>
    var BREVO_KEY = ''; // from env.md
    var SLACK_HOOK = ''; // from env.md

    function submitLead(email, company, course) {
      // Brevo
      var listIds = [];
      if (course === '5day' || course === 'both') listIds.push(27);
      if (course === '15day' || course === 'both') listIds.push(28);

      var payload = {
        email: email,
        attributes: { COMPANY: company },
        updateEnabled: true
      };
      if (listIds.length > 0) payload.listIds = listIds;

      fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'api-key': BREVO_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      }).catch(function() {});

      // Slack
      var courseLabel = { both: 'Both courses', '5day': '5-Day Agents', '15day': '15-Day Claude', none: 'No course' };
      fetch(SLACK_HOOK, {
        method: 'POST',
        body: JSON.stringify({
          text: '*New Lead Magnet Signup* :rocket:\n>*Email:* ' + email + '\n>*Company:* ' + company + '\n>*Source:* [YOUR SOURCE NAME]\n>*Course:* ' + (courseLabel[course] || course)
        })
      }).catch(function() {});
    }
  </script>
</body>
</html>
```

### Checklist for new lead magnets

- [ ] Single HTML file, no external JS dependencies
- [ ] Uses the brand CSS variables (copy from `:root` block above)
- [ ] Inter font loaded from Google Fonts
- [ ] Brevo contact creation with `updateEnabled: true`
- [ ] Slack webhook notification on form submit
- [ ] Email course dropdown with options: Both, 5-day, 15-day, None
- [ ] Social proof section: client logos + Franklin Frith testimonial
- [ ] Logo images referenced from GitHub raw URLs
- [ ] Responsive down to 480px
- [ ] `prefers-reduced-motion` support for animations
- [ ] API keys pulled from `env.md`, never hardcoded in git

### Social proof snippet (copy-paste)

```html
<div class="social-proof-section">
  <div class="logo-bar">
    <img src="https://raw.githubusercontent.com/eltintero/claude-code-leadmagnets/main/client-logos/67c523e2172e77915b5063f1_2Dw4tz92EsKErJxvPmn82UTmPRj2q6YpfLKkyuZN6gE.svg" alt="Client logo">
    <img src="https://raw.githubusercontent.com/eltintero/claude-code-leadmagnets/main/client-logos/67c523f31dc5fb0ed51507bc_iYM3sIPobicwfOY8lOW2tDianDpwZ5tOMG7eTvPdZZs.svg" alt="Client logo">
    <img src="https://raw.githubusercontent.com/eltintero/claude-code-leadmagnets/main/client-logos/67c523f60c91203de35ab6f4_qbsveBaKuFaZqqxw0bd8HOD2Q0s1JL_aTudVU15vOIw.svg" alt="Client logo">
    <img src="https://raw.githubusercontent.com/eltintero/claude-code-leadmagnets/main/client-logos/67c523ff0c91203de35abe25_uF6oC1BtPMrHlI9V70B0x17KAmXzaYzK724yXRqffuo.svg" alt="Client logo">
    <img src="https://raw.githubusercontent.com/eltintero/claude-code-leadmagnets/main/client-logos/67c52555824fbe7abe679025_gISJF_FSCw7U388dV3ZOp1gHpzERdEmbCcuaKLOeSUw.avif" alt="Client logo">
    <img src="https://raw.githubusercontent.com/eltintero/claude-code-leadmagnets/main/client-logos/67c7bb9b69e6abbfa2ccc326_medtronic_color.svg" alt="Medtronic">
    <img src="https://raw.githubusercontent.com/eltintero/claude-code-leadmagnets/main/client-logos/68db35e16e3e72c3be76cc3a_logo_qcells.avif" alt="Q Cells">
  </div>
  <div class="testimonial">
    <p class="testimonial-quote">"Working with LowCode Agency to implement AI at HRM was the best decision I made in 2025"</p>
    <p class="testimonial-author">Franklin Frith</p>
    <p class="testimonial-role">CEO at HRM</p>
  </div>
</div>
```

### Social proof CSS (copy-paste)

```css
.social-proof-section {
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid var(--rule);
}
.logo-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}
.logo-bar img {
  height: 24px;
  width: auto;
  filter: grayscale(1) opacity(0.5);
  transition: filter 0.3s;
}
.logo-bar img:hover {
  filter: grayscale(0) opacity(1);
}
.testimonial {
  text-align: center;
  max-width: 480px;
  margin: 0 auto;
}
.testimonial-quote {
  font-size: 15px;
  font-style: italic;
  color: var(--brown);
  line-height: 1.6;
  margin-bottom: 8px;
}
.testimonial-author {
  font-size: 13px;
  font-weight: 600;
  color: var(--dark);
}
.testimonial-role {
  font-size: 12px;
  color: var(--muted);
}
@media (max-width: 480px) {
  .logo-bar { gap: 16px; }
  .logo-bar img { height: 20px; }
}
```

---

## Gotchas & Lessons Learned

1. **Never commit API keys to git.** Even if you remove files later, the keys remain in git history. Always keep keys in `env.md` (gitignored) and manually paste into HTML files.

2. **Brevo automation API doesn't exist.** You cannot create automation workflows via REST API. Templates can be created via API (`setup-brevo.js`), but the automations (trigger → email sequence with delays) must be built manually in the Brevo UI.

3. **Brevo IP whitelist can block client-side calls.** If Brevo returns 401, check if IP restrictions are enabled in the Brevo account settings. Deactivate or whitelist as needed.

4. **Brevo sender must be verified.** The sender email (`hola@lowcode.agency`) must be verified in Brevo before templates can send.

5. **No `<script>` tags inside template literals.** In the SPA pattern (like the dashboard), never use `</script>` inside a JS template string — the browser's HTML parser will interpret it as closing the main script block. Use `setTimeout` for post-render logic instead. (This applies to the dashboard project, not these lead magnets, but worth remembering.)

6. **Groq free tier rate limits.** Whisper and LLM calls are free but rate-limited. For high traffic, consider caching or upgrading.

7. **MediaRecorder MIME types vary by browser.** The cheat-sheet auto-detects supported MIME types (`audio/webm;codecs=opus` → `audio/webm` → `audio/mp4` → `audio/ogg`). Safari may only support `audio/mp4`.

8. **GitHub raw URLs for images.** The repo must be public for `raw.githubusercontent.com` URLs to work. If the repo is made private, all logo images will break across all lead magnets.

9. **localStorage for gate bypass.** The blueprint uses `localStorage.setItem('blueprint_unlocked', 'true')` so returning visitors skip the email gate. This means the same person on a different browser/device will see the gate again. This is intentional — it captures across devices.

10. **Webflow embed iframe permissions.** When embedding in Webflow, use `allow="clipboard-write; microphone"` on the iframe. The `microphone` permission is required for the cheat-sheet's voice recording to work inside an iframe.
