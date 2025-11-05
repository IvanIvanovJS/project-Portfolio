const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const SKILL_ICONS = [
  { name: 'React', slug: 'react' },
  { name: 'TypeScript', slug: 'typescript' },
  { name: 'Node.js', slug: 'nodedotjs' },
  { name: 'Three.js', slug: 'threedotjs' },
  { name: 'CSS3', slug: 'css3' },
];

const OUTPUT_DIR = path.join(__dirname, '../public/icons/skills');
const SIMPLE_ICONS_CDN = 'https://cdn.simpleicons.org';
const LOG_FILE = path.join(__dirname, '../logs/icon-fetch.log');
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

// Ensure directories exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✓ Created directory: ${dirPath}`);
  }
}

// Log to file and console
function log(message, isError = false) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;

  // Ensure logs directory exists
  const logsDir = path.dirname(LOG_FILE);
  ensureDirectoryExists(logsDir);

  // Append to log file
  fs.appendFileSync(LOG_FILE, logMessage);

  // Output to console
  if (isError) {
    console.error(message);
  } else {
    console.log(message);
  }
}

// Download file with retry logic
function downloadFile(url, outputPath, retryCount = 0) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location;
          log(`Redirecting to: ${redirectUrl}`);
          return downloadFile(redirectUrl, outputPath, retryCount)
            .then(resolve)
            .catch(reject);
        }

        // Handle errors
        if (response.statusCode !== 200) {
          const error = `HTTP ${response.statusCode}: ${response.statusMessage}`;

          if (retryCount < MAX_RETRIES) {
            const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
            log(
              `Failed to download ${url}. Retrying in ${delay}ms... (Attempt ${retryCount + 1}/${MAX_RETRIES})`
            );

            setTimeout(() => {
              downloadFile(url, outputPath, retryCount + 1)
                .then(resolve)
                .catch(reject);
            }, delay);
          } else {
            reject(new Error(error));
          }
          return;
        }

        // Write file
        const fileStream = fs.createWriteStream(outputPath);
        response.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });

        fileStream.on('error', (err) => {
          fs.unlink(outputPath, () => {}); // Delete partial file

          if (retryCount < MAX_RETRIES) {
            const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
            log(
              `File write error. Retrying in ${delay}ms... (Attempt ${retryCount + 1}/${MAX_RETRIES})`
            );

            setTimeout(() => {
              downloadFile(url, outputPath, retryCount + 1)
                .then(resolve)
                .catch(reject);
            }, delay);
          } else {
            reject(err);
          }
        });
      })
      .on('error', (err) => {
        if (retryCount < MAX_RETRIES) {
          const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
          log(
            `Network error: ${err.message}. Retrying in ${delay}ms... (Attempt ${retryCount + 1}/${MAX_RETRIES})`
          );

          setTimeout(() => {
            downloadFile(url, outputPath, retryCount + 1)
              .then(resolve)
              .catch(reject);
          }, delay);
        } else {
          reject(err);
        }
      });
  });
}

// Fetch a single icon
async function fetchIcon(icon) {
  const url = `${SIMPLE_ICONS_CDN}/${icon.slug}`;
  const outputPath = path.join(OUTPUT_DIR, `${icon.slug}.svg`);

  try {
    log(`Downloading ${icon.name} icon from ${url}...`);
    await downloadFile(url, outputPath);
    log(`✓ Successfully downloaded ${icon.name} icon to ${outputPath}`);
    return { success: true, icon: icon.name };
  } catch (error) {
    const errorMsg = `✗ Failed to download ${icon.name} icon: ${error.message}`;
    log(errorMsg, true);
    return { success: false, icon: icon.name, error: error.message };
  }
}

// Main execution
async function main() {
  console.log('='.repeat(60));
  console.log('Skill Icons Fetcher');
  console.log('='.repeat(60));

  log('Starting skill icons download...');

  // Ensure output directory exists
  ensureDirectoryExists(OUTPUT_DIR);

  // Track results
  const results = {
    total: SKILL_ICONS.length,
    successful: 0,
    failed: 0,
    errors: [],
  };

  // Download all icons
  for (const icon of SKILL_ICONS) {
    const result = await fetchIcon(icon);

    if (result.success) {
      results.successful++;
    } else {
      results.failed++;
      results.errors.push({ icon: result.icon, error: result.error });
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('Download Summary');
  console.log('='.repeat(60));
  console.log(`Total icons: ${results.total}`);
  console.log(`✓ Successful: ${results.successful}`);
  console.log(`✗ Failed: ${results.failed}`);

  if (results.errors.length > 0) {
    console.log('\nFailed downloads:');
    results.errors.forEach(({ icon, error }) => {
      console.log(`  - ${icon}: ${error}`);
    });
  }

  log(
    `\nDownload complete. ${results.successful}/${results.total} icons downloaded successfully.`
  );

  if (results.failed > 0) {
    log(
      `Warning: ${results.failed} icon(s) failed to download. Check log for details.`,
      true
    );
    process.exit(1);
  }

  console.log('\n✓ All icons downloaded successfully!');
  console.log(`Output directory: ${OUTPUT_DIR}`);
  console.log(`Log file: ${LOG_FILE}`);
}

// Run the script
main().catch((error) => {
  log(`Fatal error: ${error.message}`, true);
  console.error('\n✗ Script failed:', error.message);
  process.exit(1);
});
