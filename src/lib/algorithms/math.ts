import type { Algorithm, Step, HighlightType } from '@lib/types'
import { getCppCode } from '@lib/algorithms/cpp-code'
import { d } from '@lib/algorithms/shared'

const sieveOfEratosthenes: Algorithm = {
  id: 'sieve-of-eratosthenes',
  name: 'Sieve of Eratosthenes',
  category: 'Math',
  difficulty: 'intermediate',
  visualization: 'matrix',
  code: `def sieve_of_eratosthenes(n):
    is_prime = [True] * (n + 1)
    # 0 and 1 are not prime by definition
    is_prime[0] = False
    is_prime[1] = False

    # Check factors up to sqrt of n
    i = 2
    while i * i <= n:
        if is_prime[i]:
            # Smaller multiples were already crossed by smaller primes
            j = i * i
            while j <= n:
                is_prime[j] = False
                j = j + i
        i = i + 1

    primes = []
    for number in range(2, n + 1):
        if is_prime[number]:
            primes.append(number)

    return primes


sieve_of_eratosthenes(30)`,
  description: `Sieve of Eratosthenes

The Sieve of Eratosthenes is a classic algorithm for finding all prime numbers up to a limit n. It works by iteratively marking the multiples of each prime, starting from 2.

How it works:
1. Create a boolean array marking 2..n as potentially prime
2. For each i from 2 up to √n, if i is still marked prime, mark every multiple of i (starting from i²) as composite
3. Numbers that remain marked after the loop are the primes ≤ n

Why start crossing from i²?
  All smaller multiples of i (2i, 3i, …, (i−1)i) have already been crossed by a smaller prime.

Time Complexity:
  Best:    O(n log log n)
  Average: O(n log log n)
  Worst:   O(n log log n)

Space Complexity: O(n)

Properties:
  - Deterministic, no randomness
  - Cache-friendly when n fits in memory
  - Foundational for number theory and cryptography preprocessing`,
  cppCode: getCppCode('sieve-of-eratosthenes'),

  generateSteps(locale = 'en') {
    const N = 30
    const COLS = 6
    const ROWS = Math.ceil(N / COLS)

    const values: (number | string)[][] = Array.from({ length: ROWS }, (_, r) =>
      Array.from({ length: COLS }, (_, c) => r * COLS + c + 1),
    )

    const cellOf = (v: number): [number, number] => [Math.floor((v - 1) / COLS), (v - 1) % COLS]

    const steps: Step[] = []
    const composite = new Set<number>()

    const buildHighlights = (
      currentPrime: number | null,
      currentMultiple: number | null,
    ): Record<string, HighlightType> => {
      const h: Record<string, HighlightType> = {}
      h['0,0'] = 'sorted'
      for (const c of composite) {
        const [r, col] = cellOf(c)
        h[`${r},${col}`] = 'placed'
      }
      if (currentPrime != null) {
        const [r, col] = cellOf(currentPrime)
        h[`${r},${col}`] = 'current'
      }
      if (currentMultiple != null) {
        const [r, col] = cellOf(currentMultiple)
        h[`${r},${col}`] = 'checking'
      }
      return h
    }

    steps.push({
      matrix: {
        rows: ROWS,
        cols: COLS,
        values,
        highlights: buildHighlights(null, null),
      },
      description: d(
        locale,
        `Initialize: assume every number from 2 to ${N} is prime. 1 is excluded by definition.`,
        `Inicializar: asumimos que todo número de 2 a ${N} es primo. 1 se excluye por definición.`,
      ),
      codeLine: 2,
      variables: { n: N, primes: 0 },
    })

    const limit = Math.floor(Math.sqrt(N))
    for (let i = 2; i <= limit; i++) {
      if (composite.has(i)) continue

      steps.push({
        matrix: {
          rows: ROWS,
          cols: COLS,
          values,
          highlights: buildHighlights(i, null),
        },
        description: d(
          locale,
          `${i} is still marked prime. Cross out its multiples starting from ${i}² = ${i * i}.`,
          `${i} sigue marcado como primo. Tachar sus múltiplos empezando en ${i}² = ${i * i}.`,
        ),
        codeLine: 10,
        variables: { i, 'i*i': i * i },
      })

      for (let j = i * i; j <= N; j += i) {
        steps.push({
          matrix: {
            rows: ROWS,
            cols: COLS,
            values,
            highlights: buildHighlights(i, j),
          },
          description: d(
            locale,
            `Mark ${j} as composite (multiple of ${i}).`,
            `Marcar ${j} como compuesto (múltiplo de ${i}).`,
          ),
          codeLine: 14,
          variables: { i, j },
        })
        composite.add(j)
      }
    }

    const primes: number[] = []
    for (let k = 2; k <= N; k++) if (!composite.has(k)) primes.push(k)

    const finalHighlights: Record<string, HighlightType> = { '0,0': 'sorted' }
    for (let k = 2; k <= N; k++) {
      const [r, col] = cellOf(k)
      finalHighlights[`${r},${col}`] = composite.has(k) ? 'placed' : 'pivot'
    }

    steps.push({
      matrix: {
        rows: ROWS,
        cols: COLS,
        values,
        highlights: finalHighlights,
      },
      description: d(
        locale,
        `Done. Primes ≤ ${N}: ${primes.join(', ')} (${primes.length} primes).`,
        `Listo. Primos ≤ ${N}: ${primes.join(', ')} (${primes.length} primos).`,
      ),
      codeLine: 23,
      variables: { count: primes.length, primes: primes.join(',') },
      consoleOutput: [`[${primes.join(', ')}]`],
    })

    return steps
  },
}

export { sieveOfEratosthenes }
