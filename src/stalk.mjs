/**
 * The model: seeds, collections, edges, bills of materials, Mendel tables.
 *
 * Three questions this file has to answer without prose:
 *
 *   1. What is a collection of seeds? A predicate with an owner, a purpose and
 *      a snapshot — a query, not a folder. `COLLECTIONS` holds the predicate as
 *      a function so the member list is *evaluated* every build. A list typed
 *      next to a rule is a list that will disagree with the rule.
 *   2. What is a bill of materials? Three layers — shape, runtime, artifacts —
 *      each entry carrying where it came from. A layer nobody published is
 *      `unverified`, and saying so is the point.
 *   3. What connects seeds of different lineage? Typed edges, and a graft: an
 *      edge that crosses lineage must name its claim, because the child inherits
 *      a shape it did not grow from.
 *
 * The seed data is vendored from le.plot's registry at the snapshot date, not
 * fetched: the build is offline, and a copy with a date and a source is a claim
 * that can be checked later.
 *
 * In-universe: an isotope is a genotype, a seed is a phenotype, a collection is
 * a generation, and a Mendel table records what a crossing kept. Mandelbrot is
 * why the same shape recurs at every zoom — the rule is the same at the seed,
 * the collection and the isotope; only the scale changes.
 */

export const SNAPSHOT = '2026-11-18'
export const SLUG = 'le.stalk'
export const LIVE = 'https://james-gibson.github.io/le.stalk'
export const REPO = 'james-gibson/le.stalk'

/**
 * `via` says where a field came from. There is no field without one:
 *   plot        vendored from le.plot's registry
 *   card        read from the seed's own published /seed.json
 *   observed    seen at the origin on the snapshot date
 *   this seed   le.stalk's own facts
 */
export const SEEDS = [
  {
    id: 'le.gume',
    role: 'starter',
    live: 'https://james-gibson.github.io/le.gume',
    repo: 'james-gibson/le.gume',
    cutFrom: null,
    ships: ['silverskin', 'cornichon'],
    card: null,
    runtime: { via: 'unverified', note: 'the starter does not publish a runtime record' },
    via: 'plot',
  },
  {
    id: 'le.gume-shell',
    role: 'seed',
    live: 'https://james-gibson.github.io/le.gume-shell',
    repo: 'james-gibson/le.gume-shell',
    cutFrom: 'le.gume',
    ships: ['silverskin', 'cornichon', 'dill', 'gherkin', 'piccalilli'],
    card: null,
    runtime: { via: 'unverified', note: 'no card, no package record' },
    via: 'plot',
  },
  {
    id: 'le.gume-energy',
    role: 'seed',
    live: 'https://james-gibson.github.io/le.gume-energy',
    repo: 'james-gibson/le.gume-energy',
    cutFrom: 'le.gume',
    ships: ['silverskin', 'cornichon'],
    card: null,
    runtime: { via: 'unverified', note: 'a data site; the runtime is whatever the harvest machine has' },
    via: 'plot',
  },
  {
    id: 'le.go',
    role: 'seed',
    live: 'https://james-gibson.github.io/le.go',
    repo: 'james-gibson/le.go',
    cutFrom: 'le.gume',
    ships: ['silverskin'],
    card: null,
    runtime: { via: 'unverified', note: 'no card, no package record' },
    via: 'plot',
  },
  {
    id: 'le.railhead',
    role: 'seed',
    live: 'https://james-gibson.github.io/le.railhead',
    repo: 'james-gibson/le.railhead',
    cutFrom: 'le.gume',
    ships: [],
    card: null,
    runtime: { via: 'unverified', note: 'no card, no package record' },
    via: 'plot',
  },
  {
    id: 'le.ad',
    role: 'seed',
    live: 'https://james-gibson.github.io/le.ad',
    repo: 'james-gibson/le.ad',
    cutFrom: 'le.gume',
    ships: [],
    card: 'https://james-gibson.github.io/le.ad/seed.json',
    runtime: { via: 'unverified', note: 'the desk publishes a card, but the card has no dependency slot' },
    via: 'card',
  },
  {
    id: 'le.seo',
    role: 'seed',
    live: 'https://james-gibson.github.io/le.seo',
    repo: 'james-gibson/le.seo',
    cutFrom: 'le.gume',
    ships: ['silverskin', 'cornichon', 'giardiniera', 'pickled-egg'],
    card: 'https://james-gibson.github.io/le.seo/seed.json',
    runtime: { via: 'unverified', note: 'the pitch site publishes a card; it still publishes no runtime' },
    via: 'card',
  },
  {
    id: 'le.plot',
    role: 'seed',
    live: 'https://james-gibson.github.io/le.plot',
    repo: 'james-gibson/le.plot',
    cutFrom: 'le.gume',
    ships: [],
    card: null,
    runtime: { via: 'unverified', note: 'the registry publishes rows, not a bill of materials' },
    via: 'plot',
  },
  {
    id: 'that-train-dashboard',
    role: 'seed',
    live: 'https://james-gibson.github.io/that-train-dashboard',
    repo: 'james-gibson/that-train-dashboard',
    cutFrom: 'le.gume',
    ships: [],
    card: null,
    runtime: { via: 'unverified', note: 'no card, no package record' },
    via: 'plot',
  },
  {
    id: 'zaphood',
    role: 'seed',
    live: 'https://james-gibson.github.io/zaphood',
    repo: 'james-gibson/zaphood',
    cutFrom: 'le.gume',
    ships: [],
    card: null,
    runtime: { via: 'unverified', note: 'no card, no package record' },
    via: 'plot',
  },
  {
    id: 'le.stalk',
    role: 'seed',
    live: LIVE,
    repo: REPO,
    cutFrom: 'le.gume',
    ships: ['dilly-bean'],
    card: `${LIVE}/seed.json`,
    runtime: { via: 'this seed', note: 'node 22, no framework, one generator and one guard' },
    via: 'this seed',
  },
]

/** What a seed carries, and what carries it. */
export const ISOTOPES = [
  {
    name: 'silverskin',
    home: 'https://james-gibson.github.io/le.gume/isotopes/silverskin/',
    problem: 'a documentation site that ships itself',
    builtFrom: [],
    slots: [],
  },
  {
    name: 'cornichon',
    home: 'https://james-gibson.github.io/le.gume/isotopes/cornichon/',
    problem: 'spell-check a repository on a schedule',
    builtFrom: [],
    slots: ['repo', 'dict', 'every'],
  },
  {
    name: 'giardiniera',
    home: 'https://james-gibson.github.io/le.seo/isotope/giardiniera/',
    problem: 'serve an assortment to one voice and one goal',
    builtFrom: ['silverskin', 'cornichon'],
    slots: ['voice', 'goal'],
  },
  {
    name: 'pickled-egg',
    home: 'https://james-gibson.github.io/le.seo/isotope/pickled-egg/',
    problem: "name the installed app after the seed, from the seed's own card",
    builtFrom: ['silverskin', 'cornichon'],
    slots: ['seed', 'wall', 'mark', 'doors'],
  },
  {
    name: 'dill',
    home: 'https://james-gibson.github.io/le.gume-shell/isotopes/dill/',
    problem: 'agree on a rotation without logging it',
    builtFrom: [],
    slots: ['tick'],
  },
  {
    name: 'gherkin',
    home: 'https://james-gibson.github.io/le.gume-shell/isotopes/gherkin/',
    problem: 'read a rate limit before you spend it',
    builtFrom: [],
    slots: ['floor', 'every'],
  },
  {
    name: 'piccalilli',
    home: 'https://james-gibson.github.io/le.gume-shell/isotopes/piccalilli/',
    problem: 'measure a blast radius with a flag',
    builtFrom: [],
    slots: ['surface', 'model'],
  },
  {
    name: 'dilly-bean',
    home: `${LIVE}/isotope/dilly-bean/`,
    problem: "trace a seed's inheritance and its bill of materials",
    builtFrom: ['silverskin', 'pickled-egg'],
    slots: ['seed', 'traits', 'layers', 'graft'],
  },
]

/**
 * A collection is a predicate with an owner, a purpose and a snapshot.
 *
 * `rule` is the sentence a human reads, `predicate` is the thing the build runs.
 * They are kept side by side on purpose: when they disagree, the build wins and
 * the sentence is wrong.
 */
export const COLLECTIONS = [
  {
    id: 'published',
    title: 'the published',
    rule: 'a seed with an https origin',
    predicate: (seed) => typeof seed.live === 'string' && seed.live.startsWith('https://'),
    owner: 'the plot',
    purpose: 'what a reader can open without cloning anything',
    why: 'the only collection with a promise about right now: an origin either answers or it does not',
  },
  {
    id: 'cut-from-the-starter',
    title: 'cut from the starter',
    rule: "cutFrom === 'le.gume'",
    predicate: (seed) => seed.cutFrom === 'le.gume',
    owner: 'the starter',
    purpose: 'what inherits the shape, and therefore what a fix to the shape reaches',
    why: 'provenance, not dependency: a cutting does not import the starter, and a change there does not deploy here',
  },
  {
    id: 'quoted',
    title: 'the quoted',
    rule: 'a seed that publishes /seed.json',
    predicate: (seed) => Boolean(seed.card),
    owner: 'the seed',
    purpose: 'what a pitch site can quote instead of writing copy',
    why: 'the collection grows by publishing a card, not by asking to be added',
  },
  {
    id: 'ships-an-isotope',
    title: 'the carriers',
    rule: 'ships.length > 0',
    predicate: (seed) => seed.ships.length > 0,
    owner: 'the shelf',
    purpose: 'what proves a named procedure, rather than describing it',
    why: 'an isotope with no carrier is an address with nothing behind it',
  },
  {
    id: 'unverified-runtime',
    title: 'the unaudited',
    rule: "runtime.via === 'unverified'",
    predicate: (seed) => seed.runtime.via === 'unverified',
    owner: 'nobody yet',
    purpose: 'the audit debt: seeds whose bill of materials nobody can fill from a published artefact',
    why: 'a gap that is counted is a gap that can shrink; a gap that is described in prose is a gap that stays',
  },
]

/** Typed edges. Direction is the child, the carrier, or the quoting site. */
export const EDGE_KINDS = {
  'cut-from': 'a seed was cut from another seed — vertical, and within lineage',
  ships: 'a seed carries an isotope — vertical, and authorized by the shelf',
  composes: 'an isotope is built from other isotopes — the genotype of the genotype',
  quotes: 'a site quotes a seed card — horizontal, and the only edge that moves copy',
  documents: 'a registry documents a seed — horizontal, and the map edge',
  graft: 'a seed is cut from outside the family — vertical, across lineage, and must carry a claim',
}

export const GRAFTS = []

/** The crossings this seed has first-hand knowledge of. */
export const MENDEL = [
  {
    child: 'le.ad',
    parent: 'le.gume',
    note: 'the empty hot desk: the first seed to keep the spine and replace the wall',
    traits: [
      { trait: 'build spine', verdict: 'kept' },
      { trait: 'content model', verdict: 'kept' },
      { trait: 'publish guard', verdict: 'kept', detail: 'plus manifest, address and offline checks' },
      { trait: 'isotope page', verdict: 'kept' },
      { trait: 'tailwind', verdict: 'lost', detail: 'hand-written tokens instead' },
      { trait: 'palette', verdict: 'lost', detail: 'steelblue wall, gold grain' },
      { trait: 'manifest', verdict: 'added', detail: 'installable, with a protocol handler' },
      { trait: 'addresses', verdict: 'added', detail: 'a desk is a URL, a hash and a scheme' },
    ],
  },
  {
    child: 'le.seo',
    parent: 'le.gume',
    note: 'the pitch: keeps the site and adds a register whose order is a rule',
    traits: [
      { trait: 'build spine', verdict: 'kept' },
      { trait: 'content model', verdict: 'kept' },
      { trait: 'publish guard', verdict: 'kept', detail: 'plus card, manifest and copy gates' },
      { trait: 'isotope page', verdict: 'kept' },
      { trait: 'palette', verdict: 'lost', detail: 'aubergine wall, dark pink' },
      { trait: 'register', verdict: 'added', detail: 'destinations with a voice, a goal and a rung' },
      { trait: 'trees', verdict: 'added', detail: 'sixteen prerendered addresses' },
      { trait: 'seed cards', verdict: 'added', detail: 'a site quotes a seed instead of writing its copy' },
    ],
  },
  {
    child: 'le.stalk',
    parent: 'le.gume',
    note: 'the vine: keeps the discipline, drops the framework, adds the graph',
    traits: [
      { trait: 'publish guard', verdict: 'kept', detail: 'same job, no bundler' },
      { trait: 'content model', verdict: 'lost', detail: 'the model is code; the pages are rendered from it' },
      { trait: 'jsx spine', verdict: 'lost', detail: 'one generator, no framework' },
      { trait: 'palette', verdict: 'lost', detail: 'green-black field, bramble berry' },
      { trait: 'collections', verdict: 'added', detail: 'a predicate with an owner and a snapshot' },
      { trait: 'bill of materials', verdict: 'added', detail: 'three layers, each with a source' },
      { trait: 'Mendel tables', verdict: 'added', detail: 'what a crossing kept, added and lost' },
      { trait: 'seed card', verdict: 'added', detail: 'published so a pitch site can quote it' },
    ],
  },
]

// --- derivation -----------------------------------------------------------

export const byId = (id) => SEEDS.find((seed) => seed.id === id)

export function membersOf(collection, seeds = SEEDS) {
  return seeds.filter((seed) => collection.predicate(seed))
}

export function edges() {
  const list = []
  for (const seed of SEEDS) {
    if (seed.cutFrom) list.push({ kind: 'cut-from', from: seed.id, to: seed.cutFrom })
    for (const isotope of seed.ships) list.push({ kind: 'ships', from: seed.id, to: isotope })
  }
  for (const isotope of ISOTOPES) {
    for (const parent of isotope.builtFrom) list.push({ kind: 'composes', from: isotope.name, to: parent })
  }
  // The only quoted card today, and it is a real edge: le.seo's tree renders
  // le.ad's sentence from le.ad's card.
  list.push({ kind: 'quotes', from: 'le.seo', to: 'le.ad' })
  for (const seed of SEEDS) {
    if (seed.id !== 'le.plot') list.push({ kind: 'documents', from: 'le.plot', to: seed.id })
  }
  for (const graft of GRAFTS) list.push({ kind: 'graft', from: graft.child, to: graft.parent, claim: graft.claim })
  return list
}

/**
 * The bill of materials, in three layers. A layer that cannot be filled says so;
 * an omitted layer is indistinguishable from a seed with nothing in it.
 */
export function bomFor(seed) {
  return [
    {
      layer: 'shape',
      source: seed.via,
      entries: [
        { name: 'cut from', value: seed.cutFrom ?? 'the root' },
        { name: 'ships', value: seed.ships.length ? seed.ships.join(', ') : 'no isotope' },
      ],
    },
    {
      layer: 'runtime',
      source: seed.runtime.via,
      entries: [{ name: 'runtime', value: seed.runtime.note }],
      unverified: seed.runtime.via === 'unverified',
    },
    {
      layer: 'artifacts',
      source: seed.via,
      entries: [
        { name: 'origin', value: seed.live ?? 'not published' },
        { name: 'repository', value: seed.repo ?? 'no repository' },
        { name: 'card', value: seed.card ?? 'no card' },
      ],
    },
  ]
}

/** Walk the cut-from edges; a cycle is not a lineage, it is a mistake. */
export function assertAcyclic(seeds = SEEDS) {
  const parent = new Map(seeds.map((seed) => [seed.id, seed.cutFrom]))
  for (const seed of seeds) {
    const seen = new Set([seed.id])
    let at = seed.cutFrom
    while (at) {
      if (seen.has(at)) throw new Error(`stalk: "${seed.id}" is cut from itself through ${[...seen].join(' → ')} → ${at}`)
      seen.add(at)
      at = parent.get(at) ?? null
    }
  }
}

/** Every trait the parent carries must be accounted for in the child's table. */
export function mendelGaps(table, parentTraits) {
  const stated = new Set(table.traits.map((row) => row.trait))
  return parentTraits.filter((trait) => !stated.has(trait))
}

// --- the checks the model runs on itself --------------------------------
// Exported so the isotope can be executed against a broken fixture, not only
// against the one model that happens to be correct today.

export function assertModel({
  seeds = SEEDS,
  isotopes = ISOTOPES,
  collections = COLLECTIONS,
  grafts = GRAFTS,
} = {}) {
  const ids = new Set(seeds.map((seed) => seed.id))
  if (ids.size !== seeds.length) throw new Error('stalk: two seeds share an id')

  for (const seed of seeds) {
    if (!['starter', 'seed', 'graft'].includes(seed.role)) {
      throw new Error(`stalk: "${seed.id}" has no role`)
    }
    if (!seed.via) throw new Error(`stalk: "${seed.id}" has no source for its row`)
    if (seed.cutFrom && !ids.has(seed.cutFrom)) {
      throw new Error(`stalk: "${seed.id}" is cut from "${seed.cutFrom}", which is not in the model`)
    }
  }

  assertAcyclic(seeds)

  const isotopeNames = new Set(isotopes.map((isotope) => isotope.name))
  for (const seed of seeds) {
    for (const name of seed.ships) {
      if (!isotopeNames.has(name)) {
        throw new Error(`stalk: "${seed.id}" ships "${name}", which the shelf does not name`)
      }
    }
  }
  for (const isotope of isotopes) {
    if (!seeds.some((seed) => seed.ships.includes(isotope.name))) {
      throw new Error(`stalk: "${isotope.name}" is on the shelf with no carrier`)
    }
    for (const parent of isotope.builtFrom) {
      if (!isotopeNames.has(parent)) {
        throw new Error(`stalk: "${isotope.name}" is built from "${parent}", which is not on the shelf`)
      }
    }
  }

  for (const collection of collections) {
    const members = membersOf(collection, seeds)
    if (!members.length && !collection.mayBeEmpty) {
      throw new Error(
        `stalk: collection "${collection.id}" matches nothing — an empty collection is a claim, not a default`,
      )
    }
  }

  for (const table of MENDEL) {
    if (!ids.has(table.child) || !ids.has(table.parent)) {
      throw new Error(`stalk: the Mendel table for "${table.child}" names a seed outside the model`)
    }
    for (const row of table.traits) {
      if (!['kept', 'added', 'lost'].includes(row.verdict)) {
        throw new Error(`stalk: "${table.child}" has trait "${row.trait}" with verdict "${row.verdict}"`)
      }
    }
  }

  for (const graft of grafts) assertGraft(graft)
}

/** A cross-lineage edge is allowed; a silent one is not. */
export function assertGraft(graft) {
  if (!graft.claim || !graft.claim.trim()) {
    throw new Error(
      `stalk: graft "${graft.child} → ${graft.parent}" has no claim — a cross-lineage edge is not an opinion`,
    )
  }
}

assertModel()

export const STATS = {
  seeds: SEEDS.length,
  published: membersOf(COLLECTIONS.find((c) => c.id === 'published')).length,
  carded: membersOf(COLLECTIONS.find((c) => c.id === 'quoted')).length,
  unverified: membersOf(COLLECTIONS.find((c) => c.id === 'unverified-runtime')).length,
  isotopes: ISOTOPES.length,
  edges: edges().length,
  collections: COLLECTIONS.length,
  grafts: GRAFTS.length,
}
