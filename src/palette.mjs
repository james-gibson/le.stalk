/**
 * The wall, and the measurement of it.
 *
 * Same contract as the rest of the family: a token that is not declared is not
 * painted, and every ink/ground pair the pages use is stated with a floor. The
 * guard re-measures the pairs, so a palette edit that breaks a page fails the
 * build rather than the reader.
 */
export const PALETTE = {
  name: 'le.stalk',
  note: 'A green-black beanfield: stalk-cream ink, one bramble-berry accent, and a trellis of quiet rules.',
  tokens: {
    ink: '#12201A',
    'ink-deep': '#0D1813',
    panel: '#1A2C22',
    'panel-2': '#0C1611',
    line: '#557A60',
    'line-soft': '#37523F',
    smoke: '#EFF4EA',
    'smoke-dim': '#BCCFBC',
    berry: '#E04477',
    'berry-ink': '#F58FB0',
    'berry-deep': '#8C1039',
    night: '#08110C',
  },
  grounds: ['ink', 'panel', 'panel-2'],
  pairs: [
    { fg: 'smoke', bg: 'ink', min: 7, note: 'body text on the field' },
    { fg: 'smoke', bg: 'panel', min: 7, note: 'body text on a bed' },
    { fg: 'smoke', bg: 'panel-2', min: 7, note: 'body text in a trench' },
    { fg: 'smoke-dim', bg: 'ink', min: 4.5, note: 'secondary text on the field' },
    { fg: 'smoke-dim', bg: 'panel', min: 4.5, note: 'secondary text on a bed' },
    { fg: 'smoke-dim', bg: 'panel-2', min: 4.5, note: 'secondary text in a trench' },
    { fg: 'berry-ink', bg: 'ink', min: 4.5, note: 'links on the field' },
    { fg: 'berry-ink', bg: 'panel', min: 4.5, note: 'links on a bed' },
    { fg: 'berry-ink', bg: 'panel-2', min: 4.5, note: 'links in a trench' },
    { fg: 'night', bg: 'berry', min: 4.5, note: 'label on the accent fill' },
    { fg: 'smoke', bg: 'berry-deep', min: 4.5, note: 'label on the accent, pressed' },
  ],
}

const channel = (value) => {
  const v = value / 255
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}

export const luminance = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255)
}

export const contrast = (a, b) => {
  const la = luminance(a)
  const lb = luminance(b)
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

export const measured = () =>
  PALETTE.pairs.map((pair) => ({
    ...pair,
    ratio: contrast(PALETTE.tokens[pair.fg], PALETTE.tokens[pair.bg]),
    pass: contrast(PALETTE.tokens[pair.fg], PALETTE.tokens[pair.bg]) >= pair.min,
  }))
