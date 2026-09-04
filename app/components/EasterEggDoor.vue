<script setup lang="ts">
/**
 * The reward for reaching the bottom: a way into the prediction game.
 *
 * The token strip above the heading is a still frame of the game itself -
 * enough of a hint to make the invitation legible without explaining it.
 */
const { t } = useI18n()

/** Purely decorative sample tokens; never read, so they need no translation. */
const TOKENS = ['builds', 'ships', 'reviews', 'refactors', 'wonders'] as const
</script>

<template>
  <section class="egg">
    <div class="shell egg__inner">
      <div class="egg__tokens" aria-hidden="true">
        <span
          v-for="(token, index) in TOKENS"
          :key="token"
          class="egg__token"
          :style="{ '--delay': `${index * -0.9}s` }"
        >{{ token }}</span>
      </div>

      <h2 class="egg__title">
        {{ t('egg.title') }}
      </h2>
      <p class="egg__body measure">
        {{ t('egg.body') }}
      </p>

      <NuxtLinkLocale to="/play" class="btn btn--ghost">
        {{ t('egg.cta') }}
        <BaseArrow />
      </NuxtLinkLocale>
    </div>
  </section>
</template>

<style scoped>
.egg {
  border-top: 1px solid var(--c-line);
  padding-block: clamp(3.5rem, 12svh, 7rem);
}

.egg__tokens {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
  margin-bottom: var(--sp-5);
}

.egg__token {
  padding: 0.28rem 0.7rem;
  border: 1px solid var(--c-line);
  border-radius: var(--r-sm);
  color: var(--c-text-mute);
  font-family: var(--ff-mono);
  font-size: var(--fs-micro);
  animation: token-glow 4.5s var(--ease-in-out) var(--delay, 0s) infinite;
}

.egg__title {
  font-size: var(--fs-h2);
}

.egg__body {
  margin-top: var(--sp-3);
  color: var(--c-text-dim);
}

.egg__inner .btn {
  margin-top: var(--sp-5);
}

/* One token at a time lights up, the way a candidate does mid-game. */
@keyframes token-glow {
  0%,
  84%,
  100% {
    border-color: var(--c-line);
    color: var(--c-text-mute);
  }

  10%,
  22% {
    border-color: var(--c-accent);
    color: var(--c-accent-soft);
  }
}
</style>
