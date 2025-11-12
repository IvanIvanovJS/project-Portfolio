#!/usr/bin/env node

/**
 * Image Optimization Script
 *
 * Converts PNG images to modern formats (AVIF, WebP) with fallbacks
 * - AVIF: Best compression, modern browsers
 * - WebP: Good compression, wide support
 * - PNG: Original fallback for maximum compatibility
 *
 * Usage: node scripts/optimizeImages.js
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const CONFIG = {
  inputDir: path.join(__dirname, '../public/images'),
  outputDir: path.join(__dirname, '../public/images/optimized'),
  formats: {
    avif: {
      quality: 80,
      effort: 4, // 0-9, higher = better compression but slower
      chromaSubsampling: '4:4:4',
    },
    webp: {
      quality: 85,
      effort: 4,
      smartSubsample: true,
    },
    png: {
      quality: 90,
      compressionLevel: 9,
      adaptiveFiltering: true,
    },
  },
  // Maximum dimensions for responsive images
  sizes: [
    { suffix: '', width: 1920 }, // Full size
    { suffix: '@2x', width: 3840 }, // Retina
    { suffix: '@lg', width: 1200 }, // Large screens
    { suffix: '@md', width: 768 }, // Tablets
    { suffix: '@sm', width: 640 }, // Mobile
  ],
};

/**
 * Get all PNG files from directory
 */
async function getPngFiles(dir) {
  const files = await fs.readdir(dir);
  return files.filter((file) => file.toLowerCase().endsWith('.png'));
}

/**
 * Ensure output directory exists
 */
async function ensureDir(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

/**
 * Get image metadata
 */
async function getImageInfo(filePath) {
  const metadata = await sharp(filePath).metadata();
  return {
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    size: (await fs.stat(filePath)).size,
  };
}

/**
 * Convert image to specified format
 */
async function convertImage(
  inputPath,
  outputPath,
  format,
  options,
  width = null
) {
  let pipeline = sharp(inputPath);

  // Resize if width is specified
  if (width) {
    pipeline = pipeline.resize(width, null, {
      withoutEnlargement: true,
      fit: 'inside',
    });
  }

  // Convert to target format
  switch (format) {
    case 'avif':
      pipeline = pipeline.avif(options);
      break;
    case 'webp':
      pipeline = pipeline.webp(options);
      break;
    case 'png':
      pipeline = pipeline.png(options);
      break;
  }

  await pipeline.toFile(outputPath);

  const stats = await fs.stat(outputPath);
  return stats.size;
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Process single image
 */
async function processImage(filename, inputDir, outputDir) {
  const inputPath = path.join(inputDir, filename);
  const baseName = path.parse(filename).name;

  console.log(`\n📸 Processing: ${filename}`);

  const originalInfo = await getImageInfo(inputPath);
  console.log(
    `   Original: ${originalInfo.width}x${originalInfo.height} - ${formatBytes(originalInfo.size)}`
  );

  const results = {
    original: filename,
    originalSize: originalInfo.size,
    formats: {},
  };

  // Process each format
  for (const [formatName, formatOptions] of Object.entries(CONFIG.formats)) {
    results.formats[formatName] = {};

    // Generate responsive sizes
    for (const size of CONFIG.sizes) {
      // Skip sizes larger than original
      if (size.width > originalInfo.width && size.suffix !== '@2x') {
        continue;
      }

      const outputFilename = `${baseName}${size.suffix}.${formatName}`;
      const outputPath = path.join(outputDir, outputFilename);

      try {
        const fileSize = await convertImage(
          inputPath,
          outputPath,
          formatName,
          formatOptions,
          size.width
        );

        results.formats[formatName][size.suffix || 'default'] = {
          filename: outputFilename,
          size: fileSize,
          width: size.width,
        };

        const savings = ((1 - fileSize / originalInfo.size) * 100).toFixed(1);
        console.log(
          `   ✓ ${formatName.toUpperCase()} ${size.suffix || 'full'}: ${formatBytes(fileSize)} (${savings}% smaller)`
        );
      } catch (error) {
        console.error(
          `   ✗ Failed to create ${formatName} ${size.suffix}:`,
          error.message
        );
      }
    }
  }

  return results;
}

/**
 * Generate usage documentation
 */
function generateUsageDoc(results) {
  const doc = [];

  doc.push('# Optimized Images Usage Guide\n');
  doc.push('Generated: ' + new Date().toISOString() + '\n\n');
  doc.push('## How to Use\n');
  doc.push(
    'Use Next.js `<Image>` component with `<picture>` for format fallbacks:\n\n'
  );
  doc.push('```tsx');
  doc.push("import Image from 'next/image';");
  doc.push('');
  doc.push('<picture>');
  doc.push('  <source');
  doc.push('    srcSet="/images/optimized/example.avif"');
  doc.push('    type="image/avif"');
  doc.push('  />');
  doc.push('  <source');
  doc.push('    srcSet="/images/optimized/example.webp"');
  doc.push('    type="image/webp"');
  doc.push('  />');
  doc.push('  <Image');
  doc.push('    src="/images/optimized/example.png"');
  doc.push('    alt="Description"');
  doc.push('    width={1920}');
  doc.push('    height={1080}');
  doc.push('  />');
  doc.push('</picture>');
  doc.push('```\n\n');

  doc.push('## Responsive Images with Sizes\n\n');
  doc.push('```tsx');
  doc.push('<picture>');
  doc.push('  <source');
  doc.push('    srcSet="');
  doc.push('      /images/optimized/example@sm.avif 640w,');
  doc.push('      /images/optimized/example@md.avif 768w,');
  doc.push('      /images/optimized/example@lg.avif 1200w,');
  doc.push('      /images/optimized/example.avif 1920w');
  doc.push('    "');
  doc.push(
    '    sizes="(max-width: 640px) 100vw, (max-width: 1200px) 80vw, 1200px"'
  );
  doc.push('    type="image/avif"');
  doc.push('  />');
  doc.push('  <source');
  doc.push('    srcSet="');
  doc.push('      /images/optimized/example@sm.webp 640w,');
  doc.push('      /images/optimized/example@md.webp 768w,');
  doc.push('      /images/optimized/example@lg.webp 1200w,');
  doc.push('      /images/optimized/example.webp 1920w');
  doc.push('    "');
  doc.push(
    '    sizes="(max-width: 640px) 100vw, (max-width: 1200px) 80vw, 1200px"'
  );
  doc.push('    type="image/webp"');
  doc.push('  />');
  doc.push('  <Image');
  doc.push('    src="/images/optimized/example.png"');
  doc.push('    alt="Description"');
  doc.push('    width={1920}');
  doc.push('    height={1080}');
  doc.push(
    '    sizes="(max-width: 640px) 100vw, (max-width: 1200px) 80vw, 1200px"'
  );
  doc.push('  />');
  doc.push('</picture>');
  doc.push('```\n\n');

  doc.push('## Processed Images\n\n');

  for (const result of results) {
    doc.push(`### ${result.original}\n`);
    doc.push(`Original size: ${formatBytes(result.originalSize)}\n\n`);

    for (const [format, sizes] of Object.entries(result.formats)) {
      doc.push(`**${format.toUpperCase()}:**\n`);
      for (const [sizeName, info] of Object.entries(sizes)) {
        const savings = ((1 - info.size / result.originalSize) * 100).toFixed(
          1
        );
        doc.push(
          `- ${info.filename}: ${formatBytes(info.size)} (${savings}% reduction)\n`
        );
      }
      doc.push('\n');
    }
  }

  return doc.join('');
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Image Optimization Script\n');
  console.log('Input directory:', CONFIG.inputDir);
  console.log('Output directory:', CONFIG.outputDir);

  try {
    // Ensure output directory exists
    await ensureDir(CONFIG.outputDir);

    // Get all PNG files
    const pngFiles = await getPngFiles(CONFIG.inputDir);

    if (pngFiles.length === 0) {
      console.log('\n⚠️  No PNG files found in input directory');
      return;
    }

    console.log(`\nFound ${pngFiles.length} PNG file(s) to process\n`);

    // Process all images
    const results = [];
    for (const file of pngFiles) {
      const result = await processImage(
        file,
        CONFIG.inputDir,
        CONFIG.outputDir
      );
      results.push(result);
    }

    // Generate usage documentation
    const usageDoc = generateUsageDoc(results);
    const docPath = path.join(CONFIG.outputDir, 'USAGE.md');
    await fs.writeFile(docPath, usageDoc);

    // Calculate total savings
    const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
    let totalOptimized = 0;
    results.forEach((r) => {
      Object.values(r.formats.avif).forEach((info) => {
        totalOptimized += info.size;
      });
    });

    const totalSavings = ((1 - totalOptimized / totalOriginal) * 100).toFixed(
      1
    );

    console.log('\n✅ Optimization complete!');
    console.log(`\nTotal original size: ${formatBytes(totalOriginal)}`);
    console.log(`Total AVIF size: ${formatBytes(totalOptimized)}`);
    console.log(`Total savings: ${totalSavings}%`);
    console.log(`\n📄 Usage guide: ${docPath}`);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
