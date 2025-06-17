const tween = (from, to, dur, onUpdate) => {
  const start = performance.now()
  const frame = (now) => {
    const t = Math.min((now - start) / dur, 1)
    onUpdate(from + (to - from) * t)
    if (t < 1) requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

export const onHover = (ref, distance = -1, duration = 200) => {
  const mesh = ref.current
  if (!mesh) return

  if (!mesh.userData._originalPosition) {
    mesh.userData._originalPosition = mesh.position.clone()
  }

  const originalPosition = mesh.userData._originalPosition

  tween(originalPosition.z, originalPosition.z - distance, duration, (newZ) => {
    mesh.position.z = newZ
  })
}

export const onHoverExit = (ref, duration = 200) => {
  const mesh = ref.current
  if (!mesh || !mesh.userData._originalPosition) return

  const originalPosition = mesh.userData._originalPosition

  tween(mesh.position.z, originalPosition.z, duration, (newZ) => {
    mesh.position.z = newZ
  })
}
