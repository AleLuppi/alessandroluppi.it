<script setup lang="ts">
/**
 * Closing call to action. The page is a teaser by design, so it ends on the
 * one thing a reader might want next: a way to reach a person.
 */
const { t } = useI18n()
</script>

<template>
  <section class="contact">
    <div class="shell contact__inner">
      <h2 class="contact__title">
        {{ t('contact.title') }}
      </h2>
      <p class="contact__body measure">
        {{ t('contact.body') }}
      </p>
      <a
        class="btn btn--primary"
        :href="SITE_LINKS.linkedin"
        target="_blank"
        rel="noopener noreferrer me"
      >
        {{ t('contact.cta') }}
        <BaseArrow />
      </a>
    </div>
  </section>
</template>

<style scoped>
.contact {
  position: relative;
  padding-block: clamp(4rem, 14svh, 9rem);
}

/* A soft rise of light behind the closing statement, so the page resolves
   rather than simply stopping. */
.contact::before {
  position: absolute;
  z-index: -1;
  inset: 0;
  background: radial-gradient(70% 100% at 50% 100%, var(--c-glow-soft) 0%, transparent 70%);
  content: "";
}

.contact__title {
  font-size: var(--fs-h1);
  letter-spacing: var(--tr-display);
}

.contact__body {
  margin-top: var(--sp-4);
  color: var(--c-text-dim);
  font-size: var(--fs-h3);
}

.contact__inner .btn {
  margin-top: var(--sp-6);
}
</style>
