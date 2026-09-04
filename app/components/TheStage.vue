<script setup lang="ts">
/**
 * The scroll-driven narrative that carries the whole landing page.
 *
 * Five acts, all inside one sticky viewport:
 *
 *   1. hero   the opening line, full bleed
 *   2. fold   the viewport narrows until it *is* a laptop screen
 *   3. flow   pulses run through that screen while the AI beats appear
 *   4. close  the lid tips back, uncovering the watch behind it
 *   5. craft  the watch turns upright and the software beats land
 *
 * Layout is written twice on purpose. The default styles are an ordinary
 * stacked document - the version that ships in the prerendered HTML, that a
 * crawler reads, and that anyone preferring reduced motion sees. Everything
 * under `.stage--cinematic` is the pinned version, applied only once the
 * client has confirmed motion is welcome.
 */

const { t } = useI18n()

/** Beat ids. Kept in code so the act ranges and the copy cannot drift apart. */
const AI_BEATS = ['product', 'practice', 'page'] as const

/**
 * Act ranges, expressed as fractions of the track. Ranges overlap where one
 * act should begin before the previous has settled. The tail after the last
 * act is a deliberate hold, so the closing composition rests for a moment
 * before the pin releases.
 */
const { track, pin, isCinematic } = useScrollStage({
  acts: [
    { id: 'hero', start: 0.03, end: 0.15 },
    { id: 'fold', start: 0.06, end: 0.30, ease: easeInOutCubic },
    { id: 'line', start: 0.20, end: 0.44, ease: pulse },
    { id: 'flow', start: 0.26, end: 0.42 },
    { id: 'product', start: 0.30, end: 0.44, ease: pulse },
    { id: 'practice', start: 0.44, end: 0.58, ease: pulse },
    { id: 'page', start: 0.58, end: 0.72, ease: pulse },
    { id: 'close', start: 0.64, end: 0.80, ease: easeInOutCubic },
    { id: 'craft', start: 0.76, end: 0.92, ease: easeOutQuint },
  ],

  /**
   * Derive the laptop screen rectangle from the real pin size. The clip that
   * shrinks the viewport, the frame drawn around it and the base underneath
   * all read these, so they cannot fall out of alignment at any width.
   */
  measure: ({ width, height }) => {
    const widthLimited = Math.min(width * 0.88, 1088)
    const screenH = Math.min(widthLimited / 1.6, height * 0.52)
    const screenW = screenH * 1.6
    const baseH = Math.max(9, screenH * 0.05)

    // Sit the device a little above centre to leave room for the copy below.
    const top = Math.max(16, (height - (screenH + baseH)) / 2 - height * 0.06)
    const left = (width - screenW) / 2

    return {
      '--screen-w': `${screenW.toFixed(1)}px`,
      '--screen-h': `${screenH.toFixed(1)}px`,
      '--screen-x': `${left.toFixed(1)}px`,
      '--screen-y': `${top.toFixed(1)}px`,
      '--base-h': `${baseH.toFixed(1)}px`,
      '--fold-t': `${top.toFixed(1)}px`,
      '--fold-r': `${(width - left - screenW).toFixed(1)}px`,
      '--fold-b': `${(height - top - screenH).toFixed(1)}px`,
      '--fold-l': `${left.toFixed(1)}px`,
    }
  },
})
</script>

<template>
  <div
    ref="track"
    class="stage"
    :class="{ 'stage--cinematic': isCinematic }"
  >
    <div ref="pin" class="stage__pin">
      <!-- Act 1 -->
      <section class="act act--hero">
        <h1 class="hero__title">
          {{ t('stage.hero.title') }}
        </h1>
        <p class="hero__sub">
          {{ t('stage.hero.sub') }}
        </p>
        <p class="hero__hint" aria-hidden="true">
          {{ t('stage.hero.hint') }}
        </p>
      </section>

      <!-- Acts 2 and 4: the hardware -->
      <div class="scene">
        <StageDeviceWatch class="scene__watch" />

        <div class="scene__laptop">
          <div class="laptop__lid">
            <div class="laptop__frame" aria-hidden="true" />
            <div class="laptop__glass">
              <StageFlowField />
              <p class="laptop__line">
                {{ t('stage.screen.line') }}
              </p>
            </div>
          </div>
          <div class="laptop__base" aria-hidden="true" />
        </div>
      </div>

      <!-- Act 3 -->
      <section class="act act--flow">
        <h2 class="act__title">
          {{ t('stage.ai.title') }}
        </h2>
        <div class="act__beats">
          <article
            v-for="beat in AI_BEATS"
            :key="beat"
            class="beat"
            :style="{ '--beat': `var(--p-${beat}, 1)` }"
          >
            <p class="eyebrow">
              {{ t(`stage.ai.beats.${beat}.label`) }}
            </p>
            <h3 class="beat__title">
              {{ t(`stage.ai.beats.${beat}.title`) }}
            </h3>
            <p class="beat__body">
              {{ t(`stage.ai.beats.${beat}.body`) }}
            </p>
          </article>
        </div>
      </section>

      <!-- Act 5 -->
      <section class="act act--craft">
        <p class="eyebrow">
          {{ t('stage.craft.label') }}
        </p>
        <h2 class="act__title">
          {{ t('stage.craft.title') }}
        </h2>
        <p class="act__body">
          {{ t('stage.craft.body') }}
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* ========================================================================
   Static layout - the prerendered document, and what reduced motion gets.
   ======================================================================== */

.stage__pin {
  display: grid;
  gap: var(--sp-9);
  padding-block: var(--sp-8) var(--sp-9);
}

.act,
.scene {
  width: var(--shell);
  margin-inline: auto;
}

.hero__title {
  max-width: 14ch;
  font-size: var(--fs-display);
  font-weight: 600;
  letter-spacing: var(--tr-display);
  line-height: var(--lh-tight);
}

.hero__sub {
  max-width: var(--measure);
  margin-top: var(--sp-5);
  color: var(--c-text-dim);
  font-size: var(--fs-h3);
}

.hero__hint {
  margin-top: var(--sp-6);
  color: var(--c-text-mute);
  font-family: var(--ff-mono);
  font-size: var(--fs-micro);
  letter-spacing: var(--tr-label);
  text-transform: uppercase;
}

/* --- Laptop ------------------------------------------------------------- */

.laptop__lid {
  position: relative;
  aspect-ratio: 16 / 10;
  border-radius: var(--r-lg);
}

.laptop__frame {
  position: absolute;
  inset: -0.7%;
  border-radius: calc(var(--r-lg) + 4px);
  background: linear-gradient(160deg, #333a48 0%, #171b24 46%, #2a303d 100%);
  box-shadow: 0 2rem 5rem rgb(0 0 0 / 55%);
}

.laptop__glass {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
  background:
    radial-gradient(120% 100% at 50% 0%, #101725 0%, var(--c-bg-inset) 70%);
}

.laptop__line {
  position: absolute;
  inset: 0;
  display: grid;
  padding: var(--sp-5);
  font-size: var(--fs-h3);
  font-weight: 600;
  letter-spacing: var(--tr-heading);
  place-content: center;
  text-align: center;
}

.laptop__base {
  width: 106%;
  height: clamp(9px, 1.1vw, 16px);
  margin-inline: auto;
  border-radius: 0 0 var(--r-md) var(--r-md);
  background: linear-gradient(180deg, #3a4150 0%, #1b1f28 68%, #0d1015 100%);
  box-shadow: 0 1.4rem 2.6rem rgb(0 0 0 / 45%);
}

/* The lip you would see on the front edge of a closed laptop. */
.laptop__base::after {
  display: block;
  width: 14%;
  height: 42%;
  margin-inline: auto;
  border-radius: 0 0 var(--r-sm) var(--r-sm);
  background: rgb(0 0 0 / 45%);
  content: "";
}

.scene__watch {
  --watch-unit: clamp(11px, 2.4vh, 24px);

  margin-top: var(--sp-8);
}

/* --- Copy --------------------------------------------------------------- */

.act__title {
  max-width: 18ch;
  margin-top: var(--sp-3);
}

.act__body,
.beat__body {
  max-width: var(--measure);
  margin-top: var(--sp-4);
  color: var(--c-text-dim);
}

.act__beats {
  display: grid;
  gap: var(--sp-7);
  margin-top: var(--sp-6);
}

.beat__title {
  margin-top: var(--sp-3);
}

/* ========================================================================
   Cinematic layout - one sticky viewport, driven by scroll progress.
   ======================================================================== */

.stage--cinematic {
  /* Total scroll travel is this minus one viewport. Roughly four screens of
     movement paces the five acts without the page feeling endless. */
  height: 520svh;
}

.stage--cinematic .stage__pin {
  position: sticky;
  top: 0;
  display: block;
  overflow: hidden;
  height: 100svh;
  padding: 0;
  /* Establishes the depth the lid rotates within. */
  perspective: 1800px;
  perspective-origin: 50% calc(var(--screen-y, 30%) + var(--screen-h, 40%) * 0.5);

  --bezel: clamp(6px, 0.9vw, 13px);
}

.stage--cinematic .act,
.stage--cinematic .scene {
  position: absolute;
  width: auto;
  margin: 0;
}

/* --- Act 1: hero -------------------------------------------------------- */

.stage--cinematic .act--hero {
  z-index: 2;
  display: grid;
  align-content: center;
  padding-inline: max(1.25rem, calc((100vw - var(--shell)) / 2));
  inset: 0;
  opacity: calc(1 - var(--p-hero, 0));
  scale: calc(1 - var(--p-hero, 0) * 0.14);
  will-change: opacity, scale;
}

.stage--cinematic .hero__hint {
  /* The prompt to scroll is only true while there is nothing else on screen. */
  opacity: calc(1 - var(--p, 0) * 12);
}

/* --- Acts 2 and 4: the hardware ----------------------------------------- */

.stage--cinematic .scene {
  z-index: 1;
  inset: 0;
}

.stage--cinematic .scene__laptop {
  position: absolute;
  inset: 0;
  opacity: calc(1 - var(--p-craft, 0));
  translate: 0 calc(var(--p-craft, 0) * 6svh);
}

.stage--cinematic .laptop__lid {
  position: absolute;
  aspect-ratio: auto;
  inset: 0;
  rotate: x calc(var(--p-close, 0) * 82deg);
  transform-origin: 50% calc(var(--screen-y) + var(--screen-h));
  will-change: rotate;
}

.stage--cinematic .laptop__frame {
  width: calc(var(--screen-w) + var(--bezel) * 2);
  height: calc(var(--screen-h) + var(--bezel) * 2);
  border-radius: calc(18px + var(--bezel));
  inset:
    calc(var(--screen-y) - var(--bezel)) auto
    auto calc(var(--screen-x) - var(--bezel));
  opacity: var(--p-fold, 0);
}

/**
 * The fold itself. The glass covers the whole viewport and is clipped inward
 * to the measured screen rectangle, so nothing is resized and nothing is
 * scaled: the text inside stays exactly as crisp as it started.
 */
.stage--cinematic .laptop__glass {
  overflow: visible;
  border-radius: 0;
  clip-path: inset(
    calc(var(--fold-t, 0px) * var(--p-fold, 0))
    calc(var(--fold-r, 0px) * var(--p-fold, 0))
    calc(var(--fold-b, 0px) * var(--p-fold, 0))
    calc(var(--fold-l, 0px) * var(--p-fold, 0))
    round calc(18px * var(--p-fold, 0))
  );
  opacity: calc(1 - var(--p-close, 0) * 1.4);
  will-change: clip-path;
}

.stage--cinematic :deep(.flow) {
  /* Barely there behind the opening line, full strength inside the screen. */
  opacity: calc(0.1 + var(--p-fold, 0) * 0.35 + var(--p-flow, 0) * 0.55);
}

.stage--cinematic .laptop__line {
  width: var(--screen-w);
  height: var(--screen-h);
  inset: var(--screen-y) auto auto var(--screen-x);
  opacity: var(--p-line, 0);
}

.stage--cinematic .laptop__base {
  position: absolute;
  width: calc(var(--screen-w) * 1.07);
  height: var(--base-h);
  inset: calc(var(--screen-y) + var(--screen-h) + var(--bezel)) auto auto 50%;
  translate: -50% 0;
  opacity: var(--p-fold, 0);
}

.stage--cinematic .scene__watch {
  position: absolute;
  margin: 0;
  inset: calc(var(--screen-y) + var(--screen-h) * 0.5) auto auto 50%;
  opacity: var(--p-close, 0);
  rotate: calc((1 - var(--p-craft, 0)) * -90deg);
  scale: calc(0.6 + var(--p-close, 0) * 0.4);
  translate: -50% -50%;
  will-change: rotate, scale;
}

/* --- Acts 3 and 5: copy ------------------------------------------------- */

.stage--cinematic .act--flow,
.stage--cinematic .act--craft {
  z-index: 3;
  padding-inline: max(1.25rem, calc((100vw - var(--shell)) / 2));
  inset: auto 0 clamp(1.5rem, 5svh, 3.5rem) 0;
  pointer-events: none;
}

.stage--cinematic .act--flow .act__title {
  /* The section heading is for the document outline; on screen the beats
     carry the message, so it stays out of the composition. */
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}

.stage--cinematic .act__beats {
  display: grid;
  margin: 0;
}

.stage--cinematic .beat {
  grid-area: 1 / 1;
  opacity: var(--beat, 0);
  translate: 0 calc((1 - var(--beat, 0)) * 1.5rem);
}

.stage--cinematic .act--craft {
  opacity: var(--p-craft, 0);
  translate: 0 calc((1 - var(--p-craft, 0)) * 2rem);
}
</style>
