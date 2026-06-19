import { useEffect, useMemo, useRef, useState } from 'react'
import * as d3 from 'd3'

type ComplexityKey =
  | 'O(1)'
  | 'O(log n)'
  | 'O(√n)'
  | 'O(n)'
  | 'O(n log log n)'
  | 'O(n log n)'
  | 'O(n²)'
  | 'O(2^n)'
  | 'O(n!)'

type ReferenceKey = 'O(1)' | 'O(log n)' | 'O(n)' | 'O(n log n)' | 'O(n²)'

const COMPLEXITY_FNS: Record<ComplexityKey, (n: number) => number> = {
  'O(1)': () => 1,
  'O(log n)': (n) => Math.log2(Math.max(1, n)),
  'O(√n)': (n) => Math.sqrt(n),
  'O(n)': (n) => n,
  'O(n log log n)': (n) => n * Math.log2(Math.max(2, Math.log2(Math.max(2, n)))),
  'O(n log n)': (n) => n * Math.log2(Math.max(1, n)),
  'O(n²)': (n) => n * n,
  'O(2^n)': (n) => Math.pow(2, n),
  'O(n!)': (n) => {
    let r = 1
    for (let i = 2; i <= n; i++) r *= i
    return r
  },
}

const REFERENCE_KEYS: ReferenceKey[] = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)']
const REFERENCE_COLORS: Record<ReferenceKey, string> = {
  'O(1)': '#2dd4bf',
  'O(log n)': '#38bdf8',
  'O(n)': '#94a3b8',
  'O(n log n)': '#818cf8',
  'O(n²)': '#fb7185',
}

const AMBER = '#fbbf24'
const N_MAX = 20
const Y_CAP = N_MAX * N_MAX
const MIN_WIDTH = 260
const DEFAULT_SIZE = { width: 320, height: 184 }

/* Handles one level of nested parens, e.g. O((V+E) log V). */
const O_RE = /O\((?:[^()]+|\([^)]*\))*\)/

function normalizeToKey(raw: string): ComplexityKey | null {
  const s = raw.replace(/\s+/g, '').toLowerCase()
  if (/^o\(1\)/.test(s)) return 'O(1)'
  if (/n!/.test(s)) return 'O(n!)'
  if (/2\^|k\^/.test(s)) return 'O(2^n)'
  if (/√n|sqrt/.test(s)) return 'O(√n)'
  if (/n²|n\^2|v²/.test(s)) return 'O(n²)'
  if (/nloglogn|n\*loglogn/.test(s)) return 'O(n log log n)'
  if (/nlogn|n\*logn|\(v\+e\)log|elog|n\^1\.25/.test(s)) return 'O(n log n)'
  if (/loglog/.test(s)) return 'O(log n)'
  if (/log/.test(s)) return 'O(log n)'
  if (/n\+k|d[×x*]/.test(s)) return 'O(n)'
  if (/[nm][×x*][nwm]|rows[×x*]cols/.test(s)) return 'O(n²)'
  if (/v\+e/.test(s)) return 'O(n)'
  if (/n/.test(s)) return 'O(n)'
  return null
}

interface Entry {
  label: string
  raw: string
  key: ComplexityKey
}

interface TooltipState {
  x: number
  n: number
  rows: { key: ReferenceKey; value: string; color: string; highlighted: boolean }[]
}

function parseTimeComplexity(description: string): Entry[] {
  const entries: Entry[] = []

  const idxEn = description.indexOf('Time Complexity')
  const idxEs = description.indexOf('Complejidad Temporal')
  const idx = idxEn !== -1 ? idxEn : idxEs
  if (idx === -1) return entries

  const isSpanish = idxEs !== -1 && (idxEn === -1 || idxEs < idxEn)

  const rest = description.slice(idx)
  const blockRe = isSpanish
    ? /Complejidad Temporal[:\s]*([\s\S]*?)(?=\n\s*\nComplejidad Espacial|\n\s*\nPropiedades|\n\s*\n[A-ZÁÉÍÓÚÑ]|$)/
    : /Time Complexity[:\s]*([\s\S]*?)(?=\n\s*\nSpace|\n\s*\nProperties|\n\s*\n[A-Z]|$)/
  const blockMatch = rest.match(blockRe)
  if (!blockMatch) return entries
  const block = blockMatch[0]

  const oRe = (prefix: string) => new RegExp(`${prefix}:\\s*(O\\((?:[^()]+|\\([^)]*\\))*\\))`, 'i')

  const best = block.match(oRe(isSpanish ? 'Mejor' : 'Best'))
  const avg = block.match(oRe(isSpanish ? 'Promedio' : 'Average'))
  const worst = block.match(oRe(isSpanish ? 'Peor' : 'Worst'))

  if (best || avg || worst) {
    if (best) {
      const k = normalizeToKey(best[1])
      if (k) entries.push({ label: isSpanish ? 'Mejor' : 'Best', raw: best[1], key: k })
    }
    if (avg) {
      const k = normalizeToKey(avg[1])
      if (k) entries.push({ label: isSpanish ? 'Prom' : 'Avg', raw: avg[1], key: k })
    }
    if (worst) {
      const k = normalizeToKey(worst[1])
      if (k) entries.push({ label: isSpanish ? 'Peor' : 'Worst', raw: worst[1], key: k })
    }
  } else {
    const single = block.match(O_RE)
    if (single) {
      const k = normalizeToKey(single[0])
      if (k) entries.push({ label: '', raw: single[0], key: k })
    }
  }

  return entries
}

function formatValue(value: number): string {
  if (value >= 100000) return d3.format('.2e')(value)
  if (Number.isInteger(value)) return d3.format(',')(value)
  return d3
    .format(',.2f')(value)
    .replace(/\.?0+$/, '')
}

function makeVisibleState(): Record<ReferenceKey, boolean> {
  return {
    'O(1)': true,
    'O(log n)': true,
    'O(n)': true,
    'O(n log n)': true,
    'O(n²)': true,
  }
}

export default function ComplexityChart({
  description,
  locale = 'en',
}: {
  description: string
  locale?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [size, setSize] = useState(DEFAULT_SIZE)
  const [visible, setVisible] = useState<Record<ReferenceKey, boolean>>(() => makeVisibleState())
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const entries = useMemo(() => parseTimeComplexity(description), [description])
  const highlightedKeys = useMemo(
    () =>
      new Set(
        entries
          .map((entry) => entry.key)
          .filter((key): key is ReferenceKey => REFERENCE_KEYS.includes(key as ReferenceKey)),
      ),
    [entries],
  )

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const updateSize = () => {
      const width = Math.max(MIN_WIDTH, Math.floor(node.getBoundingClientRect().width))
      setSize({ width, height: Math.max(170, Math.min(220, Math.round(width * 0.52))) })
    }

    updateSize()
    const observer = new ResizeObserver(updateSize)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (entries.length === 0 || !svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${size.width} ${size.height}`)
    svg.attr('preserveAspectRatio', 'xMidYMid meet')

    const margin = { top: 16, right: 18, bottom: 30, left: 36 }
    const innerWidth = size.width - margin.left - margin.right
    const innerHeight = size.height - margin.top - margin.bottom
    const x = d3
      .scaleLinear()
      .domain([1, N_MAX])
      .range([margin.left, margin.left + innerWidth])
    const y = d3
      .scaleSqrt()
      .domain([0, Y_CAP])
      .nice()
      .range([margin.top + innerHeight, margin.top])
    const data = d3.range(1, N_MAX + 0.25, 0.25)

    const root = svg.append('g')
    const grid = root.append('g').attr('aria-hidden', 'true')
    grid
      .selectAll('line')
      .data(y.ticks(4))
      .join('line')
      .attr('x1', margin.left)
      .attr('x2', margin.left + innerWidth)
      .attr('y1', (d) => y(d))
      .attr('y2', (d) => y(d))
      .attr('stroke', '#1f2937')
      .attr('stroke-width', 1)
      .attr('opacity', 0.55)

    const axisText = (selection: d3.Selection<SVGGElement, unknown, null, undefined>) => {
      selection.selectAll('path, line').attr('stroke', '#334155')
      selection
        .selectAll('text')
        .attr('fill', '#94a3b8')
        .attr('font-size', 10)
        .attr('font-family', 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace')
    }

    root
      .append('g')
      .attr('transform', `translate(0,${margin.top + innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(4)
          .tickSizeOuter(0)
          .tickFormat((d) => `${d}`),
      )
      .call(axisText)

    root
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(y)
          .ticks(4)
          .tickSizeOuter(0)
          .tickFormat((d) => formatValue(Number(d))),
      )
      .call(axisText)

    const curveLine = (key: ReferenceKey) =>
      d3
        .line<number>()
        .x((n) => x(n))
        .y((n) => y(Math.min(COMPLEXITY_FNS[key](n), Y_CAP)))
        .curve(d3.curveMonotoneX)(data)

    const activeCurves = REFERENCE_KEYS.filter((key) => visible[key])
    const curves = root.append('g').attr('fill', 'none')

    activeCurves.forEach((key, index) => {
      const highlighted = highlightedKeys.has(key)
      const path = curves
        .append('path')
        .datum(data)
        .attr('d', curveLine(key))
        .attr('stroke', highlighted ? AMBER : REFERENCE_COLORS[key])
        .attr('stroke-width', highlighted ? 2.6 : 1.6)
        .attr('stroke-linecap', 'round')
        .attr('stroke-linejoin', 'round')
        .attr('opacity', highlighted ? 1 : 0.5)

      const length = path.node()?.getTotalLength() ?? 0
      path
        .attr('stroke-dasharray', `${length} ${length}`)
        .attr('stroke-dashoffset', length)
        .transition()
        .delay(index * 55)
        .duration(650)
        .ease(d3.easeCubicOut)
        .attr('stroke-dashoffset', 0)
    })

    const focus = root.append('g').attr('pointer-events', 'none').style('display', 'none')
    focus
      .append('line')
      .attr('y1', margin.top)
      .attr('y2', margin.top + innerHeight)
      .attr('stroke', '#475569')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3 4')
    const focusDots = focus.append('g')

    const moveFocus = (event: PointerEvent) => {
      const [mx] = d3.pointer(event, svg.node())
      const n = Math.max(1, Math.min(N_MAX, Math.round(x.invert(mx))))
      const xPos = x(n)
      const rows = activeCurves.map((key) => ({
        key,
        value: formatValue(COMPLEXITY_FNS[key](n)),
        color: highlightedKeys.has(key) ? AMBER : REFERENCE_COLORS[key],
        highlighted: highlightedKeys.has(key),
      }))

      focus.style('display', null).attr('transform', `translate(${xPos},0)`)
      focusDots
        .selectAll('circle')
        .data(rows, (d) => (d as { key: ReferenceKey }).key)
        .join('circle')
        .attr('cx', 0)
        .attr('cy', (d) => y(Math.min(COMPLEXITY_FNS[d.key](n), Y_CAP)))
        .attr('r', (d) => (d.highlighted ? 4 : 3))
        .attr('fill', (d) => d.color)
        .attr('stroke', '#020617')
        .attr('stroke-width', 1.5)

      setTooltip({
        x: Math.min(Math.max(xPos, 92), size.width - 92),
        n,
        rows,
      })
    }

    root
      .append('rect')
      .attr('x', margin.left)
      .attr('y', margin.top)
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .style('cursor', 'crosshair')
      .on('pointermove', moveFocus)
      .on('pointerenter', moveFocus)
      .on('pointerleave', () => {
        focus.style('display', 'none')
        setTooltip(null)
      })

    return () => {
      svg.selectAll('*').interrupt()
    }
  }, [entries.length, highlightedKeys, size, visible])

  if (entries.length === 0) return null

  const chartTitle = locale === 'es' ? 'Complejidad temporal' : 'Time complexity'
  const chartLabel = `${chartTitle}: ${entries
    .map((entry) => (entry.label ? `${entry.label} ${entry.raw}` : entry.raw))
    .join(', ')}`

  return (
    <div className="mt-5 mb-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
          {locale === 'es' ? 'Complejidad Temporal' : 'Time Complexity'}
        </div>
        <div className="text-[10px] text-amber-300/90 font-mono">
          {entries.map((entry) => entry.raw).join(' / ')}
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg border border-slate-800 bg-slate-950/80"
      >
        <svg
          ref={svgRef}
          className="block w-full"
          style={{ height: size.height }}
          role="img"
          aria-label={chartLabel}
        />
        {tooltip && (
          <div
            className="pointer-events-none absolute top-3 z-10 min-w-32 rounded-md border border-slate-700 bg-slate-950/95 px-2.5 py-2 text-[10px] text-slate-300 shadow-lg"
            style={{ left: tooltip.x, transform: 'translateX(-50%)' }}
          >
            <div className="mb-1 font-mono text-slate-100">n = {tooltip.n}</div>
            {tooltip.rows.map((row) => (
              <div key={row.key} className="flex items-center justify-between gap-4 font-mono">
                <span className="flex items-center gap-1.5">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: row.color }}
                  />
                  {row.key}
                </span>
                <span className={row.highlighted ? 'text-amber-300' : 'text-slate-400'}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5" aria-label="Toggle complexity curves">
        {REFERENCE_KEYS.map((key) => {
          const enabled = visible[key]
          const highlighted = highlightedKeys.has(key)
          const color = highlighted ? AMBER : REFERENCE_COLORS[key]
          return (
            <button
              key={key}
              type="button"
              onClick={() => setVisible((prev) => ({ ...prev, [key]: !prev[key] }))}
              className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-mono transition-colors active:scale-[0.98] ${
                enabled
                  ? 'border-slate-700 bg-slate-900 text-slate-200 hover:border-amber-400/70'
                  : 'border-slate-800 bg-slate-950 text-slate-600 hover:text-slate-400'
              }`}
              aria-pressed={enabled}
            >
              <span
                className="h-1.5 w-3 rounded-full"
                style={{
                  backgroundColor: color,
                  opacity: enabled ? 1 : 0.25,
                }}
              />
              {key}
              {highlighted && <span className="text-amber-300">current</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
