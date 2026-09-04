<script setup lang="ts">
/**
 * The prediction game.
 *
 * Each round: a sentence missing its last token, three candidates with the
 * likelihood a naive predictor would assign them, and a character that gets
 * dressed by whatever the player picks. Choosing fires an activation from
 * the unit down a wire to the chosen token, which is drawn from the two
 * measured positions so it lands correctly at any layout or screen size.
 *
 * Being wrong is not punished. The reveal appears either way, because the
 * facts are the point and the score is only the joke.
 */
const { t } = useI18n()
const prefersReduced = useReducedMotion()

type Phase = 'choosing' | 'firing' | 'revealed' | 'done'

const roundIndex = ref(0)
const phase = ref<Phase>('choosing')
const picks = ref<string[]>([])
const slots = reactive({ ...AVATAR_BLANK })

const board = ref<HTMLElement | null>(null)
const source = ref<HTMLElement | null>(null)
const wire = ref<Record<string, string>>({})
const firedId = ref<string | null>(null)

const round = computed(() => GAME_ROUNDS[roundIndex.value]!)
const isLastRound = computed(() => roundIndex.value === GAME_ROUNDS.length - 1)
const picked = computed(() => round.value.choices.find(c => c.id === firedId.value))
const wasRight = computed(() => picked.value?.correct === true)

const score = computed(() => picks.value.filter((id, index) => (
  GAME_ROUNDS[index]?.choices.find(c => c.id === id)?.correct === true
)).length)

/** How long the activation takes to travel, in ms. Mirrors the CSS. */
const TRAVEL_MS = 620

/**
 * Point the wire from the activation unit at the chosen token. Both centres
 * are measured relative to the board, so the wire is correct whether the
 * candidates are stacked on a phone or spread out on a desktop.
 */
function aimAt(target: HTMLElement): void {
  const origin = board.value?.getBoundingClientRect()
  const from = source.value?.getBoundingClientRect()
  if (!origin || !from) return

  const to = target.getBoundingClientRect()
  const x = from.left + from.width / 2 - origin.left
  const y = from.top + from.height / 2 - origin.top
  const dx = to.left + to.width / 2 - origin.left - x
  const dy = to.top + to.height / 2 - origin.top - y

  wire.value = {
    '--wire-x': `${x}px`,
    '--wire-y': `${y}px`,
    '--wire-len': `${Math.hypot(dx, dy)}px`,
    '--wire-angle': `${Math.atan2(dy, dx)}rad`,
  }
}

function choose(choice: TokenChoice, event: MouseEvent | KeyboardEvent): void {
  if (phase.value !== 'choosing') return

  firedId.value = choice.id
  picks.value[roundIndex.value] = choice.id
  slots[round.value.slot] = choice.value

  const target = event.currentTarget
  if (target instanceof HTMLElement) aimAt(target)

  // With reduced motion there is nothing to wait for.
  if (prefersReduced.value) {
    phase.value = 'revealed'
    return
  }

  phase.value = 'firing'
  setTimeout(() => {
    if (phase.value === 'firing') phase.value = 'revealed'
  }, TRAVEL_MS)
}

function advance(): void {
  if (isLastRound.value) {
    phase.value = 'done'
    return
  }
  roundIndex.value += 1
  firedId.value = null
  wire.value = {}
  phase.value = 'choosing'
}

function restart(): void {
  roundIndex.value = 0
  picks.value = []
  firedId.value = null
  wire.value = {}
  Object.assign(slots, AVATAR_BLANK)
  phase.value = 'choosing'
}
</script>

<template>
  <div class="game">
    <!-- The figure being assembled -->
    <aside class="game__figure">
      <GameAvatar :slots="slots" />
      <p v-if="phase === 'done'" class="figure__caption">
        {{ t('game.result.caption') }}
      </p>
    </aside>

    <!-- The round -->
    <div v-if="phase !== 'done'" ref="board" class="game__board">
      <p class="eyebrow">
        {{ t('game.progress', { current: roundIndex + 1, total: GAME_ROUNDS.length }) }}
      </p>

      <h2 class="board__prompt">
        {{ t(`game.rounds.${round.id}.prompt`) }}
        <span class="board__blank" :class="{ 'board__blank--filled': firedId }">
          {{ firedId ? t(`game.rounds.${round.id}.choices.${firedId}`) : '' }}
        </span>
      </h2>

      <!-- The activation unit the player is standing in for -->
      <div ref="source" class="board__unit" aria-hidden="true">
        <span class="board__unit-core" />
      </div>

      <!-- Wire and travelling activation, aimed at the chosen candidate -->
      <div
        v-if="phase === 'firing'"
        class="board__wire"
        :style="wire"
        aria-hidden="true"
      >
        <span class="board__pulse" />
      </div>

      <ul class="board__choices">
        <li v-for="choice in round.choices" :key="choice.id">
          <button
            type="button"
            class="token"
            :class="{
              'token--fired': firedId === choice.id,
              'token--truth': phase === 'revealed' && choice.correct && firedId !== choice.id,
              'token--dim': phase !== 'choosing' && firedId !== choice.id && !choice.correct,
            }"
            :disabled="phase !== 'choosing'"
            @click="choose(choice, $event)"
          >
            <span class="token__label">
              {{ t(`game.rounds.${round.id}.choices.${choice.id}`) }}
            </span>
            <span class="token__prob">{{ choice.probability }}%</span>
            <span class="token__bar" :style="{ '--w': `${choice.probability}%` }" />
          </button>
        </li>
      </ul>

      <div class="board__reveal" aria-live="polite">
        <template v-if="phase === 'revealed'">
          <p class="reveal__verdict" :class="wasRight ? 'is-right' : 'is-wrong'">
            {{ wasRight ? t('game.right') : t('game.wrong') }}
          </p>
          <p class="reveal__fact">
            {{ t(`game.rounds.${round.id}.reveal`) }}
          </p>
          <button type="button" class="btn btn--ghost" @click="advance">
            {{ isLastRound ? t('game.finish') : t('game.next') }}
            <BaseArrow />
          </button>
        </template>
      </div>
    </div>

    <!-- Closing screen -->
    <div v-else class="game__result">
      <p class="eyebrow">
        {{ t('game.result.label') }}
      </p>
      <h2 class="result__score">
        {{ t('game.result.score', { score, total: GAME_ROUNDS.length }) }}
      </h2>
      <p class="result__body measure">
        {{ t('game.result.body') }}
      </p>

      <div class="result__actions">
        <a
          class="btn btn--primary"
          :href="SITE_LINKS.linkedin"
          target="_blank"
          rel="noopener noreferrer me"
        >
          {{ t('contact.cta') }}
          <BaseArrow />
        </a>
        <button type="button" class="btn btn--ghost" @click="restart">
          {{ t('game.replay') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game {
  display: grid;
  gap: var(--sp-6);
  align-items: start;
}

@media (width >= 56rem) {
  .game {
    grid-template-columns: minmax(0, 15rem) minmax(0, 1fr);
    gap: var(--sp-8);
  }
}

/* --- Figure ------------------------------------------------------------- */

.game__figure {
  display: grid;
  justify-items: center;
  padding: var(--sp-5);
  border: 1px solid var(--c-line);
  border-radius: var(--r-lg);
  background: radial-gradient(90% 70% at 50% 0%, var(--c-bg-elev) 0%, var(--c-bg-inset) 100%);
}

.game__figure :deep(.avatar) {
  max-width: 11rem;
}

.figure__caption {
  margin-top: var(--sp-4);
  color: var(--c-text-dim);
  font-size: var(--fs-micro);
  text-align: center;
}

/* --- Board -------------------------------------------------------------- */

.game__board {
  position: relative;
}

.board__prompt {
  margin-top: var(--sp-3);
  font-size: var(--fs-h3);
}

/* The slot the predicted token drops into. */
.board__blank {
  display: inline-block;
  min-width: 6ch;
  border-bottom: 2px solid var(--c-line-strong);
  color: var(--c-accent-soft);
  transition: border-color var(--t-base) var(--ease-out);
}

.board__blank--filled {
  border-color: var(--c-accent);
}

.board__unit {
  display: grid;
  width: 2.25rem;
  height: 2.25rem;
  margin: var(--sp-6) 0 var(--sp-4);
  border: 1px solid var(--c-line-strong);
  border-radius: 50%;
  place-items: center;
}

.board__unit-core {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background: var(--c-accent);
  box-shadow: 0 0 0 0 var(--c-glow);
  animation: unit-idle 2.4s var(--ease-in-out) infinite;
}

/**
 * Wire and activation. Both are positioned from the measured origin and
 * rotated to face the target, so one element covers every direction.
 */
.board__wire {
  position: absolute;
  z-index: 1;
  top: var(--wire-y);
  left: var(--wire-x);
  width: var(--wire-len);
  height: 2px;
  background: var(--g-signal);
  rotate: var(--wire-angle);
  transform-origin: 0 50%;
  animation: wire-draw 180ms var(--ease-out) both;
  pointer-events: none;
}

.board__pulse {
  position: absolute;
  top: 50%;
  left: 0;
  width: 0.7rem;
  height: 0.7rem;
  margin-top: -0.35rem;
  border-radius: 50%;
  background: var(--c-accent-soft);
  box-shadow: 0 0 12px 3px var(--c-glow);
  animation: pulse-travel 440ms var(--ease-in-out) 180ms both;
}

/* --- Candidate tokens --------------------------------------------------- */

.board__choices {
  display: grid;
  gap: var(--sp-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.token {
  position: relative;
  display: flex;
  gap: var(--sp-4);
  align-items: baseline;
  justify-content: space-between;
  overflow: hidden;
  width: 100%;
  padding: 0.85rem 1.1rem;
  border: 1px solid var(--c-line);
  border-radius: var(--r-md);
  background: var(--c-bg-elev);
  text-align: left;
  transition:
    border-color var(--t-fast) var(--ease-out),
    background-color var(--t-fast) var(--ease-out),
    opacity var(--t-base) var(--ease-out);
}

.token:not(:disabled):hover {
  border-color: var(--c-accent);
  background: var(--c-bg-elev-2);
}

.token__label {
  font-weight: 500;
}

.token__prob {
  color: var(--c-text-mute);
  font-family: var(--ff-mono);
  font-size: var(--fs-micro);
}

/* Likelihood, drawn along the bottom edge of the token. */
.token__bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: var(--w);
  height: 2px;
  background: var(--c-line-strong);
}

.token--fired {
  border-color: var(--c-accent);
  background: var(--c-bg-elev-2);
  box-shadow: 0 0 0 1px var(--c-accent), 0 0 30px -6px var(--c-glow);
}

.token--fired .token__bar {
  background: var(--g-signal);
}

/* The true token, marked once the round is over and it was not the pick. */
.token--truth {
  border-color: var(--c-accent-2);
  border-style: dashed;
}

.token--dim {
  opacity: 0.4;
}

/* --- Reveal ------------------------------------------------------------- */

.board__reveal {
  min-height: 9rem;
  margin-top: var(--sp-5);
}

.reveal__verdict {
  font-family: var(--ff-mono);
  font-size: var(--fs-micro);
  letter-spacing: var(--tr-label);
  text-transform: uppercase;
}

.reveal__verdict.is-right {
  color: var(--c-accent-soft);
}

.reveal__verdict.is-wrong {
  color: var(--c-text-mute);
}

.reveal__fact {
  margin: var(--sp-2) 0 var(--sp-4);
  color: var(--c-text-dim);
}

/* --- Result ------------------------------------------------------------- */

.result__score {
  margin-top: var(--sp-3);
  font-size: var(--fs-h2);
}

.result__body {
  margin-top: var(--sp-4);
  color: var(--c-text-dim);
}

.result__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-3);
  margin-top: var(--sp-6);
}

/* --- Keyframes ---------------------------------------------------------- */

@keyframes unit-idle {
  0%,
  100% {
    box-shadow: 0 0 0 0 var(--c-glow);
  }

  50% {
    box-shadow: 0 0 0 7px rgb(76 141 255 / 0%);
  }
}

@keyframes wire-draw {
  from {
    scale: 0 1;
  }

  to {
    scale: 1 1;
  }
}

@keyframes pulse-travel {
  from {
    translate: 0 0;
  }

  to {
    translate: var(--wire-len) 0;
  }
}
</style>
