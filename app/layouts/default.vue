<script setup lang="ts">
/** Shared chrome: the header and footer every route carries. */
</script>

<template>
  <div class="layout">
    <SiteNav />
    <main id="main">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100svh;
}

main {
  flex: 1;
}
</style>
