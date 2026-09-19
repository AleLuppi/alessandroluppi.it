<script setup lang="ts">
/**
 * The landing page: one scroll-driven narrative, then the way to get in
 * touch.
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
  </div>
</template>
