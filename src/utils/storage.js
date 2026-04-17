// ─── DATA EXPORT / IMPORT ────────────────────────────────────────────────────
const STORAGE_KEYS = [
  'fittrack_users',
  'fittrack_healthLogs',
  'fittrack_workoutLogs',
  'fittrack_splits',
  'fittrack_theme',
  'fittrack_measurements',
  'fittrack_caloriesLog',
  'fittrack_foodLog',
  'fittrack_favoriteFoods',
];

export const exportData = (payload = {}) => {
  let csvContent = "Table,Data\n\n";
  
  Object.entries(payload).forEach(([key, data]) => {
    if (!Array.isArray(data) || data.length === 0) return;
    
    try {
      const tableName = key.toUpperCase();
      csvContent += `--- ${tableName} ---\n`;
      
      // Get all unique keys
      const headers = Array.from(new Set(data.flatMap(Object.keys)));
      csvContent += headers.join(',') + '\n';
      
      // Map rows
      data.forEach(obj => {
        const row = headers.map(header => {
          let cellData = obj[header];
          if (typeof cellData === 'object' && cellData !== null) {
            cellData = JSON.stringify(cellData);
          }
          if (typeof cellData === 'string') {
            return `"${cellData.replace(/"/g, '""')}"`;
          }
          return cellData !== undefined && cellData !== null ? cellData : '';
        });
        csvContent += row.join(',') + '\n';
      });
      csvContent += '\n\n';
    } catch (e) {
      console.warn(`Could not parse ${key} for CSV export`);
    }
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fittrack-pro-export-${new Date().toISOString().split('T')[0]}.csv`;
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
