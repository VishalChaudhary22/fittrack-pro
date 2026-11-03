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

// ── Research intel: Stronger By Science RSS, hardened (2026-11) ───────────
// The original version fetched with no User-Agent, no timeout and no
// status check, and silently substituted two hardcoded articles on any
// failure — in production the fetch never succeeded, so the same pair
// shipped every week from launch. This version sends a browser UA,
// times out at 10s, checks res.ok, takes the top 4 usable items and
// rotates the displayed pair by ISO week (so the section changes even
// when SBS has not published lately). On failure it falls back to a
// pool of real SBS articles — also rotated — and the caller reports
// which source was used, so a dead feed is never silent again.

const IMG_ARCHIVE = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
const FALLBACK_IMG = "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800";

type Article = { title: string; link: string; image: string; desc: string; topic: string; };
type IntelResult = { articles: Article[]; source: "rss" | "pool" };

// Real Stronger By Science articles (snapshot of their feed), used only
// when the live fetch fails. Rotated by week like the live picks.
const FALLBACK_POOL: Article[] = [
  {
    title: "Is the Correlation Between Hypertrophy and Strength Gains Stronger Than We Realized?",
    link: "https://www.strongerbyscience.com/correlation-strength-hypertrophy/",
    image: "https://www.strongerbyscience.com/wp-content/uploads/2026/05/image9.jpg",
    desc: "Hypertrophy probably contributes more to strength gains in new lifters than prior studies suggested \u2026 but the relationship is nowhere near as strong a...",
    topic: "Research",
  },
  {
    title: "Hold Still: What Does the Evidence Actually Say About Isometric Training for Strength and Hypertrophy?",
    link: "https://www.strongerbyscience.com/isometric-training/",
    image: "https://www.strongerbyscience.com/wp-content/uploads/2026/04/image.png",
    desc: "Resistance training is commonly performed dynamically using a full range of motion. Isometric training has long been thought to be inferior to dynamic...",
    topic: "Research",
  },
  {
    title: "High volume vs high intensity: which builds more muscle?",
    link: "https://www.strongerbyscience.com/high-volume-vs-high-intensity/",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800",
    desc: "Few topics in the fitness industry divide the community like this one. But what does the research actually say is best for hypertrophy?\nThe post High ...",
    topic: "Research",
  },
  {
    title: "Is lifting during pregnancy healthy?",
    link: "https://www.strongerbyscience.com/lifting-during-pregnancy/",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    desc: "A recently published systematic review and meta analysis involving 50 studies and over 47,000 participants looked at the effect of resistance training...",
    topic: "Research",
  },
  {
    title: "How does sleep deprivation affect your workouts?",
    link: "https://www.strongerbyscience.com/sleep-deprivation-affect-workouts/",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800",
    desc: "Can you still train effectively after a bad night, or is it better to rest and recover?\nThe post How does sleep deprivation affect your workouts? appe...",
    topic: "Research",
  },
  {
    title: "Can a little alcohol be healthy for lifters?",
    link: "https://www.strongerbyscience.com/alcohol-lifters/",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800",
    desc: "For decades, thanks to observational studies suggesting a J-shaped curve, light drinking was thought to have some protective benefits for the heart, w...",
    topic: "Research",
  },
];

function decodeEntities(s: string): string {
  return s.replace(/&amp;/g, "&").replace(/&#0?39;/g, "'").replace(/&#8217;/g, "’")
    .replace(/&#8220;/g, "“").replace(/&#8221;/g, "”").replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");
}

function isoWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const fDay = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - fDay + 3);
  return 1 + Math.round((date.getTime() - firstThursday.getTime()) / (7 * 24 * 3600 * 1000));
}

// Consecutive pairs, rotating by ISO week: (0,1), (2,3), ... then repeat.
function pickPair(items: Article[], when: Date): Article[] {
  const pairs = Math.max(1, Math.floor(items.length / 2));
  const idx = isoWeekNumber(when) % pairs;
  return items.slice(idx * 2, idx * 2 + 2);
}

async function fetchFitnessIntel(when: Date): Promise<IntelResult> {
  // SBS intermittently serves a bot-check page (HTTP 200, no <item> at all)
  // instead of the feed — observed repeatedly on 2026-11-03 — so one retry
  // is built in before falling back to the pool.
  for (let attempt = 1; attempt <= 2; attempt++) {
    const got = await tryFetchFeed();
    if (got) return { articles: pickPair(got, when), source: "rss" };
    if (attempt < 2) await new Promise((r) => setTimeout(r, 800));
  }
  return { articles: pickPair(FALLBACK_POOL, when), source: "pool" };
}

async function tryFetchFeed(): Promise<Article[] | null> {
  try {
    const res = await fetch("https://www.strongerbyscience.com/feed/", {
      headers: {
        // Browser UA only — do NOT send an RSS Accept header: SBS's server
        // answers 415 to `Accept: application/rss+xml,...` from some
        // clients (verified 2026-11-03). The runtime default (*/*) is fine.
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`SBS feed HTTP ${res.status}`);
    const text = await res.text();
    const parsed: Article[] = [];
    for (const item of text.split("<item>").slice(1)) {
      if (parsed.length >= 4) break;
      const cleanItem = item.split("</item>")[0];
      const titleMatch = cleanItem.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || cleanItem.match(/<title>(.*?)<\/title>/);
      const linkMatch = cleanItem.match(/<link>(.*?)<\/link>/);
      if (!titleMatch || !linkMatch) continue;
      const imgMatch = cleanItem.match(/<media:content.*?url="([^"]+)"/i)
        || cleanItem.match(/<enclosure.*?url="([^"]+)"/i)
        || cleanItem.match(/<content:encoded>[\s\S]*?src="([^"]+)"/i)
        || cleanItem.match(/<description>[\s\S]*?src="([^"]+)"/i);
      const descMatch = cleanItem.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i)
        || cleanItem.match(/<description>([\s\S]*?)<\/description>/i);
      const cleanDesc = descMatch ? decodeEntities(descMatch[1].replace(/<[^>]+>/g, "")).trim().substring(0, 150) + "..." : "New fitness research available.";
      parsed.push({
        title: decodeEntities(titleMatch[1]),
        link: linkMatch[1],
        image: imgMatch ? imgMatch[1] : FALLBACK_IMG,
        desc: cleanDesc,
        topic: "Research",
      });
    }
    if (parsed.length >= 2) return parsed;
    console.error(`SBS feed parsed only ${parsed.length} usable articles`);
    return null;
  } catch (e) {
    console.error("RSS fetch failed", e);
    return null;
  }
}

// ── Volt email palette (app dark tokens, src/ui/volt/volt.css) ──────────────
// The weekly digest follows the skin each user selected in the app
// (user_profiles.design_version): 'v1' gets the Original Kinetic ember
// identity, 'volt' the Volt blackboard identity, 'quest' the Quest arcade
// identity. Unknown/missing values fall back to Volt, the app default.
// Email is a dark-only design in every skin. The consistency-protocol
// helper in _shared keeps the V1 palette as its defaults; every skin
// passes its own theme here.
type SkinKey = "v1" | "volt" | "quest";
type EmailTheme = {
  skin: SkinKey;
  colors: {
    canvas: string; sheet: string; panel: string; inset: string;
    ink: string; dim: string; faint: string;
    volt: string; voltSoft: string; voltInk: string;
    hairline: string; gold: string;
    accentDim: string; onAccentDim: string; onAccentSoft: string; goldBorder: string;
  };
  fd: string; fm: string; fontsHref: string;
  radius: string; radiusSm: string; slotRadius: string; pillRadius: string;
  edgeCss: string; glow: string;
};
const SKIN_THEMES: Record<SkinKey, EmailTheme> = {
  volt: {
    skin: "volt",
    colors: {
      canvas: "#0a0a09", sheet: "#131311", panel: "#1a1a17", inset: "#0e0e0c",
      ink: "#f4f5e9", dim: "#b9bfa8", faint: "rgba(244,245,233,0.45)",
      volt: "#c9f158", voltSoft: "#e2fb8f", voltInk: "#141416",
      hairline: "#2c2c26", gold: "#ffc627",
      accentDim: "rgba(201,241,88,0.55)", onAccentDim: "rgba(20,20,22,0.65)",
      onAccentSoft: "rgba(20,20,22,0.75)", goldBorder: "rgba(255,198,39,0.4)",
    },
    fd: "'Archivo',Helvetica,Arial,sans-serif",
    fm: "'JetBrains Mono',Menlo,Consolas,monospace",
    fontsHref: "family=Archivo:wght@500;700;800;900&family=JetBrains+Mono:wght@500;700",
    radius: "20px", radiusSm: "16px", slotRadius: "12px", pillRadius: "999px",
    edgeCss: "2px solid #f4f5e9", glow: "rgba(201,241,88,0.35)",
  },
  v1: {
    skin: "v1",
    colors: {
      canvas: "#0e0e10", sheet: "#131315", panel: "#1b1b1d", inset: "#0e0e10",
      ink: "#e5e1e4", dim: "#e3bfb3", faint: "rgba(229,225,228,0.45)",
      volt: "#f85f1b", voltSoft: "#ffb59b", voltInk: "#201f21",
      hairline: "#353437", gold: "#ffb59b",
      accentDim: "rgba(255,181,155,0.6)", onAccentDim: "rgba(32,31,33,0.62)",
      onAccentSoft: "rgba(32,31,33,0.78)", goldBorder: "rgba(255,181,155,0.4)",
    },
    fd: "'Space Grotesk',Helvetica,Arial,sans-serif",
    fm: "'Be Vietnam Pro',Helvetica,Arial,sans-serif",
    fontsHref: "family=Space+Grotesk:wght@500;700&family=Be+Vietnam+Pro:wght@400;600;700",
    radius: "24px", radiusSm: "16px", slotRadius: "12px", pillRadius: "999px",
    edgeCss: "1px solid #353437", glow: "rgba(248,95,27,0.3)",
  },
  quest: {
    skin: "quest",
    colors: {
      canvas: "#14141f", sheet: "#1e1e30", panel: "#262640", inset: "#10101c",
      ink: "#f4f5e9", dim: "#8b8ba7", faint: "rgba(244,245,233,0.4)",
      volt: "#c9f158", voltSoft: "#e2fb8f", voltInk: "#14141f",
      hairline: "#000000", gold: "#ffc627",
      accentDim: "rgba(201,241,88,0.55)", onAccentDim: "rgba(20,20,31,0.65)",
      onAccentSoft: "rgba(20,20,31,0.78)", goldBorder: "rgba(255,198,39,0.55)",
    },
    fd: "'VT323','Courier New',monospace",
    fm: "'Press Start 2P','VT323',monospace",
    fontsHref: "family=Press+Start+2P&family=VT323",
    radius: "0px", radiusSm: "0px", slotRadius: "0px", pillRadius: "0px",
    edgeCss: "3px solid #000000", glow: "rgba(201,241,88,0.35)",
  },
};
function skinOf(value: unknown): SkinKey {
  return value === "v1" || value === "quest" ? value : "volt";
}
function themeForSkin(value: unknown): EmailTheme {
  return SKIN_THEMES[skinOf(value)];
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
  totalUsers: number,
  designVersion?: string | null
) {
  const T = themeForSkin(designVersion);
  const E = T.colors;
  const FD = T.fd;
  const FM = T.fm;
  const hasWorkedOut = workoutCount > 0;
  const consistencyProtocol = getConsistencyProtocolHtml(
    allWorkoutDates,
    weekStartDate,
    weekEndDate,
    E.panel,
    { accent: E.volt, accentSoft: E.voltSoft, onAccent: E.voltInk, idleBg: E.inset, glow: T.glow, label: E.dim, containerRadius: T.radius, displayFont: FD, bodyFont: FM },
  );
  const workoutLabel = workoutCount === 1 ? "1 workout logged." : `${workoutCount} workouts logged.`;

  const prItemsHtml = bestLifts.map(lift => `
      <div style="background-color:${E.panel};background:${E.panel};border:1px solid ${E.hairline};border-radius:${T.radiusSm};padding:16px 20px;margin-bottom:10px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td><p style="font-family:${FD};font-size:16px;font-weight:700;color:${E.ink};margin:0;">${escapeHtml(lift.name)}</p><p style="font-family:${FM};font-size:11px;color:${E.dim};margin:3px 0 0;text-transform:uppercase;">${escapeHtml(lift.day)}</p></td>
          <td style="text-align:right;"><p style="font-family:${FM};font-size:17px;font-weight:700;color:${E.volt};margin:0;">${escapeHtml(lift.summary)}</p></td>
        </tr></table>
      </div>
  `).join('');

  const bestLiftHtml = bestLifts.length > 0 ? prItemsHtml : `
      <div style="background-color:${E.panel};background:${E.panel};border:1px solid ${E.hairline};border-radius:${T.radiusSm};padding:16px 20px;margin-bottom:10px;">
        <p style="font-family:${FD};font-size:13px;color:${E.dim};margin:0;">No lifting data available.</p>
      </div>
  `;

  const statsCardsHtml = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="width:33%;padding-right:6px;">
        <div style="background-color:${E.voltInk};background:${E.voltInk};border-radius:${T.slotRadius};padding:14px 12px;">
          <div style="font-family:${FM};font-size:22px;font-weight:700;color:${E.volt};">${weeklyStats.volumeKg.toLocaleString("en-US")}</div>
          <div style="font-family:${FM};font-size:9px;color:${E.accentDim};margin-top:3px;letter-spacing:0.08em;text-transform:uppercase;">Volume (kg)</div>
        </div>
      </td>
      <td style="width:33%;padding:0 3px;">
        <div style="background-color:${E.voltInk};background:${E.voltInk};border-radius:${T.slotRadius};padding:14px 12px;">
          <div style="font-family:${FM};font-size:22px;font-weight:700;color:${E.volt};">${weeklyStats.trainedMuscles}</div>
          <div style="font-family:${FM};font-size:9px;color:${E.accentDim};margin-top:3px;letter-spacing:0.08em;text-transform:uppercase;">Body Parts</div>
        </div>
      </td>
      <td style="width:33%;padding-left:6px;">
        <div style="background-color:${E.voltInk};background:${E.voltInk};border-radius:${T.slotRadius};padding:14px 12px;">
          <div style="font-family:${FM};font-size:22px;font-weight:700;color:${E.volt};">${formatDuration(weeklyStats.durationMinutes)}</div>
          <div style="font-family:${FM};font-size:9px;color:${E.accentDim};margin-top:3px;letter-spacing:0.08em;text-transform:uppercase;">Training</div>
        </div>
      </td>
    </tr></table>
  `;

  const heroSection = hasWorkedOut ? `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${E.volt}" class="gm-volt" style="background-color:${E.volt} !important;padding:30px 28px 28px;">
      <p style="font-family:${FM};font-size:10px;font-weight:700;color:${E.onAccentDim};letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">Last Week's Report</p>
      <h2 style="font-family:${FD};font-size:32px;font-weight:900;color:${E.voltInk};letter-spacing:-0.02em;line-height:1.12;margin:0 0 6px;">${escapeHtml(workoutLabel)}</h2>
      <p style="font-family:${FD};font-size:15px;color:${E.onAccentSoft};line-height:1.5;margin:0 0 22px;">
        ${workoutCount >= 4 ? "You are in the top 12% of Kaaya Fit users this month." : "Keep building. Consistency compounds."}
      </p>
      ${statsCardsHtml}
    </td></tr></table>
  ` : `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${E.sheet}" class="gm-sheet" style="padding:30px 28px 26px;background-color:${E.sheet} !important;">
      <p style="font-family:${FM};font-size:10px;font-weight:700;color:${E.volt};letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">Last Week's Report</p>
      <h2 style="font-family:${FD};font-size:28px;font-weight:900;color:${E.ink};letter-spacing:-0.02em;line-height:1.15;margin:0 0 8px;">No workouts last week.</h2>
      <p style="font-family:${FD};font-size:14px;color:${E.dim};line-height:1.6;margin:0;max-width:480px;">Consistency means showing up more often than not. One session this week resets the clock.</p>
    </td></tr></table>
  `;

  const protocolSection = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${E.sheet}" class="gm-sheet" style="padding:22px 28px 2px;background-color:${E.sheet} !important;">
      ${consistencyProtocol}
    </td></tr></table>
  `;

  const liftsSection = hasWorkedOut ? `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${E.sheet}" class="gm-sheet" style="padding:10px 28px 8px;background-color:${E.sheet} !important;">
      <p style="font-family:${FM};font-size:10px;font-weight:700;color:${E.volt};letter-spacing:0.16em;text-transform:uppercase;margin:0 0 14px;">Highlights</p>
      ${bestLiftHtml}
    </td></tr></table>
  ` : `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${E.sheet}" class="gm-sheet" style="padding:10px 28px 8px;background-color:${E.sheet} !important;">
      <div style="background-color:${E.panel};background:${E.panel};border:1px solid ${E.hairline};border-left:3px solid ${E.volt};border-radius:${T.radiusSm};padding:18px 20px;">
        <p style="font-family:${FD};font-size:13px;color:${E.ink};line-height:1.6;margin:0 0 12px;"><strong>Your all-time best lifts:</strong></p>
        ${bestLiftHtml}
        <p style="font-family:${FD};font-size:13px;color:${E.dim};line-height:1.6;margin:12px 0 16px;">Strength declines after ~10 days of inactivity.</p>
        <a href="https://kaaya.fit/workout" style="display:inline-block;background-color:${E.volt};color:${E.voltInk};font-family:${FD};font-size:13px;font-weight:800;padding:13px 30px;border-radius:${T.pillRadius};text-decoration:none;letter-spacing:0.04em;text-transform:uppercase;">Log a Workout</a>
      </div>
    </td></tr></table>
  `;

  let articlesHtml = '';
  articles.forEach(art => {
    articlesHtml += `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${E.sheet}" class="gm-sheet" style="padding:0 28px 16px;background-color:${E.sheet} !important;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${E.panel}" class="gm-panel" style="background-color:${E.panel} !important;border:1px solid ${E.hairline};border-radius:${T.radius};overflow:hidden;">
        <img src="${escapeHtml(art.image)}" alt="Article image" style="width:100%;height:200px;object-fit:cover;display:block;" />
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${E.panel}" class="gm-panel" style="padding:20px 24px 24px;background-color:${E.panel} !important;">
          <div style="margin-bottom:12px;">
            <span style="display:inline-block;background-color:${E.volt};color:${E.voltInk};font-family:${FM};font-size:9px;font-weight:700;padding:5px 10px;border-radius:${T.pillRadius};letter-spacing:0.1em;text-transform:uppercase;margin-right:6px;">${escapeHtml(art.topic)}</span>
            <span style="display:inline-block;color:${E.dim};font-family:${FM};font-size:9px;font-weight:700;padding:5px 10px;border-radius:${T.pillRadius};letter-spacing:0.1em;text-transform:uppercase;border:1px solid ${E.hairline};">Science</span>
          </div>
          <h4 style="font-family:${FD};font-size:20px;font-weight:700;color:${E.ink};line-height:1.3;margin:0 0 10px;">${escapeHtml(art.title)}</h4>
          <p style="font-family:${FD};font-size:13px;color:${E.dim};line-height:1.6;margin:0 0 14px;">${escapeHtml(art.desc)}</p>
          <a href="${escapeHtml(art.link)}" style="font-family:${FM};font-size:10px;font-weight:700;color:${E.volt};letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;">Read Full Article →</a>
        </td></tr></table>
      </td></tr></table>
    </td></tr></table>`;
  });

  const researchVault = `
    <!-- Research Vault Header -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${E.sheet}" class="gm-sheet" style="padding:26px 28px 14px;background-color:${E.sheet} !important;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td><h3 style="font-family:${FD};font-size:24px;font-weight:800;color:${E.ink};text-transform:uppercase;letter-spacing:-0.01em;margin:0;">Research Vault</h3></td>
        <td style="text-align:right;"><span style="font-family:${FM};font-size:10px;color:${E.dim};letter-spacing:0.15em;text-transform:uppercase;">0${articles.length} New Papers</span></td>
      </tr></table>
    </td></tr></table>
    ${articlesHtml}
    <!-- Last Week's Analytics (archive teaser) -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${E.sheet}" class="gm-sheet" style="padding:0 28px 24px;background-color:${E.sheet} !important;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${E.panel}" class="gm-panel" style="background-color:${E.panel} !important;border:1px solid ${E.hairline};border-radius:${T.radius};overflow:hidden;">
        <img src="${IMG_ARCHIVE}" alt="Previous edition analytics" style="width:100%;height:160px;object-fit:cover;display:block;filter:grayscale(100%);opacity:0.7;" />
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${E.panel}" class="gm-panel" style="padding:20px 24px;background-color:${E.panel} !important;">
          <h4 style="font-family:${FD};font-size:20px;font-weight:700;color:${E.ink};text-transform:uppercase;margin:0 0 8px;">Last Week's Analytics</h4>
          <p style="font-family:${FD};font-size:13px;color:${E.dim};line-height:1.6;margin:0 0 14px;">We analyzed performance of 5,000 elite athletes using the Kinetic methodology. Discover how neural drive impacts your RPE during high-volume hypertrophy blocks.</p>
          <a href="https://kaaya.fit/" style="display:inline-block;background-color:${E.inset};color:${E.ink};font-family:${FM};font-size:11px;font-weight:700;padding:10px 20px;border-radius:${T.pillRadius};text-decoration:none;letter-spacing:0.1em;text-transform:uppercase;border:1px solid ${E.hairline};">Review Archive</a>
        </td></tr></table>
      </td></tr></table>
    </td></tr></table>
  `;

  return `<!DOCTYPE html><html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><meta name="color-scheme" content="dark only"><meta name="supported-color-schemes" content="dark only"><title>Kaaya Fit Weekly Digest</title>
<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
<style>
:root{color-scheme:dark only !important;}
html,body,table,td,div,p,a,span,h1,h2,h3,h4{color-scheme:dark only !important;}
body{margin:0 !important;padding:0 !important;background-color:${E.canvas} !important;background:${E.canvas} !important;color:${E.ink} !important;}
/* Gmail dark mode override prevention */
u+.body{background-color:${E.canvas} !important;background:${E.canvas} !important;}
u+.body .gm-bg{background-color:${E.canvas} !important;}
u+.body .gm-sheet{background-color:${E.sheet} !important;}
u+.body .gm-panel{background-color:${E.panel} !important;}
u+.body .gm-inset{background-color:${E.inset} !important;}
u+.body .gm-volt{background-color:${E.volt} !important;}
/* Prevent auto dark mode in supported clients */
@media (prefers-color-scheme:dark){
  body,table,td,div{background-color:${E.canvas} !important;color:${E.ink} !important;}
}
</style>
<link href="https://fonts.googleapis.com/css2?${T.fontsHref}&display=swap" rel="stylesheet"></head>
<body class="body" bgcolor="${E.canvas}" style="margin:0 !important;padding:0 !important;background-color:${E.canvas} !important;background:${E.canvas} !important;color:${E.ink} !important;color-scheme:dark only !important;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
<!-- Preheader (hidden preview text) -->
<div style="display:none;font-size:1px;color:${E.canvas};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${workoutCount > 0 ? `${workoutCount} workouts last week` : 'Your weekly Kaaya Fit digest is here'} &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;</div>
<!-- Outer wrapper table (Gmail-proof) -->
<table role="presentation" width="100%" bgcolor="${E.canvas}" cellpadding="0" cellspacing="0" border="0" class="gm-bg" style="background-color:${E.canvas} !important;background:${E.canvas} !important;width:100% !important;"><tr><td align="center" bgcolor="${E.canvas}" class="gm-bg" style="padding:20px 0;background-color:${E.canvas} !important;background:${E.canvas} !important;">
<!-- Inner sheet -->
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="gm-sheet" style="max-width:600px;width:100%;background-color:${E.sheet} !important;background:${E.sheet} !important;border:${T.edgeCss};border-radius:${T.radius};overflow:hidden;"><tr><td bgcolor="${E.sheet}" class="gm-sheet" style="background-color:${E.sheet} !important;background:${E.sheet} !important;color:${E.ink} !important;">
  <!-- Header -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${E.canvas}" class="gm-bg" style="background-color:${E.canvas} !important;padding:22px 28px 18px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td><p style="font-family:${FM};font-size:10px;font-weight:700;color:${E.volt} !important;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 5px;">Weekly Digest</p><h1 style="font-family:${FD};font-size:22px;font-weight:900;color:${E.ink} !important;letter-spacing:0.04em;text-transform:uppercase;margin:0;">Kaaya <span style="color:${E.volt};">Fit</span></h1></td>
      <td style="text-align:right;vertical-align:top;"><p style="font-family:${FM};font-size:10px;color:${E.dim} !important;letter-spacing:0.1em;text-transform:uppercase;line-height:1.6;margin:0;">${weekRange}</p></td>
    </tr></table>
  </td></tr></table>
  ${heroSection}
  ${protocolSection}
  ${liftsSection}

  <!-- Olympus League -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${E.sheet}" class="gm-sheet" style="padding:14px 28px 26px;background-color:${E.sheet} !important;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${E.panel}" class="gm-panel" style="background-color:${E.panel} !important;border:${T.edgeCss};border-radius:${T.radius};padding:20px 24px;">
      <p style="font-family:${FM};font-size:10px;color:${E.dim} !important;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 5px;">Olympus League</p>
      <p style="font-family:${FD};font-size:18px;font-weight:800;color:${E.ink} !important;margin:0;">${xpData.tier} <span style="font-family:${FM};font-size:12px;font-weight:500;color:${E.dim} !important;">${xpData.xp.toLocaleString()} / ${xpData.nextXp.toLocaleString()} XP to ${xpData.nextTierName}</span></p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${E.inset}" class="gm-inset" style="margin-top:12px;background-color:${E.inset} !important;border-radius:6px;height:8px;overflow:hidden;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:${xpData.progressPct}%;height:8px;"><tr><td bgcolor="${E.volt}" style="height:8px;background-color:${E.volt} !important;border-radius:6px;"></td></tr></table>
      </td></tr></table>
      ${xpData.xpToGo > 0 ? `<p style="text-align:center;margin:12px 0 0;"><span style="display:inline-block;background-color:${E.volt} !important;color:${E.voltInk} !important;font-family:${FM};font-size:11px;font-weight:700;padding:9px 22px;border-radius:${T.pillRadius};letter-spacing:0.06em;text-transform:uppercase;">${xpData.xpToGo.toLocaleString()} XP to go</span></p>` : ''}
    </td></tr></table>
    <!-- Top 5 Incentive -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;"><tr><td bgcolor="${E.panel}" class="gm-panel" style="background-color:${E.panel} !important;border-radius:${T.radius};padding:20px 24px;border:1px solid ${E.goldBorder};">
      <p style="font-family:${FM};font-size:10px;font-weight:700;color:${E.gold} !important;letter-spacing:0.16em;text-transform:uppercase;margin:0 0 8px;">Monthly Prize Pool</p>
      <p style="font-family:${FD};font-size:16px;font-weight:700;color:${E.ink} !important;line-height:1.4;margin:0 0 10px;">Top 5 athletes this month win <span style="color:${E.gold} !important;">free supplements</span> — shipped to your door.</p>
      <p style="font-family:${FD};font-size:13px;color:${E.dim} !important;margin:0 0 14px;line-height:1.5;">Your rank: <strong style="color:${E.gold} !important;font-family:${FM};font-size:15px;">#${leaderboardRank}</strong> of ${totalUsers} athletes${leaderboardRank <= 5 ? ' — <span style="color:' + E.volt + ' !important;">In the prize zone!</span>' : leaderboardRank <= 10 ? ' — almost there, keep pushing!' : ''}</p>
      <a href="https://kaaya.fit/" style="display:inline-block;background-color:transparent !important;color:${E.gold} !important;font-family:${FM};font-size:11px;font-weight:700;padding:10px 20px;border-radius:${T.pillRadius};text-decoration:none;letter-spacing:0.08em;text-transform:uppercase;border:1px solid ${E.gold};">See Full Leaderboard →</a>
    </td></tr></table>
  </td></tr></table>

  ${researchVault}
  <!-- CTA -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${E.sheet}" class="gm-sheet" style="padding:6px 28px 30px;text-align:center;background-color:${E.sheet} !important;">
    <a href="https://kaaya.fit/" style="display:inline-block;background-color:${E.volt} !important;color:${E.voltInk} !important;font-family:${FD};font-size:13px;font-weight:800;padding:14px 40px;border-radius:${T.pillRadius};text-decoration:none;letter-spacing:0.06em;text-transform:uppercase;">Open Dashboard</a>
  </td></tr></table>
  <!-- Footer -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${E.canvas}" class="gm-bg" style="padding:20px 28px 26px;background-color:${E.canvas} !important;">
    <p style="font-family:${FM};font-size:10px;color:${E.faint} !important;text-align:center;line-height:1.8;margin:0;">You receive this because you train with Kaaya Fit.<br><a href="https://kaaya.fit/profile" style="color:${E.dim} !important;text-decoration:underline;">Manage preferences</a> · <a href="#" style="color:${E.dim} !important;text-decoration:underline;">Unsubscribe</a></p>
  </td></tr></table>
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

    // Fetch all profiles
    const { data: dbUsers, error: usersError } = await supabase.from("user_profiles").select("id, email, name, design_version");
    if (usersError) throw usersError;

    // Fetch emails from auth.users so each user gets their own data
    const { data: { users: authUsers } } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    const authEmailMap = new Map<string, string>();
    for (const au of (authUsers || [])) {
      if (au.email) authEmailMap.set(au.id, au.email);
    }

    // Merge auth emails into profiles
    let users = (dbUsers || []).map((u: any) => ({
      ...u,
      email: u.email || authEmailMap.get(u.id) || null,
    }));
    
    if (reqBody.testEmail) {
      const testEmail = String(reqBody.testEmail).toLowerCase();
      const requestedUserId = reqBody.userId || reqBody.testUserId;

      // Strategy 1: explicit userId provided
      let selectedUser = requestedUserId
        ? users.find((u: any) => u.id === requestedUserId)
        : null;

      // Strategy 2: find the auth user by email, then match profile
      if (!selectedUser) {
        const authUser = (authUsers || []).find(au => au.email?.toLowerCase() === testEmail);
        if (authUser) {
          selectedUser = users.find((u: any) => u.id === authUser.id);
        }
      }

      // Strategy 3: check profile email column
      if (!selectedUser) {
        selectedUser = users.find((u: any) => u.email?.toLowerCase() === testEmail);
      }

      if (selectedUser) {
        users = [{ ...selectedUser, email: testEmail }];
      } else {
        users = [{ id: "test-dummy-id", email: testEmail, name: "Test Athlete", design_version: "volt" }];
      }
      // Optional skin override for test sends: { testEmail, skin: "quest" }
      if (reqBody.skin) {
        users = users.map((u: any) => ({ ...u, design_version: String(reqBody.skin) }));
      }
    } else {
      // Normal flow: only send to users who have an email
      users = users.filter((u: any) => u.email);
    }

    if (!users || users.length === 0) return new Response("No users to email", { status: 200 });

    const requestedToday = reqBody.asOfDate ? new Date(reqBody.asOfDate) : null;
    const today = requestedToday && Number.isFinite(requestedToday.getTime()) ? requestedToday : new Date();
    const reportWeek = getPreviousWeekWindow(today);
    const monthWindow = getCurrentMonthWindow(today);
    const weekRange = reportWeek.weekRange;

    const intel = await fetchFitnessIntel(today);
    const articles = intel.articles;
    console.log(`Research intel source: ${intel.source} — ${articles.map((a) => a.title).join(" | ")}`);
    const errors = [];
    const diagnostics = [];
    const skinCounts: Record<SkinKey, number> = { v1: 0, volt: 0, quest: 0 };
    for (const u of users) skinCounts[skinOf((u as any).design_version)]++;

    // ── Compute global leaderboard for Top 5 incentive ──
    const { data: allXpRows } = await supabase
      .from("monthly_xp_cache").select("user_id, total_xp").eq("month", monthWindow.month);
    const xpMap = new Map<string, number>();
    for (const row of (allXpRows || [])) {
      xpMap.set(row.user_id, toNumber(row.total_xp));
    }
    // Also count users who have workout data but no cache entry yet
    const totalLeaderboardUsers = Math.max((dbUsers || []).length, xpMap.size);

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
          designVersion: skinOf((user as any).design_version),
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
        articles, xpData, topLifts, weeklyStats, userRank, totalLeaderboardUsers,
        (user as any).design_version
      );

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendApiKey}` },
        body: JSON.stringify({
          from: "Kaaya Fit <updates@kaaya.fit>",
          to: user.email,
          subject: workoutCount > 0
            ? `${workoutCount} ${workoutCount === 1 ? "workout" : "workouts"} last week — your Kaaya Fit digest`
            : "No workouts last week — your Kaaya Fit digest",
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
      return new Response(JSON.stringify({ success: true, dryRun: true, articlesSource: intel.source, articleTitles: articles.map((a) => a.title), skinCounts, diagnostics }), {
        headers: { "Content-Type": "application/json" }, status: 200,
      });
    }

    return new Response(JSON.stringify({ success: true, emailsSent, errors, articlesSource: intel.source, articleTitles: articles.map((a) => a.title), skinCounts }), {
      headers: { "Content-Type": "application/json" }, status: 200,
    });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
