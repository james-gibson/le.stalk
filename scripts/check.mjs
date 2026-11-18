#!/usr/bin/env node
/**
 * The isotope, executed.
 *
 * `features/dilly-bean.feature` states eight behaviours; `src/stalk.mjs` is the
 * reference implementation. This file runs the implementation against the same
 * statements — including the refusals, which are tested with deliberately broken
 * fixtures rather than trusted to the one model that happens to be correct.
 */
import {
  COLLECTIONS,
  ISOTOPES,
  SEEDS,
  assertAcyclic,
  assertGraft,
  assertModel,
  bomFor,
  membersOf,
  mendelGaps,
} from '../src/stalk.mjs'
import { readFileSync } from 'node:fs'

let failures = 0
const results = []
const check = (n, name, condition, detail = '') => {
  if (condition) results.push(`  ok  ${String(n).padStart(2, '0')}  ${name}`)
  else {
    failures += 1
    results.push(`FAIL  ${String(n).padStart(2, '0')}  ${name}${detail ? ` — ${detail}` : ''}`)
  }
}
const throws = (fn) => {
  try {
    fn()
    return false
  } catch {
    return true
  }
}

// 1. a collection is evaluated, not listed
{
  const published = COLLECTIONS.find((collection) => collection.id === 'published')
  const members = membersOf(published)
  check(1, 'every member satisfies the predicate', members.every((seed) => published.predicate(seed)))
  check(1, 'the member count is the evaluated count', members.length === SEEDS.filter((s) => s.live?.startsWith('https://')).length)
  const offline = { id: 'offline', live: null, runtime: { via: 'unverified' }, ships: [] }
  check(1, 'a seed with no origin is not a member', !published.predicate(offline))
}

// 2. a collection that matches nothing is refused
{
  const empty = { id: 'empty', rule: 'nothing', predicate: () => false, owner: 'nobody', purpose: 'none' }
  check(2, 'an empty collection stops the build', throws(() => assertModel({ collections: [empty] })))
  check(2, 'an empty collection declared empty is allowed', !throws(() => assertModel({ collections: [{ ...empty, mayBeEmpty: true }] })))
}

// 3. a lineage cycle is refused
{
  const cycle = [
    { id: 'a', role: 'seed', cutFrom: 'b', ships: [], via: 'test' },
    { id: 'b', role: 'seed', cutFrom: 'c', ships: [], via: 'test' },
    { id: 'c', role: 'seed', cutFrom: 'a', ships: [], via: 'test' },
  ]
  check(3, 'a cycle stops the build', throws(() => assertAcyclic(cycle)))
}

// 4. an unknown parent is refused
{
  const orphan = [{ id: 'a', role: 'seed', cutFrom: 'ghost', ships: [], via: 'test' }]
  check(4, 'an unknown parent stops the build', throws(() => assertModel({ seeds: orphan, isotopes: [], collections: [] })))
}

// 5. a graft without a claim is refused
{
  check(5, 'a graft with no claim stops the build', throws(() => assertGraft({ child: 'a', parent: 'b', claim: '' })))
  check(5, 'a graft with a claim is allowed', !throws(() => assertGraft({ child: 'a', parent: 'b', claim: 'cut from a foreign starter for its data model' })))
}

// 6. an unfilled layer is unverified, not omitted
{
  const bom = bomFor({ id: 'x', live: null, repo: null, card: null, cutFrom: 'le.gume', ships: [], runtime: { via: 'unverified', note: 'nobody published it' }, via: 'test' })
  const runtime = bom.find((layer) => layer.layer === 'runtime')
  check(6, 'the runtime layer is present', Boolean(runtime))
  check(6, 'the runtime layer is marked unverified', runtime?.unverified === true)
  const filled = bomFor({ id: 'y', live: null, repo: null, card: null, cutFrom: null, ships: [], runtime: { via: 'card', note: 'node 22, no framework' }, via: 'test' })
  check(6, 'a filled layer is not marked unverified', filled.find((layer) => layer.layer === 'runtime')?.unverified === false)
}

// 7. a Mendel table accounts for every parent trait
{
  const gaps = mendelGaps({ traits: [{ trait: 'guard', verdict: 'kept' }] }, ['guard', 'palette', 'manifest'])
  check(7, 'an omitted trait is reported', gaps.join(',') === 'palette,manifest', gaps.join(','))
  check(7, 'a complete table reports nothing', mendelGaps({ traits: [{ trait: 'guard' }, { trait: 'palette' }] }, ['guard', 'palette']).length === 0)
}

// 8. an isotope names a carrier
{
  const stranger = [{ name: 'stranger', builtFrom: [], slots: [] }]
  check(8, 'an isotope with no carrier stops the build', throws(() => assertModel({ isotopes: stranger })))
  check(8, 'every shelf isotope has a carrier today', ISOTOPES.every((isotope) => SEEDS.some((seed) => seed.ships.includes(isotope.name))))
}

console.log(results.join('\n'))
if (failures) {
  console.error(`\ncheck: ${failures} assertion(s) failed against features/dilly-bean.feature`)
  process.exit(1)
}
const scenarios = readFileSync('features/dilly-bean.feature', 'utf8').match(/^\s{2}Scenario:/gm)?.length ?? 0
console.log(`\ncheck: ${results.length} assertions pass against features/dilly-bean.feature (${scenarios} scenarios)`)
