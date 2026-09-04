<script setup lang="ts">
// Root component: document-level attributes every route inherits.
const { locale } = useI18n()
const head = useLocaleHead()
</script>

<template>
  <Html :lang="head.htmlAttrs?.lang ?? locale" :dir="head.htmlAttrs?.dir">
    <Body>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </Body>
  </Html>
</template>
