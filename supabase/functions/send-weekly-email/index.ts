import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";
import {
  getRankData,
  C,
  escapeHtml,
  getPreviousWeekWindow,
  getCurrentMonthWindow,
  getWeeklyStats,
  formatDuration,
  getTopLiftsForWeek,
  getTopLiftsAllTime,
  calculateWorkoutXP,
  getConsistencyProtocolHtml,
  isDateInRange,
  toNumber,
  normalizeDate,
  LiftSummary,
  WorkoutRow
} from "../_shared/fitness_helpers.ts";

const resendApiKey = Deno.env.get("RESEND_API_KEY") || "";
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// ── Research article images (from newsletter/code.html Google CDN) ──
const IMG_ARCHIVE = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

type Article = { title: string; link: string; image: string; desc: string; topic: string; };

async function fetchFitnessIntel(): Promise<Article[]> {
  const articles: Article[] = [];
  try {
    const res = await fetch("https://www.strongerbyscience.com/feed/");
    const text = await res.text();
    const items = text.split("<item>").slice(1, 3);
    for (const item of items) {
      if (!item) continue;
      const cleanItem = item.split("</item>")[0];
      const titleMatch = cleanItem.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || cleanItem.match(/<title>(.*?)<\/title>/);
      const linkMatch = cleanItem.match(/<link>(.*?)<\/link>/);
      const imgMatch = cleanItem.match(/<media:content.*?url="([^"]+)"/i) 
        || cleanItem.match(/<enclosure.*?url="([^"]+)"/i) 
        || cleanItem.match(/<content:encoded>[\s\S]*?src="([^"]+)"/i)
        || cleanItem.match(/<description>[\s\S]*?src="([^"]+)"/i);
      const descMatch = cleanItem.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i) 
          || cleanItem.match(/<description>([\s\S]*?)<\/description>/i);
      const cleanDesc = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim().substring(0, 150) + "..." : "New fitness research available.";
      articles.push({
        title: titleMatch ? titleMatch[1] : 'Fitness Research Update',
        link: linkMatch ? linkMatch[1] : 'https://www.strongerbyscience.com/',
        image: imgMatch ? imgMatch[1] : 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800',
        desc: cleanDesc,
        topic: 'Research'
      });
    }
  } catch (e) {
    console.error("RSS fetch failed", e);
  }
  if (articles.length === 0) {
    articles.push({
      title: "The Anabolic Window: New Findings on Protein Timing",
      link: "https://www.strongerbyscience.com/",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJGY2ydexvDI9csFyDkG2Xn_3xs1IBwl1sqHSlZim5iKWsjtywGNfV-FYcBGSiNTjmjqIu9_TqCoGJc0TtA5xHUWT8XF-VH8oUC_wAtdxu5_4E21KeWTnngB8d6HowX9NYLtEGu6vEf_AuLIcCwqv63Sl_oOzifowidZr1VymDM9fK1n-eUkMDgeR5RewW1_u3XvRpbYRRUoka3vsiBsDi2Ivrt4kAClV2WRd3EOY-Zwz2vUNOKSgSQtuD7pTRYK2crnKH3jzrAaAL",
      desc: "Recent clinical data suggests that the 'anabolic window' is significantly wider than previously assumed...",
      topic: "Hypertrophy"
    });
    articles.push({
      title: "Neural Drive & Force Production: Why Mind-Muscle Connection Matters",
      link: "https://www.strongerbyscience.com/",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCPsFjojvlO3f0CM3Cm3mj33k123hteCivz0bdJK2pnt4XzG4_kR73MKGs3-dCFSQ6VZE70OF-OlgwAw8uJYP4YH3_u8VYgK3aDdkEfS6rBFRabCgko7roPjgemIWOAvf44xvOI8BZE7ShmwaGvFVawCFI7wfHXKLsX_hklCwNfNRA2Y7ICP5QVF6KqgSy1J7n1Nqc6o7fKUzPteuT-8CSpz9kY8PPM8YWu8wrT406VBaimjbwzty-9fiesmw33cFWBokhBYsVqcYaB",
      desc: "Investigating the voluntary activation of motor units and how conscious focus can increase total force output by up to 12% in experienced lifters.",
      topic: "Neurology"
    });
  }
  return articles;
}

function buildEmailHtml(
  workoutCount: number,
  weekRange: string,
  allWorkoutDates: string[],
  weekStartDate: string,
  weekEndDate: string,
  articles: Article[],
  xpData: ReturnType<typeof getRankData>,
  bestLifts: LiftSummary[],
  weeklyStats: ReturnType<typeof getWeeklyStats>,
  leaderboardRank: number,
  totalUsers: number
) {
  const hasWorkedOut = workoutCount > 0;
  const consistencyProtocol = getConsistencyProtocolHtml(
    allWorkoutDates,
    weekStartDate,
    weekEndDate,
    hasWorkedOut ? C.surfaceLow : C.surfaceContainer,
  );
  const workoutLabel = workoutCount === 1 ? "1 workout logged." : `${workoutCount} workouts logged.`;

  const prItemsHtml = bestLifts.map(lift => `
      <div style="background-color:${C.surfaceContainer};background:${C.surfaceContainer};border-radius:16px;padding:16px 20px;margin-bottom:10px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td><p style="font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:${C.onSurface};margin:0;">${escapeHtml(lift.name)}</p><p style="font-family:'Be Vietnam Pro',sans-serif;font-size:11px;color:${C.onSurfaceVariant};margin:2px 0 0;">${escapeHtml(lift.day)}</p></td>
          <td style="text-align:right;"><p style="font-family:'Space Grotesk',sans-serif;font-size:18px;font-weight:700;color:${C.onSurface};margin:0;">${escapeHtml(lift.summary)}</p></td>
        </tr></table>
      </div>
  `).join('');

  const bestLiftHtml = bestLifts.length > 0 ? prItemsHtml : `
      <div style="background-color:${C.surfaceContainer};background:${C.surfaceContainer};border-radius:16px;padding:16px 20px;margin-bottom:10px;">
        <p style="font-family:'Be Vietnam Pro',sans-serif;font-size:13px;color:${C.onSurfaceVariant};margin:0;">No lifting data available.</p>
      </div>
  `;

  const statsCardsHtml = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="width:33%;padding-right:6px;">
        <div style="background-color:rgba(255,255,255,0.1);background:rgba(255,255,255,0.1);border-radius:12px;padding:14px 12px;border:1px solid rgba(255,255,255,0.2);">
          <div style="font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:700;color:#FFFFFF;">${weeklyStats.volumeKg.toLocaleString("en-US")}</div>
          <div style="font-family:'Be Vietnam Pro',sans-serif;font-size:9px;color:rgba(255,255,255,0.6);margin-top:3px;letter-spacing:0.08em;text-transform:uppercase;">Volume (kg)</div>
        </div>
      </td>
      <td style="width:33%;padding:0 3px;">
        <div style="background-color:rgba(255,255,255,0.1);background:rgba(255,255,255,0.1);border-radius:12px;padding:14px 12px;border:1px solid rgba(255,255,255,0.2);">
          <div style="font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:700;color:#FFFFFF;">${weeklyStats.trainedMuscles}</div>
          <div style="font-family:'Be Vietnam Pro',sans-serif;font-size:9px;color:rgba(255,255,255,0.6);margin-top:3px;letter-spacing:0.08em;text-transform:uppercase;">Body Parts</div>
        </div>
      </td>
      <td style="width:33%;padding-left:6px;">
        <div style="background-color:rgba(255,255,255,0.1);background:rgba(255,255,255,0.1);border-radius:12px;padding:14px 12px;border:1px solid rgba(255,255,255,0.2);">
          <div style="font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:700;color:#FFFFFF;">${formatDuration(weeklyStats.durationMinutes)}</div>
          <div style="font-family:'Be Vietnam Pro',sans-serif;font-size:9px;color:rgba(255,255,255,0.6);margin-top:3px;letter-spacing:0.08em;text-transform:uppercase;">Training</div>
        </div>
      </td>
    </tr></table>
  `;

  const heroSection = hasWorkedOut ? `
    <div class="gm-hero-active" style="background-color:${C.primaryContainer} !important;background:linear-gradient(135deg,${C.primary},${C.primaryContainer}) !important;padding:32px 28px 28px;">
      <p style="font-family:'Be Vietnam Pro',sans-serif;font-size:10px;font-weight:700;color:${C.onPrimary};letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">LAST WEEK'S REPORT</p>
      <h2 style="font-family:'Space Grotesk',sans-serif;font-size:32px;font-weight:900;color:#fff;letter-spacing:-0.03em;line-height:1.15;margin:0 0 4px;">${escapeHtml(workoutLabel)}</h2>
      <p style="font-family:'Be Vietnam Pro',sans-serif;font-size:15px;color:rgba(255,255,255,0.8);line-height:1.5;margin:0 0 24px;">
        ${workoutCount >= 4 ? "You're in the top 12% of Kaaya users this month." : "Keep building. Consistency compounds."}
      </p>
      ${consistencyProtocol}
      ${statsCardsHtml}
    </div>
    <!-- Personal Records -->
    <div class="gm-surface-low" style="padding:24px 28px;background-color:${C.surfaceLow} !important;background:${C.surfaceLow} !important;">
      <p style="font-family:'Be Vietnam Pro',sans-serif;font-size:10px;font-weight:700;color:${C.primaryContainer};letter-spacing:0.16em;text-transform:uppercase;margin:0 0 16px;">Highlights</p>
      ${bestLiftHtml}
    </div>
  ` : `
    <div class="gm-hero-inactive" style="padding:32px 28px 28px;background-color:${C.surfaceLow} !important;background:${C.surfaceLow} !important;">
      <p style="font-family:'Be Vietnam Pro',sans-serif;font-size:10px;font-weight:700;color:${C.onSurfaceVariant};letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">LAST WEEK'S REPORT</p>
      <h2 style="font-family:'Space Grotesk',sans-serif;font-size:28px;font-weight:900;color:${C.onSurface};letter-spacing:-0.03em;line-height:1.15;margin:0 0 8px;">No workouts last week.</h2>
      <p style="font-family:'Be Vietnam Pro',sans-serif;font-size:14px;color:${C.onSurfaceVariant};line-height:1.6;margin:0 0 24px;max-width:480px;">Consistency means showing up more often than not. One session this week resets the clock.</p>
      ${consistencyProtocol}
      <div style="background-color:${C.surfaceContainer};background:${C.surfaceContainer};border-radius:16px;padding:16px 20px;border-left:3px solid ${C.primaryContainer};margin-bottom:24px;">
        <p style="font-family:'Be Vietnam Pro',sans-serif;font-size:13px;color:${C.onSurface};line-height:1.6;margin:0 0 12px;"><strong>Your all-time best lifts:</strong></p>
        ${bestLiftHtml}
        <p style="font-family:'Be Vietnam Pro',sans-serif;font-size:13px;color:${C.onSurfaceVariant};line-height:1.6;margin:12px 0 0;">Strength declines after ~10 days of inactivity. Don't lose momentum.</p>
      </div>
      <a href="https://kaaya.fit/workout" style="display:inline-block;background-color:${C.primaryContainer};background:linear-gradient(135deg,${C.primary},${C.primaryContainer});color:${C.onPrimary};font-family:'Space Grotesk',sans-serif;font-size:14px;font-weight:700;padding:14px 32px;border-radius:16px;text-decoration:none;letter-spacing:0.04em;text-transform:uppercase;">Log a Workout</a>
    </div>
  `;

  let articlesHtml = '';
  articles.forEach(art => {
    articlesHtml += `
    <div style="padding:0 28px 16px;background-color:${C.surface};background:${C.surface};">
      <div style="background-color:${C.surfaceLow};background:${C.surfaceLow};border-radius:20px;overflow:hidden;">
        <img src="${escapeHtml(art.image)}" alt="Article image" style="width:100%;height:200px;object-fit:cover;display:block;" />
        <div style="padding:20px 24px 24px;">
          <div style="margin-bottom:12px;">
            <span style="display:inline-block;background-color:rgba(255,181,155,0.1);color:${C.primary};font-family:'Be Vietnam Pro',sans-serif;font-size:9px;font-weight:700;padding:5px 10px;border-radius:20px;letter-spacing:0.1em;text-transform:uppercase;border:1px solid rgba(255,181,155,0.2);margin-right:6px;">${escapeHtml(art.topic)}</span>
            <span style="display:inline-block;background-color:${C.surfaceHighest};background:${C.surfaceHighest};color:${C.onSurfaceVariant};font-family:'Be Vietnam Pro',sans-serif;font-size:9px;font-weight:700;padding:5px 10px;border-radius:20px;letter-spacing:0.1em;text-transform:uppercase;">Science</span>
          </div>
          <h4 style="font-family:'Space Grotesk',sans-serif;font-size:20px;font-weight:700;color:${C.onSurface};line-height:1.3;margin:0 0 10px;">${escapeHtml(art.title)}</h4>
          <p style="font-family:'Be Vietnam Pro',sans-serif;font-size:13px;color:${C.onSurfaceVariant};line-height:1.6;margin:0 0 14px;">${escapeHtml(art.desc)}</p>
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="padding-right:16px;"><a href="${escapeHtml(art.link)}" style="font-family:'Be Vietnam Pro',sans-serif;font-size:10px;color:${C.onSurfaceVariant};letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;">READ FULL ARTICLE →</a></td>
          </tr></table>
        </div>
      </div>
    </div>`;
  });

  const researchVault = `
    <!-- Research Vault Header -->
    <div style="padding:28px 28px 16px;background-color:${C.surface};background:${C.surface};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td><h3 style="font-family:'Space Grotesk',sans-serif;font-size:24px;font-weight:700;color:${C.onSurface};text-transform:uppercase;letter-spacing:-0.02em;margin:0;">Research Vault</h3></td>
        <td style="text-align:right;"><span style="font-family:'Be Vietnam Pro',sans-serif;font-size:10px;color:${C.onSurfaceVariant};letter-spacing:0.15em;text-transform:uppercase;">0${articles.length} NEW PAPERS</span></td>
      </tr></table>
    </div>
    ${articlesHtml}
    <!-- Last Week's Analytics (archive teaser) -->
    <div style="padding:0 28px 24px;background-color:${C.surface};background:${C.surface};">
      <div style="background-color:${C.surfaceLow};background:${C.surfaceLow};border-radius:20px;overflow:hidden;">
        <img src="${IMG_ARCHIVE}" alt="Previous edition analytics" style="width:100%;height:160px;object-fit:cover;display:block;filter:grayscale(100%);opacity:0.7;" />
        <div style="padding:20px 24px;">
          <h4 style="font-family:'Space Grotesk',sans-serif;font-size:20px;font-weight:700;color:${C.onSurface};text-transform:uppercase;margin:0 0 8px;">Last Week's Analytics</h4>
          <p style="font-family:'Be Vietnam Pro',sans-serif;font-size:13px;color:${C.onSurfaceVariant};line-height:1.6;margin:0 0 14px;">We analyzed performance of 5,000 elite athletes using the Kinetic methodology. Discover how neural drive impacts your RPE during high-volume hypertrophy blocks.</p>
          <a href="https://kaaya.fit/dashboard" style="display:inline-block;background-color:${C.surfaceHighest};background:${C.surfaceHighest};color:${C.onSurface};font-family:'Be Vietnam Pro',sans-serif;font-size:11px;font-weight:700;padding:10px 20px;border-radius:12px;text-decoration:none;letter-spacing:0.1em;text-transform:uppercase;">Review Archive</a>
        </div>
      </div>
    </div>
  `;

  return `<!DOCTYPE html><html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><meta name="color-scheme" content="dark only"><meta name="supported-color-schemes" content="dark only"><title>Kaaya Weekly Digest</title>
<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
<style>
:root{color-scheme:dark only !important;}
html,body,table,td,div,p,a,span,h1,h2,h3,h4{color-scheme:dark only !important;}
body{margin:0 !important;padding:0 !important;background-color:${C.surfaceLowest} !important;background:${C.surfaceLowest} !important;color:${C.onSurface} !important;}
/* Gmail dark mode override prevention */
u+.body{background-color:${C.surfaceLowest} !important;background:${C.surfaceLowest} !important;}
u+.body .gm-bg{background-color:${C.surfaceLowest} !important;}
u+.body .gm-surface{background-color:${C.surface} !important;}
u+.body .gm-surface-low{background-color:${C.surfaceLow} !important;}
u+.body .gm-surface-container{background-color:${C.surfaceContainer} !important;}
u+.body .gm-surface-highest{background-color:${C.surfaceHighest} !important;}
u+.body .gm-hero-active{background-color:${C.primaryContainer} !important;}
u+.body .gm-hero-inactive{background-color:${C.surfaceLow} !important;}
u+.body .gm-incentive{background-color:#1a1408 !important;}
/* Prevent auto dark mode in supported clients */
@media (prefers-color-scheme:dark){
  body,table,td,div{background-color:${C.surfaceLowest} !important;color:${C.onSurface} !important;}
}
</style>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700;900&family=Be+Vietnam+Pro:wght@400;600;700&display=swap" rel="stylesheet"></head>
<body class="body" bgcolor="${C.surfaceLowest}" style="margin:0 !important;padding:0 !important;background-color:${C.surfaceLowest} !important;background:${C.surfaceLowest} !important;color:${C.onSurface} !important;color-scheme:dark only !important;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
<!-- Preheader (hidden preview text) -->
<div style="display:none;font-size:1px;color:${C.surfaceLowest};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${workoutCount > 0 ? `${workoutCount} workouts last week` : 'Your weekly Kaaya digest is here'} &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;</div>
<!-- Outer wrapper table (Gmail-proof) -->
<table role="presentation" width="100%" bgcolor="${C.surfaceLowest}" cellpadding="0" cellspacing="0" border="0" class="gm-bg" style="background-color:${C.surfaceLowest} !important;background:${C.surfaceLowest} !important;width:100% !important;"><tr><td align="center" bgcolor="${C.surfaceLowest}" class="gm-bg" style="padding:20px 0;background-color:${C.surfaceLowest} !important;background:${C.surfaceLowest} !important;">
<!-- Inner wrapper table (second layer of protection) -->
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="gm-surface" style="max-width:600px;width:100%;background-color:${C.surface} !important;background:${C.surface} !important;border-radius:4px;overflow:hidden;"><tr><td bgcolor="${C.surface}" class="gm-surface" style="background-color:${C.surface} !important;background:${C.surface} !important;color:${C.onSurface} !important;">
  <!-- Header -->
  <div class="gm-bg" style="background-color:${C.surfaceLowest} !important;background:${C.surfaceLowest} !important;padding:24px 28px 20px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td><p style="font-family:'Be Vietnam Pro',sans-serif;font-size:10px;font-weight:700;color:${C.primaryContainer} !important;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 4px;">Weekly Digest</p><h1 style="font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:900;color:${C.onSurface} !important;letter-spacing:0.05em;font-style:italic;text-transform:uppercase;margin:0;">KAAYA</h1></td>
      <td style="text-align:right;vertical-align:top;"><p style="font-family:'Be Vietnam Pro',sans-serif;font-size:10px;color:rgba(227,191,179,0.5) !important;letter-spacing:0.1em;text-transform:uppercase;line-height:1.6;margin:0;">${weekRange}</p></td>
    </tr></table>
  </div>
  ${heroSection}
  
  <!-- Olympus League -->
  <div class="gm-surface-container" style="padding:20px 28px;background-color:${C.surfaceContainer} !important;background:${C.surfaceContainer} !important;">
    <div class="gm-surface-low" style="background-color:${C.surfaceLow} !important;background:${C.surfaceLow} !important;border-radius:24px;padding:20px 24px;">
      <p style="font-family:'Be Vietnam Pro',sans-serif;font-size:10px;color:${C.onSurfaceVariant} !important;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 4px;">Olympus League</p>
      <p style="font-family:'Space Grotesk',sans-serif;font-size:18px;font-weight:700;color:${C.onSurface} !important;margin:0;">${xpData.tier} <span style="font-size:13px;font-weight:400;color:${C.onSurfaceVariant} !important;">${xpData.xp.toLocaleString()} / ${xpData.nextXp.toLocaleString()} XP to ${xpData.nextTierName}</span></p>
      <div style="margin-top:12px;background-color:${C.surfaceLowest} !important;background:${C.surfaceLowest} !important;border-radius:6px;height:8px;overflow:hidden;">
        <div style="width:${xpData.progressPct}%;height:100%;background-color:${C.primaryContainer} !important;background:linear-gradient(135deg,${C.primary},${C.primaryContainer}) !important;border-radius:6px;"></div>
      </div>
      ${xpData.xpToGo > 0 ? `<p style="text-align:center;margin:12px 0 0;"><span style="display:inline-block;background-color:${C.surfaceHighest} !important;background:${C.surfaceHighest} !important;color:${C.onSurface} !important;font-family:'Be Vietnam Pro',sans-serif;font-size:12px;font-weight:700;padding:10px 24px;border-radius:12px;letter-spacing:0.06em;text-transform:uppercase;">${xpData.xpToGo.toLocaleString()} XP TO GO</span></p>` : ''}
    </div>
    <!-- Top 5 Incentive -->
    <div class="gm-incentive" style="margin-top:12px;background-color:#1a1408 !important;background:linear-gradient(135deg,#1a1408,#261d0a) !important;border-radius:20px;padding:20px 24px;border:1px solid rgba(255,193,7,0.25);">
      <p style="font-family:'Be Vietnam Pro',sans-serif;font-size:10px;font-weight:700;color:#FFD54F !important;letter-spacing:0.16em;text-transform:uppercase;margin:0 0 8px;">🏆 MONTHLY PRIZE POOL</p>
      <p style="font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:#FFFFFF !important;line-height:1.4;margin:0 0 10px;">Top 5 athletes this month win <span style="color:#FFD54F !important;">free supplements</span> — shipped to your door.</p>
      <p style="font-family:'Be Vietnam Pro',sans-serif;font-size:13px;color:rgba(255,255,255,0.7) !important;margin:0 0 14px;line-height:1.5;">Your rank: <strong style="color:#FFD54F !important;font-family:'Space Grotesk',sans-serif;font-size:15px;">#${leaderboardRank}</strong> of ${totalUsers} athletes${leaderboardRank <= 5 ? ' — <span style="color:#4CAF50 !important;">In the prize zone! 🔥</span>' : leaderboardRank <= 10 ? ' — almost there, keep pushing!' : ''}</p>
      <a href="https://kaaya.fit/dashboard" style="display:inline-block;background-color:#FFD54F !important;background:linear-gradient(135deg,#FFD54F,#FF8F00) !important;color:#1a1408 !important;font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:700;padding:10px 20px;border-radius:12px;text-decoration:none;letter-spacing:0.08em;text-transform:uppercase;">See Full Leaderboard →</a>
    </div>
  </div>

  ${researchVault}
  <!-- CTA -->
  <div class="gm-surface" style="padding:16px 28px 28px;text-align:center;background-color:${C.surface} !important;background:${C.surface} !important;">
    <a href="https://kaaya.fit/dashboard" style="display:inline-block;background-color:${C.surfaceHighest} !important;background:${C.surfaceHighest} !important;color:${C.onSurface} !important;font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:700;padding:14px 40px;border-radius:12px;text-decoration:none;letter-spacing:0.06em;text-transform:uppercase;">Open Dashboard</a>
  </div>
  <!-- Footer -->
  <div class="gm-bg" style="padding:20px 28px 28px;background-color:${C.surfaceLowest} !important;background:${C.surfaceLowest} !important;">
    <p style="font-family:'Be Vietnam Pro',sans-serif;font-size:10px;color:rgba(227,191,179,0.4) !important;text-align:center;line-height:1.8;margin:0;">You're receiving this because you train with Kaaya.<br><a href="https://kaaya.fit/profile" style="color:${C.onSurfaceVariant} !important;text-decoration:underline;">Manage preferences</a> · <a href="#" style="color:${C.onSurfaceVariant} !important;text-decoration:underline;">Unsubscribe</a></p>
  </div>
</td></tr></table>
</td></tr></table>
</body></html>`;
}

serve(async (req) => {
  try {
    let reqBody: any = {};
    if (req.method === "POST") {
      try { reqBody = await req.json(); } catch (e) { /* ignore */ }
    }
    
    // Check if it's a dry run
    const isDryRun = !!reqBody.dryRun;

    if (!isDryRun && !resendApiKey) throw new Error("RESEND_API_KEY is not configured");

    const supabase = createClient(supabaseUrl, supabaseKey);
    let emailsSent = 0;

    const { data: dbUsers, error: usersError } = await supabase.from("user_profiles").select("id, email, name");
    if (usersError) throw usersError;
    
    let users = dbUsers || [];
    
    if (reqBody.testEmail) {
      const testEmail = String(reqBody.testEmail).toLowerCase();
      const requestedUserId = reqBody.userId || reqBody.testUserId;
      const requestedName = String(reqBody.userName || reqBody.testUserName || "").toLowerCase();
      const selectedUser = users.find((u: any) => requestedUserId && u.id === requestedUserId)
        || users.find((u: any) => u.email?.toLowerCase() === testEmail)
        || users.find((u: any) => requestedName && u.name?.toLowerCase().includes(requestedName))
        || users.find((u: any) => u.name?.toLowerCase().includes("vishal"));
      if (selectedUser) {
        users = [{ ...selectedUser, email: reqBody.testEmail }];
      } else {
        users = [{ id: "test-dummy-id", email: reqBody.testEmail, name: "Test Athlete" }];
      }
    }

    if (!users || users.length === 0) return new Response("No users to email", { status: 200 });

    const requestedToday = reqBody.asOfDate ? new Date(reqBody.asOfDate) : null;
    const today = requestedToday && Number.isFinite(requestedToday.getTime()) ? requestedToday : new Date();
    const reportWeek = getPreviousWeekWindow(today);
    const monthWindow = getCurrentMonthWindow(today);
    const weekRange = reportWeek.weekRange;

    const articles = await fetchFitnessIntel();
    const errors = [];
    const diagnostics = [];

    // ── Compute global leaderboard for Top 5 incentive ──
    const { data: allXpRows } = await supabase
      .from("monthly_xp_cache").select("user_id, total_xp").eq("month", monthWindow.month);
    const xpMap = new Map<string, number>();
    for (const row of (allXpRows || [])) {
      xpMap.set(row.user_id, toNumber(row.total_xp));
    }
    // Also count users who have workout data but no cache entry yet
    const totalLeaderboardUsers = Math.max(users.length, xpMap.size);

    for (const user of users) {
      if (!user.email && !isDryRun) continue;

      const { data: allWorkouts } = await supabase
        .from("workout_logs").select("date, day_name, duration_minutes, exercises").eq("user_id", user.id).order('date', { ascending: false });
        
      const workouts = ((allWorkouts || []) as WorkoutRow[]).map((w) => ({ ...w, date: normalizeDate(w.date) }));
      const allWorkoutDates = workouts.map(w => normalizeDate(w.date));
      
      const weeklyWorkouts = workouts.filter((w) => isDateInRange(w.date, reportWeek.startDate, reportWeek.endDate));
      const workoutCount = weeklyWorkouts.length;
      const weeklyStats = getWeeklyStats(weeklyWorkouts);

      // Fetch dynamic XP Cache
      const { data: xpCache } = await supabase
        .from("monthly_xp_cache").select("*").eq("user_id", user.id).eq("month", monthWindow.month).maybeSingle();

      const monthlyWorkouts = workouts.filter((w) => isDateInRange(w.date, monthWindow.startDate, monthWindow.endDate));
      const liveWorkoutXP = calculateWorkoutXP(monthlyWorkouts);
      const cachedXP = toNumber(xpCache?.total_xp);
      const totalLiveXP = Object.values(liveWorkoutXP).reduce((a, b) => a + b, 0);
      const totalXP = Math.max(cachedXP, totalLiveXP);
      const xpData = getRankData(totalXP);

      const topLifts = workoutCount > 0
        ? getTopLiftsForWeek(weeklyWorkouts, 4)
        : getTopLiftsAllTime(workouts, xpCache || {}, 4);

      if (isDryRun) {
        diagnostics.push({
          user: user.name,
          email: user.email,
          weekRange: reportWeek.weekRange,
          workoutCount,
          totalXP,
          xpSource: cachedXP > totalLiveXP ? 'cache' : 'live',
          tier: xpData.tier,
          selectedLifts: topLifts,
        });
        continue;
      }

      // Compute this user's leaderboard rank
      const sortedXpList = Array.from(xpMap.entries())
        .map(([uid, xp]) => ({ uid, xp }))
        .sort((a, b) => b.xp - a.xp);
      // If user not in cache, they still get a rank (at the bottom)
      let userRank = sortedXpList.findIndex(r => r.uid === user.id) + 1;
      if (userRank === 0) userRank = sortedXpList.length + 1; // not cached yet
      // Ensure the user's live XP is considered
      if (totalXP > 0 && !xpMap.has(user.id)) {
        // Count how many have more XP
        userRank = sortedXpList.filter(r => r.xp > totalXP).length + 1;
      } else if (totalXP > (xpMap.get(user.id) || 0)) {
        // Live XP is higher than cached, recalculate
        userRank = sortedXpList.filter(r => r.uid !== user.id && r.xp > totalXP).length + 1;
      }

      const htmlContent = buildEmailHtml(
        workoutCount, weekRange, allWorkoutDates, reportWeek.startDate, reportWeek.endDate,
        articles, xpData, topLifts, weeklyStats, userRank, totalLeaderboardUsers
      );

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendApiKey}` },
        body: JSON.stringify({
          from: "Kaaya <updates@kaaya.fit>",
          to: user.email,
          subject: workoutCount > 0
            ? `${workoutCount} ${workoutCount === 1 ? "workout" : "workouts"} last week — your Kaaya digest`
            : "No workouts last week — your Kaaya digest",
          html: htmlContent,
        }),
      });

      if (res.ok) {
        emailsSent++;
        await supabase.from("notification_logs").insert({ user_id: user.id, type: "email_weekly", status: "sent" });
      } else {
        const errorText = await res.text();
        console.error(`Failed to send to ${user.email}: ${errorText}`);
        errors.push({ email: user.email, error: errorText });
      }
    }

    if (isDryRun) {
      return new Response(JSON.stringify({ success: true, dryRun: true, diagnostics }), {
        headers: { "Content-Type": "application/json" }, status: 200,
      });
    }

    return new Response(JSON.stringify({ success: true, emailsSent, errors }), {
      headers: { "Content-Type": "application/json" }, status: 200,
    });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
