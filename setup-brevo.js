#!/usr/bin/env node

/**
 * Brevo Setup Script — LowCode Agency Lead Magnets
 *
 * Creates contact lists, email templates, and automation workflows
 * for both email courses via Brevo's REST API.
 *
 * Usage:
 *   BREVO_API_KEY=your-key node setup-brevo.js
 *
 * What it creates:
 *   - 2 contact lists (5-Day AI Agents Course, 15-Day Deploy Claude Course)
 *   - 20 email templates (5 + 15 course emails)
 *   - 2 automation workflows with daily delays
 *   - Engagement tags (foundation-builder, active-user, aware-of-gap, course-complete)
 *
 * Requires: Node.js 18+ (uses native fetch)
 */

const API_KEY = process.env.BREVO_API_KEY;
if (!API_KEY) {
  console.error('Error: Set BREVO_API_KEY environment variable');
  console.error('Usage: BREVO_API_KEY=your-key node setup-brevo.js');
  process.exit(1);
}

const BASE_URL = 'https://api.brevo.com/v3';
const fs = require('fs');
const path = require('path');

const SENDER = {
  name: 'Jesus Vargas',
  email: 'hola@lowcode.agency' // Verified sender in Brevo
};

// ─── Email Course Definitions ───

const FIVE_DAY_COURSE = {
  listName: '5-Day AI Agents Course',
  folder: path.join(__dirname, 'emails/5-day-agents-course'),
  prefix: '5day',
  emails: [
    { file: 'day-1-company-knowledge-agent.html', day: 1 },
    { file: 'day-2-meeting-prep-agent.html', day: 2 },
    { file: 'day-3-daily-briefing-agent.html', day: 3 },
    { file: 'day-4-sales-research-agent.html', day: 4 },
    { file: 'day-5-support-draft-agent.html', day: 5 },
  ]
};

const FIFTEEN_DAY_COURSE = {
  listName: '15-Day Deploy Claude Course',
  folder: path.join(__dirname, 'emails/15-day-claude-course'),
  prefix: '15day',
  emails: [
    { file: 'day-01-company-knowledge-base.html', day: 1 },
    { file: 'day-02-brand-voice.html', day: 2 },
    { file: 'day-03-team-and-tools.html', day: 3 },
    { file: 'day-04-process-sops.html', day: 4 },
    { file: 'day-05-share-and-validate.html', day: 5 },
    { file: 'day-06-prompting.html', day: 6 },
    { file: 'day-07-artifacts-and-skills.html', day: 7 },
    { file: 'day-08-connect-tools.html', day: 8 },
    { file: 'day-09-cowork.html', day: 9 },
    { file: 'day-10-research-mode.html', day: 10 },
    { file: 'day-11-the-wall.html', day: 11 },
    { file: 'day-12-14-document-framework.html', day: 12 },
    { file: 'day-13-time-audit.html', day: 13 },
    { file: 'day-14-custom-ai-tools.html', day: 14 },
    { file: 'day-15-next-move.html', day: 15 },
  ]
};

// ─── API Helper ───

async function brevo(method, endpoint, body) {
  const url = `${BASE_URL}${endpoint}`;
  const opts = {
    method,
    headers: {
      'api-key': API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);
  const text = await res.text();

  if (!res.ok) {
    throw new Error(`Brevo API ${method} ${endpoint} failed (${res.status}): ${text}`);
  }

  return text ? JSON.parse(text) : {};
}

// ─── Extract subject and preheader from HTML comments ───

function parseEmail(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const subjectMatch = html.match(/<!--SUBJECT:\s*(.+?)\s*-->/);
  const preheaderMatch = html.match(/<!--PREHEADER:\s*(.+?)\s*-->/);
  return {
    subject: subjectMatch ? subjectMatch[1] : 'No subject',
    preheader: preheaderMatch ? preheaderMatch[1] : '',
    htmlContent: html,
  };
}

// ─── Step 1: Create Contact Lists ───

async function createList(name) {
  console.log(`  Creating list: "${name}"...`);
  try {
    const result = await brevo('POST', '/contacts/lists', {
      name,
      folderId: 1, // Default folder; change if you use folders
    });
    console.log(`  ✓ List created (ID: ${result.id})`);
    return result.id;
  } catch (err) {
    // List may already exist — try to find it
    if (err.message.includes('already exist')) {
      console.log(`  → List already exists, looking up...`);
      const lists = await brevo('GET', '/contacts/lists?limit=50&offset=0');
      const existing = lists.lists.find(l => l.name === name);
      if (existing) {
        console.log(`  ✓ Found existing list (ID: ${existing.id})`);
        return existing.id;
      }
    }
    throw err;
  }
}

// ─── Step 2: Create Email Templates ───

async function createTemplate(name, subject, htmlContent, sender) {
  console.log(`  Creating template: "${name}"...`);
  try {
    const result = await brevo('POST', '/smtp/templates', {
      templateName: name,
      subject,
      htmlContent,
      sender: { name: sender.name, email: sender.email },
      isActive: true,
    });
    console.log(`  ✓ Template created (ID: ${result.id})`);
    return result.id;
  } catch (err) {
    if (err.message.includes('already exist')) {
      console.log(`  → Template "${name}" already exists, skipping`);
      return null;
    }
    throw err;
  }
}

// ─── Step 3: Create Automation Workflow ───
// Note: Brevo's Automation API is limited — complex workflows may need
// manual setup in the UI. This creates the basic structure.

async function createAutomation(name, listId, templateIds, delayDays) {
  console.log(`\n  Creating automation: "${name}"...`);

  // Brevo's automation API uses a specific format
  // We'll create a workflow triggered by list addition
  try {
    const steps = [];

    templateIds.forEach((templateId, index) => {
      if (templateId === null) return; // Skip if template already existed

      // Add delay (except for Day 1 which sends immediately)
      if (index > 0) {
        steps.push({
          type: 'delay',
          parameters: { duration: 1, unit: 'day' },
        });
      }

      // Send email step
      steps.push({
        type: 'sendEmail',
        parameters: { templateId },
      });
    });

    // Brevo Automation API v3 — create workflow
    const result = await brevo('POST', '/automation/workflows', {
      name,
      trigger: {
        type: 'listAddition',
        parameters: { listId },
      },
      steps,
      isActive: false, // Start inactive so you can review before enabling
    });

    console.log(`  ✓ Automation created (ID: ${result.id}) — set to INACTIVE (review in Brevo UI then activate)`);
    return result.id;
  } catch (err) {
    console.log(`  ⚠ Automation API error: ${err.message}`);
    console.log(`  → You may need to create the automation manually in Brevo UI.`);
    console.log(`    Templates are already created — just wire them up with 1-day delays.`);
    return null;
  }
}

// ─── Main ───

async function main() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║  LowCode Agency — Brevo Email Course Setup  ║');
  console.log('╚══════════════════════════════════════════════╝\n');

  // Verify API key works
  console.log('Verifying API key...');
  try {
    const account = await brevo('GET', '/account');
    console.log(`✓ Connected as: ${account.email} (${account.companyName || 'No company'})\n`);
  } catch (err) {
    console.error('✗ API key verification failed:', err.message);
    process.exit(1);
  }

  // ── 5-Day Course ──
  console.log('━━━ 5-Day AI Agents Course ━━━\n');

  const fiveDayListId = await createList(FIVE_DAY_COURSE.listName);
  console.log('');

  const fiveDayTemplateIds = [];
  for (const email of FIVE_DAY_COURSE.emails) {
    const filePath = path.join(FIVE_DAY_COURSE.folder, email.file);
    const { subject, htmlContent } = parseEmail(filePath);
    const templateName = `[5-Day Course] Day ${email.day}: ${subject.substring(0, 60)}`;
    const id = await createTemplate(templateName, subject, htmlContent, SENDER);
    fiveDayTemplateIds.push(id);
  }

  await createAutomation(
    'Lead Magnet: 5-Day AI Agents Course',
    fiveDayListId,
    fiveDayTemplateIds,
    1
  );

  // ── 15-Day Course ──
  console.log('\n━━━ 15-Day Deploy Claude Course ━━━\n');

  const fifteenDayListId = await createList(FIFTEEN_DAY_COURSE.listName);
  console.log('');

  const fifteenDayTemplateIds = [];
  for (const email of FIFTEEN_DAY_COURSE.emails) {
    const filePath = path.join(FIFTEEN_DAY_COURSE.folder, email.file);
    const { subject, htmlContent } = parseEmail(filePath);
    const templateName = `[15-Day Course] Day ${email.day}: ${subject.substring(0, 50)}`;
    const id = await createTemplate(templateName, subject, htmlContent, SENDER);
    fifteenDayTemplateIds.push(id);
  }

  await createAutomation(
    'Lead Magnet: 15-Day Deploy Claude Course',
    fifteenDayListId,
    fifteenDayTemplateIds,
    1
  );

  // ── Post-Course Follow-up Templates (15-Day) ──
  console.log('\n━━━ Post-Course Follow-up Templates ━━━\n');

  const followUps = [
    {
      name: '[15-Day Post] Day 17: Check-in',
      subject: "How's your team doing with Claude? (Quick check-in)",
      html: buildFollowUpEmail(
        "How's your team doing with Claude?",
        "It's been 2 days since the course ended. By now, your team has had a chance to sit with everything you built — the docs, the Projects, the Skills.\n\nA few questions worth asking yourself:\n\n• Has your team continued using the Claude Project you set up?\n• Have any new docs been added since Day 5?\n• Did anyone on your team surprise you with how they used Claude?\n\nHit reply and let me know. I read every response.",
        null
      ),
    },
    {
      name: '[15-Day Post] Day 22: Case Study',
      subject: "How a 40-person agency deployed AI across every department",
      html: buildFollowUpEmail(
        "From scattered AI usage to a coordinated AI workforce",
        "One of the patterns we see over and over: a few people on the team get really good at Claude, while most of the company barely touches it.\n\nSound familiar?\n\nHere's how one company fixed it. They ran a discovery audit — structured interviews with every department head, documented every process, mapped every tool. In 3 weeks, they had the complete 14-document foundation.\n\nThen we deployed role-specific Claude Projects with validated documentation, custom Skills for recurring workflows, and connected their entire tool stack.\n\nThe result: every team member had AI that actually knew their job. Not generic. Not generic at all.",
        'See What This Looks Like for Your Team'
      ),
    },
    {
      name: '[15-Day Post] Day 30: Discovery Slots',
      subject: "We have 2 discovery audit slots open this month",
      html: buildFollowUpEmail(
        "2 discovery audit slots open this month",
        "Quick note: we have 2 slots available for discovery audits this month.\n\nIf you've been thinking about getting the full 14-document framework built — the kind of thing that takes teams 3-6 months to do internally — this is how we do it in 2-3 weeks.\n\nThe discovery audit ($7,500) includes:\n\n• 5-8 structured interviews with your team leads (45-60 min each)\n• Complete 14-document framework, written and validated\n• Tool stack mapping with integration recommendations\n• AI deployment roadmap customized to your business\n\nNo pressure. If you're not ready, that's fine. But if you are — reply to this email or book a call below.",
        'Book a Free 30-Minute Call'
      ),
    },
    {
      name: '[15-Day Post] Day 45: Stuck Check-in',
      subject: "Most teams get stuck around document 7. If that's you, let's talk.",
      html: buildFollowUpEmail(
        "The document 7 wall",
        "It's been about a month since you finished the course. Here's what we typically see:\n\n• The first 5-6 docs get done with energy and momentum\n• Then day-to-day work takes over\n• The remaining docs keep getting pushed to \"next week\"\n• Eventually, the Claude Project sits there with the same docs from a month ago\n\nIf that's you — you're not alone. It's the #1 pattern we see.\n\nThe reason teams hire us isn't because they can't do this work. It's because they can't protect the time to do it while also running the business. Our discovery audit handles all of it in 2-3 weeks, with no time burden on your team beyond the interview sessions.\n\nIf you've been meaning to finish the framework and haven't — that's the signal.",
        'Book a Discovery Audit Call'
      ),
    },
  ];

  for (const followUp of followUps) {
    await createTemplate(followUp.name, followUp.subject, followUp.html, SENDER);
  }

  // ── Summary ──
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║                    Done!                     ║');
  console.log('╚══════════════════════════════════════════════╝\n');
  console.log('What was created:');
  console.log(`  • Contact list: "${FIVE_DAY_COURSE.listName}" (ID: ${fiveDayListId})`);
  console.log(`  • Contact list: "${FIFTEEN_DAY_COURSE.listName}" (ID: ${fifteenDayListId})`);
  console.log(`  • ${fiveDayTemplateIds.filter(Boolean).length} email templates (5-Day Course)`);
  console.log(`  • ${fifteenDayTemplateIds.filter(Boolean).length} email templates (15-Day Course)`);
  console.log(`  • ${followUps.length} post-course follow-up templates`);
  console.log('');
  console.log('Next steps:');
  console.log('  1. Go to Brevo → Automations and review/activate the workflows');
  console.log('  2. Update sender email if needed (currently: jesus@lowcode.agency)');
  console.log('  3. Add the scorecard and cheat sheet signup forms to your site');
  console.log('  4. Wire forms to add contacts to the appropriate list');
  console.log('  5. Set up the post-course follow-up sequence (Day 17, 22, 30, 45)');
  console.log('     as a second automation triggered by course completion');
  console.log('');
  console.log('Engagement tags to set up in Brevo UI:');
  console.log('  • "foundation-builder" — contacts who complete Days 1-5 (15-Day)');
  console.log('  • "active-user" — contacts who complete Days 6-10 (15-Day)');
  console.log('  • "aware-of-gap" — contacts who complete Day 11 / scorecard (15-Day)');
  console.log('  • "course-complete-high-intent" — contacts who finish all 15 days');
  console.log('');
}

// ─── Helper: Build a follow-up email HTML ───

function buildFollowUpEmail(headline, body, ctaText) {
  const paragraphs = body.split('\n\n').map(p => {
    if (p.startsWith('•')) {
      const items = p.split('\n').map(line =>
        `<li style="margin: 0 0 8px 0; color: #414141; font-size: 16px; line-height: 1.7;">${line.replace(/^[•]\s*/, '')}</li>`
      ).join('');
      return `<ul style="margin: 0 0 16px 0; padding-left: 20px;">${items}</ul>`;
    }
    return `<p style="margin: 0 0 16px 0; color: #414141; font-size: 16px; line-height: 1.7;">${p}</p>`;
  }).join('');

  const ctaBlock = ctaText ? `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 32px 0;">
      <tr>
        <td style="background: #705CF6; border-radius: 6px;">
          <a href="https://lowcode.agency/contact" target="_blank" style="display: inline-block; padding: 14px 32px; color: #ffffff; font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-weight: 600; text-decoration: none;">${ctaText}</a>
        </td>
      </tr>
    </table>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background: #FAF9F6; font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #FAF9F6;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; width: 100%;">
          <!-- Header -->
          <tr>
            <td style="padding: 0 0 32px 0;">
              <span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 0.08em; color: #282828;">LOW <span style="color: #705CF6;">/</span> CODE</span>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 0 0 32px 0;">
              <h1 style="margin: 0 0 24px 0; font-family: Arial, Helvetica, sans-serif; font-size: 28px; font-weight: 700; line-height: 1.2; color: #282828;">${headline}</h1>
              ${paragraphs}
              ${ctaBlock}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="border-top: 1px solid #D9D9D9; padding: 24px 0 0 0;">
              <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #B5B5B5;">LowCode Agency &nbsp;|&nbsp; <a href="https://lowcode.agency" style="color: #705CF6; text-decoration: none;">lowcode.agency</a> &nbsp;|&nbsp; You received this because you signed up for our 15-Day Claude course.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

main().catch(err => {
  console.error('\n✗ Fatal error:', err.message);
  process.exit(1);
});
