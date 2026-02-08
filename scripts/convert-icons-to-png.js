#!/usr/bin/env node

/**
 * Convert SVG icons to PNG using sharp
 */

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const sizes = [192, 512]
const publicDir = path.join(__dirname, '../public')

async function convertSVGtoPNG() {
  for (const size of sizes) {
    const svgPath = path.join(publicDir, `icon-${size}.svg`)
    const pngPath = path.join(publicDir, `icon-${size}.png`)

    try {
      const svgBuffer = fs.readFileSync(svgPath)
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(pngPath)

      console.log(`✓ Created icon-${size}.png`)
    } catch (error) {
      console.error(`✗ Error converting icon-${size}.svg:`, error.message)
    }
  }

  console.log('\n✓ PNG icon conversion complete!')
}

convertSVGtoPNG()
