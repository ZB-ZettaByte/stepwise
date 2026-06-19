import { useEffect, useState } from 'react'
import type { Translations } from '@i18n/translations'
import {
  parseArrayInput,
  MIN_CUSTOM_VALUE,
  MAX_CUSTOM_VALUE,
  MAX_CUSTOM_ARRAY_LENGTH,
} from '@lib/algorithms/shared'

// Strong ease-out curve (from the design guidelines) for snappy, responsive feel.
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)'

interface ArrayInputProps {
  t: Translations
  /** Searching algorithms need a target value in addition to the array. */
  askForTarget?: boolean
  defaultTarget?: number
  /** Apply a parsed custom array to the visualization. */
  onVisualize: (values: number[], target?: number) => void
  /** Restore the algorithm's default array. */
  onReset: () => void
}

/**
 * Small entrance-animated error line. Keyed by message in the parent so a new
 * error re-mounts and re-plays the fade-in.
 */
function ErrorText({ message }: { message: string }) {
  const [shown, setShown] = useState(false)
  useEffect(() => setShown(true), [])

  return (
    <p
      role="alert"
      className="mt-2 text-xs text-red-600"
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(-2px)',
        transition: `opacity 200ms ${EASE_OUT}, transform 200ms ${EASE_OUT}`,
      }}
    >
      {message}
    </p>
  )
}

export default function ArrayInput({
  t,
  askForTarget = false,
  defaultTarget,
  onVisualize,
  onReset,
}: ArrayInputProps) {
  const [text, setText] = useState('')
  const [targetText, setTargetText] = useState(defaultTarget == null ? '' : String(defaultTarget))
  const [error, setError] = useState<string | null>(null)
  const [hasCustom, setHasCustom] = useState(false)

  const hint = t.customArrayHint
    .replace('{min}', String(MIN_CUSTOM_VALUE))
    .replace('{max}', String(MAX_CUSTOM_VALUE))
    .replace('{count}', String(MAX_CUSTOM_ARRAY_LENGTH))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { values, errorKind } = parseArrayInput(text)
    if (errorKind === 'empty') {
      setError(t.customArrayErrorEmpty)
      return
    }
    if (errorKind === 'invalid') {
      setError(t.customArrayErrorInvalid)
      return
    }
    let target: number | undefined
    if (askForTarget) {
      target = Number(targetText.trim())
      if (!targetText.trim() || !Number.isInteger(target)) {
        setError('Enter a whole-number target to search for.')
        return
      }
      if (target < MIN_CUSTOM_VALUE || target > MAX_CUSTOM_VALUE) {
        setError(`Target must be between ${MIN_CUSTOM_VALUE} and ${MAX_CUSTOM_VALUE}.`)
        return
      }
    }
    setError(null)
    setHasCustom(true)
    onVisualize(values, target)
  }

  const handleReset = () => {
    setText('')
    setTargetText(defaultTarget == null ? '' : String(defaultTarget))
    setError(null)
    setHasCustom(false)
    onReset()
  }

  return (
    <div className="w-full max-w-3xl mx-auto mb-5">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <label htmlFor="custom-array" className="sr-only">
            {t.customArrayLabel}
          </label>
          <input
            id="custom-array"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              if (error) setError(null)
            }}
            placeholder={t.customArrayPlaceholder}
            aria-describedby="custom-array-hint"
            aria-invalid={error ? true : undefined}
            className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm font-mono text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-400 transition-colors duration-150"
            style={{ transitionTimingFunction: EASE_OUT }}
          />
          <p id="custom-array-hint" className="mt-2 text-[11px] text-slate-500">
            {hint}
          </p>
        </div>
        {askForTarget && (
          <div className="w-full sm:w-32">
            <label htmlFor="custom-target" className="sr-only">
              Target value
            </label>
            <input
              id="custom-target"
              type="number"
              inputMode="numeric"
              min={MIN_CUSTOM_VALUE}
              max={MAX_CUSTOM_VALUE}
              autoComplete="off"
              value={targetText}
              onChange={(e) => {
                setTargetText(e.target.value)
                if (error) setError(null)
              }}
              placeholder="target"
              aria-label="Target value to search for"
              aria-invalid={error ? true : undefined}
              className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm font-mono text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-400 transition-colors duration-150"
              style={{ transitionTimingFunction: EASE_OUT }}
            />
            <p className="mt-2 text-[11px] text-slate-500">Target value</p>
          </div>
        )}
        {hasCustom && (
          <button
            type="button"
            onClick={handleReset}
            className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-950 active:scale-[0.97] transition-colors duration-150"
            style={{ transitionTimingFunction: EASE_OUT }}
          >
            {t.customArrayReset}
          </button>
        )}
        <button
          type="submit"
          className="shrink-0 rounded-lg px-4 py-2 text-sm font-semibold text-white bg-slate-950 hover:bg-slate-800 active:scale-[0.97] transition-colors duration-150"
          style={{ transitionTimingFunction: EASE_OUT }}
        >
          {t.customArrayButton}
        </button>
      </form>

      {error && <ErrorText key={error} message={error} />}
    </div>
  )
}
