const esbuild = require("esbuild");
const JavaScriptObfuscator = require("javascript-obfuscator");
const fs = require("fs");

// Build with esbuild
esbuild
  .build({
    entryPoints: ["./dist/index.js"], // Input JS (after TypeScript compilation)
    outfile: "dist/bundle.js", // Output bundled file
    bundle: true,
    platform: "node",
    minify: true,
    sourcemap: false,
    format: "cjs",
    target: "es2016",
  })
  .then(() => {
    console.log("📦 Build: Bundling Completed!");

    // Read the bundled file
    const bundleCode = fs.readFileSync("dist/bundle.js", "utf8");

    // Obfuscate the JavaScript code
    const obfuscatedCode = JavaScriptObfuscator.obfuscate(bundleCode, {
      compact: true,
      controlFlowFlattening: true,
      stringArrayEncoding: ["rc4"], // Encode strings
      stringArrayThreshold: 0.75,
    }).getObfuscatedCode();

    // Write the obfuscated code back to bundle.js
    fs.writeFileSync("dist/bundle.js", obfuscatedCode);
    console.log("🔐 Build: JavaScript Obfuscation Completed!");
    console.log("✅ Build: Build Successful!");
  })
  .catch(() => process.exit(1));
