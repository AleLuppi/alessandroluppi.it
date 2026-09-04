/**
 * Scroll-driven stage engine.
 *
 * A "stage" is a tall track containing a sticky pin. As the track scrolls
 * past, the pin stays fixed and this composable maps how far the track has
 * travelled onto a set of named acts, writing each act's 0-1 progress to a
 * CSS custom property (`--p-hero`, `--p-fold`, ...).
 *
 * Why custom properties rather than driving styles from JavaScript: the only
 * per-frame work here is writing a handful of numbers. Every transform,
 * opacity and clip that reacts to them is declared in CSS and handled by the
 * compositor, so the main thread stays free even on a low-end phone.
 *
 * The stage is strictly an enhancement. Server-rendered output and any
 * client that prefers reduced motion get the plain stacked layout, with the
 * same text in the same order, and no listener is ever attached.
 */

export interface StageAct {
  /** Suffix of the custom property to write, e.g. `hero` sets `--p-hero`. */
  readonly id: string
  /** Track progress at which this act begins, 0-1. */
  readonly start: number
  /** Track progress at which this act completes, 0-1. */
  readonly end: number
  /** Optional shaping curve; defaults to linear so acts chain seamlessly. */
  readonly ease?: (t: number) => number
}

export interface ScrollStageOptions {
  /** Acts to publish, in narrative order. Ranges may overlap. */
  readonly acts: readonly StageAct[]
  /**
   * Called whenever the pin is measured. Returns custom properties (in px or
   * any CSS unit) describing geometry that depends on the pin's real size,
   * such as where the laptop screen sits. Keeping this a callback lets the
   * component own its geometry while the composable owns the loop.
   */
  readonly measure?: (size: { width: number, height: number }) => Record<string, string>
}

export interface ScrollStage {
  /** Attach to the tall outer track element. */
  readonly track: Ref<HTMLElement | null>
  /** Attach to the sticky inner element. */
  readonly pin: Ref<HTMLElement | null>
  /** True once mounted on a client that welcomes motion. */
  readonly isCinematic: Readonly<Ref<boolean>>
  /** Overall track progress, 0-1. Exposed for components that need it in JS. */
  readonly progress: Readonly<Ref<number>>
}

/** Below this delta a frame would not change a rendered pixel, so it is skipped. */
const EPSILON = 0.0004

export function useScrollStage(options: ScrollStageOptions): ScrollStage {
  const track = ref<HTMLElement | null>(null)
  const pin = ref<HTMLElement | null>(null)
  const progress = ref(0)

  const isMounted = ref(false)
  const prefersReduced = useReducedMotion()
  const isCinematic = computed(() => isMounted.value && !prefersReduced.value)

  let frame = 0
  let lastWritten = Number.NaN

  /** Push the current progress out as custom properties on the track. */
  function publish(value: number): void {
    const el = track.value
    if (!el) return

    el.style.setProperty('--p', value.toFixed(4))
    for (const act of options.acts) {
      const local = progressBetween(act.start, act.end, value)
      const shaped = act.ease ? act.ease(local) : local
      el.style.setProperty(`--p-${act.id}`, shaped.toFixed(4))
    }
  }

  /**
   * Recompute geometry that depends on the pin's size. Runs on mount and on
   * resize only - never per frame, because it reads layout.
   */
  function measure(): void {
    const el = track.value
    const pinEl = pin.value
    if (!el || !pinEl || !options.measure) return

    const props = options.measure({
      width: pinEl.offsetWidth,
      height: pinEl.offsetHeight,
    })
    for (const [name, value] of Object.entries(props)) {
      el.style.setProperty(name, value)
    }
  }

  function update(): void {
    frame = 0
    const el = track.value
    const pinEl = pin.value
    if (!el || !pinEl) return

    // The sticky pin travels exactly (track height - pin height). Measuring
    // against the pin rather than the window keeps this stable on mobile,
    // where the browser chrome changes `innerHeight` mid-scroll.
    const travel = el.offsetHeight - pinEl.offsetHeight
    const value = travel <= 0 ? 0 : clamp(-el.getBoundingClientRect().top / travel)

    if (Math.abs(value - lastWritten) < EPSILON) return
    lastWritten = value
    progress.value = value
    publish(value)
  }

  function schedule(): void {
    if (frame) return
    frame = requestAnimationFrame(update)
  }

  function onResize(): void {
    measure()
    lastWritten = Number.NaN
    schedule()
  }

  function start(): void {
    measure()
    lastWritten = Number.NaN
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
  }

  function stop(): void {
    if (frame) cancelAnimationFrame(frame)
    frame = 0
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', onResize)
  }

  onMounted(() => {
    isMounted.value = true
  })

  watch(isCinematic, (on) => {
    if (!import.meta.client) return
    if (on) nextTick(start)
    else stop()
  })

  onBeforeUnmount(() => {
    if (import.meta.client) stop()
  })

  return {
    track,
    pin,
    isCinematic: readonly(isCinematic),
    progress: readonly(progress),
  }
}
