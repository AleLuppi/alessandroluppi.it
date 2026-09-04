<script setup lang="ts">
/**
 * The landing page: one scroll-driven narrative, then the two things a
 * reader can act on - getting in touch, and the game.
 */
const { t } = useI18n()

useSeoMeta({
  title: () => t('site.title'),
  description: () => t('site.description'),
  ogTitle: () => t('site.title'),
  ogDescription: () => t('site.description'),
})
</script>

<template>
  <div>
    <TheStage />
    <ContactSection />
    <EasterEggDoor />
  </div>
</template>
