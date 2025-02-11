import { minify } from "minify";
import { glob } from "glob";
import { promises as fs } from "fs";
import path from "path";

async function replaceFileContent(filePath, newContent) {
  try {
    await fs.writeFile(filePath, newContent, "utf8");
  } catch (error) {
    console.error(`Error writing to file: ${error.message}`);
  }
}

async function getFileContent(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return data;
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    throw error;
  }
}

async function replaceLiquidJsFile() {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const srcFile = path.join(__dirname, "src", "utils", "liquid.min.js");
  const destFile = path.join(__dirname, "functions", "utils", "liquid.min.js");

  try {
    await fs.copyFile(srcFile, destFile);
  } catch (error) {
    console.error(`Error copying liquid.min.js: ${error.message}`);
  }
}

const jsFiles = await glob("./functions/**/*.js");
const jsonFiles = await glob("./functions/**/*.json");

await replaceLiquidJsFile();

for (const path of jsFiles) {
  const minifiedJs = await minify(path);
  await replaceFileContent(path, minifiedJs);
}

for (const path of jsonFiles) {
  const fileContent = await getFileContent(path);
  const minifiedJson = JSON.stringify(JSON.parse(fileContent));
  await replaceFileContent(path, minifiedJson);
}
