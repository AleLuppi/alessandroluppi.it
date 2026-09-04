<script setup lang="ts">
/**
 * Slim persistent header. It carries only what has to be reachable from
 * anywhere: the way home and the way to the other language.
 */
const { t } = useI18n()
</script>

<template>
  <header class="nav">
    <a class="nav__skip" href="#main">{{ t('nav.skip') }}</a>
    <NuxtLinkLocale to="/" class="nav__name">
      {{ t('site.name') }}
    </NuxtLinkLocale>
    <LocaleSwitch />
  </header>
</template>

<style scoped>
.nav {
  position: fixed;
  z-index: var(--z-nav);
  top: 0;
  display: flex;
  gap: var(--sp-4);
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--sp-4) max(1.25rem, calc((100vw - var(--shell)) / 2));

  /* The stage runs full bleed underneath, so the bar reads as a layer over
     the scene rather than a band across it. */
  background: linear-gradient(180deg, rgb(7 8 11 / 82%) 0%, rgb(7 8 11 / 0%) 100%);
  backdrop-filter: blur(6px);
  mask: linear-gradient(180deg, #000 55%, transparent 100%);
}

.nav__name {
  font-size: var(--fs-small);
  font-weight: 600;
  letter-spacing: -0.01em;
}

/* Visible only once focused, which is the point of a skip link. */
.nav__skip {
  position: absolute;
  top: var(--sp-3);
  left: var(--sp-3);
  padding: var(--sp-2) var(--sp-4);
  border-radius: var(--r-sm);
  background: var(--c-accent);
  color: var(--c-bg);
  font-size: var(--fs-micro);
  font-weight: 600;
  translate: 0 -200%;
  transition: translate var(--t-fast) var(--ease-out);
}

.nav__skip:focus-visible {
  translate: 0 0;
}
</style>
