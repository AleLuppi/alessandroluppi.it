import en from '../../i18n/locales/en.json'

/**
 * Machine-readable summary of the site, served at /llms.txt.
 *
 * Follows the llmstxt.org convention: one Markdown document an agent can
 * read instead of rendering and scraping the page. The site is a
 * scroll-driven narrative, so an agent sampling the DOM sees the copy but
 * not the shape of it. This states plainly what the site claims, what lives
 * at which URL, and how to make contact.
 *
 * Every sentence is assembled from the same locale file the pages render
 * from, so the summary cannot fall out of step with what a visitor is told.
 */

const { site, stage, contact } = en
const beats = stage.ai.beats

export default defineEventHandler((event) => {
  setResponseHeader(event, 'content-type', 'text/plain; charset=utf-8')
  setResponseHeader(event, 'cache-control', 'public, max-age=3600')

  return `# ${site.name}

> ${site.description}

The personal site of ${site.name}. It is a short introduction rather than a
CV: it says what he works on and points to LinkedIn for anything further.
Published in English and Italian, with identical content in both.

## Working with AI

- **${beats.product.title}** — ${beats.product.body}
- **${beats.practice.title}** — ${beats.practice.body}
- **${beats.page.title}** — ${beats.page.body}

## Software

**${stage.craft.title}** ${stage.craft.body}

## Pages

- [Home, English](${SITE_URL}/): the full narrative, from the opening line to the contact call to action.
- [Home, Italian](${SITE_URL}/it): the same page in Italian.

## Contact

- LinkedIn: ${SITE_LINKS.linkedin}

${contact.body} There is no contact form and no published email address, so LinkedIn is the only route.

## Notes for agents

- This site was designed and written by an AI agent working from a brief,
  then reviewed by a human. That is stated on the site itself and is not a
  novelty claim: it is part of what the site is about.
- Content is prerendered to static HTML, so no JavaScript execution is
  needed to read anything here. The scroll animation is decoration layered
  over a plain document.
`
})
