/**
 * Icon Fetcher Script
 *
 * Downloads SVG icons from Simple Icons CDN for the configured technology list.
 * Features:
 * - Retry logic with exponential backoff (3 attempts maximum)
 * - Error logging to logs/icon-fetch.log
 * - Progress reporting with console output
 * - Graceful error handling to continue on individual failures
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { technologies } = require('./config/technologies');

// Configuration
const SIMPLE_ICONS_CDN = 'cdn.simpleicons.org';
const OUTPUT_DIR = path.join(__dirname, '../assets/icons/svg');
const LOG_DIR = path.join(__dirname, '../logs');
const LOG_FILE = path.join(LOG_DIR, 'icon-fetch.log');
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

// Ensure directories exist
function ensureDirectories() {
  [OUTPUT_DIR, LOG_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Log to file
function logToFile(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(LOG_FILE, logMessage);
}

// Sleep utility for retry delays
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch a single icon from Simple Icons CDN
 * @param {string} name - Technology name (Simple Icons slug)
 * @param {number} attempt - Current attempt number (1-based)
 * @returns {Promise<string>} - Resolves with icon name on success
 */
async function fetchIcon(name, attempt = 1) {
  const url = `https://${SIMPLE_ICONS_CDN}/${name}`;
  const outputPath = path.join(OUTPUT_DIR, `${name}.svg`);

  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location;
          logToFile(`Redirect for ${name}: ${redirectUrl}`);
          https.get(redirectUrl, handleResponse).on('error', reject);
          return;
        }

        handleResponse(response);
      })
      .on('error', reject);

    function handleResponse(response) {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(outputPath);
        response.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          logToFile(`✓ Successfully fetched: ${name} (attempt ${attempt})`);
          resolve(name);
        });

        fileStream.on('error', (err) => {
          fs.unlink(outputPath, () => {}); // Clean up partial file
          reject(err);
        });
      } else {
        reject(
          new Error(
            `HTTP ${response.statusCode}: Failed to fetch ${name} from ${url}`
          )
        );
      }
    }
  });
}

/**
 * Fetch icon with retry logic and exponential backoff
 * @param {string} name - Technology name
 * @returns {Promise<{name: string, success: boolean, error?: string}>}
 */
async function fetchIconWithRetry(name) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await fetchIcon(name, attempt);
      return { name, success: true };
    } catch (error) {
      const errorMessage = error.message || String(error);
      logToFile(
        `✗ Attempt ${attempt}/${MAX_RETRIES} failed for ${name}: ${errorMessage}`
      );

      // If this was the last attempt, return failure
      if (attempt === MAX_RETRIES) {
        return {
          name,
          success: false,
          error: errorMessage,
        };
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1);
      logToFile(`  Retrying ${name} in ${delay}ms...`);
      await sleep(delay);
    }
  }
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
 * Fetch all icons from the technology list
 * @returns {Promise<{successful: string[], failed: Array<{name: string, error: string}>}>}
 */
async function fetchAllIcons() {
  console.log('🚀 Starting icon fetch process...\n');
  console.log(`📦 Total icons to fetch: ${technologies.length}\n`);

  ensureDirectories();

  // Clear log file
  fs.writeFileSync(LOG_FILE, '');
  logToFile('=== Icon Fetch Process Started ===');
  logToFile(`Total icons: ${technologies.length}`);

  const results = [];
  let completed = 0;

  // Process icons with progress reporting
  for (const tech of technologies) {
    displayProgress(completed, technologies.length, `Fetching ${tech.name}...`);
    const result = await fetchIconWithRetry(tech.name);
    results.push(result);
    completed++;
  }

  displayProgress(completed, technologies.length, 'Complete!');

  // Separate successful and failed downloads
  const successful = results.filter((r) => r.success).map((r) => r.name);
  const failed = results
    .filter((r) => !r.success)
    .map((r) => ({ name: r.name, error: r.error }));

  return { successful, failed };
}

/**
 * Generate and display summary report
 * @param {Object} results - Results from fetchAllIcons
 */
function generateSummaryReport(results) {
  const { successful, failed } = results;

  console.log('\n' + '='.repeat(60));
  console.log('📊 FETCH SUMMARY REPORT');
  console.log('='.repeat(60));
  console.log(`✓ Successful: ${successful.length}`);
  console.log(`✗ Failed: ${failed.length}`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  console.log(`📝 Log file: ${LOG_FILE}`);
  console.log('='.repeat(60));

  // Log summary to file
  logToFile('\n=== Fetch Summary ===');
  logToFile(`Successful: ${successful.length}`);
  logToFile(`Failed: ${failed.length}`);

  if (successful.length > 0) {
    console.log('\n✓ Successfully fetched icons:');
    successful.forEach((name) => {
      console.log(`  • ${name}`);
    });
    logToFile('\nSuccessful icons:');
    successful.forEach((name) => logToFile(`  ${name}`));
  }

  if (failed.length > 0) {
    console.log('\n✗ Failed to fetch icons:');
    failed.forEach(({ name, error }) => {
      console.log(`  • ${name}: ${error}`);
    });
    logToFile('\nFailed icons:');
    failed.forEach(({ name, error }) => logToFile(`  ${name}: ${error}`));
  }

  console.log('\n');

  // Exit with error code if any downloads failed
  if (failed.length > 0) {
    console.log(
      '⚠️  Some icons failed to download. Check the log file for details.'
    );
    process.exit(1);
  } else {
    console.log('✅ All icons fetched successfully!');
    process.exit(0);
  }
}

// Main execution
if (require.main === module) {
  fetchAllIcons()
    .then(generateSummaryReport)
    .catch((error) => {
      console.error('\n❌ Fatal error during icon fetch:', error);
      logToFile(`FATAL ERROR: ${error.message || String(error)}`);
      process.exit(1);
    });
}

module.exports = {
  fetchIcon,
  fetchIconWithRetry,
  fetchAllIcons,
};
