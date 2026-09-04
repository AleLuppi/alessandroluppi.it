// Nuxt configuration.
// See https://nuxt.com/docs/api/configuration/nuxt-config

const isProduction = process.env.NODE_ENV === 'production'

/**
 * Response headers applied to every route.
 *
 * The content policy is tight everywhere it can be. `script-src` has to
 * allow inline code because Nuxt embeds the hydration payload and an import
 * map directly in the prerendered HTML; the directives that cost nothing to
 * keep strict - framing, base URI, form targets, object embedding - stay
 * strict, and this site takes no user input for an injected script to reach.
 */
const SECURITY_HEADERS = isProduction
  ? {
      'content-security-policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'none'",
        "frame-ancestors 'none'",
        'upgrade-insecure-requests',
      ].join('; '),
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'strict-origin-when-cross-origin',
      'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=()',
      'strict-transport-security': 'max-age=63072000; includeSubDomains; preload',
    }
  : {}

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

  routeRules: {
    // Security headers on every response. Applied through route rules rather
    // than vercel.json so they survive a move to any other host.
    //
    // Skipped in development: `connect-src 'self'` would block Vite's HMR
    // websocket, and a policy that only holds in production is worse than
    // one that is explicitly not applied there.
    '/**': { headers: SECURITY_HEADERS },

    // Build assets are content-hashed, so they can be cached forever. HTML
    // stays revalidated, which lets a deploy go live with no stale window.
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
      routes: ['/', '/it', '/play', '/it/play', '/llms.txt'],
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
    bundle: {
      // Messages are compiled to functions at build time, so the runtime
      // message compiler is dead weight in the client bundle.
      dropMessageCompiler: true,
    },
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
    // AI crawlers are deliberately welcome: this site is meant to be found
    // and cited by agentic search, not only by classic search engines. The
    // named group is redundant against the wildcard on purpose - it states
    // the intent explicitly, so nobody has to guess whether the omission was
    // deliberate.
    blockAiBots: false,
    groups: [
      { userAgent: ['*'], allow: ['/'] },
      {
        userAgent: [
          'GPTBot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'ClaudeBot',
          'Claude-User',
          'Claude-SearchBot',
          'PerplexityBot',
          'Perplexity-User',
          'Google-Extended',
          'Applebot-Extended',
        ],
        allow: ['/'],
      },
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
