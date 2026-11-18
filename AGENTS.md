# Agent hints

## This repository

`le.stalk` models the family: collections as predicates, bills of materials in three layers, and
lineage as typed edges. It introduces the `dilly-bean` isotope. Live:
https://james-gibson.github.io/le.stalk/

## The model is the site

`src/stalk.mjs` holds `SEEDS`, `COLLECTIONS`, `ISOTOPES`, `MENDEL` and the derived bills. The pages
in `src/render.mjs` render it; there is no other source of truth.

- A **collection** is a predicate with an owner, a purpose and a snapshot. Never add a member list;
  add the seed, or change the predicate. An empty result fails the build unless the collection says
  `mayBeEmpty`.
- A **bill of materials** has three layers, each entry tagged with its source. Do not drop an
  unfilled layer; mark it `unverified` (`runtime.via`).
- A **Mendel table** must account for every trait of the parent. A table that lists only additions
  is a press release.
- A **graft** is a cross-lineage edge and must carry a claim. There are zero today; that is a
  finding, not an omission.
- Seed rows are **vendored from le.plot** at the snapshot date. When a seed changes, edit the row
  and bump `SNAPSHOT`; the guard cannot tell "no new seeds" from "nobody looked".

## Commands

```sh
npm run build    # icons, five pages, card, manifest, llms.txt, sitemap
npm run check    # the isotope's eight scenarios, executed (16 assertions)
npm run verify   # the publish guard
npm run isotope  # re-derive the isotope id
```

## Rules that are easy to break

- The isotope id is content-addressed: if `features/dilly-bean.feature` changes, the page must be
  updated or the build stops.
- The manifest is generated from the card and the palette; never hand-edit `dist`.
- A seed with no https origin is not in the `published` collection — and the guard checks that
  claim rather than trusting it.
- `dist/404.html` is a real page, not an SPA fallback: there is no router.
