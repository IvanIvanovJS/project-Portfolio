/**
 * SVG to PNG Converter Script
 *
 * Converts SVG icons to PNG format using Sharp library.
 * Features:
 * - Batch processing with concurrency control (5 simultaneous conversions)
 * - 128×128 pixel output with transparent background
 * - PNG compression level 9 for optimal file size
 * - Error handling for corrupted or invalid SVG files
 * - Progress tracking and conversion report
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

// Configuration
const INPUT_DIR = path.join(__dirname, '../assets/icons/svg');
const OUTPUT_DIR = path.join(__dirname, '../assets/icons/png');
const OUTPUT_SIZE = 128;
const PNG_COMPRESSION = 9;
const CONCURRENCY_LIMIT = 5;

// Ensure output directory exists
async function ensureOutputDirectory() {
  if (!fsSync.existsSync(OUTPUT_DIR)) {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
  }
}

/**
 * Convert a single SVG file to PNG
 * @param {string} svgPath - Path to input SVG file
 * @param {string} pngPath - Path to output PNG file
 * @returns {Promise<{success: boolean, inputSize: number, outputSize: number, error?: string}>}
 */
async function convertSvgToPng(svgPath, pngPath) {
  try {
    // Get input file size
    const inputStats = await fs.stat(svgPath);
    const inputSize = inputStats.size;

    // Convert SVG to PNG
    await sharp(svgPath)
      .resize(OUTPUT_SIZE, OUTPUT_SIZE, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({
        compressionLevel: PNG_COMPRESSION,
        palette: true, // Use palette-based PNG for smaller file size
      })
      .toFile(pngPath);

    // Get output file size
    const outputStats = await fs.stat(pngPath);
    const outputSize = outputStats.size;

    return {
      success: true,
      inputSize,
      outputSize,
    };
  } catch (error) {
    return {
      success: false,
      inputSize: 0,
      outputSize: 0,
      error: error.message || String(error),
    };
  }
}

/**
 * Format bytes to human-readable string
 * @param {number} bytes - Number of bytes
 * @returns {string} - Formatted string (e.g., "1.5 KB")
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Display progress bar in console
 * @param {number} current - Current progress
 * @param {number} total - Total items
 * @param {string} status - Status message
 */
function displayProgress(current, total, status = '') {
  const percentage = Math.round((current / total) * 100);
  const barLength = 40;
  const filledLength = Math.round((barLength * current) / total);
  const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);

  process.stdout.write(
    `\r[${bar}] ${percentage}% (${current}/${total}) ${status}`
  );

  if (current === total) {
    process.stdout.write('\n');
  }
}

/**
 * Process conversions with concurrency control
 * @param {Array<{svgPath: string, pngPath: string, name: string}>} tasks - Conversion tasks
 * @returns {Promise<Array<{name: string, success: boolean, inputSize: number, outputSize: number, error?: string}>>}
 */
async function processWithConcurrency(tasks) {
  const results = [];
  let completed = 0;
  let activePromises = [];

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];

    // Create conversion promise
    const promise = convertSvgToPng(task.svgPath, task.pngPath).then(
      (result) => {
        completed++;
        displayProgress(completed, tasks.length, `Converting ${task.name}...`);
        return {
          name: task.name,
          ...result,
        };
      }
    );

    activePromises.push(promise);

    // Wait if we've reached concurrency limit
    if (activePromises.length >= CONCURRENCY_LIMIT) {
      const result = await Promise.race(activePromises);
      results.push(result);
      activePromises = activePromises.filter((p) => p !== promise);
    }
  }

  // Wait for remaining promises
  const remainingResults = await Promise.all(activePromises);
  results.push(...remainingResults);

  return results;
}

/**
 * Convert all SVG files in the input directory to PNG
 * @returns {Promise<Array<{name: string, success: boolean, inputSize: number, outputSize: number, error?: string}>>}
 */
async function convertAllIcons() {
  console.log('🎨 Starting SVG to PNG conversion process...\n');

  await ensureOutputDirectory();

  // Read all SVG files from input directory
  let files;
  try {
    files = await fs.readdir(INPUT_DIR);
  } catch (error) {
    throw new Error(
      `Failed to read input directory ${INPUT_DIR}: ${error.message}`
    );
  }

  const svgFiles = files.filter((file) => file.toLowerCase().endsWith('.svg'));

  if (svgFiles.length === 0) {
    console.log('⚠️  No SVG files found in input directory.');
    console.log(`📁 Input directory: ${INPUT_DIR}\n`);
    return [];
  }

  console.log(`📦 Total SVG files to convert: ${svgFiles.length}`);
  console.log(`📐 Output size: ${OUTPUT_SIZE}×${OUTPUT_SIZE} pixels`);
  console.log(`🗜️  PNG compression level: ${PNG_COMPRESSION}`);
  console.log(`⚡ Concurrency limit: ${CONCURRENCY_LIMIT}\n`);

  // Prepare conversion tasks
  const tasks = svgFiles.map((file) => ({
    name: path.basename(file, '.svg'),
    svgPath: path.join(INPUT_DIR, file),
    pngPath: path.join(OUTPUT_DIR, file.replace(/\.svg$/i, '.png')),
  }));

  // Process conversions with concurrency control
  const results = await processWithConcurrency(tasks);

  displayProgress(results.length, results.length, 'Complete!');

  return results;
}

/**
 * Generate and display conversion report
 * @param {Array} results - Conversion results
 */
function generateConversionReport(results) {
  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  // Calculate total sizes
  const totalInputSize = successful.reduce((sum, r) => sum + r.inputSize, 0);
  const totalOutputSize = successful.reduce((sum, r) => sum + r.outputSize, 0);
  const compressionRatio =
    totalInputSize > 0
      ? ((1 - totalOutputSize / totalInputSize) * 100).toFixed(1)
      : 0;

  console.log('\n' + '='.repeat(60));
  console.log('📊 CONVERSION REPORT');
  console.log('='.repeat(60));
  console.log(`✓ Successful: ${successful.length}`);
  console.log(`✗ Failed: ${failed.length}`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  console.log('='.repeat(60));

  if (successful.length > 0) {
    console.log('\n📈 Size Statistics:');
    console.log(`  Total input size:  ${formatBytes(totalInputSize)}`);
    console.log(`  Total output size: ${formatBytes(totalOutputSize)}`);
    console.log(`  Compression ratio: ${compressionRatio}%`);
    console.log(
      `  Average per icon:  ${formatBytes(totalOutputSize / successful.length)}`
    );
  }

  if (failed.length > 0) {
    console.log('\n✗ Failed conversions:');
    failed.forEach(({ name, error }) => {
      console.log(`  • ${name}: ${error}`);
    });
  }

  if (successful.length > 0) {
    console.log('\n✓ Successfully converted icons:');
    successful.forEach(({ name, inputSize, outputSize }) => {
      const ratio = ((1 - outputSize / inputSize) * 100).toFixed(1);
      console.log(
        `  • ${name}: ${formatBytes(inputSize)} → ${formatBytes(outputSize)} (${ratio}% smaller)`
      );
    });
  }

  console.log('\n' + '='.repeat(60));

  // Exit with appropriate code
  if (failed.length > 0) {
    console.log(
      '\n⚠️  Some conversions failed. Check the errors above for details.'
    );
    process.exit(1);
  } else {
    console.log('\n✅ All icons converted successfully!');
    process.exit(0);
  }
}

// Main execution
if (require.main === module) {
  convertAllIcons()
    .then(generateConversionReport)
    .catch((error) => {
      console.error('\n❌ Fatal error during conversion:', error);
      process.exit(1);
    });
}

module.exports = {
  convertSvgToPng,
  convertAllIcons,
};
