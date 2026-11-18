# le.stalk

Collections, bills of materials and lineage for a family of seeds.

Live: https://james-gibson.github.io/le.stalk/

Three questions, answered as things a build can check rather than as prose:

- **What is a collection of seeds?** A predicate with an owner, a purpose and a snapshot. The
  members are evaluated every build; a collection that matches nothing fails the build unless it
  declares that it expects to.
- **What is a bill of materials?** Three layers — shape, runtime, artifacts — each entry carrying
  the source it came from. A layer nobody published is printed as `unverified`, never omitted.
- **What connects seeds across lineage?** Six typed edges. An edge that crosses lineage is a graft
  and must carry a claim.

The seed introduces **dilly-bean**, an isotope for tracing a seed's inheritance and its bill of
materials. It ships five refusals: a lineage cycle, an unknown parent, a graft without a claim, an
isotope with no carrier, and a collection that quietly matches nothing.

## Build

```sh
npm run build    # icons, pages, card, manifest
npm run check    # the isotope, executed against the model and broken fixtures
npm run verify   # the publish guard
npm run isotope  # re-derive the isotope id with the canon
```

No dependencies: one generator, one model, one guard.
