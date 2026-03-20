// ─── DATA EXPORT / IMPORT ────────────────────────────────────────────────────
const STORAGE_KEYS = [
  'fittrack_users',
  'fittrack_healthLogs',
  'fittrack_workoutLogs',
  'fittrack_splits',
  'fittrack_theme',
  'fittrack_measurements',
  'fittrack_caloriesLog',
];

export const exportData = () => {
  const data = {};
  STORAGE_KEYS.forEach(key => {
    const val = localStorage.getItem(key);
    if (val) data[key] = JSON.parse(val);
  });
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fittrack-pro-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        // Validate it has at least one known key
        const validKeys = Object.keys(data).filter(k => STORAGE_KEYS.includes(k));
        if (validKeys.length === 0) {
          reject(new Error('Invalid backup file — no recognizable data found'));
          return;
        }
        validKeys.forEach(key => {
          localStorage.setItem(key, JSON.stringify(data[key]));
        });
        resolve(validKeys.length);
      } catch (err) {
        reject(new Error('Failed to parse backup file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
