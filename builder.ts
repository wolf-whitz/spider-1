import { readdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath, pathToFileURL } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const spidersDir = join(__dirname, "src", "spiders") // updated path

function findSpiders(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true })
  let files: string[] = []

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...findSpiders(fullPath))
    } else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".d.ts")) {
      files.push(fullPath)
    }
  }

  return files
}

async function runAll() {
  const spiders = findSpiders(spidersDir)
  for (const spiderFile of spiders) {
    // convert path to file:// URL for ESM import
    const spiderUrl = pathToFileURL(spiderFile).href
    await import(spiderUrl) // spider.save() should be called inside the spider file
  }
}

runAll()
