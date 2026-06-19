import AlgorithmShowcase from '@components/AlgorithmShowcase'
import type { Algorithm } from '@lib/types'

const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '')

function withBase(path: string): string {
  return `${BASE_PATH}${path.startsWith('/') ? path : `/${path}`}`
}

export default function HeroShowcase() {
  const openAlgorithm = (algorithm: Algorithm) => {
    window.location.href = withBase(`/${algorithm.id}`)
  }

  return (
    <div className="landing-showcase">
      <AlgorithmShowcase locale="en" density="landing" onSelectAlgorithm={openAlgorithm} />
    </div>
  )
}
