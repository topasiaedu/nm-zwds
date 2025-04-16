const fs = require("fs");
const path = require("path");

// Directory containing SVG files
const iconsDir = __dirname;

// Get all SVG files in the directory
const svgFiles = fs.readdirSync(iconsDir).filter(file => file.endsWith(".svg"));

// Process each SVG file
svgFiles.forEach(file => {
  const filePath = path.join(iconsDir, file);
  let content = fs.readFileSync(filePath, "utf8");
  
  // Step 1: Make SVG sharper by changing shape-rendering
  content = content.replace(
    /shape-rendering:geometricPrecision/g,
    "shape-rendering:crispEdges"
  );
  
  // Step 2: Make the background transparent
  // Fix for background path with opacity
  content = content.replace(
    /<g><path style="opacity:1" fill="#[a-fA-F0-9]+" d="M -0\.5,-0\.5[^<]+<\/g>/g,
    '<g><path style="opacity:0" fill="none" d="M -0.5,-0.5$&'.substring(44)
  );
  
  // Fix for files with the -0.5,-0.5 text outside of tags
  content = content.replace(
    /-0\.5,-0\.5<g><path[^<]+<\/g>/g,
    (match) => {
      // Extract the path content
      const pathStart = match.indexOf('<g>');
      const pathContent = match.substring(pathStart);
      
      // Replace the path's opacity and fill
      return pathContent.replace(
        /style="opacity:1" fill="#[a-fA-F0-9]+"/,
        'style="opacity:0" fill="none"'
      );
    }
  );
  
  // Step 3: Change all red colors to black
  // Common red color values found in the SVGs
  const redColors = [
    "#b4272b", "#b11519", "#b3292b", "#b84042", "#d78e95", 
    "#b94345", "#b74241", "#bd3c3e", "#d87679", "#c95e61", 
    "#b2161a", "#d38384", "#cf6767", "#cc5353", "#af1e1f",
    "#bb383a", "#c34f4d", "#b31b1d", "#c87c7f", "#d27c81",
    "#ce6163", "#ce7172", "#db908e", "#d37a81", "#c97172",
    "#d88688", "#d8828"
  ];
  
  let modifiedContent = content;
  redColors.forEach(color => {
    modifiedContent = modifiedContent.replace(
      new RegExp(`fill="${color}"`, "g"),
      'fill="#000000"'
    );
  });
  
  // Write the updated content back to the file
  fs.writeFileSync(filePath, modifiedContent);
  console.log(`Updated ${file}`);
});

console.log("All SVG files have been updated."); 