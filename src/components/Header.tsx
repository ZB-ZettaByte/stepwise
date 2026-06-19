import type { Algorithm } from '@lib/types'
import type { Locale, Translations } from '@i18n/translations'
import { getCategoryName, locales, localeNames } from '@i18n/translations'
import Controls from '@components/Controls'

interface HeaderProps {
  locale: Locale
  t: Translations
  selectedAlgorithm: Algorithm | null
  sidebarCollapsed: boolean
  codePanelCollapsed: boolean
  onExpandSidebar: () => void
  onExpandCodePanel: () => void
  // Controls props
  currentStep: number
  totalSteps: number
  isPlaying: boolean
  speed: number
  onTogglePlay: () => void
  onStepForward: () => void
  onStepBackward: () => void
  onSpeedChange: (speed: number) => void
  onStepChange: (step: number) => void
  // Mobile props
  isMobile?: boolean
  onToggleMobileSidebar?: () => void
  onToggleMobileCodePanel?: () => void
}

const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '')

function withBase(path: string) {
  return `${BASE_PATH}${path}`
}

function getLocaleUrl(targetLocale: Locale, algorithmId?: string) {
  if (targetLocale === 'en') {
    return withBase(algorithmId ? `/${algorithmId}` : '/')
  }

  return withBase(algorithmId ? `/${targetLocale}/${algorithmId}` : `/${targetLocale}/`)
}

export default function Header({
  locale,
  t,
  selectedAlgorithm,
  sidebarCollapsed,
  codePanelCollapsed,
  onExpandSidebar,
  onExpandCodePanel,
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  onTogglePlay,
  onStepForward,
  onStepBackward,
  onSpeedChange,
  onStepChange,
  isMobile = false,
  onToggleMobileSidebar,
  onToggleMobileCodePanel,
}: HeaderProps) {
  return (
    <header
      className="h-16 shrink-0 flex items-center justify-between px-4 md:px-7 border-b border-slate-200 bg-white z-10"
      role="banner"
    >
      {/* Left: Logo + Breadcrumb */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0 shrink-0">
        {isMobile ? (
          <button
            onClick={onToggleMobileSidebar}
            className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-950 shrink-0"
            aria-label={t.openMenu}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        ) : sidebarCollapsed ? (
          <button
            onClick={onExpandSidebar}
            className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-950"
            aria-label={t.expandSidebar}
          >
            <svg
              height="16"
              strokeLinejoin="round"
              viewBox="0 0 16 16"
              width="16"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.245 2.5H14.5V12.5C14.5 13.0523 14.0523 13.5 13.5 13.5H6.245V2.5ZM4.995 2.5H1.5V12.5C1.5 13.0523 1.94772 13.5 2.5 13.5H4.995V2.5ZM0 1H1.5H14.5H16V2.5V12.5C16 13.8807 14.8807 15 13.5 15H2.5C1.11929 15 0 13.8807 0 12.5V2.5V1Z"
                fill="currentColor"
              />
            </svg>
          </button>
        ) : null}
        <a
          href={withBase('/app')}
          className="flex items-center gap-2 md:gap-2.5 hover:opacity-80 transition-opacity min-w-0"
          aria-label="Stepwise — App home"
        >
          <span className="font-semibold text-lg tracking-tight text-slate-950 font-heading">
            Stepwise
          </span>
        </a>
        {selectedAlgorithm && (
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 min-w-0 overflow-hidden"
          >
            <span className="text-slate-300 shrink-0">/</span>
            <span className="text-sm text-slate-500 hidden md:inline shrink-0">
              {getCategoryName(locale, selectedAlgorithm.category)}
            </span>
            <span className="text-slate-300 hidden md:inline shrink-0">/</span>
            <span className="text-sm font-medium text-slate-800 truncate" aria-current="page">
              {selectedAlgorithm.name}
            </span>
          </nav>
        )}
      </div>

      {/* Center: Controls (hidden on mobile, shown in bottom bar instead) */}
      {!isMobile && (
        <div className="flex-1 flex justify-center min-w-0 mx-2">
          <Controls
            currentStep={currentStep}
            totalSteps={totalSteps}
            isPlaying={isPlaying}
            speed={speed}
            onTogglePlay={onTogglePlay}
            onStepForward={onStepForward}
            onStepBackward={onStepBackward}
            onSpeedChange={onSpeedChange}
            onStepChange={onStepChange}
            disabled={totalSteps === 0}
            locale={locale}
          />
        </div>
      )}

      {/* Right: Language switcher + code panel toggle */}
      <div className="flex items-center justify-end gap-2 min-w-0 shrink-0">
        {isMobile && selectedAlgorithm && (
          <button
            onClick={onToggleMobileCodePanel}
            className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-950"
            aria-label={t.viewCode}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
              />
            </svg>
          </button>
        )}
        {!isMobile && codePanelCollapsed && (
          <button
            onClick={onExpandCodePanel}
            className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-950"
            aria-label={t.expandCodePanel}
          >
            <svg
              height="16"
              strokeLinejoin="round"
              viewBox="0 0 16 16"
              width="16"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.755 2.5H1.5V12.5C1.5 13.0523 1.94772 13.5 2.5 13.5H9.755V2.5ZM11.005 2.5H14.5V12.5C14.5 13.0523 14.0523 13.5 13.5 13.5H11.005V2.5ZM16 1H14.5H1.5H0V2.5V12.5C0 13.8807 1.11929 15 2.5 15H13.5C14.8807 15 16 13.8807 16 12.5V2.5V1Z"
                fill="currentColor"
              />
            </svg>
          </button>
        )}
        <nav
          aria-label={t.languageLabel}
          className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5 border border-slate-200"
        >
          {locales.map((l) => (
            <a
              key={l}
              href={getLocaleUrl(l, selectedAlgorithm?.id)}
              className={`px-3 md:px-3.5 py-1.5 text-sm font-medium rounded-md transition-all ${
                l === locale
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-500 hover:text-slate-950 hover:bg-slate-200'
              }`}
              aria-label={localeNames[l]}
              aria-current={l === locale ? 'page' : undefined}
              lang={l}
            >
              {l.toUpperCase()}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
