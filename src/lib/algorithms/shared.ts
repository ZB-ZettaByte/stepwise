import type { AlgorithmInput, GraphNode, GraphEdge } from '@lib/types'

/** Locale-aware description helper */
export const d = (locale: string, en: string, es: string) => (locale === 'es' ? es : en)

// ── Custom array input ──

/** Most numbers a custom array may hold, so bars stay readable. */
export const MAX_CUSTOM_ARRAY_LENGTH = 16
/** Custom values are clamped here so value-indexed sorts (counting, radix) stay valid. */
export const MIN_CUSTOM_VALUE = 1
export const MAX_CUSTOM_VALUE = 99

export interface ParseArrayResult {
  values: number[]
  error: string | null
}

/**
 * Parse a comma- or space-separated string into a clean number array.
 * Values are rounded to integers and clamped to [MIN_CUSTOM_VALUE, MAX_CUSTOM_VALUE]
 * so every sort (including the value-indexed ones) stays valid. `errorKind` lets the
 * caller localize the message: 'empty' = nothing entered, 'invalid' = a non-numeric token.
 */
export function parseArrayInput(
  text: string,
): ParseArrayResult & { errorKind: 'empty' | 'invalid' | null } {
  const tokens = text
    .split(/[\s,]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)

  if (tokens.length === 0) {
    return { values: [], error: 'empty', errorKind: 'empty' }
  }

  const values: number[] = []
  for (const token of tokens) {
    const num = Number(token)
    if (!Number.isFinite(num)) {
      return { values: [], error: 'invalid', errorKind: 'invalid' }
    }
    const rounded = Math.round(num)
    const clamped = Math.min(MAX_CUSTOM_VALUE, Math.max(MIN_CUSTOM_VALUE, rounded))
    values.push(clamped)
  }

  return { values: values.slice(0, MAX_CUSTOM_ARRAY_LENGTH), error: null, errorKind: null }
}

/** Use the caller-provided array when it has values, otherwise the algorithm's default. */
export function arrayOrDefault(input: AlgorithmInput | undefined, fallback: number[]): number[] {
  const values = Array.isArray(input) ? input : input?.array
  return values && values.length > 0 ? [...values] : [...fallback]
}

/** Shared graph data for BFS/DFS */
export const graphNodes: GraphNode[] = [
  { id: 0, label: '0', x: 250, y: 40 },
  { id: 1, label: '1', x: 130, y: 130 },
  { id: 2, label: '2', x: 370, y: 130 },
  { id: 3, label: '3', x: 50, y: 230 },
  { id: 4, label: '4', x: 200, y: 230 },
  { id: 5, label: '5', x: 440, y: 230 },
  { id: 6, label: '6', x: 200, y: 310 },
]

export const graphEdges: GraphEdge[] = [
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  { from: 1, to: 3 },
  { from: 1, to: 4 },
  { from: 2, to: 5 },
  { from: 4, to: 6 },
]

export const graphAdj: Record<number, number[]> = {
  0: [1, 2],
  1: [0, 3, 4],
  2: [0, 5],
  3: [1],
  4: [1, 6],
  5: [2],
  6: [4],
}
