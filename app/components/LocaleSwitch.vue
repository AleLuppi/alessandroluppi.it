<script setup lang="ts">
/**
 * Toggles between the two locales.
 *
 * With exactly two languages a single link beats a dropdown: one tap, no
 * menu, and a real anchor that crawlers can follow to the alternate version.
 */
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const other = computed(() => locales.value.find(item => item.code !== locale.value))
</script>

<template>
  <NuxtLink
    v-if="other"
    class="locale"
    :to="switchLocalePath(other.code)"
    :hreflang="other.language"
    :lang="other.code"
    :aria-label="other.name"
  >
    {{ other.code.toUpperCase() }}
  </NuxtLink>
</template>

<style scoped>
.locale {
  padding: 0.35rem 0.6rem;
  border: 1px solid var(--c-line);
  border-radius: var(--r-pill);
  color: var(--c-text-dim);
  font-family: var(--ff-mono);
  font-size: var(--fs-micro);
  letter-spacing: 0.08em;
  transition:
    color var(--t-fast) var(--ease-out),
    border-color var(--t-fast) var(--ease-out);
}

.locale:hover {
  border-color: var(--c-line-strong);
  color: var(--c-text);
}
</style>
