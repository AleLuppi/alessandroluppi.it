<script setup lang="ts">
/**
 * The easter-egg route, reached from the bottom of the landing page.
 */
const { t } = useI18n()

useSeoMeta({
  title: () => t('game.metaTitle'),
  description: () => t('game.metaDescription'),
  ogTitle: () => t('game.metaTitle'),
  ogDescription: () => t('game.metaDescription'),
})
</script>

<template>
  <div class="play">
    <div class="shell">
      <p class="eyebrow">
        {{ t('game.label') }}
      </p>
      <h1 class="play__title">
        {{ t('game.title') }}
      </h1>
      <p class="play__intro measure">
        {{ t('game.intro') }}
      </p>

      <GameBoard class="play__game" />

      <NuxtLinkLocale to="/" class="play__back">
        {{ t('game.backHome') }}
      </NuxtLinkLocale>
    </div>
  </div>
</template>

<style scoped>
.play {
  padding-block: clamp(5rem, 12svh, 8rem) var(--sp-8);
}

.play__title {
  margin-top: var(--sp-3);
  font-size: var(--fs-h1);
  letter-spacing: var(--tr-display);
}

.play__intro {
  margin-top: var(--sp-4);
  color: var(--c-text-dim);
}

.play__game {
  margin-top: var(--sp-8);
}

.play__back {
  display: inline-block;
  margin-top: var(--sp-8);
  color: var(--c-text-mute);
  font-size: var(--fs-small);
}

.play__back::before {
  content: "\2190\00a0";
}

.play__back:hover {
  color: var(--c-text);
}
</style>
