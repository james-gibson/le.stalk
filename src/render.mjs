import { CSS } from './theme.mjs'
import { measured } from './palette.mjs'
import {
  COLLECTIONS,
  EDGE_KINDS,
  GRAFTS,
  ISOTOPES,
  LIVE,
  MENDEL,
  REPO,
  SEEDS,
  SNAPSHOT,
  STATS,
  bomFor,
  byId,
  edges,
  membersOf,
} from './stalk.mjs'

const esc = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

export const ROUTES = [
  { path: '', title: 'What is a collection of seeds?', nav: 'Home' },
  { path: 'collections', title: 'Collections', nav: 'Collections' },
  { path: 'bom', title: 'Bill of materials', nav: 'Bill of materials' },
  { path: 'lineage', title: 'Lineage', nav: 'Lineage' },
  { path: 'isotope/dilly-bean', title: 'The dilly-bean isotope', nav: 'Isotope' },
]

const nav = (current) =>
  ROUTES.filter((route) => route.path)
    .map(
      (route) =>
        `<a href="/${route.path}/"${current === route.path ? ' aria-current="page"' : ''}>${esc(route.nav)}</a>`,
    )
    .join('')

const MARK = `<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
  <rect x="15" y="4" width="2" height="25" fill="var(--le-line)"/>
  <path d="M16 21c-5 0-8-3-8-7 5 0 8 3 8 7z" fill="var(--le-line)"/>
  <path d="M17 14c0-5 3-8 7-8 0 5-3 8-7 8z" fill="var(--le-line)"/>
  <ellipse cx="20.5" cy="10" rx="1.6" ry="2.6" transform="rotate(38 20.5 10)" fill="var(--le-berry)"/>
  <ellipse cx="11.5" cy="16.5" rx="1.4" ry="2.2" transform="rotate(-38 11.5 16.5)" fill="var(--le-berry-ink)"/>
</svg>`

export function layout({ title, description, current, body }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · le.stalk</title>
<meta name="description" content="${esc(description)}">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#12201A">
<meta name="application-name" content="le.stalk">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="manifest" href="/manifest.json">
<link rel="canonical" href="${LIVE}/${current ? `${current}/` : ''}">
<style>${CSS}</style>
</head>
<body>
<div class="wrap">
<header class="masthead">
  <a class="brand" href="/"${current === '' ? ' aria-current="page"' : ''} aria-label="le.stalk — lineage and collections">
    ${MARK}
    <span class="brand__name">le<span class="brand__dot">.</span>stalk</span>
    <span class="brand__sub">lineage · collections · bills</span>
  </a>
  <nav class="nav" aria-label="Sections">${nav(current)}</nav>
</header>
<main class="main">${body}</main>
<footer class="footer">
  <p><b>le.stalk</b> — seeds, what they are made of, and what they are cut from. Snapshot ${SNAPSHOT}.</p>
  <nav aria-label="Elsewhere">
    <a href="https://james-gibson.github.io/le.plot/">le.plot</a>
    <a href="https://james-gibson.github.io/le.seo/">le.seo</a>
    <a href="/seed.json">seed.json</a>
    <a href="/llms.txt">llms.txt</a>
    <a href="https://github.com/${REPO}">source</a>
  </nav>
</footer>
</div>
</body>
</html>
`
}

// --- home -----------------------------------------------------------------

export function home() {
  const unaudited = STATS.unverified
  const body = `<div class="page">
<p class="eyebrow">a seed about seeds</p>
<h1>What is a collection<br><span class="accent">of seeds?</span></h1>
<p class="lede">The family has a map and a pitch. It did not have an account of what a collection is,
what a seed is made of, or what crosses between lineages. This seed is that account, stated as
things a build can check.</p>

<ul class="stats" aria-label="Model at a glance">
  <li><b>${STATS.seeds}</b> seeds</li>
  <li><b>${STATS.collections}</b> collections</li>
  <li><b>${STATS.isotopes}</b> isotopes</li>
  <li><b>${STATS.edges}</b> edges</li>
  <li><b>${STATS.carded}</b> quoted cards</li>
  <li><b>${unaudited}</b> unaudited runtimes</li>
  <li><b>${STATS.grafts}</b> grafts</li>
</ul>

<div class="answers">
  <div class="answer">
    <h3>A collection is a predicate with an owner</h3>
    <p>Not a folder and not a tag. It has an admission rule, a purpose, an owner and a snapshot, and
    its members are recalculated every build. <a href="/collections/">Five of them, evaluated</a>.</p>
  </div>
  <div class="answer">
    <h3>A bill of materials is three layers</h3>
    <p>Shape, runtime, artifacts — each entry saying where it came from. A layer nobody published is
    <em>unverified</em>, not omitted. <a href="/bom/">The family's bills, with the gaps visible</a>.</p>
  </div>
  <div class="answer">
    <h3>Lineage is typed edges; a graft needs a reason</h3>
    <p>Cut-from, ships, composes, quotes, documents. An edge that crosses lineage is a graft and
    must carry a claim. <a href="/lineage/">The graph, and the crossings</a>.</p>
  </div>
</div>

<h2>The finding this seed ships with</h2>
<p>${unaudited} of ${STATS.seeds} seeds cannot state their own runtime from a published artefact. That is
not an insult to the seeds: it is the shape of the gap. The map records what a seed <em>is</em> and the
pitch records what it <em>says</em>; nothing publishes what it is <em>made of</em>. The fix is a slot, not a
document — a <code>deps</code> block in the card, derived at build, so a consumer can read a bill
without cloning a repository.</p>

<h2>Why a stalk</h2>
<p>A stalk is what a cutting grows into, and a beanstalk is the family's oldest joke about scale:
you climb it and the same structure is above you. That is the claim this seed tests. An isotope is
a genotype; a seed is a phenotype; a collection is a generation. A Mendel table records what a
crossing kept, added and lost — and the Mandelbrot claim is that the rule is the same at every
zoom, which is only true if a seed can say what it inherited.</p>
<p>It is also the seed that proves its own point: it is cut from the starter, and its
<a href="/lineage/#mendel">Mendel table</a> says exactly what it dropped.</p>

<h2>What this costs</h2>
<ul>
  <li><b>A model is a promise to keep it current.</b> The seed data is vendored from le.plot at the
  snapshot date; a new seed is invisible here until this file is edited, and the guard cannot tell
  the difference between "no new seeds" and "nobody looked".</li>
  <li><b>Two of eleven cards.</b> The bill of materials is honest but thin: nine seeds are described
  by a registry row, not by their own publication.</li>
  <li><b>No pans.</b> The palette gate measures ink against ground; it does not measure the trellis
  behind it, and a build cannot see whether the page reads well.</li>
</ul>
</div>`
  return layout({
    title: 'What is a collection of seeds?',
    description:
      'Seeds, what they are made of, and what they are cut from: collections as predicates, bills of materials in three layers, and lineage as typed edges.',
    current: '',
    body,
  })
}

// --- collections ----------------------------------------------------------

export function collections() {
  const blocks = COLLECTIONS.map((collection) => {
    const members = membersOf(collection)
    const chips = members.length
      ? members
          .map((seed) =>
            seed.live
              ? `<a class="chip" href="${seed.live}">${esc(seed.id)}</a>`
              : `<span class="chip">${esc(seed.id)}</span>`,
          )
          .join('')
      : '<span class="chip chip--empty">nothing yet — and that is stated, not hidden</span>'
    return `<section class="collection" aria-labelledby="c-${collection.id}">
  <div class="collection__head">
    <h2 id="c-${collection.id}">${esc(collection.title)}</h2>
    <span class="collection__count">${members.length} of ${SEEDS.length}</span>
  </div>
  <p class="collection__rule"><code>${esc(collection.rule)}</code></p>
  <dl class="collection__meta">
    <div><b>owner</b> · ${esc(collection.owner)}</div>
    <div><b>purpose</b> · ${esc(collection.purpose)}</div>
  </dl>
  <p class="collection__rule">${esc(collection.why)}</p>
  <div class="collection__members">${chips}</div>
</section>`
  }).join('\n')

  const body = `<div class="page">
<p class="eyebrow">collections</p>
<h1>A collection is a question<br><span class="accent">you can re-ask.</span></h1>
<p class="lede">A folder is where a file is. A collection is a predicate, an owner, a purpose and a
snapshot — so the member list can change without anybody editing a list.</p>

<p>This matters because the family already has three things that look like collections and are not
the same kind of thing: a repository owns files, a registry owns claims, and a pitch owns an order.
Calling all three “the seeds” hides the only interesting question, which is <em>who decides what is
in it, and what happens when they are wrong?</em></p>

<p>Each block below prints the rule as code and then the members the rule actually selects. If the
two disagree, the build fails before the page does. That is the whole trick: a collection is not a
document that describes a set; it is a function that produces one.</p>

${blocks}

<h2>What is not a collection</h2>
<ul>
  <li><b>“All my repositories.”</b> No admission rule, no purpose, no owner — a directory listing
  with a possessive pronoun.</li>
  <li><b>A tag.</b> Tags are many-to-many and weightless: everything can have every tag, and no tag
  has to justify a member. A collection has to say why a seed is in it.</li>
  <li><b>The plot.</b> le.plot is a <em>registry</em>: it owns rows and their claims, and it is one
  collection's owner, not the collection itself.</li>
  <li><b>The pitch.</b> le.seo is a <em>view</em> over the published seeds for a voice and a goal.
  It is a collection, but its order is editorial, and an editorial decision is not an admission
  rule.</li>
</ul>

<h2>SEO as a collection</h2>
<p>le.seo is the pitch collection: its predicate is “published, and has a pitch for at least one
voice”, its owner is the family, its purpose is to sell, and its snapshot is the register. That is
why it can drop a seed from a tree without removing it from the family: a tree is a <em>selection
from a collection</em>, ordered for one reader. The collection is the set; the tree is the sentence
about it.</p>

<h2>Why the owner matters</h2>
<p>Without an owner, a collection drifts by accretion: something gets added because it was nearby.
With one, removal is a decision somebody can be asked about. The unaudited collection below has
owner “nobody yet” — which is the point of naming it. A gap with an owner is a task; a gap with a
name is a fact.</p>
</div>`
  return layout({
    title: 'Collections are predicates with owners',
    description:
      'Five collections evaluated against the family: published, cut from the starter, quoted, carriers, and the unaudited runtimes.',
    current: 'collections',
    body,
  })
}

// --- BOM ------------------------------------------------------------------

export function bom() {
  const blocks = SEEDS.map((seed) => {
    const layers = bomFor(seed)
      .map((layer) => {
        const rows = layer.entries
          .map((entry) => `<dt>${esc(entry.name)}</dt><dd>${esc(entry.value)}</dd>`)
          .join('')
        const tag = layer.unverified
          ? '<span class="tag tag--unverified">unverified</span>'
          : `<span class="tag tag--verified">${esc(layer.source)}</span>`
        return `<div class="layer${layer.unverified ? ' layer--unverified' : ''}">
  <h3>${esc(layer.layer)} ${tag}</h3>
  <dl>${rows}</dl>
</div>`
      })
      .join('')
    return `<section class="bom" aria-labelledby="b-${esc(seed.id)}">
  <div class="bom__head"><h2 id="b-${esc(seed.id)}">${esc(seed.id)}</h2><span class="muted small">${esc(seed.role)}</span></div>
  <div class="bom__layers">${layers}</div>
</section>`
  }).join('\n')

  const body = `<div class="page">
<p class="eyebrow">bill of materials</p>
<h1>What a seed is made of,<br><span class="accent">layer by layer.</span></h1>
<p class="lede">npm tells you what you imported. A bill of materials tells you what you are made
of — including the parts nobody ships as a package: the shape, the isotopes, the artifacts.</p>

<p>Three layers, because they fail differently. <b>Shape</b>: what it was cut from and what it
carries. <b>Runtime</b>: the platform the build and the page assume. <b>Artifacts</b>: what a
consumer can actually fetch — an origin, a repository, a card, a manifest.</p>

<p>Every entry says where it came from. <code>plot</code> means the claim is vendored from the
registry, <code>card</code> means the seed published it, <code>this seed</code> means le.stalk
observed it. A layer with no source is marked <span class="tag tag--unverified">unverified</span>
rather than left blank, because an omitted layer looks exactly like a seed that has nothing in
it.</p>

<div class="table-wrap">
<table>
<thead><tr><th>layer</th><th>the question it answers</th><th>why it cannot be merged</th></tr></thead>
<tbody>
<tr><td><code>shape</code></td><td>what is this cut from, and what does it carry?</td><td>survives a version bump; changes only when the lineage does</td></tr>
<tr><td><code>runtime</code></td><td>what has to exist for this to build and serve?</td><td>changes on a patch release; the thing an audit actually checks</td></tr>
<tr><td><code>artifacts</code></td><td>what can be fetched, and from where?</td><td>changes on a deploy; the thing a consumer actually uses</td></tr>
</tbody>
</table>
</div>

${blocks}

<h2>What the gaps say</h2>
<p>${STATS.unverified} of ${STATS.seeds} runtime layers are unverified, and not because the seeds are
careless. Each one publishes a site, a guard and a registry row; none publishes a dependency record
a consumer can read without cloning. The next card slot is <code>deps</code>: the three layers,
generated at build, so this page can quote instead of guess.</p>
<p>That is also why this seed publishes its own runtime in full: one seed has to show what a filled
layer looks like before asking the others for theirs.</p>

<h2>What a BOM is not</h2>
<ul>
  <li><b>Not a lockfile.</b> A lockfile is exact and unreadable; a BOM is coarse and arguable. You
  need both, and they answer different questions.</li>
  <li><b>Not a licence list.</b> Licences are one column of one layer — the legal one — and a bill
  that only lists licences tells you nothing about what runs.</li>
  <li><b>Not a promise of freshness.</b> Every entry carries a date and a source; a BOM without
  either is a memory.</li>
</ul>
</div>`
  return layout({
    title: 'A bill of materials in three layers',
    description:
      'Shape, runtime and artifacts for every seed in the family, each entry tagged with the source it came from.',
    current: 'bom',
    body,
  })
}

// --- lineage --------------------------------------------------------------

export function lineage() {
  const all = edges()
  const kinds = Object.entries(EDGE_KINDS).map(([kind, note]) => {
    const rows = all
      .filter((edge) => edge.kind === kind)
      .map(
        (edge) =>
          `<tr><td><code>${esc(edge.from)}</code></td><td>${esc(kind)}</td><td><code>${esc(edge.to)}</code></td><td>${esc(edge.claim ?? '—')}</td></tr>`,
      )
      .join('')
    return `<h3>${esc(kind)} <span class="muted small">— ${note}</span></h3>
<div class="table-wrap"><table>
<thead><tr><th>from</th><th>edge</th><th>to</th><th>claim</th></tr></thead>
<tbody>${rows || '<tr><td colspan="4" class="muted">no edges of this kind</td></tr>'}</tbody>
</table></div>`
  }).join('\n')

  const mendel = MENDEL.map((table) => {
    const rows = table.traits
      .map(
        (trait) =>
          `<tr><td>${esc(trait.trait)}</td><td class="verdict verdict--${trait.verdict}">${esc(trait.verdict)}</td><td>${esc(trait.detail ?? '')}</td></tr>`,
      )
      .join('')
    return `<section class="mendel" aria-labelledby="m-${esc(table.child)}">
<h3 id="m-${esc(table.child)}">${esc(table.parent)} × capability → ${esc(table.child)}</h3>
<p class="muted small">${esc(table.note)}</p>
<div class="table-wrap"><table>
<thead><tr><th>trait</th><th>verdict</th><th>detail</th></tr></thead>
<tbody>${rows}</tbody>
</table></div>
</section>`
  }).join('\n')

  const body = `<div class="page">
<p class="eyebrow">lineage</p>
<h1>A seed inherits a shape.<br><span class="accent">Not the family's memory.</span></h1>
<p class="lede">Lineage is not dependency. A cutting keeps the shape and gets its own life; a
dependency is imported and shared. The graph below keeps the two apart by naming the verb.</p>

<p>Six edge kinds. Four are vertical (cut-from, ships, composes, graft), two are horizontal (quotes,
documents). Direction is the child, the carrier, or the quoting site — never “related to”, which is
the word people use when they have not decided.</p>

${kinds}

<h2 id="grafts">Grafts</h2>
<p>A graft is the edge that crosses lineage: a seed cut from outside the family. It is legal, and it
is the one edge that must carry a claim, because the child inherits a shape it did not grow from
and the family's self-similarity claim stops applying at that seam.</p>
<p>${GRAFTS.length === 0 ? 'There are <b>zero grafts</b> today. Every seed in the model is cut from le.gume, which is itself a finding: the family has not tested its own inheritance rule against a foreign rootstock, and this page cannot tell you what would happen if it did.' : `${GRAFTS.length} graft(s) recorded.`}</p>

<h2 id="mendel">Mendel tables</h2>
<p>A crossing keeps some traits, adds some, and loses some. A table that lists only additions is a
press release; a table that lists only losses is an apology. The three below are the crossings this
seed has first-hand knowledge of, with every trait the parent has accounted for.</p>

${mendel}

<h2>The Mandelbrot claim</h2>
<p>Zoom into a seed and you find a card, isotopes, a guard. Zoom into a collection and you find
seeds with cards, isotopes and guards. Zoom into an isotope and you find scenarios, slots and a
refusal. The rule is the same at every scale — <em>declare, derive, refuse</em> — and only the noun
changes. That is the claim, and it is falsifiable: a seed that needs a different rule at its own
scale is a break in self-similarity, and the break is worth naming rather than smoothing over.</p>
<p>The boundary is the interesting part. A seed's coastline is the set of claims another seed could
also make: a quote, a shared isotope, a copied palette. The coastline is where the family is
actually joined, and it is why the <a href="/collections/#c-quoted">quoted</a> collection is small
and the <a href="/bom/">bills</a> are thin.</p>

<h2>What the graph refuses</h2>
<ul>
  <li><b>A cycle.</b> A seed cut from itself, directly or through others, is not a lineage.</li>
  <li><b>An unknown parent or isotope.</b> A name is an address; one that resolves to nothing is a
  rumour with a diagram.</li>
  <li><b>A graft without a claim.</b> Crossing lineage is allowed; crossing it silently is not.</li>
  <li><b>An isotope with no carrier.</b> A procedure nobody implements is a description.</li>
  <li><b>A Mendel table that ignores a trait.</b> The parent's traits are the denominator; a table
  that lists four of eight is not a table, it is a highlight reel.</li>
</ul>
</div>`
  return layout({
    title: 'Lineage, grafts and Mendel tables',
    description:
      'Cut-from, ships, composes, quotes, documents and graft — the six typed edges, the zero grafts, and the crossings that were measured.',
    current: 'lineage',
    body,
  })
}

// --- isotope --------------------------------------------------------------

export function isotope({ id, signature, canon, tokens, parts }) {
  const seed = byId('le.stalk')
  const slots = ISOTOPES.find((entry) => entry.name === 'dilly-bean').slots
  const body = `<div class="page page--doc">
<p class="eyebrow">isotope</p>
<h1>The dilly-bean isotope</h1>
<p class="lede">A dilly bean is a green bean, pickled whole and packed upright in the jar — the vine's
fruit, preserved in the shape it grew. That is the procedure: a seed's inheritance and its bill of
materials, kept in the shape they were declared.</p>

<h2>The identity</h2>
<pre><code>isotope    ${esc(id)}
signature  ${esc(signature)}  (hmac-sha256, key seed-42)
canon      ${esc(canon)}
parts      ${esc(parts)}
source     features/dilly-bean.feature</code></pre>
<p class="small muted">Run <code>npm run isotope</code> to re-derive it with the real canon. If the
number above is not what that command prints, the page is wrong and the build should be stopped.</p>

<h2>The instruction slots</h2>
<div class="table-wrap"><table>
<thead><tr><th>slot</th><th>fill with</th><th>what the build does</th></tr></thead>
<tbody>
<tr><td><code>seed</code></td><td>a seed row with its origin, repository and card</td><td>the subject of the table; a row without a source is refused</td></tr>
<tr><td><code>traits</code></td><td>the parent's traits, stated before the crossing</td><td>every trait must appear in the child's table as kept, added or lost; a missing trait fails</td></tr>
<tr><td><code>layers</code></td><td>shape, runtime and artifacts</td><td>each entry carries a source; an unfilled layer is printed as unverified, never omitted</td></tr>
<tr><td><code>graft</code></td><td>zero or more cross-lineage edges</td><td>a graft needs a claim; silence is refused</td></tr>
</tbody>
</table></div>

<h2>The five refusals</h2>
<ol>
  <li><b>A cycle in the lineage.</b> A cutting cut from itself.</li>
  <li><b>A parent or isotope that resolves to nothing.</b></li>
  <li><b>A graft without a claim.</b> Crossing lineage is a decision, not a detail.</li>
  <li><b>An isotope with no carrier.</b> A procedure nobody implements.</li>
  <li><b>A collection that matches nothing and does not say it expects to.</b> An empty result is a
  claim; a default is a bug.</li>
</ol>

<h2>Why this isotope and not a spreadsheet</h2>
<p>A spreadsheet can hold the same rows and will not refuse anything. The isotope's contribution is
the refusals: they are the difference between a document that describes the family and a model that
can disagree with it. It is also why the seed publishes its own row and its own bill — the first
carrier has to be the example.</p>

<h2>Built from the existing pickles</h2>
<p>This isotope is <b>silverskin</b> (a self-documenting site that ships itself) crossed with
<b>pickled-egg</b> (artifacts generated from the seed's own card): the site shape from the first,
the per-seed publication from the second. It is the genotype side of the family — the procedure for
reading inheritance, where giardiniera is the procedure for ordering a pitch.</p>

<h2>Status: proposed</h2>
<p>First home is here, beside its carrier. The proposal is to file it upstream as
<code>isotope/features/dilly-bean.feature</code> with the five refusals as policy, because “a model
that refuses” is the family's own standard and this is the first isotope that applies it to the
family itself.</p>

<p class="small muted">Carrier: <a href="${seed.live}">${esc(seed.id)}</a> · the model is
<code>src/stalk.mjs</code> · the scenarios are run by <code>npm run check</code>.</p>
</div>`
  return layout({
    title: 'The dilly-bean isotope',
    description:
      'Trace a seed\'s inheritance and its bill of materials: slots for the seed, the traits, the layers and a graft, with five refusals.',
    current: 'isotope/dilly-bean',
    body,
  })
}

export function notFound() {
  return layout({
    title: 'No row here',
    description: 'That address is not in the model.',
    current: '404',
    body: `<div class="page"><p class="eyebrow">404</p><h1>No row here.</h1>
<p>That address is not in the model. <a href="/">Back to the collections</a>, or read the
<a href="/lineage/">lineage</a>.</p></div>`,
  })
}

// --- palette page? no: the guard measures; the site states. ----------------

export function paletteLine() {
  return measured()
    .filter((pair) => !pair.pass)
    .map((pair) => `${pair.fg} on ${pair.bg}: ${pair.ratio.toFixed(2)} < ${pair.min}`)
    .join(', ')
}
