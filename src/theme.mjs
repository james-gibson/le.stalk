import { PALETTE } from './palette.mjs'

const tokens = Object.entries(PALETTE.tokens)
  .map(([name, hex]) => `  --le-${name}: ${hex};`)
  .join('\n')

export const CSS = `/* le.stalk — the trellis
   Tokens are declared once, from src/palette.mjs; the guard re-measures every
   pair the pages paint and refuses a build that breaks one. */
:root {
${tokens}
  --le-mono: ui-monospace, "SFMono-Regular", "IBM Plex Mono", Menlo, Consolas, monospace;
  --le-step: 8px;
  color-scheme: dark;
}

*, *::before, *::after { box-sizing: border-box; }

html {
  background: var(--le-ink);
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  min-height: 100svh;
  font-family: var(--le-mono);
  font-size: 15px;
  line-height: 1.65;
  color: var(--le-smoke);
  background-color: var(--le-ink);
  background-image:
    radial-gradient(110% 70% at 88% -8%, rgba(224, 68, 119, 0.13), transparent 58%),
    radial-gradient(80% 60% at 4% 108%, rgba(85, 122, 96, 0.22), transparent 62%),
    linear-gradient(180deg, #14241d 0%, var(--le-ink) 48%, #101c16 100%);
  background-attachment: fixed;
  overflow-x: hidden;
}

/* The trellis: a faint vertical ruling, like wires for vines. */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.5;
  background-image: repeating-linear-gradient(
    90deg,
    rgba(85, 122, 96, 0.10) 0 1px,
    transparent 1px 96px
  );
}

.wrap { position: relative; z-index: 1; display: flex; min-height: 100svh; flex-direction: column; }
.main { flex: 1; width: 100%; }
.page { width: min(1080px, 100% - 2.5rem); margin: 0 auto; padding: clamp(2rem, 5vw, 4rem) 0 clamp(4rem, 8vw, 6rem); }
.page--doc { width: min(820px, 100% - 2.5rem); }

/* --- masthead ----------------------------------------------------------- */
.masthead {
  display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem 1.4rem;
  padding: 0.7rem clamp(1rem, 3vw, 2rem);
  border-bottom: 1px solid var(--le-line-soft);
  background: color-mix(in srgb, var(--le-ink) 86%, transparent);
  backdrop-filter: blur(10px);
}
.brand { display: inline-flex; align-items: center; gap: 0.5rem; color: var(--le-smoke); text-decoration: none; }
.brand svg { width: 20px; height: 20px; display: block; }
.brand__name { font-size: 0.98rem; font-weight: 600; letter-spacing: -0.01em; }
.brand__dot { color: var(--le-berry); }
.brand__sub { color: var(--le-smoke-dim); font-size: 0.72rem; letter-spacing: 0.16em; text-transform: uppercase; }
.nav { display: flex; flex-wrap: wrap; gap: 0.25rem 1rem; margin-left: auto; }
.nav a { color: var(--le-smoke-dim); text-decoration: none; font-size: 0.82rem; padding: 0.2rem 0; border-bottom: 1px solid transparent; }
.nav a:hover { color: var(--le-smoke); }
.nav a[aria-current="page"] { color: var(--le-smoke); border-bottom-color: var(--le-berry); }

/* --- type --------------------------------------------------------------- */
h1, h2, h3 { font-weight: 500; letter-spacing: -0.02em; line-height: 1.2; margin: 0 0 calc(var(--le-step) * 2); }
h1 { font-size: clamp(1.9rem, 4.4vw, 3rem); }
h2 { font-size: clamp(1.2rem, 2.3vw, 1.5rem); margin-top: calc(var(--le-step) * 6); }
h3 { font-size: 1rem; margin-top: calc(var(--le-step) * 4); color: var(--le-smoke-dim); text-transform: lowercase; letter-spacing: 0.02em; }
p, li { max-width: 70ch; }
p { margin: 0 0 calc(var(--le-step) * 2); }
a { color: var(--le-berry-ink); text-decoration-thickness: 1px; text-underline-offset: 0.22em; }
a:hover { color: var(--le-smoke); text-decoration-color: var(--le-berry); }
:focus-visible { outline: 2px solid var(--le-berry-ink); outline-offset: 2px; }
::selection { background: var(--le-berry); color: var(--le-night); }
hr { border: 0; border-top: 1px solid var(--le-line-soft); margin: calc(var(--le-step) * 4) 0; }
code, kbd { font-family: var(--le-mono); font-size: 0.9em; color: var(--le-smoke); background: var(--le-panel-2); border: 1px solid var(--le-line-soft); padding: 0.06em 0.34em; }
pre { background: var(--le-panel-2); border: 1px solid var(--le-line-soft); padding: calc(var(--le-step) * 2); overflow-x: auto; }
pre code { background: none; border: 0; padding: 0; }

.eyebrow { margin: 0 0 0.7rem; color: var(--le-smoke-dim); font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase; }
.lede { font-size: 1.02rem; color: var(--le-smoke-dim); }
.accent { color: var(--le-berry-ink); }
.muted { color: var(--le-smoke-dim); }
.small { font-size: 0.82rem; }

/* --- stats -------------------------------------------------------------- */
.stats { display: flex; flex-wrap: wrap; gap: 0.4rem 1.6rem; margin: 1.2rem 0 0; padding: 0; list-style: none; }
.stats li { color: var(--le-smoke-dim); font-size: 0.8rem; }
.stats b { color: var(--le-smoke); font-weight: 500; }

/* --- cards -------------------------------------------------------------- */
.answers { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1px; background: var(--le-line-soft); border: 1px solid var(--le-line-soft); margin: 2rem 0; }
.answer { background: var(--le-panel); padding: 1.1rem 1.2rem; }
.answer h3 { margin: 0 0 0.5rem; color: var(--le-smoke); text-transform: none; letter-spacing: 0; }
.answer p { margin: 0; font-size: 0.86rem; color: var(--le-smoke-dim); }
.answer a { font-size: 0.8rem; }

/* --- tables ------------------------------------------------------------- */
.table-wrap { overflow-x: auto; border: 1px solid var(--le-line-soft); margin: 1.2rem 0 2rem; }
table { border-collapse: collapse; width: 100%; font-size: 0.82rem; }
th, td { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--le-line-soft); vertical-align: top; }
th { color: var(--le-smoke-dim); font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; font-size: 0.68rem; }
tbody tr:last-child td { border-bottom: 0; }
td code { white-space: nowrap; }

/* --- collection blocks -------------------------------------------------- */
.collection { border: 1px solid var(--le-line-soft); margin: 0 0 1.4rem; background: var(--le-panel); }
.collection__head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0.4rem 0.9rem; padding: 0.9rem 1rem 0.4rem; }
.collection__head h2 { margin: 0; font-size: 1.1rem; }
.collection__count { color: var(--le-smoke-dim); font-size: 0.75rem; }
.collection__rule { margin: 0; padding: 0 1rem 0.6rem; font-size: 0.8rem; color: var(--le-smoke-dim); }
.collection__meta { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.2rem 1rem; margin: 0; padding: 0 1rem 0.8rem; font-size: 0.78rem; color: var(--le-smoke-dim); }
.collection__meta b { color: var(--le-smoke); font-weight: 500; }
.collection__members { display: flex; flex-wrap: wrap; gap: 0.35rem; padding: 0.7rem 1rem 0.9rem; border-top: 1px solid var(--le-line-soft); }
.chip { display: inline-flex; align-items: center; gap: 0.35rem; border: 1px solid var(--le-line-soft); padding: 0.1rem 0.45rem; font-size: 0.75rem; color: var(--le-smoke); text-decoration: none; }
.chip:hover { border-color: var(--le-line); color: var(--le-smoke); }
.chip--empty { color: var(--le-smoke-dim); }

/* --- BOM ---------------------------------------------------------------- */
.bom { border: 1px solid var(--le-line-soft); margin: 0 0 1rem; }
.bom__head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0.4rem 0.8rem; padding: 0.7rem 0.9rem; border-bottom: 1px solid var(--le-line-soft); }
.bom__head h2 { margin: 0; font-size: 1rem; }
.bom__layers { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1px; background: var(--le-line-soft); }
.layer { background: var(--le-panel-2); padding: 0.7rem 0.9rem; }
.layer h3 { margin: 0 0 0.35rem; font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--le-smoke-dim); }
.layer dl { margin: 0; display: grid; grid-template-columns: auto 1fr; gap: 0.15rem 0.6rem; font-size: 0.76rem; }
.layer dt { color: var(--le-smoke-dim); }
.layer dd { margin: 0; overflow-wrap: anywhere; }
.layer--unverified h3 { color: var(--le-berry-ink); }

.tag { display: inline-block; font-size: 0.64rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.08rem 0.35rem; border: 1px solid var(--le-line-soft); color: var(--le-smoke-dim); }
.tag--verified { border-color: var(--le-line); color: var(--le-smoke); }
.tag--unverified { border-color: var(--le-berry-deep); color: var(--le-berry-ink); }

/* --- Mendel ------------------------------------------------------------- */
.mendel { margin: 0 0 2rem; }
.mendel table td:first-child { white-space: nowrap; }
.verdict { font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase; }
.verdict--kept { color: var(--le-smoke); }
.verdict--added { color: var(--le-berry-ink); }
.verdict--lost { color: var(--le-smoke-dim); }

/* --- footer ------------------------------------------------------------- */
.footer { border-top: 1px solid var(--le-line-soft); padding: 1rem clamp(1rem, 3vw, 2rem) 1.4rem; display: flex; flex-wrap: wrap; gap: 0.6rem 2rem; align-items: baseline; }
.footer p { margin: 0; font-size: 0.78rem; color: var(--le-smoke-dim); }
.footer nav { display: flex; flex-wrap: wrap; gap: 0.3rem 1rem; }
.footer nav a { font-size: 0.78rem; }

@media (max-width: 640px) {
  .brand__sub { display: none; }
  .nav { width: 100%; margin-left: 0; }
  .page { width: calc(100% - 1.75rem); }
}
`
