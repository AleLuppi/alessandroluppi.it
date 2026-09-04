/**
 * Tracks the user's `prefers-reduced-motion` setting reactively.
 *
 * Resolves to `false` during server rendering, which is intentional: the
 * prerendered HTML is the static, motion-free layout, and motion is only
 * ever added on the client once this has confirmed it is welcome.
 */
export function useReducedMotion(): Readonly<Ref<boolean>> {
  const prefersReduced = ref(false)
  let media: MediaQueryList | undefined

  const sync = () => {
    prefersReduced.value = media?.matches ?? false
  }

  onMounted(() => {
    media = window.matchMedia('(prefers-reduced-motion: reduce)')
    sync()
    media.addEventListener('change', sync)
  })

  onBeforeUnmount(() => {
    media?.removeEventListener('change', sync)
  })

  return readonly(prefersReduced)
}
