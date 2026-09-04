/**
 * Canonical site facts, shared by the app and by server routes.
 *
 * Lives under `shared/` so the pages and the machine-readable summary at
 * /llms.txt are generated from one set of values and cannot drift apart.
 *
 * Contact deliberately goes through LinkedIn rather than an email address or
 * a form: it is the channel that is actually monitored, and it keeps no
 * personal data on this site.
 */
export const SITE_URL = 'https://alessandroluppi.it'

export const SITE_LINKS = {
  linkedin: 'https://www.linkedin.com/in/alessandro-luppi/',
  github: 'https://github.com/AleLuppi/alessandroluppi.it',
  githubProfile: 'https://github.com/AleLuppi',
} as const
