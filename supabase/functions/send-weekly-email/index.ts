import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const resendApiKey = Deno.env.get("RESEND_API_KEY") || "";
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// ── Research article images (from newsletter/code.html Google CDN) ──
const IMG_TRAINING = "https://lh3.googleusercontent.com/aida-public/AB6AXuBJGY2ydexvDI9csFyDkG2Xn_3xs1IBwl1sqHSlZim5iKWsjtywGNfV-FYcBGSiNTjmjqIu9_TqCoGJc0TtA5xHUWT8XF-VH8oUC_wAtdxu5_4E21KeWTnngB8d6HowX9NYLtEGu6vEf_AuLIcCwqv63Sl_oOzifowidZr1VymDM9fK1n-eUkMDgeR5RewW1_u3XvRpbYRRUoka3vsiBsDi2Ivrt4kAClV2WRd3EOY-Zwz2vUNOKSgSQtuD7pTRYK2crnKH3jzrAaAL";
const IMG_NEURAL = "https://lh3.googleusercontent.com/aida-public/AB6AXuCPsFjojvlO3f0CM3Cm3mj33k123hteCivz0bdJK2pnt4XzG4_kR73MKGs3-dCFSQ6VZE70OF-OlgwAw8uJYP4YH3_u8VYgK3aDdkEfS6rBFRabCgko7roPjgemIWOAvf44xvOI8BZE7ShmwaGvFVawCFI7wfHXKLsX_hklCwNfNRA2Y7ICP5QVF6KqgSy1J7n1Nqc6o7fKUzPteuT-8CSpz9kY8PPM8YWu8wrT406VBaimjbwzty-9fiesmw33cFWBokhBYsVqcYaB";
const IMG_ARCHIVE = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

// ── Color tokens (Kinetic Elite / Obsidian Performance) ──
const C = {
  surface: "#131315", surfaceLowest: "#0e0e10", surfaceLow: "#1b1b1d",
  surfaceContainer: "#201f21", surfaceHigh: "#2a2a2c", surfaceHighest: "#353437",
  onSurface: "#e5e1e4", onSurfaceVariant: "#e3bfb3",
  primary: "#ffb59b", primaryContainer: "#f85f1b", onPrimary: "#5b1a00",
};

// ── Types ──
type Article = {
  title: string;
  link: string;
  image: string;
  desc: string;
  topic: string;
};

// ── Helpers ──
function getConsistencyProtocolHtml(workoutDates: string[], today: Date) {
  // 1. Calculate streak
  let streak = 0;
  const uniqueDates = [...new Set(workoutDates)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  let currentDate = new Date(today);
  currentDate.setHours(0,0,0,0);
  
  let hasWorkedOutToday = uniqueDates.includes(currentDate.toISOString().split('T')[0]);
  let yesterday = new Date(currentDate);
  yesterday.setDate(yesterday.getDate() - 1);
  let hasWorkedOutYesterday = uniqueDates.includes(yesterday.toISOString().split('T')[0]);
  
  if (hasWorkedOutToday || hasWorkedOutYesterday) {
    let tempDate = hasWorkedOutToday ? new Date(currentDate) : new Date(yesterday);
    for (const dateStr of uniqueDates) {
      if (dateStr === tempDate.toISOString().split('T')[0]) {
        streak++;
        tempDate.setDate(tempDate.getDate() - 1);
      } else if (new Date(dateStr) < tempDate) {
        break;
      }
    }
  }

  // 2. Build bubbles for the past 7 days (e.g. Mon-Sun if run on Monday)
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const bubblesHtml = [];
  
  for (let i = 7; i >= 1; i--) {
    let d = new Date(today);
    d.setDate(d.getDate() - i);
    const dStr = d.toISOString().split('T')[0];
    const isChecked = uniqueDates.includes(dStr);
    const dayLabel = days[d.getDay()];

    let bubble;
    if (isChecked) {
      bubble = `<div style="width:36px;height:36px;border-radius:18px;background:linear-gradient(135deg,${C.primary},${C.primaryContainer});margin:0 auto;line-height:36px;color:${C.onPrimary};font-size:14px;box-shadow:0 0 10px rgba(248,95,27,0.3);">✓</div>`;
    } else {
      bubble = `<div style="width:36px;height:36px;border-radius:18px;background:${C.surfaceLowest};margin:0 auto;"></div>`;
    }

    bubblesHtml.push(`
      <td style="width:14.28%;">
        <div style="font-family:'Be Vietnam Pro',sans-serif;font-size:10px;font-weight:700;color:${isChecked ? C.primaryContainer : C.onSurfaceVariant};margin-bottom:8px;">${dayLabel}</div>
        ${bubble}
      </td>
    `);
  }

  return `
    <!-- Consistency Protocol -->
    <div style="padding:24px;background:${C.surfaceLow};border-radius:24px;margin-bottom:24px;border:1px solid rgba(255,255,255,0.03);">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;"><tr>
        <td>
          <div style="font-family:'Be Vietnam Pro',sans-serif;font-size:11px;font-weight:700;color:${C.onSurfaceVariant};letter-spacing:0.16em;text-transform:uppercase;">Consistency Protocol</div>
        </td>
        <td style="text-align:right;">
          <div style="font-family:'Space Grotesk',sans-serif;font-size:24px;font-weight:900;color:${C.primary};letter-spacing:-0.02em;">${streak} DAYS</div>
        </td>
      </tr></table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="text-align:center;"><tr>
        ${bubblesHtml.join('')}
      </tr></table>
    </div>
  `;
}

async function fetchFitnessIntel(): Promise<Article[]> {
  const articles: Article[] = [];
  try {
    const res = await fetch("https://www.strongerbyscience.com/feed/");
    const text = await res.text();
    const items = text.split("<item>").slice(1, 3); // top 2
    
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

function buildEmailHtml(user: { name?: string }, workoutCount: number, weekRange: string, allWorkoutDates: string[], today: Date, articles: Article[]) {
  const userName = user.name || "Athlete";
  const hasWorkedOut = workoutCount > 0;
  const consistencyProtocol = getConsistencyProtocolHtml(allWorkoutDates, today);

  // ── Workout Report Hero (from workout log/code.html) ──
  const heroSection = hasWorkedOut ? `
    <div style="background:linear-gradient(135deg,${C.primary},${C.primaryContainer});padding:32px 28px 28px;">
      <p style="font-family:'Be Vietnam Pro',sans-serif;font-size:10px;font-weight:700;color:${C.onPrimary};letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">THIS WEEK'S REPORT</p>
      <h2 style="font-family:'Space Grotesk',sans-serif;font-size:32px;font-weight:900;color:#fff;letter-spacing:-0.03em;line-height:1.15;margin:0 0 4px;">${workoutCount} workouts logged.</h2>
      <p style="font-family:'Be Vietnam Pro',sans-serif;font-size:15px;color:rgba(255,255,255,0.8);line-height:1.5;margin:0 0 24px;">
        ${workoutCount >= 4 ? "You're in the top 12% of FitTrack users this month." : "Keep building. Consistency compounds."}
      </p>
      ${consistencyProtocol}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="width:33%;padding-right:6px;">
          <div style="background:rgba(255,255,255,0.1);border-radius:12px;padding:14px 12px;border:1px solid rgba(255,255,255,0.2);">
            <p style="font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:700;color:#fff;margin:0;">12,480</p>
            <p style="font-family:'Be Vietnam Pro',sans-serif;font-size:9px;color:rgba(255,255,255,0.6);margin:3px 0 0;letter-spacing:0.08em;text-transform:uppercase;">Volume (kg)</p>
          </div>
        </td>
        <td style="width:33%;padding:0 3px;">
          <div style="background:rgba(255,255,255,0.1);border-radius:12px;padding:14px 12px;border:1px solid rgba(255,255,255,0.2);">
            <p style="font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:700;color:#fff;margin:0;">2</p>
            <p style="font-family:'Be Vietnam Pro',sans-serif;font-size:9px;color:rgba(255,255,255,0.6);margin:3px 0 0;letter-spacing:0.08em;text-transform:uppercase;">New PRs Set</p>
          </div>
        </td>
        <td style="width:33%;padding-left:6px;">
          <div style="background:rgba(255,255,255,0.1);border-radius:12px;padding:14px 12px;border:1px solid rgba(255,255,255,0.2);">
            <p style="font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:700;color:#fff;margin:0;">3h 12m</p>
            <p style="font-family:'Be Vietnam Pro',sans-serif;font-size:9px;color:rgba(255,255,255,0.6);margin:3px 0 0;letter-spacing:0.08em;text-transform:uppercase;">Training</p>
          </div>
        </td>
      </tr></table>
    </div>
    <!-- Personal Records -->
    <div style="padding:24px 28px;background:${C.surfaceLow};">
      <p style="font-family:'Be Vietnam Pro',sans-serif;font-size:10px;font-weight:700;color:${C.primaryContainer};letter-spacing:0.16em;text-transform:uppercase;margin:0 0 16px;">Personal Records</p>
      <div style="background:${C.surfaceContainer};border-radius:16px;padding:16px 20px;margin-bottom:10px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td><p style="font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:${C.onSurface};margin:0;">Bench Press</p><p style="font-family:'Be Vietnam Pro',sans-serif;font-size:11px;color:${C.onSurfaceVariant};margin:2px 0 0;">Upper A · Wednesday</p></td>
          <td style="text-align:right;"><p style="font-family:'Space Grotesk',sans-serif;font-size:18px;font-weight:700;color:${C.onSurface};margin:0;">85 kg × 6</p><p style="font-family:'Be Vietnam Pro',sans-serif;font-size:10px;font-weight:600;color:${C.primaryContainer};margin:2px 0 0;">↑ 2.5 kg from last week</p></td>
        </tr></table>
      </div>
      <div style="background:${C.surfaceContainer};border-radius:16px;padding:16px 20px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td><p style="font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:${C.onSurface};margin:0;">Romanian Deadlift</p><p style="font-family:'Be Vietnam Pro',sans-serif;font-size:11px;color:${C.onSurfaceVariant};margin:2px 0 0;">Lower A · Thursday</p></td>
          <td style="text-align:right;"><p style="font-family:'Space Grotesk',sans-serif;font-size:18px;font-weight:700;color:${C.onSurface};margin:0;">100 kg × 8</p><p style="font-family:'Be Vietnam Pro',sans-serif;font-size:10px;font-weight:600;color:${C.primaryContainer};margin:2px 0 0;">↑ 5 kg from last week</p></td>
        </tr></table>
      </div>
    </div>
    <!-- Olympus League -->
    <div style="padding:20px 28px;background:${C.surfaceContainer};">
      <div style="background:${C.surfaceLow};border-radius:24px;padding:20px 24px;">
        <p style="font-family:'Be Vietnam Pro',sans-serif;font-size:10px;color:${C.onSurfaceVariant};letter-spacing:0.12em;text-transform:uppercase;margin:0 0 4px;">Olympus League</p>
        <p style="font-family:'Space Grotesk',sans-serif;font-size:18px;font-weight:700;color:${C.onSurface};margin:0;">Silver II <span style="font-size:13px;font-weight:400;color:${C.onSurfaceVariant};">1,240 / 1,500 XP to Gold</span></p>
        <div style="margin-top:12px;background:${C.surfaceLowest};border-radius:6px;height:8px;overflow:hidden;">
          <div style="width:83%;height:100%;background:linear-gradient(135deg,${C.primary},${C.primaryContainer});border-radius:6px;"></div>
        </div>
        <p style="text-align:center;margin:12px 0 0;"><span style="display:inline-block;background:${C.surfaceHighest};color:${C.onSurface};font-family:'Be Vietnam Pro',sans-serif;font-size:12px;font-weight:700;padding:10px 24px;border-radius:12px;letter-spacing:0.06em;text-transform:uppercase;">260 XP TO GO</span></p>
      </div>
    </div>
  ` : `
    <div style="padding:32px 28px 28px;background:${C.surfaceLow};">
      <p style="font-family:'Be Vietnam Pro',sans-serif;font-size:10px;font-weight:700;color:${C.onSurfaceVariant};letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">THIS WEEK'S REPORT</p>
      <h2 style="font-family:'Space Grotesk',sans-serif;font-size:28px;font-weight:900;color:${C.onSurface};letter-spacing:-0.03em;line-height:1.15;margin:0 0 8px;">No workouts this week.</h2>
      <p style="font-family:'Be Vietnam Pro',sans-serif;font-size:14px;color:${C.onSurfaceVariant};line-height:1.6;margin:0 0 24px;max-width:480px;">Consistency means showing up more often than not. One session this week resets the clock.</p>
      ${consistencyProtocol}
      <div style="background:${C.surfaceContainer};border-radius:16px;padding:16px 20px;border-left:3px solid ${C.primaryContainer};margin-bottom:24px;">
        <p style="font-family:'Be Vietnam Pro',sans-serif;font-size:13px;color:${C.onSurface};line-height:1.6;margin:0;"><strong>Your last best lift:</strong> Bench Press at 82.5 kg × 6<br><span style="color:${C.onSurfaceVariant};">Strength declines after ~10 days of inactivity. Don't lose momentum.</span></p>
      </div>
      <a href="https://fittrack-pro.vercel.app/workout" style="display:inline-block;background:linear-gradient(135deg,${C.primary},${C.primaryContainer});color:${C.onPrimary};font-family:'Space Grotesk',sans-serif;font-size:14px;font-weight:700;padding:14px 32px;border-radius:16px;text-decoration:none;letter-spacing:0.04em;text-transform:uppercase;">Log a Workout</a>
    </div>
    <div style="padding:20px 28px;background:${C.surfaceContainer};">
      <div style="background:${C.surfaceLow};border-radius:24px;padding:20px 24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td><p style="font-family:'Be Vietnam Pro',sans-serif;font-size:10px;color:${C.onSurfaceVariant};letter-spacing:0.12em;text-transform:uppercase;margin:0 0 4px;">Olympus League</p><p style="font-family:'Space Grotesk',sans-serif;font-size:18px;font-weight:700;color:${C.onSurface};margin:0;">Silver II <span style="font-size:13px;font-weight:400;color:${C.onSurfaceVariant};">· 1,240 XP</span></p></td>
          <td style="text-align:right;"><p style="font-family:'Be Vietnam Pro',sans-serif;font-size:11px;color:${C.onSurfaceVariant};margin:0;">No XP earned</p></td>
        </tr></table>
      </div>
    </div>
  `;

  // ── Research Vault (from newsletter/code.html — dynamic via RSS) ──
  let articlesHtml = '';
  articles.forEach(art => {
    articlesHtml += `
    <div style="padding:0 28px 16px;background:${C.surface};">
      <div style="background:${C.surfaceLow};border-radius:20px;overflow:hidden;">
        <img src="${art.image}" alt="Article image" style="width:100%;height:200px;object-fit:cover;display:block;" />
        <div style="padding:20px 24px 24px;">
          <div style="margin-bottom:12px;">
            <span style="display:inline-block;background:rgba(255,181,155,0.1);color:${C.primary};font-family:'Be Vietnam Pro',sans-serif;font-size:9px;font-weight:700;padding:5px 10px;border-radius:20px;letter-spacing:0.1em;text-transform:uppercase;border:1px solid rgba(255,181,155,0.2);margin-right:6px;">${art.topic}</span>
            <span style="display:inline-block;background:${C.surfaceHighest};color:${C.onSurfaceVariant};font-family:'Be Vietnam Pro',sans-serif;font-size:9px;font-weight:700;padding:5px 10px;border-radius:20px;letter-spacing:0.1em;text-transform:uppercase;">Science</span>
          </div>
          <h4 style="font-family:'Space Grotesk',sans-serif;font-size:20px;font-weight:700;color:${C.onSurface};line-height:1.3;margin:0 0 10px;">${art.title}</h4>
          <p style="font-family:'Be Vietnam Pro',sans-serif;font-size:13px;color:${C.onSurfaceVariant};line-height:1.6;margin:0 0 14px;">${art.desc}</p>
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="padding-right:16px;"><a href="${art.link}" style="font-family:'Be Vietnam Pro',sans-serif;font-size:10px;color:${C.onSurfaceVariant};letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;">READ FULL ARTICLE →</a></td>
          </tr></table>
        </div>
      </div>
    </div>`;
  });

  const researchVault = `
    <!-- Research Vault Header -->
    <div style="padding:28px 28px 16px;background:${C.surface};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td><h3 style="font-family:'Space Grotesk',sans-serif;font-size:24px;font-weight:700;color:${C.onSurface};text-transform:uppercase;letter-spacing:-0.02em;margin:0;">Research Vault</h3></td>
        <td style="text-align:right;"><span style="font-family:'Be Vietnam Pro',sans-serif;font-size:10px;color:${C.onSurfaceVariant};letter-spacing:0.15em;text-transform:uppercase;">0${articles.length} NEW PAPERS</span></td>
      </tr></table>
    </div>

    ${articlesHtml}

    <!-- Last Week's Analytics (archive teaser from newsletter/code.html) -->
    <div style="padding:0 28px 24px;background:${C.surface};">
      <div style="background:${C.surfaceLow};border-radius:20px;overflow:hidden;">
        <img src="${IMG_ARCHIVE}" alt="Previous edition analytics" style="width:100%;height:160px;object-fit:cover;display:block;filter:grayscale(100%);opacity:0.7;" />
        <div style="padding:20px 24px;">
          <h4 style="font-family:'Space Grotesk',sans-serif;font-size:20px;font-weight:700;color:${C.onSurface};text-transform:uppercase;margin:0 0 8px;">Last Week's Analytics</h4>
          <p style="font-family:'Be Vietnam Pro',sans-serif;font-size:13px;color:${C.onSurfaceVariant};line-height:1.6;margin:0 0 14px;">We analyzed performance of 5,000 elite athletes using the Kinetic methodology. Discover how neural drive impacts your RPE during high-volume hypertrophy blocks.</p>
          <a href="https://fittrack-pro.vercel.app/dashboard" style="display:inline-block;background:${C.surfaceHighest};color:${C.onSurface};font-family:'Be Vietnam Pro',sans-serif;font-size:11px;font-weight:700;padding:10px 20px;border-radius:12px;text-decoration:none;letter-spacing:0.1em;text-transform:uppercase;">Review Archive</a>
        </div>
      </div>
    </div>
  `;

  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700;900&family=Be+Vietnam+Pro:wght@400;600;700&display=swap" rel="stylesheet"></head>
<body style="margin:0;padding:0;background:${C.surfaceLowest};">
<div style="max-width:600px;margin:0 auto;background:${C.surface};overflow:hidden;">
  <!-- Header -->
  <div style="background:${C.surfaceLowest};padding:24px 28px 20px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td><p style="font-family:'Be Vietnam Pro',sans-serif;font-size:10px;font-weight:700;color:${C.primaryContainer};letter-spacing:0.2em;text-transform:uppercase;margin:0 0 4px;">Weekly Digest</p><h1 style="font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:900;color:${C.onSurface};letter-spacing:0.05em;font-style:italic;text-transform:uppercase;margin:0;">FITTRACK PRO</h1></td>
      <td style="text-align:right;vertical-align:top;"><p style="font-family:'Be Vietnam Pro',sans-serif;font-size:10px;color:rgba(227,191,179,0.5);letter-spacing:0.1em;text-transform:uppercase;line-height:1.6;margin:0;">${weekRange}</p></td>
    </tr></table>
  </div>
  ${heroSection}
  ${researchVault}
  <!-- CTA -->
  <div style="padding:16px 28px 28px;text-align:center;background:${C.surface};">
    <a href="https://fittrack-pro.vercel.app/dashboard" style="display:inline-block;background:${C.surfaceHighest};color:${C.onSurface};font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:700;padding:14px 40px;border-radius:12px;text-decoration:none;letter-spacing:0.06em;text-transform:uppercase;">Open Dashboard</a>
  </div>
  <!-- Footer -->
  <div style="padding:20px 28px 28px;background:${C.surfaceLowest};">
    <p style="font-family:'Be Vietnam Pro',sans-serif;font-size:10px;color:rgba(227,191,179,0.4);text-align:center;line-height:1.8;margin:0;">You're receiving this because you train with FitTrack Pro.<br><a href="https://fittrack-pro.vercel.app/profile" style="color:${C.onSurfaceVariant};text-decoration:underline;">Manage preferences</a> · <a href="#" style="color:${C.onSurfaceVariant};text-decoration:underline;">Unsubscribe</a></p>
  </div>
</div>
</body></html>`;
}

serve(async (req) => {
  try {
    if (!resendApiKey) throw new Error("RESEND_API_KEY is not configured");

    const supabase = createClient(supabaseUrl, supabaseKey);
    let emailsSent = 0;

    const { data: users, error: usersError } = await supabase
      .from("user_profiles").select("id, email, name").not("email", "is", null);

    if (usersError) throw usersError;
    if (!users || users.length === 0) return new Response("No users to email", { status: 200 });

    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    const dateStr = sevenDaysAgo.toISOString().split("T")[0];

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const weekRange = `${monthNames[sevenDaysAgo.getMonth()]} ${sevenDaysAgo.getDate()} – ${monthNames[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

    // Fetch dynamic RSS articles once for all emails
    const articles = await fetchFitnessIntel();

    for (const user of users) {
      if (!user.email) continue;

      // Fetch ALL dates for streak calculation
      const { data: allWorkouts } = await supabase
        .from("workout_logs").select("date").eq("user_id", user.id);
        
      const allWorkoutDates = (allWorkouts || []).map(w => w.date);
      
      // Filter last 7 days count
      const workoutCount = allWorkoutDates.filter(d => d >= dateStr).length;

      const htmlContent = buildEmailHtml(user, workoutCount, weekRange, allWorkoutDates, today, articles);

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendApiKey}` },
        body: JSON.stringify({
          from: "FitTrack Pro <noreply@fittrack-pro.com>",
          to: user.email,
          subject: workoutCount > 0
            ? `${workoutCount} workouts this week — your FitTrack digest`
            : "Your weekly FitTrack digest — time to get back at it",
          html: htmlContent,
        }),
      });

      if (res.ok) {
        emailsSent++;
        await supabase.from("notification_logs").insert({ user_id: user.id, type: "email_weekly", status: "sent" });
      } else {
        console.error(`Failed to send to ${user.email}: ${await res.text()}`);
      }
    }

    return new Response(JSON.stringify({ success: true, emailsSent }), {
      headers: { "Content-Type": "application/json" }, status: 200,
    });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
