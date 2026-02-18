import fs from "fs";
import path from "path";

export default (req, res) => {
  const results = {};
  
  results.cwd = process.cwd();
  results.env = {
    NEXT_RUNTIME: process.env.NEXT_RUNTIME,
    VERCEL: process.env.VERCEL,
  };
  
  const locations = [
    process.cwd(),
    path.join(process.cwd(), "public"),
    path.join(process.cwd(), ".next"),
    path.join(process.cwd(), ".next/server"),
    path.join(process.cwd(), "node_modules"),
    "/tmp",
  ];
  
  results.directories = {};
  locations.forEach(loc => {
    try {
      if (fs.existsSync(loc)) {
        results.directories[loc] = fs.readdirSync(loc).slice(0, 20);
      } else {
        results.directories[loc] = "NOT FOUND";
      }
    } catch (err) {
      results.directories[loc] = `ERROR: ${err.message}`;
    }
  });
  
  const fontPaths = [
    path.join(process.cwd(), "public/Roboto-Regular.ttf"),
    path.join(process.cwd(), "Roboto-Regular.ttf"),
    "/tmp/Roboto-Regular.ttf",
  ];
  
  results.fontCheck = {};
  fontPaths.forEach(p => {
    results.fontCheck[p] = fs.existsSync(p);
  });
  
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(results, null, 2));
};
