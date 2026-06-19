import AlgorithmShowcase from '@components/AlgorithmShowcase'
import type { Algorithm } from '@lib/types'

export default function HeroShowcase() {
  const openAlgorithm = (algorithm: Algorithm) => {
    window.location.href = `/${algorithm.id}`
  }

  return (
    <div className="landing-showcase">
      <AlgorithmShowcase locale="en" density="landing" onSelectAlgorithm={openAlgorithm} />
    </div>
  )
}
