#!/usr/bin/env node
/**
 * The publish guard.
 *
 * Same job as the rest of the family: read what the build actually produced and
 * refuse to publish something that contradicts its own claims. The checks are
 * the ones this seed has a subject for — a model page whose numbers disagree
 * with the model, a manifest that names a missing icon, an isotope page that
 * prints an id its feature does not derive.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { PALETTE, measured } from '../src/palette.mjs'
import { IDENTITY, SELF_CARD } from '../src/self-card.mjs'
import { COLLECTIONS, SEEDS, STATS, membersOf } from '../src/stalk.mjs'
import { ROUTES } from '../src/render.mjs'

const DIST = 'dist'
const failures = []
const notes = []
const fail = (check, detail) => failures.push({ check, detail })
const read = (path) => readFileSync(path, 'utf8')

const pngSize = (path) => {
  if (!existsSync(path)) return null
  const buffer = readFileSync(path)
  if (buffer.toString('ascii', 1, 4) !== 'PNG') return null
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) }
}

// --- 1. every route is a shell -------------------------------------------
for (const route of ROUTES) {
  const file = join(DIST, route.path, 'index.html')
  if (!existsSync(file)) fail('route', `${file} is missing — a page is an address`)
}
if (!existsSync(join(DIST, '404.html'))) fail('route', 'dist/404.html is missing')
if (!existsSync(join(DIST, '.nojekyll'))) fail('route', 'dist/.nojekyll is missing — Pages would run Jekyll')

// --- 2. every page states itself -----------------------------------------
for (const route of ROUTES) {
  const file = join(DIST, route.path, 'index.html')
  if (!existsSync(file)) continue
  const html = read(file)
  const bare = html.replace(/<style>[\s\S]*?<\/style>/, '')
  if (!/<title>[^<]+ · le\.stalk<\/title>/.test(html)) fail('title', `${route.path || '/'} has no title`)
  if (!/<meta name="description" content="[^"]{20,}">/.test(html)) fail('title', `${route.path || '/'} has no description`)
  if (!html.includes(`<link rel="canonical" href="${SELF_CARD.live}/${route.path ? `${route.path}/` : ''}">`)) {
    fail('title', `${route.path || '/'} has the wrong canonical`)
  }
  if ((bare.match(/aria-current="page"/g) ?? []).length !== 1) {
    fail('nav', `${route.path || '/'} marks ${(bare.match(/aria-current="page"/g) ?? []).length} nav items as current`)
  }
  if (bare.includes('undefined') || bare.includes('[object Object]')) {
    fail('render', `${route.path || '/'} contains an unrendered value`)
  }
}

// --- 3. the palette is measured, not asserted ----------------------------
for (const pair of measured()) {
  if (!pair.pass) fail('contrast', `${pair.fg} on ${pair.bg} is ${pair.ratio.toFixed(2)}:1, under ${pair.min}`)
}
const tightest = measured().reduce((worst, pair) => (pair.ratio < worst.ratio ? pair : worst))
notes.push(`contrast ${tightest.ratio.toFixed(2)}:1 (${tightest.fg} on ${tightest.bg})`)

// --- 4. the install metadata is this seed's ------------------------------
const manifest = JSON.parse(read(join(DIST, 'manifest.json')))
if (manifest.short_name !== SELF_CARD.preferred) fail('manifest', `short_name is ${manifest.short_name}`)
if (!manifest.name.startsWith(SELF_CARD.name)) fail('manifest', `name is ${manifest.name}`)
if (manifest.description !== SELF_CARD.description) fail('manifest', 'description disagrees with the card')
if (manifest.theme_color !== PALETTE.tokens.ink) fail('manifest', `theme_color is ${manifest.theme_color}`)
if (manifest.background_color !== PALETTE.tokens.ink) fail('manifest', `background_color is ${manifest.background_color}`)
for (const icon of manifest.icons) {
  const size = pngSize(join(DIST, icon.src))
  const [width, height] = icon.sizes.split('x').map(Number)
  if (!size) fail('manifest', `${icon.src} is named but missing`)
  else if (size.width !== width || size.height !== height) fail('manifest', `${icon.src} is ${size.width}x${size.height}, declared ${icon.sizes}`)
}
for (const shortcut of manifest.shortcuts ?? []) {
  const shell = join(DIST, shortcut.url.replace(/^\.\//, '').replace(/\/$/, ''), 'index.html')
  if (!existsSync(shell)) fail('manifest', `shortcut ${shortcut.url} has no shell`)
}
const home = read(join(DIST, 'index.html'))
if (!home.includes('rel="manifest"')) fail('manifest', 'the home page does not link the manifest')
if (!home.includes(`content="${PALETTE.tokens.ink}"`)) fail('manifest', 'the home page does not declare the theme colour')
if (!read(join(DIST, 'favicon.svg')).includes('aria-label="le.stalk"')) fail('manifest', 'the tab mark is not named le.stalk')

// --- 5. the card is published and answers --------------------------------
const card = JSON.parse(read(join(DIST, 'seed.json')))
if (card.id !== SELF_CARD.id) fail('card', `seed.json is ${card.id}`)
if (card.live !== SELF_CARD.live) fail('card', 'seed.json live disagrees with the source')
if (!card.pitches || Object.keys(card.pitches).length < 3) fail('card', 'seed.json has fewer than three pitches')
if (!card.ships?.includes('dilly-bean')) fail('card', 'seed.json does not ship the isotope it introduces')
if (!card.card?.endsWith('/seed.json')) fail('card', 'seed.json does not cite its own address')

// --- 6. the model's numbers are the page's numbers -----------------------
if (!home.includes(`<b>${STATS.seeds}</b> seeds`)) fail('model', 'the home page does not print the seed count')
if (!home.includes(`<b>${STATS.collections}</b> collections`)) fail('model', 'the home page does not print the collection count')
if (!home.includes(`<b>${STATS.unverified}</b> unaudited runtimes`)) fail('model', 'the home page does not print the audit gap')
for (const collection of COLLECTIONS) {
  const page = read(join(DIST, 'collections', 'index.html'))
  const members = membersOf(collection)
  if (!page.includes(`>${members.length} of ${SEEDS.length}<`)) {
    fail('model', `collections page disagrees about "${collection.id}" (${members.length} members)`)
  }
}
for (const seed of SEEDS) {
  if (seed.live && !seed.live.startsWith('https://')) fail('model', `${seed.id} is not published on https`)
}

// --- 7. the isotope page prints the id the feature derives ---------------
const isotopePage = read(join(DIST, 'isotope', 'dilly-bean', 'index.html'))
if (!isotopePage.includes(IDENTITY.id)) fail('isotope', 'the isotope page does not print the identity')
try {
  const report = execFileSync('python3', ['scripts/validate-spec.py', 'features/dilly-bean.feature'], {
    encoding: 'utf8',
  })
  const derived = /isotope\s+(\S+)/.exec(report)?.[1]
  if (!derived) fail('isotope', 'the canon reported no isotope id')
  else if (derived !== IDENTITY.id) fail('isotope', `the page prints ${IDENTITY.id} but the feature derives ${derived}`)
  else notes.push(`isotope ${derived.slice(0, 10)}…`)
} catch (error) {
  if (error.status === 2) notes.push('isotope id NOT re-derived here (the canon is not installed)')
  else fail('isotope', `the canon could not read the feature: ${String(error.message).slice(0, 120)}`)
}

// --- 8. internal links resolve -------------------------------------------
const files = new Set(ROUTES.map((route) => `/${route.path ? `${route.path}/` : ''}`))
for (const name of readdirSync(DIST)) files.add(`/${name}`)
for (const route of ROUTES) {
  const file = join(DIST, route.path, 'index.html')
  if (!existsSync(file)) continue
  const html = read(file)
  for (const match of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    const href = match[1]
    if (href === '/') continue
    const known =
      files.has(href) ||
      files.has(href.replace(/\/$/, '')) ||
      href.startsWith('/icons/') ||
      href.endsWith('.svg') ||
      href.endsWith('.json') ||
      href.endsWith('.txt') ||
      href.endsWith('.xml')
    if (!known) fail('link', `${route.path || '/'} links to ${href}, which the build does not produce`)
  }
}

// --- 9. the machine entry lists every page -------------------------------
const llms = read(join(DIST, 'llms.txt'))
for (const route of ROUTES.filter((entry) => entry.path)) {
  if (!llms.includes(`/${route.path}/`)) fail('llms', `llms.txt does not list /${route.path}/`)
}
const sitemap = read(join(DIST, 'sitemap.xml'))
for (const route of ROUTES) {
  if (!sitemap.includes(`${SELF_CARD.live}/${route.path ? `${route.path}/` : ''}<`)) {
    fail('sitemap', `sitemap.xml does not list /${route.path}/`)
  }
}

// --- 10. nothing unfinished, nothing enormous ----------------------------
for (const route of ROUTES) {
  const html = read(join(DIST, route.path, 'index.html'))
  for (const word of ['TODO', 'FIXME', 'PENDING', 'lorem ipsum']) {
    if (html.includes(word)) fail('placeholder', `${route.path || '/'} still contains ${word}`)
  }
}
const size = (dir) =>
  readdirSync(dir, { withFileTypes: true }).reduce(
    (total, entry) =>
      total + (entry.isDirectory() ? size(join(dir, entry.name)) : statSync(join(dir, entry.name)).size),
    0,
  )
const total = size(DIST)
if (total > 4 * 1024 * 1024) fail('size', `dist/ is ${(total / 1024 / 1024).toFixed(1)}MB`)
notes.push(`${(total / 1024).toFixed(0)}KB total`)

if (failures.length) {
  console.error('guard: refused to publish\n')
  for (const { check, detail } of failures) console.error(`  [${check}] ${detail}`)
  console.error('\nNothing was published. Fix the checks above and rebuild.')
  process.exit(1)
}
console.log(`guard: clean — ${notes.join(', ')}`)
