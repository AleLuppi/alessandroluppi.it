// Nuxt configuration.
// See https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxtjs/i18n',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    'nuxt-schema-org',
  ],

  devtools: { enabled: true },

  // Global stylesheet: design tokens + element resets. Nuxt inlines the
  // critical part of this into the prerendered HTML, so the first paint
  // needs no additional round trip.
  css: ['~/assets/css/main.css'],

  // Canonical site identity, shared by the robots, sitemap and schema.org
  // modules through nuxt-site-config.
  site: {
    url: 'https://alessandroluppi.it',
    name: 'Alessandro Luppi',
    defaultLocale: 'en',
  },

  // Long-lived immutable caching for build assets; HTML stays revalidated so
  // content updates go live on the next deploy without a stale window.
  routeRules: {
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/_fonts/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
  },

  compatibilityDate: '2026-09-04',

  nitro: {
    // Every route is rendered to static HTML at build time. There is no
    // server-side work at request time, which keeps TTFB at CDN latency and
    // guarantees crawlers and AI agents receive fully-formed markup.
    prerender: {
      crawlLinks: true,
      routes: ['/', '/it', '/play', '/it/play'],
      failOnError: true,
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  // Self-hosted, subset and preloaded at build time: no third-party request
  // and no layout shift from a late-arriving webfont.
  fonts: {
    defaults: {
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
    },
  },

  i18n: {
    defaultLocale: 'en',
    // English lives at the root, Italian under /it. Keeps the canonical URLs
    // short and gives every page a stable, indexable address per language.
    strategy: 'prefix_except_default',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json', dir: 'ltr' },
      { code: 'it', language: 'it-IT', name: 'Italiano', file: 'it.json', dir: 'ltr' },
    ],
    baseUrl: 'https://alessandroluppi.it',
    // Only the root path negotiates language, so shared deep links always
    // resolve to the language they were shared in.
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'en',
    },
  },

  robots: {
    // AI crawlers are deliberately welcome: this site is meant to be
    // discoverable by agentic search, not just by classic search engines.
    blockAiBots: false,
    groups: [
      { userAgent: ['*'], allow: ['/'] },
    ],
  },

  schemaOrg: {
    // Declared once here and inherited by every route, so search engines and
    // AI agents get an unambiguous, machine-readable answer to "who is this
    // site about" without having to infer it from the prose.
    identity: {
      type: 'Person',
      name: 'Alessandro Luppi',
      jobTitle: 'Software and AI engineer',
      url: 'https://alessandroluppi.it',
      sameAs: [
        'https://www.linkedin.com/in/alessandro-luppi/',
        'https://github.com/AleLuppi',
      ],
    },
  },

  sitemap: {
    autoI18n: true,
    xsl: false,
  },
})
