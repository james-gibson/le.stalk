#!/usr/bin/env node
/**
 * The build: five pages, a card, a manifest, and the machine entry.
 *
 * There is no framework here on purpose. The model is data, the pages are
 * functions of it, and the output is HTML — so what ships is exactly what the
 * guard read, with no hydration step in between. It is the starter's shape with
 * the JSX spine dropped, which the Mendel table on /lineage/ records.
 */
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { IDENTITY, SELF_CARD } from '../src/self-card.mjs'
import { PALETTE } from '../src/palette.mjs'
import { COLLECTIONS, SEEDS, SNAPSHOT, STATS } from '../src/stalk.mjs'
import { ROUTES, bom, collections, home, isotope, lineage, notFound } from '../src/render.mjs'

const DIST = 'dist'

rmSync(DIST, { recursive: true, force: true })
mkdirSync(DIST, { recursive: true })

const pages = {
  '': home(),
  collections: collections(),
  bom: bom(),
  lineage: lineage(),
  'isotope/dilly-bean': isotope({
    id: IDENTITY.id,
    signature: IDENTITY.signature,
    canon: `${IDENTITY.tokens} tokens, ${IDENTITY.parts} parts`,
    tokens: IDENTITY.tokens,
    parts: IDENTITY.parts,
  }),
}

for (const [path, html] of Object.entries(pages)) {
  const dir = path ? join(DIST, path) : DIST
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
}

// Pages serves 404.html for anything without a shell. There is no SPA to fall
// back to, so the page says so instead of pretending to route.
writeFileSync(join(DIST, '404.html'), notFound())

// --- the card -------------------------------------------------------------
const card = {
  ...SELF_CARD,
  generated: SNAPSHOT,
  card: `${SELF_CARD.live}/seed.json`,
}
writeFileSync(join(DIST, 'seed.json'), `${JSON.stringify(card, null, 2)}\n`)

// --- the manifest ---------------------------------------------------------
const icons = [
  { src: 'icons/icon-192.png', sizes: '192x192', purpose: 'any' },
  { src: 'icons/icon-512.png', sizes: '512x512', purpose: 'any' },
  { src: 'icons/maskable-512.png', sizes: '512x512', purpose: 'maskable' },
  { src: 'icons/apple-touch-icon.png', sizes: '180x180', purpose: 'any' },
]
const manifest = {
  id: '/le.stalk/',
  name: `${SELF_CARD.name} — ${SELF_CARD.verb}`,
  short_name: SELF_CARD.preferred,
  description: SELF_CARD.description,
  lang: 'en',
  dir: 'ltr',
  start_url: './',
  scope: './',
  display: 'standalone',
  display_override: ['standalone', 'minimal-ui'],
  orientation: 'any',
  background_color: PALETTE.tokens.ink,
  theme_color: PALETTE.tokens.ink,
  categories: ['developer', 'productivity'],
  icons: icons.map((icon) => ({ ...icon, type: 'image/png' })),
  shortcuts: [
    { name: 'collections', short_name: 'collections', url: './collections/' },
    { name: 'bill of materials', short_name: 'bom', url: './bom/' },
    { name: 'lineage', short_name: 'lineage', url: './lineage/' },
  ],
}
writeFileSync(join(DIST, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)

// --- assets ---------------------------------------------------------------
cpSync('public/icons', join(DIST, 'icons'), { recursive: true })
cpSync('public/favicon.svg', join(DIST, 'favicon.svg'))
writeFileSync(join(DIST, '.nojekyll'), '')
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SELF_CARD.live}/sitemap.xml\n`)

const url = (path) => `${SELF_CARD.live}/${path ? `${path}/` : ''}`
writeFileSync(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${ROUTES.map(
    (route) => `  <url><loc>${url(route.path)}</loc><lastmod>${SNAPSHOT}</lastmod></url>`,
  ).join('\n')}\n</urlset>\n`,
)

const llms = `# le.stalk

> ${SELF_CARD.description}

le.stalk models a family of seeds: what a collection is (a predicate with an owner), what a seed is
made of (shape, runtime, artifacts), and what connects seeds across lineage (typed edges, and a
graft that must carry a claim). Snapshot ${SNAPSHOT}; ${STATS.seeds} seeds, ${STATS.collections}
collections, ${STATS.isotopes} isotopes, ${STATS.grafts} grafts.

## Pages

${ROUTES.filter((route) => route.path)
  .map((route) => `- [${route.title}](${url(route.path)})`)
  .join('\n')}

## Machine

- card: ${SELF_CARD.live}/seed.json
- isotope: features/dilly-bean.feature (${IDENTITY.id})
- source: https://github.com/${SELF_CARD.repo}

## Collections

${COLLECTIONS.map((collection) => `- ${collection.id}: ${collection.rule} — ${collection.purpose}`).join('\n')}
`
writeFileSync(join(DIST, 'llms.txt'), llms)

// --- the report -----------------------------------------------------------
const files = Object.keys(pages).length + 8
console.log(
  `build: ${files} files — ${ROUTES.length} pages, card ${SELF_CARD.id}, manifest "${manifest.name}", ` +
    `${STATS.seeds} seeds in ${STATS.collections} collections, ${STATS.unverified} unverified runtime layer(s)`,
)
