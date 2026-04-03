# Instructions for Angie: Setting Up the 15-Day Email Course in Brevo

Hi Angie! Here's everything you need to set up the "Deploy Claude Across Your Team" 15-day email automation in Brevo. This is the same process Jesus used for the 5-day course — just more emails.

---

## Overview

- **Course name:** Deploy Claude Across Your Team
- **Emails:** 15 (one per day)
- **Trigger:** Contact is added to **List 28**
- **Sender:** hola@lowcode.agency
- **Templates already exist in Brevo** (IDs 271–285) — you just need to wire them into an automation

---

## Step-by-Step

### 1. Go to Automations

- Log into Brevo → **Automations** (left sidebar) → **Create an automation** → **Create from scratch**

### 2. Set the trigger

- Choose: **"A contact is added to a list"**
- Select list: **Deploy Claude Across Your Team (15 days)** (List ID 28)

### 3. Add the first email

- Add action: **"Send an email"**
- Select template: **ID 271** (Day 1)
- Subject line: `Day 1: Before your team uses Claude, do this first (everyone skips it — that's why 79% fail)`
- Make sure sender is `hola@lowcode.agency`

### 4. Add a wait step

- Add action: **"Wait"** → **1 day**

### 5. Repeat for all 15 days

Add the email → wait 1 day → next email → wait 1 day → etc.

Here's the full list of template IDs, subjects, and preheaders:

| Day | Template ID | Subject | Preheader |
|-----|-------------|---------|-----------|
| 1 | 271 | Day 1: Before your team uses Claude, do this first (everyone skips it — that's why 79% fail) | The #1 reason AI fails: no context. Today you fix that. |
| 2 | 272 | Day 2: Every AI-generated email at your company sounds the same. Fix it in 20 minutes. | Without a voice guide, AI outputs are generic. Here's the highest-leverage doc you can create. |
| 3 | 273 | Day 3: The document that makes AI actually useful for new hires, managers, and cross-team work | Two interviews today. Your org chart and tool stack — documented for AI. |
| 4 | 274 | Day 4: Ask Claude "How do we onboard a client?" and watch it nail the answer — because you taught it | Before AI can do a job, someone has to explain the job. Today you'll do exactly that. |
| 5 | 275 | Day 5: Your team now has something 90% of companies don't — a real AI knowledge base | Five days, 6+ documents, a working AI knowledge base. Now share it with your team. |
| 6 | 276 | Day 6: Same question, 10x better answer — here's the prompting formula your team needs | Context + Format + Examples. The 3-part formula that transforms AI output quality. |
| 7 | 277 | Day 7: Claude just created a working spreadsheet, a slide deck, and a PDF from my notes | Artifacts create real outputs. Skills teach Claude your workflows. Today you build both. |
| 8 | 278 | Day 8: "Search my Slack for what the team said about the Q4 budget" — done in 3 seconds | Connectors + Enterprise Search = Claude knows your company AND what happened today. |
| 9 | 279 | Day 9: I described a task, walked away for lunch, and came back to a finished deliverable | Chat = conversation. Cowork = delegation. The shift that changes everything. |
| 10 | 280 | Day 10: Claude spent 20 minutes researching my competitor and produced a report better than my analyst's | Multi-step, agentic research that takes 5-45 minutes. Work that would take hours. |
| 11 | 281 | Day 11: The honest truth about where you stand (and what most companies never figure out) | You're ahead of 90%. But there's a gap between "using AI" and "running on AI." |
| 12 | 282 | Day 12: You've built 6 documents. Here are the other 8 that complete the picture. | The full 14-document framework. What you've done, what's remaining, and why it matters. |
| 13 | 283 | Day 13: We found $96,000/year in wasted time at one company. Here's the exercise they used. | Map every recurring task. Calculate the cost. Find your first AI agents. |
| 14 | 284 | Day 14: Training your team on Claude is step 1. Here's what step 2 looks like | Custom AI tools — internal and external — are where the real ROI lives. |
| 15 | 285 | Day 15: You've done more in 15 days than most companies do in a year. Here's what's next. | Three paths forward. All of them start with what you've already built. |

### 6. Final structure should look like this

```
Trigger: Contact added to List 28
  ↓
Send email (Template 271) — Day 1
  ↓ Wait 1 day
Send email (Template 272) — Day 2
  ↓ Wait 1 day
Send email (Template 273) — Day 3
  ↓ Wait 1 day
  ... (repeat for each day)
  ↓ Wait 1 day
Send email (Template 285) — Day 15
  ↓
End
```

### 7. Activate

- Review the full flow
- Click **Activate** to make it live
- Test by adding yourself to List 28 (or use Brevo's test feature)

---

## How to verify templates exist

Go to **Campaigns** → **Templates** in Brevo. You should see templates with IDs 271 through 285. Each one already has the HTML content, subject line, and preheader built in.

If a template is missing or the content looks wrong, the source HTML files are in the private repo:
`https://github.com/eltintero/leadmagnets-internal` → `emails/15-day-claude-course/`

Each file has the subject and preheader in HTML comments at the very top:
```
<!--SUBJECT: Day 1: Before your team uses Claude...-->
<!--PREHEADER: The #1 reason AI fails...-->
```

---

## Notes

- The **5-day course** (List 27, Templates 266–270) is already set up — don't touch it
- People can sign up for **both courses at once** — they get added to both lists simultaneously, so both automations run in parallel
- The sender must be **hola@lowcode.agency** (it's the verified sender in our Brevo account)
- If you need to edit a template's content, copy the HTML from the corresponding file in the repo and paste it into Brevo's template editor (use the HTML/code view, not the drag-and-drop editor)

---

Questions? Ask Jesus or check the `LEAD-MAGNETS-OVERVIEW.md` in the repo for the full picture.
