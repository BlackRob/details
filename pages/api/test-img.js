import satori from "satori";
import sharp from "sharp";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  const results = {};
  
  // Test 1: Check current working directory
  results.cwd = process.cwd();
  
  // Test 2: Check font file
  const fontPath = path.join(process.cwd(), "public/Roboto-Regular.ttf");
  results.fontPath = fontPath;
  results.fontExists = fs.existsSync(fontPath);
  
  // Test 3: Try to read font
  try {
    if (results.fontExists) {
      const fontData = fs.readFileSync(fontPath);
      results.fontSize = fontData.length;
    }
  } catch (err) {
    results.fontError = err.message;
  }
  
  // Test 4: Try simple satori render
  try {
    const svg = await satori(
      <div style={{ color: "white", fontSize: 24 }}>Test</div>,
      { width: 100, height: 100 }
    );
    results.satoriWorks = true;
    results.svgLength = svg.length;
  } catch (err) {
    results.satoriWorks = false;
    results.satoriError = err.message;
  }
  
  // Test 5: Try sharp conversion
  try {
    const svg = await satori(
      <div style={{ color: "white", fontSize: 24 }}>Test</div>,
      { width: 100, height: 100 }
    );
    const png = await sharp(Buffer.from(svg)).png().toBuffer();
    results.sharpWorks = true;
    results.pngSize = png.length;
  } catch (err) {
    results.sharpWorks = false;
    results.sharpError = err.message;
  }
  
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(results, null, 2));
}
