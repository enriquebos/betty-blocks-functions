import { promises as fs } from "fs";
import path from "path";

async function replaceLiquidJsFile() {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const srcFile = path.join(__dirname, "src", "utils", "liquidjs", "liquid.min.js");
  const destFile = path.join(__dirname, "functions", "utils", "liquidjs", "liquid.min.js");

  console.log(`Copying liquid.min.js from ${srcFile} to ${destFile}`);

  try {
    await fs.copyFile(srcFile, destFile);
  } catch (error) {
    console.error(`Error copying liquid.min.js: ${error.message}`);
  }
}

await replaceLiquidJsFile();
