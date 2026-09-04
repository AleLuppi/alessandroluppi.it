<script setup lang="ts">
/**
 * A smartwatch drawn in CSS, shown in its natural upright orientation.
 *
 * The component owns the object only. Where it sits, how large it is and
 * when it rotates are the stage's business, which keeps all choreography in
 * one place. The stage drives size through `--watch-unit`: every dimension
 * here is expressed in `em`, so scaling changes the unit rather than
 * applying a transform, and the face stays pin-sharp at any size.
 *
 * The face itself cycles through three abstract app tiles on its own timer.
 * They are intentionally wordless - the point they make, that the same
 * craft goes into very different products, does not need translating.
 */
</script>

<template>
  <div class="watch" aria-hidden="true">
    <div class="watch__strap watch__strap--top" />
    <div class="watch__strap watch__strap--bottom" />

    <div class="watch__case">
      <div class="watch__crown" />
      <div class="watch__screen">
        <!-- Tile 1: throughput -->
        <div class="tile tile--a">
          <div class="tile__label">
            99.9<span>%</span>
          </div>
          <div class="tile__bars">
            <i style="--h: 42%" /><i style="--h: 68%" /><i style="--h: 55%" />
            <i style="--h: 88%" /><i style="--h: 74%" /><i style="--h: 96%" />
          </div>
        </div>

        <!-- Tile 2: nested progress rings -->
        <div class="tile tile--b">
          <div class="tile__rings">
            <i style="--size: 100%; --dash: 82" />
            <i style="--size: 72%; --dash: 64" />
            <i style="--size: 44%; --dash: 91" />
          </div>
        </div>

        <!-- Tile 3: a task list -->
        <div class="tile tile--c">
          <div class="tile__rows">
            <i style="--w: 92%" /><i style="--w: 64%" />
            <i style="--w: 78%" /><i style="--w: 48%" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.watch {
  position: relative;
  display: grid;
  place-items: center;
  font-size: var(--watch-unit, 16px);
  line-height: 1;
}

/* --- Straps ------------------------------------------------------------- */

.watch__strap {
  position: absolute;
  left: 50%;
  width: 8.2em;
  height: 7em;
  background: linear-gradient(180deg, #1a1e28 0%, #12151d 100%);
  translate: -50% 0;
}

.watch__strap--top {
  bottom: 55%;
  border-radius: 2.4em 2.4em 0.7em 0.7em;
}

.watch__strap--bottom {
  top: 55%;
  border-radius: 0.7em 0.7em 2.4em 2.4em;
}

/* --- Case --------------------------------------------------------------- */

.watch__case {
  position: relative;
  width: 12.4em;
  height: 15em;
  padding: 0.62em;
  border-radius: 3.4em;
  background: linear-gradient(155deg, #363c4b 0%, #191d26 42%, #2b3140 100%);
  box-shadow:
    0 0 0 0.06em rgb(255 255 255 / 12%),
    0 1.6em 3.4em rgb(0 0 0 / 55%);
}

.watch__crown {
  position: absolute;
  top: 30%;
  right: -0.34em;
  width: 0.42em;
  height: 2em;
  border-radius: 0.2em;
  background: linear-gradient(90deg, #2a2f3c, #565e73);
}

/* --- Screen ------------------------------------------------------------- */

.watch__screen {
  position: relative;
  display: grid;
  overflow: hidden;
  height: 100%;
  border-radius: 2.9em;
  background: radial-gradient(120% 90% at 50% 0%, #0d1119 0%, #04060a 100%);
  box-shadow: inset 0 0 1.4em rgb(76 141 255 / 18%);
}

.tile {
  display: grid;
  grid-area: 1 / 1;
  gap: 0.75em;
  place-content: center;
  place-items: center;
  padding: 1em;
  opacity: 0;
  animation: tile-cycle 10.5s var(--ease-in-out) infinite;
}

.tile--b {
  animation-delay: -3.5s;
}

.tile--c {
  animation-delay: -7s;
}

.tile__label {
  color: var(--c-text);
  font-size: 1.9em;
  font-weight: 600;
  letter-spacing: -0.03em;
}

.tile__label span {
  color: var(--c-accent);
  font-size: 0.55em;
}

.tile__bars {
  display: flex;
  gap: 0.34em;
  align-items: flex-end;
  height: 3.4em;
}

.tile__bars i {
  width: 0.6em;
  height: var(--h);
  border-radius: 0.2em;
  background: var(--g-signal);
}

.tile__rings {
  position: relative;
  display: grid;
  width: 7em;
  height: 7em;
  place-items: center;
}

/* Each ring is a circle whose stroke is drawn by a conic gradient and then
   masked to a thin band, which avoids nesting three more SVGs on the face. */
.tile__rings i {
  position: absolute;
  width: var(--size);
  aspect-ratio: 1;
  border-radius: 50%;
  background: conic-gradient(
    var(--c-accent) calc(var(--dash) * 1%),
    rgb(255 255 255 / 8%) 0
  );
  mask: radial-gradient(circle, transparent 63%, #000 65%);
}

.tile__rows {
  display: grid;
  gap: 0.6em;
  width: 6.4em;
}

.tile__rows i {
  width: var(--w);
  height: 0.7em;
  border-radius: 0.35em;
  background: rgb(255 255 255 / 14%);
}

.tile__rows i:first-child {
  background: var(--g-signal);
}

@keyframes tile-cycle {
  0% {
    opacity: 0;
    transform: translateY(0.7em);
  }

  4%,
  29% {
    opacity: 1;
    transform: none;
  }

  33%,
  100% {
    opacity: 0;
    transform: translateY(-0.7em);
  }
}
</style>
