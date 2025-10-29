const Spritesmith = require('spritesmith');
const fs = require('fs').promises;
const path = require('path');

const PNG_DIR = path.join(__dirname, '../assets/icons/png');
const OUTPUT_DIR = path.join(__dirname, '../public/textures');
const VERSION = 'v1';

/**
 * Calculate the next power-of-two dimension for WebGL compatibility
 * @param {number} value - The dimension to round up
 * @returns {number} The next power-of-two value
 */
function nextPowerOfTwo(value) {
  return Math.pow(2, Math.ceil(Math.log2(value)));
}

/**
 * Generate texture atlas from PNG icons
 * @returns {Promise<void>}
 */
async function generateAtlas() {
  console.log('🎨 Starting texture atlas generation...\n');

  try {
    // Ensure output directory exists
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Get all PNG files
    const files = await fs.readdir(PNG_DIR);
    const pngFiles = files
      .filter((file) => file.endsWith('.png'))
      .map((file) => path.join(PNG_DIR, file));

    if (pngFiles.length === 0) {
      console.error('❌ No PNG files found in', PNG_DIR);
      process.exit(1);
    }

    console.log(`📦 Found ${pngFiles.length} icons to pack\n`);

    // Generate sprite using Spritesmith
    const result = await new Promise((resolve, reject) => {
      Spritesmith.run(
        {
          src: pngFiles,
          padding: 2, // 2-pixel padding to prevent bleeding
          algorithm: 'binary-tree', // Efficient packing algorithm
          algorithmOpts: { sort: true }, // Sort for better packing
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });

    // Calculate power-of-two dimensions for WebGL
    const maxDimension = Math.max(
      result.properties.width,
      result.properties.height
    );
    const atlasSize = nextPowerOfTwo(maxDimension);

    console.log(
      `📐 Original dimensions: ${result.properties.width}x${result.properties.height}`
    );
    console.log(`📐 Power-of-two dimensions: ${atlasSize}x${atlasSize}\n`);

    // Create canvas with power-of-two dimensions if needed
    let finalImage = result.image;
    if (
      atlasSize !== result.properties.width ||
      atlasSize !== result.properties.height
    ) {
      const sharp = require('sharp');

      // Extend image to power-of-two dimensions with transparent background
      finalImage = await sharp(result.image)
        .extend({
          top: 0,
          bottom: atlasSize - result.properties.height,
          left: 0,
          right: atlasSize - result.properties.width,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();
    }

    // Save atlas image
    const atlasPath = path.join(OUTPUT_DIR, `icons.${VERSION}.png`);
    await fs.writeFile(atlasPath, finalImage);
    console.log(`✅ Atlas image saved: ${atlasPath}`);

    // Generate metadata
    const metadata = {
      meta: {
        version: VERSION,
        size: atlasSize,
        iconSize: 128,
        padding: 2,
        count: pngFiles.length,
        generated: new Date().toISOString(),
      },
      frames: {},
    };

    // Add frame data for each icon
    for (const [filePath, coords] of Object.entries(result.coordinates)) {
      const iconName = path.basename(filePath, '.png');
      metadata.frames[iconName] = {
        x: coords.x,
        y: coords.y,
        w: coords.width,
        h: coords.height,
      };
    }

    // Save metadata JSON
    const metadataPath = path.join(OUTPUT_DIR, `icons.${VERSION}.json`);
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');
    console.log(`✅ Metadata saved: ${metadataPath}`);

    // Print summary
    console.log('\n📊 Atlas Generation Summary:');
    console.log(`   - Icons packed: ${pngFiles.length}`);
    console.log(`   - Atlas size: ${atlasSize}x${atlasSize} pixels`);
    console.log(`   - Padding: 2 pixels`);
    console.log(`   - Algorithm: binary-tree`);
    console.log(`   - Version: ${VERSION}`);
    console.log('\n✨ Texture atlas generation complete!\n');
  } catch (error) {
    console.error('❌ Error generating atlas:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the script
generateAtlas();
