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

async function copyCryptoMinFiles() {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const srcDir = path.join(__dirname, "src", "utils", "crypto");
  const destDir = path.join(__dirname, "functions", "utils", "crypto");

  try {
    await fs.mkdir(destDir, { recursive: true });

    const files = await fs.readdir(srcDir);
    const minFiles = files.filter((file) => file.endsWith(".min.js"));

    await Promise.all(
      minFiles.map(async (file) => {
        const srcFile = path.join(srcDir, file);
        const destFile = path.join(destDir, file);
        console.log(`Copying ${file} from ${srcFile} to ${destFile}`);
        await fs.copyFile(srcFile, destFile);
      })
    );
  } catch (error) {
    console.error(`Error copying crypto min.js files: ${error.message}`);
  }
}

await replaceLiquidJsFile();
await copyCryptoMinFiles();
