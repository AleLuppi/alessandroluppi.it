<script setup lang="ts">
/**
 * Root component. Everything declared here is inherited by every route:
 * document language, the alternate-language links, the social card, and the
 * icons.
 */
const { t } = useI18n()
const site = useSiteConfig()

// Supplies `lang`/`dir` on <html>, the canonical URL, and a rel="alternate"
// hreflang link per locale, so each language version is indexed in its own
// right instead of competing with the other.
useHead(useLocaleHead())

useHead({
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
  ],
  meta: [
    { name: 'theme-color', content: '#07080b' },
  ],
})

useSeoMeta({
  ogSiteName: () => t('site.name'),
  ogType: 'website',
  ogImage: `${site.url}/og.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: () => t('site.title'),
  twitterCard: 'summary_large_image',
  twitterImage: `${site.url}/og.png`,
  twitterImageAlt: () => t('site.title'),
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
