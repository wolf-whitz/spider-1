import * as fs from "fs"
import * as path from "path"
import { validateSpiderJson } from "./validation.ts"
import type { SpiderJSON, SpiderConfig, ManifestCrawler } from "./types.ts"

const GITHUB_BASE_URL = "https://github.com/wolf-whitz/spider-1/raw/main/spider_builds"

const FIXED_TOKEN = "2f3e5b8f3c4a1e6d9b7c2f3a1e4b6d7c9f0a1b2c3d4e5f6789abcdef012345678"

export function buildSpiderJson(config: SpiderConfig): SpiderJSON {
  const spiderJson = Object.freeze({ spider: Object.freeze(config), token: FIXED_TOKEN })
  validateSpiderJson(spiderJson)
  return spiderJson
}

export function saveSpiderJson(spiderJson: SpiderJSON, outputFolder: string): string {
  if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder, { recursive: true })
  const filePath = path.join(outputFolder, `${spiderJson.spider.id}.json`)
  fs.writeFileSync(filePath, JSON.stringify(spiderJson, null, 2), "utf-8")
  updateManifest(spiderJson)
  return filePath
}

function updateManifest(spiderJson: SpiderJSON) {
  const manifestPath = path.join(__dirname, "../../spider_builds/manifest.json")
  let manifest: { crawlers: ManifestCrawler[] } = { crawlers: [] }

  if (fs.existsSync(manifestPath)) {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"))
  }

  const link = `${GITHUB_BASE_URL}/${spiderJson.spider.id}.json`
  const exists = manifest.crawlers.find(c => c.id === spiderJson.spider.id)

  if (!exists) {
    manifest.crawlers.push(Object.freeze({ id: spiderJson.spider.id, name: spiderJson.spider.name || spiderJson.spider.id, link }))
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8")
}

export function generateToken(): string {
  return FIXED_TOKEN
}
