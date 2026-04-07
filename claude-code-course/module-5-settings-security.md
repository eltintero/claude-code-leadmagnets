# Module 5: Settings, Security & Making It Your Own

---

## The Trust Question

By now, you've seen what Claude Code can do. It reads your files, follows your instructions, connects to your tools, and produces work that sounds like your business.

But here's the question that comes up in every conversation we have with business owners:

"How much should I actually trust this thing?"

It's the right question. And the honest answer is: it depends on how you set it up.

Claude Code is a powerful tool. Like any powerful tool, the difference between "this is incredible" and "this just sent the wrong thing to a client" comes down to the guardrails you put in place.

This module is about those guardrails.

---

## What Claude Can and Can't See

Let's start with the basics.

Claude Code can only access what you explicitly give it access to. It doesn't scan your entire computer. It doesn't read files outside the folders you've approved. It doesn't connect to tools you haven't authorized.

This is important to internalize, because it means *you* are in control of Claude's world. If you give it access to one folder, that's all it sees. If you connect Slack but not your CRM, it can't access the CRM. There's no background crawling, no silent data collection.

Here's what that looks like in practice:

**File access is folder-by-folder.** You choose which folders Claude can read. Your proposals folder? Yes. Your personal documents? No. Your team's shared drive? Only the subfolders you specify.

**Tool access is connection-by-connection.** Each integration (Slack, calendar, email, CRM) is a separate authorization. You can connect Slack without connecting email. You can give read access without write access. You can revoke access anytime.

**Conversation data stays on your machine.** Claude Code conversations are stored locally on your computer. They're not uploaded to a cloud server for training. They're not visible to Anthropic. They're yours.

This last point matters more than most people realize. When you type something into a regular chat AI, that conversation goes to a server. With Claude Code's local mode, the conversation lives on your device. For businesses that handle sensitive client information, this is a meaningful difference.

---

## Permissions: The Three Levels

Claude Code has a built-in permission system that controls what it can do. Think of it as three levels of trust:

### Level 1: Read Only
Claude can look at files and data but can't change anything. It reads your documents, analyzes your Slack messages, checks your calendar — but it can't send a message, modify a file, or create anything new without asking first.

This is where you should start. Let Claude prove itself as a reader and analyst before you let it take action.

### Level 2: Create with Approval
Claude can draft new files, write new content, and propose changes — but it asks for your approval before saving or sending anything. You see the output, review it, and decide whether it goes forward.

This is where most business owners settle for daily work. Claude does the heavy lifting, you do the quality check. It's the "trust but verify" model.

### Level 3: Autonomous Action
Claude can take actions without asking — send messages, save files, update records. This level is only appropriate for tasks where you've verified the output is consistently reliable, and the consequences of a mistake are low.

Example: Claude saving a meeting prep document to your folder? Low risk — autonomous is fine. Claude sending a follow-up email to a client? Higher risk — keep approval on.

You can set different permission levels for different tools and different types of actions. The system is granular enough to match your comfort level.

---

## Choosing the Right Model

Not all Claude models are created equal. Anthropic offers three tiers, and which one you use affects both the quality of output and how fast you burn through your usage allowance.

### Opus — The Heavyweight
The most capable model. Best for complex, multi-step work: analyzing large documents, drafting detailed proposals, research synthesis, anything that requires deep reasoning. Uses the most allocation.

Use it for: important client deliverables, complex analysis, work that needs to be right the first time.

### Sonnet — The Everyday Workhorse
The balanced option. Handles most business tasks well — emails, summaries, drafts, meeting prep, Slack management. Good quality, reasonable usage cost.

Use it for: daily work, routine tasks, anything you'll review before sending.

### Haiku — The Quick and Light
The fastest and most efficient model. Good for simple tasks — reformatting, quick lookups, short drafts, categorization. Uses the least allocation.

Use it for: quick questions, simple reformatting, high-volume low-stakes work.

The practical takeaway: don't use Opus for everything. Match the model to the task. A quick Slack summary doesn't need your most powerful model. A board presentation does.

Most people start on Sonnet for everything, then learn to switch to Haiku for light work and Opus for important work. It's like having three employees with different hourly rates — you assign work accordingly.

---

## Managing Your Usage

Claude Code uses more of your plan's allocation than regular chat. Multi-step tasks — where Claude reads files, analyzes data, and produces output — consume more than a quick question-and-answer.

This isn't a problem if you're intentional about it. Here's how to get the most from your allocation:

**Batch related work.** Instead of five separate conversations about five separate emails, do them all in one session. Claude already has the context loaded — use it.

**Use chat for simple things.** If you just need a quick answer or a single paragraph rewritten, regular Claude chat is faster and uses less allocation. Save Claude Code for work that actually needs your files, your tools, and your business context.

**Match models to tasks.** As we covered above, Haiku for light work, Sonnet for daily work, Opus for the important stuff. This alone can double how much you get done within your allocation.

**Check your usage.** The app shows how much of your allocation you've used. Check it periodically, especially in the first month, so you can calibrate your habits. Most people overestimate how much they're using until they actually look.

---

## What to Keep Away from Claude

Not everything should go into Claude. Here's a practical framework:

### Green Light — Safe to Use
- Marketing materials and public-facing content
- General business processes and SOPs
- Proposals and pitch templates (with client names redacted if you prefer)
- Internal communication drafts
- Research and analysis tasks
- Calendar and scheduling

### Yellow Light — Use with Caution
- Client-specific information (names, deal sizes, project details)
- Financial data (revenue, margins, pricing models)
- Employee information (performance, compensation)
- Anything covered by an NDA

For yellow-light data: use Claude Code's local mode, keep permissions tight, and make sure you understand your plan's data handling policies. On Team and Enterprise plans, Anthropic provides commitments about data usage. On the Pro plan, review the terms.

### Red Light — Keep Out
- Passwords, API keys, credentials
- Social Security numbers, credit card numbers, government IDs
- Health records (HIPAA-protected data)
- Anything where a leak would create legal liability

No AI tool — no matter how secure — should have access to red-light data. This isn't a Claude limitation; it's a universal best practice.

If your business handles sensitive data in regulated industries (healthcare, finance, legal), talk to your compliance team before deploying AI tools. Enterprise plans offer additional controls, but the conversation needs to happen before the deployment, not after.

---

## Memory: Teaching Claude to Remember

Claude Code has a memory system that lets it retain information across conversations. This is different from the CLAUDE.md file (which is your explicit instructions) — memory is what Claude picks up from working with you.

When you correct Claude — "we never call clients 'users,' we call them 'partners'" — it can save that preference. Next conversation, it remembers. Over time, Claude builds a working understanding of your preferences, your quirks, and your standards.

You control this completely. You can:
- See what Claude has memorized
- Delete specific memories
- Clear all memories
- Ask Claude to remember something specific

Think of CLAUDE.md as the employee handbook and memory as the notes from their first month on the job. Both make Claude better. Together, they make it dramatically better.

---

## Setting Up for a Team

If you're deploying Claude Code beyond yourself — to your team, your department, or your whole company — the stakes change.

Everything we've covered in this course so far has been from the perspective of one person. But the real questions emerge at team scale:

**Consistency.** If five people on your team are using Claude, are they getting the same quality output? Are they all using the same brand voice? The same pricing? The same processes? Without shared CLAUDE.md files and shared skills, every person's Claude is a different AI with different instructions.

**Access control.** Should your marketing coordinator have the same Claude permissions as your operations lead? Should a junior team member's Claude be able to access client financials? Who decides what each role can see?

**Onboarding.** When a new person joins the team, how do they get set up? Do they configure everything from scratch? Is there a standard setup? Who maintains it?

**Quality control.** How do you know the output is good? If Claude drafts a proposal and someone sends it without reviewing, and the pricing is wrong — who's responsible? What review process catches mistakes?

**Cost management.** Ten people on the Team plan is $300/month. Are they all using it effectively? Is anyone burning allocation on tasks that don't need AI? How do you track ROI?

**Keeping it current.** Services change. Team members leave. Pricing updates. New clients come in with different needs. Who updates the CLAUDE.md files? The skills? The integration configurations? How often?

None of these questions have purely technical answers. They're organizational decisions that require someone who understands both the tool and the business.

This is — honestly — where most companies either get stuck or get it wrong. Not because the technology is hard, but because the *change management* is hard. Getting 10 people to use a new tool consistently, with shared standards, proper permissions, and ongoing maintenance, is an operations challenge disguised as a technology project.

---

## The Compound Effect

Here's the thing most people miss.

Each piece of this course — the CLAUDE.md file, the integrations, the plugins, the permissions, the memory system — is individually useful. You can use any single piece and get value.

But the real power is compounding. When Claude has your business context AND is connected to your tools AND follows custom skills AND remembers your preferences AND is set up consistently across your team — the output quality isn't 5x better. It's qualitatively different. Claude stops being "AI that helps with writing" and starts being "a system that runs parts of your business."

Getting to that compound effect is what separates companies that "use AI" from companies that "run on AI."

It's also what separates a weekend of experimentation from a proper implementation.

---

*Next up: Module 6 — The Big Picture. What "done right" looks like, the real cost of doing it yourself vs. getting help, and how to decide what makes sense for your business.*
