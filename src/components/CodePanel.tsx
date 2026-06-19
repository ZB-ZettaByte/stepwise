import { useState, useRef, useEffect, useCallback, useMemo, lazy, Suspense } from 'react'
import type { Monaco } from '@monaco-editor/react'
import type { Locale } from '@i18n/translations'
import { translations } from '@i18n/translations'
import type { Difficulty } from '@lib/types'
import ComplexityChart from '@components/ComplexityChart'

const LazyEditor = lazy(() => import('@monaco-editor/react'))

const DIFFICULTY_CONFIG: Record<Difficulty, { en: string; es: string; color: string; bg: string }> =
  {
    easy: {
      en: 'Easy',
      es: 'Fácil',
      color: 'text-amber-700',
      bg: 'bg-amber-50 border-amber-200',
    },
    intermediate: {
      en: 'Intermediate',
      es: 'Intermedio',
      color: 'text-amber-700',
      bg: 'bg-amber-50 border-amber-200',
    },
    advanced: {
      en: 'Advanced',
      es: 'Avanzado',
      color: 'text-red-400',
      bg: 'bg-red-400/10 border-red-400/20',
    },
  }

interface CodePanelProps {
  code: string
  cppCode?: string
  description: string
  difficulty?: Difficulty
  currentLine?: number
  variables?: Record<string, string | number | boolean | null>
  consoleOutput?: string[]
  activeTab: 'code' | 'about'
  onTabChange: (tab: 'code' | 'about') => void
  locale?: Locale
}

/** Custom light theme that matches the app background */
function defineTheme(monaco: Monaco) {
  monaco.editor.defineTheme('algoviz-light', {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#ffffff',
      'editor.lineHighlightBackground': '#fff7ed',
      'editorLineNumber.foreground': '#94a3b8',
      'editorLineNumber.activeForeground': '#d97706',
      'editor.selectionBackground': '#fef3c7',
      'editorCursor.foreground': '#d97706',
    },
  })
}

export default function CodePanel({
  code,
  cppCode,
  description,
  difficulty,
  currentLine,
  variables,
  consoleOutput,
  activeTab,
  onTabChange,
  locale = 'en',
}: CodePanelProps) {
  const t = translations[locale]
  const [isMounted, setIsMounted] = useState(false)
  const [editorReady, setEditorReady] = useState(false)
  const [codeLanguage, setCodeLanguage] = useState<'python' | 'cpp'>('python')
  const editorRef = useRef<any>(null)
  const monacoRef = useRef<Monaco | null>(null)
  const decorationsRef = useRef<string[]>([])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const displayedCode = codeLanguage === 'python' ? code : (cppCode ?? code)
  const editorLanguage = codeLanguage === 'python' ? 'python' : 'cpp'
  const displayedCurrentLine = codeLanguage === 'python' ? currentLine : undefined

  const handleEditorDidMount = useCallback(
    (editor: any, monacoInstance: Monaco) => {
      defineTheme(monacoInstance)
      monacoInstance.editor.setTheme('algoviz-light')
      editorRef.current = editor
      monacoRef.current = monacoInstance

      // Apply initial line highlight
      if (displayedCurrentLine != null && displayedCurrentLine > 0) {
        decorationsRef.current = editor.deltaDecorations(
          [],
          [
            {
              range: new monacoInstance.Range(displayedCurrentLine, 1, displayedCurrentLine, 1),
              options: {
                isWholeLine: true,
                className: 'algoviz-active-line',
                linesDecorationsClassName: 'algoviz-active-line-gutter',
              },
            },
          ],
        )
      }

      setEditorReady(true)
    },
    [displayedCurrentLine],
  )

  // Build inline variable annotation for the active line
  const inlineVarText = useMemo(() => {
    if (!variables || Object.keys(variables).length === 0) return ''
    const parts = Object.entries(variables).map(
      ([k, v]) => `${k} = ${typeof v === 'string' ? v : JSON.stringify(v)}`,
    )
    return '  // ' + parts.join(', ')
  }, [variables])

  // Update line highlight + inline variable annotation when currentLine/variables change
  useEffect(() => {
    const editor = editorRef.current
    const monaco = monacoRef.current
    if (!editor || !monaco) return

    if (displayedCurrentLine != null && displayedCurrentLine > 0) {
      const decorations: any[] = [
        {
          range: new monaco.Range(displayedCurrentLine, 1, displayedCurrentLine, 1),
          options: {
            isWholeLine: true,
            className: 'algoviz-active-line',
            linesDecorationsClassName: 'algoviz-active-line-gutter',
          },
        },
      ]

      // Add inline variable annotation after the active line content
      if (inlineVarText) {
        decorations.push({
          range: new monaco.Range(
            displayedCurrentLine,
            Number.MAX_SAFE_INTEGER,
            displayedCurrentLine,
            Number.MAX_SAFE_INTEGER,
          ),
          options: {
            after: {
              content: inlineVarText,
              inlineClassName: 'algoviz-inline-vars',
            },
          },
        })
      }

      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, decorations)

      // Scroll to the active line
      editor.revealLineInCenterIfOutsideViewport(displayedCurrentLine)
    } else {
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, [])
    }
  }, [displayedCurrentLine, editorReady, inlineVarText])

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 shrink-0 gap-2 pr-2">
        <div
          className="flex min-w-0"
          role="tablist"
          aria-label={locale === 'es' ? 'Pestañas de código y detalles' : 'Code and details tabs'}
          onKeyDown={(e) => {
            const tabs = ['code', 'about'] as const
            const currentIndex = tabs.indexOf(activeTab)
            if (e.key === 'ArrowRight') {
              e.preventDefault()
              onTabChange(tabs[(currentIndex + 1) % tabs.length])
            } else if (e.key === 'ArrowLeft') {
              e.preventDefault()
              onTabChange(tabs[(currentIndex - 1 + tabs.length) % tabs.length])
            }
          }}
        >
          {(['code', 'about'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={`tabpanel-${tab}`}
              id={`tab-${tab}`}
              tabIndex={activeTab === tab ? 0 : -1}
              className={`px-3 py-2.5 md:px-5 md:py-3 text-xs font-medium transition-colors relative capitalize ${
                activeTab === tab ? 'text-slate-950' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-2">
                {tab === 'code' ? t.tabCode : t.tabAbout}
                <kbd
                  className={`inline-flex items-center justify-center w-[18px] h-[18px] text-[10px] font-mono rounded border ${
                    activeTab === tab
                      ? 'border-amber-300 text-amber-700 bg-amber-50'
                      : 'border-slate-200 text-slate-500 bg-slate-50'
                  }`}
                  aria-hidden="true"
                >
                  {tab === 'code' ? 'C' : 'E'}
                </kbd>
              </span>
              {activeTab === tab && (
                <div
                  className="absolute bottom-0 left-2 right-2 h-px bg-amber-400"
                  aria-hidden="true"
                />
              )}
            </button>
          ))}
        </div>

        <div
          className="inline-flex shrink-0 rounded-lg border border-slate-200 bg-slate-50 p-0.5"
          role="group"
          aria-label={locale === 'es' ? 'Lenguaje del código' : 'Code language'}
        >
          {(['python', 'cpp'] as const).map((language) => {
            const selected = codeLanguage === language
            return (
              <button
                key={language}
                type="button"
                onClick={() => {
                  setCodeLanguage(language)
                  onTabChange('code')
                }}
                aria-pressed={selected}
                className={`rounded-md px-2 py-1 text-[11px] font-medium transition-colors active:scale-[0.98] ${
                  selected
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {language === 'python' ? 'Python' : 'C++'}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'code' ? (
        <div
          className="flex-1 flex flex-col overflow-hidden"
          role="tabpanel"
          id="tabpanel-code"
          aria-labelledby="tab-code"
        >
          <div
            className="flex-1 overflow-hidden transition-opacity duration-500 ease-in-out"
            style={{ opacity: editorReady ? 1 : 0 }}
          >
            {isMounted && (
              <Suspense fallback={null}>
                <LazyEditor
                  defaultLanguage={editorLanguage}
                  language={editorLanguage}
                  value={displayedCode}
                  theme="vs-light"
                  onMount={handleEditorDidMount}
                  loading={null}
                  options={{
                    readOnly: true,
                    domReadOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 13,
                    lineHeight: 28,
                    fontFamily: "'Geist Mono', ui-monospace, monospace",
                    fontLigatures: true,
                    renderLineHighlight: 'none',
                    overviewRulerLanes: 0,
                    hideCursorInOverviewRuler: true,
                    overviewRulerBorder: false,
                    scrollbar: {
                      vertical: 'hidden',
                      horizontal: 'hidden',
                      handleMouseWheel: true,
                    },
                    lineNumbers: 'on',
                    lineDecorationsWidth: 12,
                    lineNumbersMinChars: 3,
                    glyphMargin: false,
                    folding: false,
                    contextmenu: false,
                    selectionHighlight: false,
                    occurrencesHighlight: 'off',
                    renderLineHighlightOnlyWhenFocus: false,
                    matchBrackets: 'never',
                    padding: { top: 12, bottom: 12 },
                    guides: { indentation: false },
                    wordWrap: 'off',
                    cursorStyle: 'line-thin',
                    cursorBlinking: 'solid',
                  }}
                />
              </Suspense>
            )}
          </div>

          {/* Console output panel */}
          {consoleOutput && consoleOutput.length > 0 && (
            <div
              className="shrink-0 border-t border-slate-200 max-h-[140px] flex flex-col"
              role="region"
              aria-label={locale === 'es' ? 'Salida de consola' : 'Console output'}
            >
              <div className="px-4 py-2 flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5 text-slate-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Console
                  </span>
                  <span className="text-[10px] text-slate-400 tabular-nums">
                    ({consoleOutput.length})
                  </span>
                </div>
              </div>
              <div className="px-4 pb-3 overflow-auto flex-1 min-h-0" aria-live="polite">
                {consoleOutput.map((line, i) => (
                  <div
                    key={i}
                    className={`flex gap-2 text-[11px] font-mono leading-[18px] ${
                      i === consoleOutput.length - 1 ? 'text-amber-700' : 'text-slate-600'
                    }`}
                  >
                    <span className="text-slate-400 select-none shrink-0" aria-hidden="true">
                      {'›'}
                    </span>
                    <span className="break-all">{line}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Variables panel */}
          {variables && Object.keys(variables).length > 0 && (
            <div
              className="shrink-0 border-t border-slate-200"
              role="region"
              aria-label={t.variables}
            >
              <div className="px-4 py-2 flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5 text-slate-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.745 3A23.933 23.933 0 003 12c0 3.183.62 6.22 1.745 9M19.5 3c.967 2.78 1.5 5.817 1.5 9s-.533 6.22-1.5 9M8.25 8.885l1.444-.89a.75.75 0 011.105.402l2.402 7.206a.75.75 0 001.104.401l1.445-.889"
                    />
                  </svg>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    {t.variables}
                  </span>
                </div>
              </div>
              <div className="px-4 pb-3 flex flex-wrap gap-x-3 gap-y-1.5" aria-live="polite">
                {Object.entries(variables).map(([name, value]) => (
                  <div
                    key={name}
                    className="inline-flex items-center gap-1.5 text-[12px] font-mono"
                  >
                    <span className="text-slate-700">{name}</span>
                    <span className="text-slate-400" aria-hidden="true">
                      =
                    </span>
                    <span className="sr-only">=</span>
                    <span
                      className={`font-medium ${
                        typeof value === 'number'
                          ? 'text-amber-700'
                          : typeof value === 'boolean'
                            ? value
                              ? 'text-amber-700'
                              : 'text-red-600'
                            : value === null
                              ? 'text-slate-400'
                              : 'text-amber-700'
                      }`}
                    >
                      {value === null
                        ? 'null'
                        : typeof value === 'boolean'
                          ? String(value)
                          : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className="flex-1 overflow-auto p-4 md:p-6"
          role="tabpanel"
          id="tabpanel-about"
          aria-labelledby="tab-about"
        >
          <article className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-wrap font-[inherit]">
            {(() => {
              const lines = description.split('\n')
              const elements: React.ReactElement[] = []
              let listItems: React.ReactElement[] = []

              const flushList = () => {
                if (listItems.length > 0) {
                  elements.push(
                    <ul key={`list-${elements.length}`} className="list-none m-0 p-0" role="list">
                      {listItems}
                    </ul>,
                  )
                  listItems = []
                }
              }

              lines.forEach((line, i) => {
                const isBullet = line.trim().startsWith('-') || line.trim().startsWith('\u2022')

                if (!isBullet) flushList()

                if (i === 0 && line.trim()) {
                  elements.push(
                    <div key={i} className="mb-4">
                      <h3 className="text-lg font-semibold text-slate-950 font-heading">{line}</h3>
                      {difficulty &&
                        (() => {
                          const cfg = DIFFICULTY_CONFIG[difficulty]
                          const label = locale === 'es' ? cfg.es : cfg.en
                          return (
                            <span
                              className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 text-[11px] font-semibold rounded-full border ${cfg.bg} ${cfg.color}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${difficulty === 'easy' ? 'bg-amber-500' : difficulty === 'intermediate' ? 'bg-amber-500' : 'bg-rose-500'}`}
                              />
                              {label}
                            </span>
                          )
                        })()}
                    </div>,
                  )
                } else if (
                  line.match(
                    /^[A-Z\u00C1-\u00DA][a-zA-Z\u00e1\u00e9\u00ed\u00f3\u00fa\u00c1\u00c9\u00cd\u00d3\u00da\u00f1\u00d1\s]+:$/,
                  )
                ) {
                  elements.push(
                    <h4
                      key={i}
                      className="text-sm font-semibold text-slate-900 mt-5 mb-2 font-heading"
                    >
                      {line}
                    </h4>,
                  )
                } else if (isBullet) {
                  listItems.push(
                    <li key={i} className="flex gap-2 ml-2 my-0.5">
                      <span className="text-slate-400 shrink-0" aria-hidden="true">
                        {'\u2022'}
                      </span>
                      <span>{line.trim().replace(/^[-\u2022]\s*/, '')}</span>
                    </li>,
                  )
                } else if (line.match(/^\s{2,}/)) {
                  elements.push(
                    <div key={i} className="font-mono text-xs text-slate-500 ml-4 my-0.5">
                      {line.trim()}
                    </div>,
                  )
                } else if (line.trim().match(/^\d+\./)) {
                  elements.push(
                    <div key={i} className="flex gap-2 ml-2 my-0.5">
                      <span>{line.trim()}</span>
                    </div>,
                  )
                } else if (!line.trim()) {
                  elements.push(<div key={i} className="h-2" />)
                } else {
                  elements.push(
                    <p key={i} className="my-1">
                      {line}
                    </p>,
                  )
                }
              })

              flushList()

              // Insert complexity chart right after the title
              if (elements.length > 0) {
                elements.splice(
                  1,
                  0,
                  <ComplexityChart
                    key="complexity-chart"
                    description={description}
                    locale={locale}
                  />,
                )
              }

              return elements
            })()}
          </article>
        </div>
      )}
    </div>
  )
}
