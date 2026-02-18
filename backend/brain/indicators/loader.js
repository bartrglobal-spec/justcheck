import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * loadIndicators
 * --------------
 * Loads indicator modules dynamically.
 * Free tier excludes premium indicators.
 */
export async function loadIndicators({ includePremium = false } = {}) {
  const indicators = [];

  const baseDir = path.join(__dirname, "v1");

  if (!fs.existsSync(baseDir)) return indicators;

  const files = fs
    .readdirSync(baseDir)
    .filter(f => f.endsWith(".js") && !f.startsWith("_"));

  for (const file of files) {
    try {
      const fileUrl = pathToFileURL(path.join(baseDir, file)).href;
      const mod = await import(fileUrl);
      const indicator = mod.default || mod;

      if (!indicator || typeof indicator.run !== "function") continue;
      if (indicator.premium && !includePremium) continue;

      indicators.push(indicator);
    } catch {
      // Indicator load failure must never break the brain
    }
  }

  return indicators;
}
