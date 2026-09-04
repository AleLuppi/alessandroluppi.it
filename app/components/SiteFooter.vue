<script setup lang="ts">
const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer__inner shell">
      <p>&copy; {{ year }} {{ t('site.name') }}</p>
      <p class="footer__built">
        {{ t('footer.built') }}
      </p>
      <a
        :href="SITE_LINKS.github"
        target="_blank"
        rel="noopener noreferrer"
        class="footer__link"
      >{{ t('footer.source') }}</a>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--c-line);
  padding-block: var(--sp-6);
  color: var(--c-text-mute);
  font-size: var(--fs-micro);
}

.footer__inner {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-3) var(--sp-6);
  align-items: baseline;
  justify-content: space-between;
}

.footer__built {
  order: 3;
  flex-basis: 100%;
  color: var(--c-line-strong);
}

.footer__link:hover {
  color: var(--c-text-dim);
}

@media (width >= 48rem) {
  .footer__built {
    order: 0;
    flex-basis: auto;
  }
}
</style>
