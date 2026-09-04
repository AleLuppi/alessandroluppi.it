/**
 * Small, dependency-free easing and range helpers used by the scroll stage.
 *
 * These are deliberately plain functions rather than an animation library:
 * the stage maps scroll position to CSS custom properties and lets the
 * compositor do the rest, so the only maths that needs to happen in
 * JavaScript is remapping one number into another.
 */

/** Constrain `value` to the inclusive range `[min, max]`. */
export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value))
}

/**
 * Position of `value` within `[from, to]`, normalised to 0-1 and clamped.
 * Used to turn overall track progress into per-act progress.
 */
export function progressBetween(from: number, to: number, value: number): number {
  if (to === from) return value >= to ? 1 : 0
  return clamp((value - from) / (to - from))
}

/**
 * The house easing curve. Quint ease-out decelerates late, which is what
 * makes scroll-linked movement feel like it has weight instead of tracking
 * the wheel one-to-one.
 */
export function easeOutQuint(t: number): number {
  return 1 - (1 - t) ** 5
}

/** Symmetric curve for values that need to settle at both ends. */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2
}

/**
 * Rises from 0 to 1 and falls back to 0 across the range. Beats of copy use
 * this so they fade in, hold, and fade out again as the reader scrolls past.
 */
export function pulse(t: number): number {
  return Math.sin(clamp(t) * Math.PI)
}
