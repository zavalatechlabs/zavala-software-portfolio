#!/usr/bin/env node

/**
 * Simple icon generator for PWA
 * Creates placeholder icons in the required sizes
 */

const fs = require('fs')
const path = require('path')

const sizes = [192, 512]

const createSVGIcon = (size) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad1)"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.floor(size * 0.4)}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">MZ</text>
</svg>`
}

const publicDir = path.join(__dirname, '../public')

sizes.forEach((size) => {
  const svg = createSVGIcon(size)
  const filename = `icon-${size}.svg`
  fs.writeFileSync(path.join(publicDir, filename), svg)
  console.log(`Created ${filename}`)
})

console.log('\n✓ Icon generation complete!')
console.log('Note: SVG icons created. For production, convert these to PNG using:')
console.log('  npm install sharp')
console.log('  node scripts/convert-icons-to-png.js')
