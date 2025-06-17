/**
 * @param cardRefs
 * @param groupRef
 */
export function animateDeal(cardRefs, groupRef, isMobile) {
  const origin = groupRef.current.position
  const total = cardRefs.length

  const spacingX = isMobile ? 1.2 : 1.5
  const spacingY = isMobile ? 0.5 : 1.2
  const separationZ = 0.3
  const yPosition = 1
  const duration = 600
  const delayEach = 200

  function tween(from, to, dur, onUpdate) {
    const start = performance.now()
    function frame(now) {
      const t = Math.min((now - start) / dur, 1)
      onUpdate(from + (to - from) * t)
      if (t < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }

  cardRefs.forEach((ref, i) => {
    const m = ref.current
    if (!m) return

    m.position.set(origin.x, origin.y, origin.z)
    m.rotation.set(0, Math.PI, 0)

    // const xEnd = -((total - 1) / 2) * spacingX + i * spacingX

    const maxCardsPerRow = isMobile ? 4 : total
    const row = Math.floor(i / maxCardsPerRow)
    const indexInRow = i % maxCardsPerRow
    const cardsThisRow = Math.min(maxCardsPerRow, total - row * maxCardsPerRow)

    const xEnd = -((cardsThisRow - 1) / 2) * spacingX + indexInRow * spacingX
    const yEnd = yPosition - (i >= maxCardsPerRow ? spacingY : spacingY - 1)
    const zEnd = 0.5 + i * separationZ
    const rotY = (i - (total - 1) / 2) * 0.1

    setTimeout(() => {
      tween(m.position.x, xEnd, duration, (v) => (m.position.x = v))
      tween(m.position.y, yEnd, duration, (v) => (m.position.y = v))
      tween(m.position.z, zEnd, duration, (v) => (m.position.z = v))
      tween(m.rotation.y, rotY, duration, (r) => (m.rotation.y = r))
    }, i * delayEach)
  })
}
