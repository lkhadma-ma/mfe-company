const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist', 'company', 'browser');
const manifestPath = path.join(distPath, 'styles-manifest.json');

function safeReadDir(directory) {
  try {
    if (!fs.existsSync(directory)) return null;
    return fs.readdirSync(directory);
  } catch (err) {
    return null;
  }
}

function findStylesFile(directory) {
  const files = safeReadDir(directory);
  if (!files) return null;
  return files.find(file => file.startsWith('styles') && file.endsWith('.css'));
}

/**
 * Tries to generate the manifest, waiting if CSS is not yet ready.
 */
function generateStylesManifest(retries = 10, delay = 300) {
  const stylesFileName = findStylesFile(distPath);

  if (!stylesFileName) {
    if (retries > 0) {
      setTimeout(() => generateStylesManifest(retries - 1, delay), delay);
    } else {
      console.warn('[Manifest] Styles file not found after waiting. Skipping...');
    }
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

// Ejecuta la generación
generateStylesManifest();
