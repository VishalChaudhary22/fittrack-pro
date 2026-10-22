/**
 * MARGIN chart chrome.
 *
 * Recharts is honoured as the charting library but stripped of its skin:
 * no gridless fills, no rounded tooltip card, no legends. Axis labels sit in
 * the app's own type stack so a chart reads as part of the page, not as an
 * embedded widget.
 */

export const chartAxis = {
  tick: {
    fill: 'var(--ash)',
    fontSize: 9,
    fontFamily: "'Space Grotesk', sans-serif",
    letterSpacing: '0.06em',
  },
  axisLine: { stroke: 'var(--hair)' },
  tickLine: false,
};

export const chartTooltip = {
  contentStyle: {
    background: 'var(--canvas)',
    border: '1px solid var(--hair)',
    borderRadius: 0,
    boxShadow: 'none',
    padding: '8px 10px',
    fontFamily: "'Be Vietnam Pro', sans-serif",
    fontSize: 11,
    color: 'var(--ink)',
  },
  labelStyle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 9,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--ash)',
    marginBottom: 4,
  },
  itemStyle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 12,
    color: 'var(--ink)',
  },
  cursor: { stroke: 'var(--hair)', strokeWidth: 1 },
};

/* the single series colour used across all charts */
export const CHART_EMBER = '#F85F1B';
export const CHART_BONE = '#E3BFB3';
export const CHART_ASH = '#7E7E8C';
