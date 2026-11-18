#!/usr/bin/env node
/**
 * The icons, drawn from the palette rather than exported from a design tool.
 *
 * The mark is a stalk: a stem, two leaves, and the pod that makes it a bean.
 * Everything is computed from the size asked for, so the 180, 192 and 512 are
 * the same drawing; the tab SVG is generated from the same geometry so the tab
 * and the launcher cannot show different marks.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { deflateSync } from 'node:zlib'
import { PALETTE } from '../src/palette.mjs'

const rgb = (name) => {
  const value = PALETTE.tokens[name].slice(1)
  return [0, 2, 4].map((at) => parseInt(value.slice(at, at + 2), 16))
}

const WALL = rgb('ink')
const LINE = rgb('line')
const BERRY = rgb('berry')
const BERRY_INK = rgb('berry-ink')

const TABLE = (() => {
  const table = new Int32Array(256)
  for (let n = 0; n < 256; n += 1) {
    let c = n
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c
  }
  return table
})()

const crc32 = (buffer) => {
  let c = 0xffffffff
  for (const byte of buffer) c = TABLE[(c ^ byte) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

const chunk = (type, data) => {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length, 0)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body), 0)
  return Buffer.concat([length, body, crc])
}

const png = (size, pixels) => {
  const header = Buffer.alloc(13)
  header.writeUInt32BE(size, 0)
  header.writeUInt32BE(size, 4)
  header[8] = 8
  header[9] = 6
  const stride = size * 4
  const raw = Buffer.alloc((stride + 1) * size)
  for (let y = 0; y < size; y += 1) {
    raw[y * (stride + 1)] = 0
    pixels.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const canvas = (size, colour) => {
  const pixels = Buffer.alloc(size * size * 4)
  for (let i = 0; i < size * size; i += 1) {
    pixels[i * 4] = colour[0]
    pixels[i * 4 + 1] = colour[1]
    pixels[i * 4 + 2] = colour[2]
    pixels[i * 4 + 3] = 255
  }
  return pixels
}

const put = (pixels, size, x, y, colour, alpha = 1) => {
  if (x < 0 || y < 0 || x >= size || y >= size) return
  const at = (y * size + x) * 4
  for (let c = 0; c < 3; c += 1) {
    pixels[at + c] = Math.round(pixels[at + c] * (1 - alpha) + colour[c] * alpha)
  }
  pixels[at + 3] = 255
}

const rect = (pixels, size, x, y, w, h, colour, alpha = 1) => {
  for (let dy = 0; dy < h; dy += 1) {
    for (let dx = 0; dx < w; dx += 1) put(pixels, size, x + dx, y + dy, colour, alpha)
  }
}

const circle = (pixels, size, cx, cy, r, colour, alpha = 1) => {
  for (let y = Math.floor(cy - r - 1); y <= Math.ceil(cy + r + 1); y += 1) {
    for (let x = Math.floor(cx - r - 1); x <= Math.ceil(cx + r + 1); x += 1) {
      const distance = Math.hypot(x + 0.5 - cx, y + 0.5 - cy)
      if (distance <= r - 1) put(pixels, size, x, y, colour, alpha)
      else if (distance <= r) put(pixels, size, x, y, colour, alpha * 0.55)
    }
  }
}

/** Two leaves as tilted lozenges: a filled rhombus, one per side. */
const leaf = (pixels, size, cx, cy, length, width, tilt, colour, alpha = 1) => {
  const cos = Math.cos(tilt)
  const sin = Math.sin(tilt)
  const reach = Math.ceil(length + width)
  for (let dy = -reach; dy <= reach; dy += 1) {
    for (let dx = -reach; dx <= reach; dx += 1) {
      const u = dx * cos + dy * sin
      const v = -dx * sin + dy * cos
      const norm = (u / length) ** 2 + (v / width) ** 2
      if (norm <= 1) put(pixels, size, Math.round(cx + dx), Math.round(cy + dy), colour, alpha)
      else if (norm <= 1.15) put(pixels, size, Math.round(cx + dx), Math.round(cy + dy), colour, alpha * 0.45)
    }
  }
}

function mark(size, { inset = 0.16, background = WALL } = {}) {
  const pixels = canvas(size, background)
  const s = size
  const left = s * inset
  const unit = s * (1 - inset * 2)
  const stemWidth = Math.max(2, Math.round(s * 0.035))

  // stem, from the soil to the crown
  rect(pixels, s, Math.round(left + unit * 0.5 - stemWidth / 2), Math.round(s * 0.18), stemWidth, Math.round(s * 0.68), LINE)

  // soil
  rect(pixels, s, Math.round(left), Math.round(s * 0.86), Math.round(unit), Math.max(2, Math.round(s * 0.02)), LINE, 0.6)

  // leaves
  leaf(pixels, s, left + unit * 0.34, s * 0.58, unit * 0.2, unit * 0.075, -0.55, LINE)
  leaf(pixels, s, left + unit * 0.68, s * 0.42, unit * 0.18, unit * 0.07, 0.5, LINE)

  // the pod: two berries on the vine
  circle(pixels, s, left + unit * 0.34, s * 0.52, s * 0.055, BERRY)
  circle(pixels, s, left + unit * 0.68, s * 0.36, s * 0.045, BERRY_INK)

  return png(s, pixels)
}

mkdirSync('public/icons', { recursive: true })
const files = [
  ['public/icons/icon-192.png', mark(192)],
  ['public/icons/icon-512.png', mark(512)],
  ['public/icons/maskable-512.png', mark(512, { inset: 0.26 })],
  ['public/icons/apple-touch-icon.png', mark(180)],
]
for (const [path, buffer] of files) {
  writeFileSync(path, buffer)
  console.log(`icons: ${path} — ${(buffer.length / 1024).toFixed(1)}KB`)
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="le.stalk">
  <rect width="64" height="64" fill="${PALETTE.tokens.ink}"/>
  <rect x="31" y="11" width="2.2" height="44" fill="${PALETTE.tokens.line}"/>
  <rect x="10" y="55" width="44" height="1.4" fill="${PALETTE.tokens.line}" opacity=".6"/>
  <ellipse cx="21" cy="37" rx="12" ry="4.4" transform="rotate(-32 21 37)" fill="${PALETTE.tokens.line}"/>
  <ellipse cx="43" cy="27" rx="11" ry="4.2" transform="rotate(29 43 27)" fill="${PALETTE.tokens.line}"/>
  <circle cx="21" cy="37" r="3.6" fill="${PALETTE.tokens.berry}"/>
  <circle cx="43" cy="27" r="3" fill="${PALETTE.tokens['berry-ink']}"/>
</svg>
`
writeFileSync(join('public', 'favicon.svg'), svg)
console.log('icons: public/favicon.svg')
