const { spawn } = require("child_process");
const path = require("path");

const DIST_PATH = path.join(__dirname, "..", "dist", "company", "browser");
const MANIFEST_SCRIPT = path.join(__dirname, "generate-styles-manifest.js");

// -----------------------------
// 1) Run Angular build --watch
// -----------------------------
console.log("Starting Angular build...");

const ng = spawn("ng", ["build", "company", "--watch"], {
  shell: true
});

// Detect each time Angular finishes recompiling
ng.stdout.on("data", (data) => {
  const text = data.toString();

  if (text.includes("Application bundle generation complete") ||
      text.includes("Browser application bundle generation complete")) {

    console.log("[Build] Completed. Running generate-styles-manifest.js...");

    // Ejecuta el script de generación de manifest
    const gen = spawn("node", [MANIFEST_SCRIPT], { shell: true, stdio: "inherit" });
    gen.on("close", (code) => {
      console.log(`[Manifest] Script finished with code ${code}`);
    });
  }

  process.stdout.write(text);
});

ng.stderr.on("data", data => process.stderr.write(data));

// -----------------------------
// 2) Start server with `serve`
// -----------------------------
console.log(`Starting server at http://localhost:4207...`);

const server = spawn("npx", ["serve", DIST_PATH, "-l", "4207"], {
  shell: true,
  stdio: "inherit"
});

server.on("close", (code) => {
  console.log(`[Server] stopped with code ${code}`);
});
