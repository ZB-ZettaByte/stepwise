import type { Algorithm, AlgorithmInput, Step, HighlightType } from '@lib/types'
import { getCppCode } from '@lib/algorithms/cpp-code'
import { d } from '@lib/algorithms/shared'

function getInputArray(input?: AlgorithmInput): number[] | undefined {
  return Array.isArray(input) ? input : input?.array
}

function getInputTarget(input?: AlgorithmInput): number | undefined {
  return Array.isArray(input) ? undefined : input?.target
}

const binarySearch: Algorithm = {
  id: 'binary-search',
  name: 'Binary Search',
  category: 'Searching',
  difficulty: 'easy',
  visualization: 'array',
  acceptsCustomArray: true,
  code: `def binary_search(array, target):
    low = 0
    high = len(array) - 1

    while low <= high:
        mid = (low + high) // 2

        if array[mid] == target:
            return mid
        # Target is bigger, so discard the left half
        elif array[mid] < target:
            low = mid + 1
        # Target is smaller, so discard the right half
        else:
            high = mid - 1

    return -1`,
  description: `Binary Search

Binary Search is an efficient algorithm for finding a target value in a sorted array. It works by repeatedly dividing the search interval in half.

Prerequisite: The array must be sorted.

How it works:
1. Compare the target with the middle element
2. If equal, we found the target
3. If target is smaller, search the left half
4. If target is larger, search the right half
5. Repeat until found or search space is empty

Time Complexity:
  Best:    O(1) — target is at the middle
  Average: O(log n)
  Worst:   O(log n)

Space Complexity: O(1) — iterative version

Binary Search is fundamental in computer science and is used extensively in databases, file systems, and as a building block for more complex algorithms.`,
  cppCode: getCppCode('binary-search'),

  generateSteps(locale = 'en', input?: AlgorithmInput) {
    // Binary search needs a sorted array; sort any custom input.
    const inputArray = getInputArray(input)
    const usingCustom = !!(inputArray && inputArray.length > 0)
    const arr = usingCustom
      ? [...inputArray].sort((a, b) => a - b)
      : [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
    const target = getInputTarget(input) ?? (usingCustom ? arr[Math.floor(arr.length / 2)] : 23)
    const steps: Step[] = []

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: Array.from({ length: arr.length }, (_, i) => i),
      description: d(
        locale,
        `Sorted array. Searching for target: ${target}`,
        `Arreglo ordenado. Buscando objetivo: ${target}`,
      ),
      codeLine: 1,
      variables: { target, low: 0, high: arr.length - 1 },
    })

    let low = 0
    let high = arr.length - 1

    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      const rangeH: Record<number, HighlightType> = {}

      for (let i = low; i <= high; i++) rangeH[i] = 'searching'
      rangeH[mid] = 'current'

      steps.push({
        array: [...arr],
        highlights: rangeH,
        sorted: [],
        description: d(
          locale,
          `Search range [${low}..${high}], checking middle index ${mid}: value ${arr[mid]}`,
          `Rango de búsqueda [${low}..${high}], verificando índice medio ${mid}: valor ${arr[mid]}`,
        ),
        codeLine: 6,
        variables: { low, high, mid, target, 'array[mid]': arr[mid] },
      })

      if (arr[mid] === target) {
        steps.push({
          array: [...arr],
          highlights: { [mid]: 'found' },
          sorted: [],
          description: d(
            locale,
            `Found ${target} at index ${mid}!`,
            `¡${target} encontrado en índice ${mid}!`,
          ),
          codeLine: 9,
          variables: { low, high, mid, target, 'array[mid]': arr[mid], result: mid },
        })
        return steps
      } else if (arr[mid] < target) {
        steps.push({
          array: [...arr],
          highlights: { [mid]: 'comparing' },
          sorted: [],
          description: d(
            locale,
            `${arr[mid]} < ${target}, searching right half`,
            `${arr[mid]} < ${target}, buscando en mitad derecha`,
          ),
          codeLine: 12,
          variables: { low: mid + 1, high, mid, target, 'array[mid]': arr[mid] },
        })
        low = mid + 1
      } else {
        steps.push({
          array: [...arr],
          highlights: { [mid]: 'comparing' },
          sorted: [],
          description: d(
            locale,
            `${arr[mid]} > ${target}, searching left half`,
            `${arr[mid]} > ${target}, buscando en mitad izquierda`,
          ),
          codeLine: 15,
          variables: { low, high: mid - 1, mid, target, 'array[mid]': arr[mid] },
        })
        high = mid - 1
      }
    }

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [],
      description: d(
        locale,
        `Target ${target} not found in the array.`,
        `Objetivo ${target} no encontrado en el arreglo.`,
      ),
      codeLine: 17,
      variables: { low, high, target, result: -1 },
    })

    return steps
  },
}

// ============================================================
// LINEAR SEARCH
// ============================================================
const linearSearch: Algorithm = {
  id: 'linear-search',
  name: 'Linear Search',
  category: 'Searching',
  difficulty: 'easy',
  visualization: 'array',
  acceptsCustomArray: true,
  code: `def linear_search(array, target):
    for i in range(len(array)):
        if array[i] == target:
            return i

    return -1`,
  description: `Linear Search

Linear Search (or Sequential Search) is the simplest searching algorithm. It checks every element in the list sequentially until the target is found or the list is exhausted.

How it works:
1. Start from the first element
2. Compare each element with the target
3. If a match is found, return the index
4. If the end is reached without a match, return -1

Time Complexity:
  Best:    O(1) — target is the first element
  Average: O(n)
  Worst:   O(n) — target is last or not present

Space Complexity: O(1)

Properties:
  - Works on unsorted arrays
  - No preprocessing needed
  - Simple to implement

Linear Search is useful for small datasets or unsorted data where more efficient algorithms cannot be applied.`,
  cppCode: getCppCode('linear-search'),

  generateSteps(locale = 'en', input?: AlgorithmInput) {
    // Linear search works on any order, so keep the custom array as typed.
    const inputArray = getInputArray(input)
    const usingCustom = !!(inputArray && inputArray.length > 0)
    const arr = usingCustom ? [...inputArray] : [14, 33, 27, 10, 35, 19, 42, 44]
    const target = getInputTarget(input) ?? (usingCustom ? arr[Math.floor(arr.length / 2)] : 35)
    const steps: Step[] = []

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [],
      description: d(
        locale,
        `Unsorted array. Searching for target: ${target}`,
        `Arreglo sin ordenar. Buscando objetivo: ${target}`,
      ),
      codeLine: 1,
      variables: { target, 'array.length': arr.length },
    })

    for (let i = 0; i < arr.length; i++) {
      steps.push({
        array: [...arr],
        highlights: { [i]: 'current' },
        sorted: [],
        description: d(
          locale,
          `Checking index ${i}: ${arr[i]} ${arr[i] === target ? '=' : '≠'} ${target}`,
          `Verificando índice ${i}: ${arr[i]} ${arr[i] === target ? '=' : '≠'} ${target}`,
        ),
        codeLine: 2,
        variables: { i, target, 'array[i]': arr[i] },
      })

      if (arr[i] === target) {
        steps.push({
          array: [...arr],
          highlights: { [i]: 'found' },
          sorted: [],
          description: d(
            locale,
            `Found ${target} at index ${i}!`,
            `¡${target} encontrado en índice ${i}!`,
          ),
          codeLine: 4,
          variables: { i, target, 'array[i]': arr[i], result: i },
        })
        return steps
      }
    }

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [],
      description: d(locale, `Target ${target} not found.`, `Objetivo ${target} no encontrado.`),
      codeLine: 6,
      variables: { target, result: -1 },
    })

    return steps
  },
}

// ============================================================
// JUMP SEARCH
// ============================================================
const jumpSearch: Algorithm = {
  id: 'jump-search',
  name: 'Jump Search',
  category: 'Searching',
  difficulty: 'intermediate',
  visualization: 'array',
  acceptsCustomArray: true,
  code: `def jump_search(array, target):
    n = len(array)
    jump = int(n ** 0.5)
    prev = 0
    curr = jump

    # Jump in blocks past the target
    while curr < n and array[curr] <= target:
        prev = curr
        curr += jump

    # Target, if present, is in this block
    for i in range(prev, min(curr, n)):
        if array[i] == target:
            return i

    return -1`,
  description: `Jump Search

Jump Search is a searching algorithm for sorted arrays. It works by jumping ahead in fixed-size blocks (√n) and then performing a linear search within the identified block.

Prerequisite: The array must be sorted.

How it works:
1. Calculate the block size as √n
2. Jump through the array in blocks until we find a block where the target could be
3. Once the right block is found, perform a linear search within it
4. Return the index if found, -1 otherwise

Time Complexity:
  Best:    O(1) — target is at the first position
  Average: O(√n)
  Worst:   O(√n)

Space Complexity: O(1)

Properties:
  - Works only on sorted arrays
  - Better than Linear Search, worse than Binary Search
  - Optimal block size is √n

Jump Search is useful when jumping back is costly (e.g., on tape drives). It provides a good middle ground between Linear and Binary Search.`,
  cppCode: getCppCode('jump-search'),

  generateSteps(locale = 'en', input?: AlgorithmInput) {
    // Jump search needs a sorted array; sort any custom input.
    const inputArray = getInputArray(input)
    const usingCustom = !!(inputArray && inputArray.length > 0)
    const arr = usingCustom
      ? [...inputArray].sort((a, b) => a - b)
      : [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
    const target = getInputTarget(input) ?? (usingCustom ? arr[Math.floor(arr.length / 2)] : 38)
    const steps: Step[] = []
    const n = arr.length
    const jump = Math.floor(Math.sqrt(n))

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: Array.from({ length: n }, (_, i) => i),
      description: d(
        locale,
        `Sorted array. Searching for target: ${target}. Jump size: √${n} = ${jump}`,
        `Arreglo ordenado. Buscando objetivo: ${target}. Tamaño de salto: √${n} = ${jump}`,
      ),
      codeLine: 1,
      variables: { target, n, jump },
    })

    let prev = 0
    let curr = jump

    // Jump phase
    while (curr < n && arr[curr] <= target) {
      const blockH: Record<number, HighlightType> = {}
      for (let i = prev; i <= curr; i++) blockH[i] = 'searching'
      blockH[curr] = 'current'

      steps.push({
        array: [...arr],
        highlights: blockH,
        sorted: [],
        description: d(
          locale,
          `Jumping: arr[${curr}] = ${arr[curr]} ≤ ${target}. Jump to next block.`,
          `Saltando: arr[${curr}] = ${arr[curr]} ≤ ${target}. Saltar al siguiente bloque.`,
        ),
        codeLine: 8,
        variables: { prev, curr, jump, 'arr[curr]': arr[curr], target },
      })

      prev = curr
      curr += jump
    }

    // Show the block we'll search
    const endIdx = Math.min(curr, n) - 1
    const searchBlockH: Record<number, HighlightType> = {}
    for (let i = prev; i <= endIdx; i++) searchBlockH[i] = 'searching'

    steps.push({
      array: [...arr],
      highlights: searchBlockH,
      sorted: [],
      description: d(
        locale,
        `Target must be in block [${prev}..${endIdx}]. Starting linear search.`,
        `El objetivo debe estar en el bloque [${prev}..${endIdx}]. Iniciando búsqueda lineal.`,
      ),
      codeLine: 13,
      variables: { prev, end: Math.min(curr, n), target },
    })

    // Linear search phase
    for (let i = prev; i < Math.min(curr, n); i++) {
      steps.push({
        array: [...arr],
        highlights: { [i]: 'current' },
        sorted: [],
        description: d(
          locale,
          `Checking index ${i}: ${arr[i]} ${arr[i] === target ? '=' : '≠'} ${target}`,
          `Verificando índice ${i}: ${arr[i]} ${arr[i] === target ? '=' : '≠'} ${target}`,
        ),
        codeLine: 14,
        variables: { i, 'arr[i]': arr[i], target },
      })

      if (arr[i] === target) {
        steps.push({
          array: [...arr],
          highlights: { [i]: 'found' },
          sorted: [],
          description: d(
            locale,
            `Found ${target} at index ${i}!`,
            `¡${target} encontrado en índice ${i}!`,
          ),
          codeLine: 15,
          variables: { i, target, result: i },
        })
        return steps
      }
    }

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [],
      description: d(locale, `Target ${target} not found.`, `Objetivo ${target} no encontrado.`),
      codeLine: 17,
      variables: { target, result: -1 },
    })

    return steps
  },
}

// ============================================================
// INTERPOLATION SEARCH
// ============================================================
const interpolationSearch: Algorithm = {
  id: 'interpolation-search',
  name: 'Interpolation Search',
  category: 'Searching',
  difficulty: 'intermediate',
  visualization: 'array',
  acceptsCustomArray: true,
  code: `def interpolation_search(array, target):
    low = 0
    high = len(array) - 1

    # Search while target is within range
    while low <= high and target >= array[low] and target <= array[high]:
        # Estimate target position from its value
        pos = low + (target - array[low]) * (high - low) // (array[high] - array[low])

        if array[pos] == target:
            return pos
        # Guess too low, search the right
        elif array[pos] < target:
            low = pos + 1
        # Guess too high, search the left
        else:
            high = pos - 1

    return -1`,
  description: `Interpolation Search

Interpolation Search is an improved variant of Binary Search for uniformly distributed sorted arrays. Instead of always checking the middle, it estimates the position of the target based on its value relative to the range.

Prerequisite: The array must be sorted. Best performance on uniformly distributed data.

How it works:
1. Estimate the position using the interpolation formula:
   pos = low + ((target - arr[low]) × (high - low)) / (arr[high] - arr[low])
2. If the element at pos matches the target, return it
3. If the element is less than the target, search the right portion
4. If greater, search the left portion
5. Repeat until found or search space is exhausted

Time Complexity:
  Best:    O(1)
  Average: O(log log n) — for uniformly distributed data
  Worst:   O(n) — for non-uniform distribution

Space Complexity: O(1)

Interpolation Search excels on large, uniformly distributed datasets. For non-uniform data, Binary Search may be more reliable.`,
  cppCode: getCppCode('interpolation-search'),

  generateSteps(locale = 'en', input?: AlgorithmInput) {
    // Interpolation search needs a sorted array; sort any custom input.
    const inputArray = getInputArray(input)
    const usingCustom = !!(inputArray && inputArray.length > 0)
    const arr = usingCustom
      ? [...inputArray].sort((a, b) => a - b)
      : [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    const target = getInputTarget(input) ?? (usingCustom ? arr[Math.floor(arr.length / 2)] : 70)
    const steps: Step[] = []
    const n = arr.length

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: Array.from({ length: n }, (_, i) => i),
      description: d(
        locale,
        `Uniformly distributed sorted array. Searching for target: ${target}`,
        `Arreglo ordenado uniformemente distribuido. Buscando objetivo: ${target}`,
      ),
      codeLine: 1,
      variables: { target, low: 0, high: n - 1 },
    })

    let low = 0
    let high = n - 1

    while (low <= high && target >= arr[low] && target <= arr[high]) {
      // Guard against equal bounds (possible with custom input) to avoid divide-by-zero.
      const range = arr[high] - arr[low]
      const pos = range === 0 ? low : low + Math.floor(((target - arr[low]) * (high - low)) / range)

      const rangeH: Record<number, HighlightType> = {}
      for (let i = low; i <= high; i++) rangeH[i] = 'searching'
      rangeH[pos] = 'current'

      steps.push({
        array: [...arr],
        highlights: rangeH,
        sorted: [],
        description: d(
          locale,
          `Range [${low}..${high}]. Estimated position: ${pos} (value ${arr[pos]})`,
          `Rango [${low}..${high}]. Posición estimada: ${pos} (valor ${arr[pos]})`,
        ),
        codeLine: 8,
        variables: { low, high, pos, target, 'arr[pos]': arr[pos] },
      })

      if (arr[pos] === target) {
        steps.push({
          array: [...arr],
          highlights: { [pos]: 'found' },
          sorted: [],
          description: d(
            locale,
            `Found ${target} at index ${pos}!`,
            `¡${target} encontrado en índice ${pos}!`,
          ),
          codeLine: 11,
          variables: { low, high, pos, target, result: pos },
        })
        return steps
      } else if (arr[pos] < target) {
        steps.push({
          array: [...arr],
          highlights: { [pos]: 'comparing' },
          sorted: [],
          description: d(
            locale,
            `${arr[pos]} < ${target}, narrowing to right portion`,
            `${arr[pos]} < ${target}, acotando a la porción derecha`,
          ),
          codeLine: 14,
          variables: { low: pos + 1, high, pos, target },
        })
        low = pos + 1
      } else {
        steps.push({
          array: [...arr],
          highlights: { [pos]: 'comparing' },
          sorted: [],
          description: d(
            locale,
            `${arr[pos]} > ${target}, narrowing to left portion`,
            `${arr[pos]} > ${target}, acotando a la porción izquierda`,
          ),
          codeLine: 17,
          variables: { low, high: pos - 1, pos, target },
        })
        high = pos - 1
      }
    }

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [],
      description: d(locale, `Target ${target} not found.`, `Objetivo ${target} no encontrado.`),
      codeLine: 19,
      variables: { target, result: -1 },
    })

    return steps
  },
}

// ============================================================
// QUICKSELECT / MEDIAN FINDING
// ============================================================

const quickselect: Algorithm = {
  id: 'quickselect',
  name: 'Quickselect / Median Finding',
  category: 'Searching',
  difficulty: 'advanced',
  visualization: 'array',
  acceptsCustomArray: true,
  code: `def quickselect(array, k):
    left = 0
    right = len(array) - 1

    while left <= right:
        pivot_index = partition(array, left, right)

        if pivot_index == k:
            return array[pivot_index]
        elif pivot_index < k:
            left = pivot_index + 1
        else:
            right = pivot_index - 1

def partition(array, left, right):
    pivot = array[right]
    store = left

    for i in range(left, right):
        if array[i] < pivot:
            array[store], array[i] = array[i], array[store]
            store += 1

    array[store], array[right] = array[right], array[store]
    return store`,
  description: `Quickselect / Median Finding

Quickselect finds the kth smallest item without fully sorting the array. It uses the same partition idea as Quicksort, but only recurses into one side.

For median finding:
  k = floor(n / 2)

How it works:
1. Pick a pivot
2. Partition values smaller than the pivot to the left
3. The pivot lands at its final sorted index
4. If that index is k, we found the kth smallest value
5. Otherwise, continue only on the side that contains k

Time Complexity:
  Best/Average: O(n)
  Worst: O(n²) — consistently terrible pivots

Space Complexity: O(1) iterative version

Quickselect is useful when you need one order statistic, like median, percentile, or kth smallest, but do not need a fully sorted array.`,
  cppCode: getCppCode('quickselect'),

  generateSteps(locale = 'en', input?: AlgorithmInput) {
    const inputArray = getInputArray(input)
    const arr = inputArray && inputArray.length > 0 ? [...inputArray] : [31, 12, 45, 7, 22, 19, 38]
    const k = Math.floor(arr.length / 2)
    const steps: Step[] = []
    let left = 0
    let right = arr.length - 1

    const makeRangeHighlights = (start: number, end: number): Record<number, HighlightType> => {
      const highlights: Record<number, HighlightType> = {}
      for (let i = start; i <= end; i++) highlights[i] = 'searching'
      return highlights
    }

    steps.push({
      array: [...arr],
      highlights: { [k]: 'selected' },
      sorted: [],
      description: d(
        locale,
        `Find the median: k = floor(${arr.length}/2) = ${k}. We need the value that belongs at index ${k}.`,
        `Encontrar la mediana: k = floor(${arr.length}/2) = ${k}. Necesitamos el valor que pertenece al índice ${k}.`,
      ),
      codeLine: 1,
      variables: { k, n: arr.length },
    })

    while (left <= right) {
      const pivotValue = arr[right]
      let store = left

      const rangeHighlights: Record<number, HighlightType> = {}
      for (let i = left; i <= right; i++) rangeHighlights[i] = 'searching'
      rangeHighlights[right] = 'pivot'

      steps.push({
        array: [...arr],
        highlights: rangeHighlights,
        sorted: [],
        description: d(
          locale,
          `Partition range [${left}..${right}] with pivot ${pivotValue}.`,
          `Particionar rango [${left}..${right}] con pivote ${pivotValue}.`,
        ),
        codeLine: 16,
        variables: { left, right, pivot: pivotValue, store },
      })

      for (let i = left; i < right; i++) {
        steps.push({
          array: [...arr],
          highlights: { ...rangeHighlights, [i]: 'current', [store]: 'selected' },
          sorted: [],
          description: d(
            locale,
            `Compare ${arr[i]} with pivot ${pivotValue}. ${arr[i] < pivotValue ? 'Move it into the small side.' : 'Leave it on the large side.'}`,
            `Comparar ${arr[i]} con pivote ${pivotValue}. ${arr[i] < pivotValue ? 'Mover al lado pequeño.' : 'Dejar en el lado grande.'}`,
          ),
          codeLine: 20,
          variables: { i, store, pivot: pivotValue, 'array[i]': arr[i] },
        })

        if (arr[i] < pivotValue) {
          ;[arr[store], arr[i]] = [arr[i], arr[store]]
          steps.push({
            array: [...arr],
            highlights: { [store]: 'swapped', [i]: 'swapped', [right]: 'pivot' },
            sorted: [],
            description: d(
              locale,
              `Swap into the small side. store moves from ${store} to ${store + 1}.`,
              `Intercambiar hacia el lado pequeño. store avanza de ${store} a ${store + 1}.`,
            ),
            codeLine: 22,
            variables: { i, store: store + 1, pivot: pivotValue },
          })
          store++
        }
      }

      ;[arr[store], arr[right]] = [arr[right], arr[store]]
      const pivotIndex = store

      steps.push({
        array: [...arr],
        highlights: { [pivotIndex]: 'pivot', [k]: pivotIndex === k ? 'found' : 'selected' },
        sorted: [pivotIndex],
        description: d(
          locale,
          `Pivot ${pivotValue} lands at index ${pivotIndex}. Its final sorted position is known.`,
          `El pivote ${pivotValue} cae en índice ${pivotIndex}. Su posición final ordenada ya se conoce.`,
        ),
        codeLine: 25,
        variables: { pivot_index: pivotIndex, k, pivot: pivotValue },
      })

      if (pivotIndex === k) {
        steps.push({
          array: [...arr],
          highlights: { [pivotIndex]: 'found' },
          sorted: [pivotIndex],
          description: d(
            locale,
            `Found the median: ${arr[pivotIndex]} at index ${pivotIndex}. No full sort needed.`,
            `Mediana encontrada: ${arr[pivotIndex]} en índice ${pivotIndex}. No hizo falta ordenar todo.`,
          ),
          codeLine: 9,
          variables: { median: arr[pivotIndex], index: pivotIndex },
        })
        return steps
      }

      if (pivotIndex < k) {
        left = pivotIndex + 1
        steps.push({
          array: [...arr],
          highlights: makeRangeHighlights(left, right),
          sorted: [pivotIndex],
          description: d(
            locale,
            `Pivot index ${pivotIndex} is too small. Continue only on the right side.`,
            `El índice del pivote ${pivotIndex} es muy pequeño. Continuar solo por la derecha.`,
          ),
          codeLine: 12,
          variables: { left, right, k },
        })
      } else {
        right = pivotIndex - 1
        steps.push({
          array: [...arr],
          highlights: makeRangeHighlights(left, right),
          sorted: [pivotIndex],
          description: d(
            locale,
            `Pivot index ${pivotIndex} is too large. Continue only on the left side.`,
            `El índice del pivote ${pivotIndex} es muy grande. Continuar solo por la izquierda.`,
          ),
          codeLine: 14,
          variables: { left, right, k },
        })
      }
    }

    return steps
  },
}

export { binarySearch, linearSearch, jumpSearch, interpolationSearch, quickselect }
