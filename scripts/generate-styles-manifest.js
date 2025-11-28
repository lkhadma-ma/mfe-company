const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist', 'company', 'browser');
const manifestPath = path.join(distPath, 'styles-manifest.json');

/**
 * Safely read a directory. Returns null if folder does not exist or is locked.
 */
function safeReadDir(directory) {
  try {
    if (!fs.existsSync(directory)) return null;
    return fs.readdirSync(directory);
  } catch (err) {
    return null; // folder is locked or not ready yet
  }
}

/**
 * Returns the name of the first styles file in the directory, or null if none exists.
 */
function findStylesFile(directory) {
  const files = safeReadDir(directory);
  if (!files) return null;
  return files.find(file => file.startsWith('styles') && file.endsWith('.css'));
}

/**
 * Generates styles-manifest.json in dist.
 */
function generateStylesManifest() {
  const stylesFileName = findStylesFile(distPath);

  if (!stylesFileName) {
    console.log('[Manifest] Styles file not ready yet. Skipping...');
    return;
  }

  const manifestData = { styles: stylesFileName };

  try {
    fs.writeFileSync(manifestPath, JSON.stringify(manifestData, null, 2), 'utf-8');
    console.log(`[Manifest] Successfully generated styles-manifest.json at ${manifestPath}`);
  } catch (err) {
    console.error('[Manifest] Failed to write manifest:', err.message);
  }
}

generateStylesManifest();
