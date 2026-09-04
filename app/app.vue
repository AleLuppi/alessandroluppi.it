<script setup lang="ts">
// Root component: holds the document-level head that every route inherits.
const { locale } = useI18n()
const head = useLocaleHead()
</script>

<template>
  <Html
    :lang="head.htmlAttrs?.lang ?? locale"
    :dir="head.htmlAttrs?.dir"
  >
    <Body>
      <NuxtPage />
    </Body>
  </Html>
</template>
