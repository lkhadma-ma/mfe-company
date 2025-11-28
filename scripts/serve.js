const { spawn } = require("child_process");
const chokidar = require("chokidar");
const browserSync = require("browser-sync").create();
const path = require("path");
const fs = require("fs");

const DIST_PATH = path.join(__dirname, "..", "dist", "company", "browser");
const MANIFEST_PATH = path.join(DIST_PATH, "styles-manifest.json");

// -----------------------------
// Safe manifest generation
// -----------------------------
function safeReadDir(directory) {
  try {
    if (!fs.existsSync(directory)) return null;
    return fs.readdirSync(directory);
  } catch {
    return null; // folder locked
  }
}

function generateManifest() {
  const files = safeReadDir(DIST_PATH);
  if (!files) return;

  const cssFile = files.find(f => f.startsWith("styles") && f.endsWith(".css"));
  if (!cssFile) return;

  const manifest = { styles: cssFile };

  try {
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf-8");
    console.log("[Manifest] Updated:", manifest);
  } catch (e) {
    console.error("[Manifest] Failed to write manifest:", e.message);
  }
}

// -----------------------------
// Debounce helper
// -----------------------------
function debounce(fn, delay) {
  let timer = null;
  return () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
}

const generateManifestDebounced = debounce(generateManifest, 500);

// -----------------------------
// 1) Run Angular build --watch
// -----------------------------
console.log("Starting Angular build...");
const ng = spawn("ng", ["build", "company", "--watch"], {
  shell: true,
  stdio: "inherit"
});

// -----------------------------
// 2) Watch dist folder for CSS changes
// -----------------------------
console.log("Watching dist folder for style changes...");

const watcher = chokidar.watch(DIST_PATH, {
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 300,
    pollInterval: 100
  }
});

watcher.on("all", (event, filePath) => {
  if (filePath.endsWith(".css") || filePath.endsWith(".css.map")) {
    generateManifestDebounced();
  }
});

// -----------------------------
// 3) Start BrowserSync (static, no reload)
// -----------------------------
console.log("Starting BrowserSync...");
browserSync.init({
  server: DIST_PATH,
  port: 4207,
  notify: false,
  open: false,
  watch: false,
  reload: false
});
