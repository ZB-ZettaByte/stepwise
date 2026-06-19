import type { HighlightType } from '@lib/types'

/** Hex colors used by the ArrayVisualizer bar chart */
export const highlightColors: Record<HighlightType, string> = {
  comparing: '#0284c7',
  swapped: '#e11d48',
  selected: '#d97706',
  sorted: '#059669',
  pivot: '#7c3aed',
  found: '#16a34a',
  current: '#0284c7',
  searching: '#0891b2',
  left: '#0284c7',
  right: '#c026d3',
  merged: '#4f46e5',
  minimum: '#d97706',
  placed: '#059669',
  conflict: '#e11d48',
  checking: '#d97706',
  wall: '#334155',
  path: '#0891b2',
  start: '#0284c7',
  end: '#e11d48',
  given: '#64748b',
  active: '#0284c7',
  visited: '#7c3aed',
}

/** RGBA styles used by the MatrixVisualizer cells */
export const highlightStyles: Record<string, { bg: string; text: string; border: string }> = {
  placed: { bg: 'rgba(5,150,105,0.12)', text: '#047857', border: 'rgba(5,150,105,0.30)' },
  conflict: { bg: 'rgba(225,29,72,0.12)', text: '#be123c', border: 'rgba(225,29,72,0.30)' },
  checking: { bg: 'rgba(217,119,6,0.12)', text: '#b45309', border: 'rgba(217,119,6,0.30)' },
  found: { bg: 'rgba(22,163,74,0.14)', text: '#15803d', border: 'rgba(22,163,74,0.34)' },
  current: { bg: 'rgba(2,132,199,0.12)', text: '#0369a1', border: 'rgba(2,132,199,0.30)' },
  comparing: { bg: 'rgba(2,132,199,0.12)', text: '#0369a1', border: 'rgba(2,132,199,0.30)' },
  selected: { bg: 'rgba(217,119,6,0.12)', text: '#b45309', border: 'rgba(217,119,6,0.30)' },
  sorted: { bg: 'rgba(5,150,105,0.12)', text: '#047857', border: 'rgba(5,150,105,0.30)' },
  searching: { bg: 'rgba(8,145,178,0.12)', text: '#0e7490', border: 'rgba(8,145,178,0.30)' },
  wall: { bg: 'rgba(148,163,184,0.08)', text: '#64748b', border: 'rgba(148,163,184,0.14)' },
  path: { bg: 'rgba(8,145,178,0.12)', text: '#0e7490', border: 'rgba(8,145,178,0.30)' },
  start: { bg: 'rgba(2,132,199,0.12)', text: '#0369a1', border: 'rgba(2,132,199,0.30)' },
  end: { bg: 'rgba(225,29,72,0.12)', text: '#be123c', border: 'rgba(225,29,72,0.30)' },
  given: { bg: 'rgba(148,163,184,0.08)', text: '#475569', border: 'rgba(148,163,184,0.15)' },
  active: { bg: 'rgba(2,132,199,0.12)', text: '#0369a1', border: 'rgba(2,132,199,0.30)' },
  visited: { bg: 'rgba(124,58,237,0.10)', text: '#6d28d9', border: 'rgba(124,58,237,0.26)' },
  left: { bg: 'rgba(2,132,199,0.10)', text: '#0369a1', border: 'rgba(2,132,199,0.25)' },
  right: { bg: 'rgba(192,38,211,0.10)', text: '#a21caf', border: 'rgba(192,38,211,0.25)' },
  merged: { bg: 'rgba(79,70,229,0.10)', text: '#4338ca', border: 'rgba(79,70,229,0.26)' },
  pivot: { bg: 'rgba(124,58,237,0.10)', text: '#6d28d9', border: 'rgba(124,58,237,0.26)' },
}

export const DEFAULT_BAR_COLOR = '#64748b'
