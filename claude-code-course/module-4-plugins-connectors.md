# Module 4: Plugins, Connectors & Integrations — Claude Inside Your Business Tools

---

## The Leap

In Modules 1-3, Claude learned to read your files and follow your instructions. That alone is a significant upgrade over regular chat.

But your business doesn't live in one folder.

Your clients are in your CRM. Your conversations are in Slack and email. Your calendar holds your schedule. Your project management tool tracks what's in progress. Your Google Drive has years of documents. Your accounting software has the numbers.

Right now, Claude can read what's on your computer. In this module, we're going to connect it to the tools where your business actually runs.

This is where Claude goes from "smart writing assistant" to something much closer to "AI employee."

---

## What Are Integrations, Really?

Let's strip away the jargon.

An integration is just Claude having a login to one of your tools. The same way you'd give a new hire access to Slack on their first day, you're giving Claude access to Slack. The same way you'd add someone to your CRM so they can look up client info, you're adding Claude.

The technical term you'll see is **MCP** — Model Context Protocol. It's a standard that Anthropic created so that Claude can talk to other software in a structured way. You don't need to understand how it works under the hood, any more than you need to understand how Wi-Fi works to use the internet.

What you need to understand is what it means in practice:

- **Claude + your calendar** = "What do I have this week? Reschedule Thursday's call to Friday and send Sarah a message about it."
- **Claude + your CRM** = "Pull up everything we know about Acme Corp. When was our last touchpoint? What's the deal status?"
- **Claude + Slack** = "Summarize what happened in the #clients channel while I was out. Flag anything that needs my attention."
- **Claude + Google Drive** = "Find the proposal we sent to Acme last quarter. Update the pricing to reflect our new rates and save it as a new version."

Each of these is one integration. One connection between Claude and a tool you already use. Combined, they give Claude the ability to do work that currently requires you to jump between five tabs, copy-paste information, and keep track of everything in your head.

---

## What's Available Today

The integration ecosystem is growing fast. Here's a snapshot of what's available and what it means for a business owner:

### File & Document Access
Claude can read and write files on your computer directly through the desktop app. This is the simplest integration and the one you set up in Module 2. It covers documents, spreadsheets, PDFs, presentations — anything stored locally or synced from cloud storage.

### Communication Tools
Slack, email (Gmail, Outlook), and messaging integrations let Claude read conversations, draft responses, and post messages on your behalf. This is where most business owners see the fastest ROI — communication takes up the biggest chunk of your day, and Claude can handle the first draft of almost all of it.

### Calendar & Scheduling
Google Calendar and Outlook integrations let Claude check your availability, suggest meeting times, and understand your schedule when planning work. "Draft a reply to John and suggest three times next week when I'm free for 30 minutes" becomes a single prompt.

### Data & Spreadsheets
Claude can read and analyze spreadsheets, CSVs, and data files. Point it at a sales report and ask for trends. Give it your expense data and ask for a summary. This isn't traditional BI software — it's conversational analysis of the data you already have.

### Web & Research
Claude can search the web, fetch information from URLs, and synthesize research from multiple sources. "Research the top five competitors in [market] and summarize their pricing models" gives you a competitive brief without opening a browser.

### Developer & Technical Tools
GitHub, databases, deployment platforms — these are where your technical team connects Claude Code in the developer sense. If you have developers on staff, they're probably already using some of these. You don't need to set these up yourself, but it's worth knowing they exist — they're why your dev team keeps talking about Claude Code.

---

## Plugins and Skills — Claude's Skill Set

Beyond connecting to tools, Claude Code has another extension system: **plugins** and **skills**.

Think of it this way:

- **Integrations** give Claude access to tools (Slack, Drive, calendar)
- **Skills** teach Claude how to do specific types of work

A skill is like a recipe. It tells Claude: "When someone asks you to write a proposal, follow these steps, use this format, check these files, and produce this output."

Without skills, you have to explain what you want every time. With skills, you just say "write a proposal for this client" and Claude follows the playbook.

Some skills come built in. Others are available in a public library — free, open source, ready to install. And you (or someone on your team) can create custom skills that match exactly how your business works.

Examples of what skills can do:

- **Copywriting skill** — Follows your brand voice guide, checks tone, structures content by channel (LinkedIn vs email vs blog)
- **Proposal skill** — Reads the client brief, pulls your pricing, uses your template, produces a ready-to-review draft
- **Meeting prep skill** — Reads your calendar, pulls background on the attendees, checks recent communication, and builds a one-page briefing
- **Report skill** — Gathers data from connected tools, structures it in your preferred format, and flags what's changed since last time

The plugin library has dozens of pre-built options. The real power comes when you customize them — or build new ones — for your specific business.

---

## Setting Up Your First Integration

Let's walk through connecting one tool. We'll use Slack as the example because it's where most business communication happens, and the payoff is immediate.

### What you'll need:
- The Claude desktop app (already installed from Module 2)
- Admin access to your Slack workspace (or someone who has it)
- About 15 minutes

### The process:

1. **In Claude's settings, find the integrations or MCP section.** This is where you manage all connected tools.

2. **Select Slack from the available integrations.** Claude will walk you through authorizing access to your workspace.

3. **Choose what Claude can access.** You can grant access to all channels, specific channels, or just direct messages. Start narrow — maybe just one or two channels where you spend the most time.

4. **Test it.** Ask Claude: "What are the most recent messages in #[channel-name]?" If it returns the messages, you're connected.

5. **Do something useful with it.** Now try: "Summarize everything in #[channel] from the last 48 hours. What needs my attention? What can I ignore?"

That's it. Claude now has eyes on your Slack — and can help you manage it instead of being managed by it.

### A note on permissions:

When you connect any tool, Claude gets read access by default — it can look at information but can't change anything. Sending messages, creating records, modifying files — those require you to explicitly grant write access, and Claude will ask for approval before taking action.

This is the same "controlled access" principle from Module 2. You stay in control. Claude proposes, you approve.

---

## The Integration Stack for a Typical Business

Here's what a fully connected Claude setup looks like for a small-to-mid-size business:

| Tool | What Claude Does With It |
|------|--------------------------|
| **Local files** | Reads proposals, templates, SOPs, brand docs |
| **Slack** | Summarizes channels, drafts messages, flags urgent items |
| **Gmail / Outlook** | Drafts emails, summarizes threads, handles follow-ups |
| **Google Calendar** | Checks availability, suggests meeting times, preps for calls |
| **Google Drive** | Searches across shared docs, updates files, creates new ones |
| **CRM (HubSpot, etc.)** | Looks up contacts, checks deal stages, logs activity |
| **Project tool (Asana, etc.)** | Checks task status, creates updates, flags overdue items |

Seven connections. Each one individually useful. Together, they give Claude a view of your business that's close to what a human executive assistant would have.

The difference: a human assistant handles one thing at a time. Claude handles all of them in a single prompt.

> "Check my calendar for tomorrow. For each meeting, pull up the contact in HubSpot, check if there are any open issues in Slack, and create a one-page briefing. Save them in my Meeting Prep folder."

One sentence. Five tools. Ten minutes of prep work — done in seconds.

---

## Where It Gets Complicated

You knew this section was coming.

Setting up one integration — like the Slack walkthrough above — is straightforward. 15 minutes, follow the steps, test it, done.

Setting up seven integrations that work together reliably? That's a different story.

Here's what actually happens when companies try to do this themselves:

**Configuration isn't one-size-fits-all.** Every CRM has different fields. Every Slack workspace has different channel structures. Every Google Drive has different folder hierarchies. Each integration needs to be configured for *your* setup, not a generic one.

**Permissions need thought.** Who on your team should have Claude connected to the CRM? Should the marketing team's Claude see the sales pipeline? Should anyone's Claude have write access to client-facing channels? These aren't technical questions — they're business decisions that need to be made before anyone installs anything.

**Instructions multiply.** Remember the CLAUDE.md from Module 3? Each integration needs its own context. Claude needs to know: "When you check the CRM, our deal stages are called X, Y, Z — not the default names." "When you draft a Slack message for #clients, always use formal tone. For #internal, casual is fine." "When you access Drive, never modify anything in the Contracts folder — read only."

**Maintenance is ongoing.** Tools update. APIs change. Someone reorganizes the Drive. A new channel gets created. A team member leaves. Every change can break an integration or, worse, produce silently wrong output that nobody catches.

**Debugging is frustrating.** When Claude gives you wrong information from a connected tool, is it a permissions issue? A configuration issue? Did the data change? Is the integration outdated? Troubleshooting requires understanding both the tool and the integration layer — and the error messages aren't always helpful.

One person connecting Slack to Claude? A weekend project.

A 10-person team with seven integrations, proper permissions, consistent instructions, and ongoing maintenance? That's an implementation project.

---

## The Skills Gap

Plugins and skills have a similar complexity curve.

Installing a pre-built skill from the library is simple — a few clicks, and it's active. But pre-built skills are generic. They follow generic processes, use generic formats, and produce generic output.

Customizing a skill to match your business — your proposal format, your pricing structure, your follow-up cadence, your brand voice — requires editing the skill configuration. It's not programming, but it's not clicking a button either. It means translating "how we do things" into structured instructions that Claude can follow consistently.

Building a custom skill from scratch — for a workflow that's unique to your company — is where most non-technical users hit a wall. The capability is there. The documentation exists. But the gap between "I know what I want Claude to do" and "I can write the instructions that make it do it reliably" is wider than it looks.

This is the same pattern as the CLAUDE.md from Module 3: simple in concept, complex in practice, exponentially harder at scale.

---

## What "Fully Connected" Looks Like

We've deployed Claude across organizations where every team member has:

- A personal CLAUDE.md with role-specific instructions
- A shared company CLAUDE.md with universal standards
- Slack, email, and calendar connected and configured
- CRM access with proper permissions by role
- Custom skills for their three most common workflows
- Clear rules about what Claude can and can't access

The result: people spend less time on admin, communication, and document creation. Proposals go out faster. Client follow-ups don't slip through cracks. Meeting prep happens automatically. The team communicates more consistently because everyone's Claude is working from the same playbook.

Getting there takes planning, configuration, and someone who understands both the tools and the business. It's not a Saturday afternoon project. But the ROI is real — we've seen teams reclaim 5-10 hours per person per week once the setup is dialed in.

---

## Where to Go From Here

If you're hands-on and want to start connecting tools yourself, begin with one. Pick the tool where you waste the most time — usually Slack or email. Get that integration working. Use it for a week. Then add the next one.

If you want the full stack configured correctly the first time — with permissions, instructions, custom skills, and team-wide consistency — that's what our AI deployment sessions are designed for. Book a call at **lowcode.agency/contact** and we'll map out what makes sense for your setup.

Either way, you now understand the building blocks: files, instructions, and connections. In the next module, we'll cover the settings and decisions that make all of this work safely and consistently across your team.

---

*Next up: Module 5 — Settings, Security & Making It Your Own. The decisions that separate "playing with AI" from "running your business on AI."*
