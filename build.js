const fs = require("fs");
const path = require("path");

// Ensure the build directory exists
const buildDir = path.join(__dirname, "build");
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Copy the calc directory
const calcDir = path.join(__dirname, "public", "calc");
const buildCalcDir = path.join(buildDir, "calc");

// Create build/calc directory if it doesn't exist
if (!fs.existsSync(buildCalcDir)) {
  fs.mkdirSync(buildCalcDir, { recursive: true });
}

// Copy all files and subdirectories from public/calc to build/calc
function copyDir(src, dest) {
  fs.cpSync(src, dest, { recursive: true });
}

copyDir(calcDir, buildCalcDir);

console.log("Successfully copied calc directory to build folder"); 