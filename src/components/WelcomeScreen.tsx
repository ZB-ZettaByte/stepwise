import { useMemo, useState } from 'react'
import type { Translations, Locale } from '@i18n/translations'
import { getCategoryName } from '@i18n/translations'
import type { Algorithm } from '@lib/types'
import { categories, algorithms } from '@lib/algorithms'

interface WelcomeScreenProps {
  t: Translations
  locale?: Locale
  onSelectAlgorithm?: (algo: Algorithm) => void
}

// One outline icon (single SVG path) per category.
const ICON_PATHS: Record<string, string> = {
  Concepts:
    'M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5',
  'Data Structures':
    'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z',
  Sorting:
    'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
  Searching: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z',
  Graphs:
    'M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z',
  'Dynamic Programming':
    'M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z',
  Backtracking: 'M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3',
  'Divide and Conquer':
    'M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15',
  Math: 'M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z',
}
const FALLBACK_ICON = 'M3.75 3.75h16.5v16.5H3.75z'

const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)'

const WELCOME_DESCRIPTION = [
  "Learning algorithms is hard. Watching them run makes it easier. Step through every data structure and algorithm with real Python and C++ code, whether you're in a DSA class or prepping for interviews.",
]

const RESOURCES = [
  {
    label: 'Introduction to Algorithms (CLRS)',
    href: 'https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/',
  },
  {
    label: 'MIT OpenCourseWare 6.006',
    href: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
  },
  {
    label: 'NeetCode.io',
    href: 'https://neetcode.io/',
  },
  {
    label: 'VisuAlgo',
    href: 'https://visualgo.net/',
  },
  {
    label: 'Big-O Cheat Sheet',
    href: 'https://www.bigocheatsheet.com/',
  },
]

function CategoryIcon({ name }: { name: string }) {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={ICON_PATHS[name] ?? FALLBACK_ICON} />
    </svg>
  )
}

export default function WelcomeScreen({ t, locale = 'en', onSelectAlgorithm }: WelcomeScreenProps) {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()

  const matches = useMemo(() => {
    if (!q) return []
    return algorithms.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        getCategoryName(locale, a.category).toLowerCase().includes(q),
    )
  }, [q, locale])

  const subtitle =
    locale === 'es'
      ? `${algorithms.length} algoritmos en ${categories.length} categorías`
      : `${algorithms.length} algorithms across ${categories.length} categories`

  return (
    <div className="mx-auto w-full max-w-6xl py-4 md:py-6">
      {/* Header */}
      <div className="mb-8 md:mb-10">
        <h1 className="font-heading text-3xl font-semibold text-slate-950 md:text-5xl">
          {t.welcomeTitle}
        </h1>
        <p className="mt-4 text-lg text-slate-500 md:text-xl">{subtitle}</p>
        <div className="mt-4 max-w-4xl space-y-1 text-xl leading-relaxed text-slate-700 md:text-2xl">
          {WELCOME_DESCRIPTION.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-8 md:mb-10">
        <svg
          className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d={ICON_PATHS.Searching} />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          aria-label={t.searchPlaceholder}
          className="w-full rounded-2xl border border-slate-200 bg-white py-5 pl-14 pr-5 text-xl text-slate-900 outline-none transition-colors duration-150 placeholder:text-slate-400 focus:border-amber-400"
          style={{ transitionTimingFunction: EASE_OUT }}
        />
      </div>

      {q ? (
        matches.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {matches.map((algo) => (
              <button
                key={algo.id}
                onClick={() => onSelectAlgorithm?.(algo)}
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 text-left transition-colors duration-200 hover:border-amber-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
                style={{ transitionTimingFunction: EASE_OUT }}
              >
                <span className="truncate text-lg text-slate-900">{algo.name}</span>
                <span className="shrink-0 text-sm text-slate-500">
                  {getCategoryName(locale, algo.category)}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-lg text-slate-500">
            {locale === 'es' ? `Sin resultados para "${query}"` : `No results for "${query}"`}
          </p>
        )
      ) : (
        <>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-600">
                Explore
              </p>
              <h2 className="mt-2 font-heading text-2xl font-semibold text-slate-950 md:text-3xl">
                Pick a path and start stepping
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((cat) => {
              const count = cat.algorithms.length
              const first = cat.algorithms[0]
              const name = getCategoryName(locale, cat.name)
              const countText = t.algorithmsCount.replace('{count}', String(count))
              const preview = first?.name ?? countText

              return (
                <button
                  key={cat.name}
                  onClick={() => first && onSelectAlgorithm?.(first)}
                  disabled={!first}
                  aria-label={`${name}, ${countText}`}
                  className="group flex min-h-36 items-center gap-5 rounded-2xl border border-slate-200 bg-white p-6 text-left transition-colors duration-200 hover:border-amber-400 hover:bg-amber-50/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 disabled:pointer-events-none disabled:opacity-40"
                  style={{ transitionTimingFunction: EASE_OUT }}
                >
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-200 transition-colors duration-200 group-hover:bg-amber-100">
                    <CategoryIcon name={cat.name} />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-heading text-xl font-semibold text-slate-950 md:text-2xl">
                        {name}
                      </h3>
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-sm font-medium text-amber-700">
                        {count}
                      </span>
                    </div>
                    <p className="mt-2 text-base text-slate-500">{preview}</p>
                  </div>
                </button>
              )
            })}
          </div>

          <section className="mt-12">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Further Reading
            </h2>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-base text-slate-500">
              {RESOURCES.map((resource) => (
                <li key={resource.href}>
                  <a
                    href={resource.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-amber-700"
                  >
                    {resource.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  )
}
