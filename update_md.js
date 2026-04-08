const fs = require('fs');
let s = fs.readFileSync('TODO-reset-plus-new-pill.md', 'utf8');

s = s.replace(/> \*\*Status:\*\* 🔴 Active/g, "> **Status:** 🟢 Completed / Fixed");

const missingFindings = `
### Actual Root Causes Fixed:
1. **Timezone Bug (Readiness & Cardio):** Both logs used \`new Date().toISOString().split('T')[0]\` which returned a UTC date string. For users in timezones like IST (+5:30), logging after UTC midnight (but before local midnight) caused the entry to save under the PREVIOUS local day. This meant \`todayReadiness\` in Dashboard was always \`undefined\`, explaining why the modal re-opened and the card didn't update.
2. **Stale Closure Bug:** \`createSyncSetter\` in \`AppContext.jsx\` bound \`prev\` to the \`useCallback\` enclosure. Rapid updates used stale closures, dropping the update payload.
3. **Supabase Silent Fails:** \`createSyncSetter\` was wrapping mapped outputs, but passed \`undefined\` fields when optional properties were missing (like \`vitaminD\`). Supabase's \`upsert\` silently ignores updates containing \`undefined\`.
`;

s = s.replace(/### Fix — Two-Part/g, missingFindings + "\n\n### Fix — Multi-Part");

fs.writeFileSync('TODO-reset-plus-new-pill.md', s);
