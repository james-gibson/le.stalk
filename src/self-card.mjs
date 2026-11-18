/**
 * The seed's own card, published at /seed.json.
 *
 * Same contract as the rest of the family: a pitch site quotes this instead of
 * writing copy about the seed, and every field here is also stated on the site.
 */
export const SELF_CARD = {
  version: 1,
  id: 'le.stalk',
  name: 'le.stalk',
  preferred: 'le.stalk',
  verb: 'trace a lineage',
  kind: 'seed',
  live: 'https://james-gibson.github.io/le.stalk',
  repo: 'james-gibson/le.stalk',
  rung: 1,
  description:
    'Collections as predicates, bills of materials in three layers, and lineage as typed edges — the family, modelled so a build can disagree with it.',
  pitches: {
    reader:
      'Five collections evaluated against the family, a bill of materials for every seed, and the lineage graph with its gaps named.',
    grower:
      'The model that tells you what a seed inherits, what it is made of, and which claims are still unverified.',
    maintainer:
      'A guard that refuses a lineage cycle, a graft without a claim and a collection that quietly matches nothing.',
    packager:
      'The dilly-bean isotope: trace a seed’s inheritance and its bill of materials, with five refusals.',
  },
  voices: ['reader', 'grower', 'maintainer', 'packager'],
  goals: ['try', 'verify', 'adopt'],
  ships: ['dilly-bean'],
  builtFrom: ['silverskin', 'pickled-egg'],
}

export const IDENTITY = {
  id: 'Fw6AbQhVBu_NfrcCDFDNa6tU1sw2_eaaprAnBWokXIc',
  signature: 'c5703b3c92ccb264',
  canon: '35 tokens, 8 parts',
  tokens: 35,
  parts: 8,
}
