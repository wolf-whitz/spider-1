import * as fs from "fs"
import * as path from "path"
import { randomBytes } from "crypto"
import { validateSpiderJson } from "./validation.ts"
import type { SpiderJSON, SpiderConfig, ManifestCrawler } from "./types.ts"

const GITHUB_BASE_URL = "https://github.com/wolf-whitz/spider-1/raw/main/spider_builds"

export function buildSpiderJson(config: SpiderConfig, token: string): SpiderJSON {
  const spiderJson = { spider: config, token }
  validateSpiderJson(spiderJson)
  return spiderJson
}

export function saveSpiderJson(spiderJson: SpiderJSON, outputFolder: string): string {
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
    manifest.crawlers.push({ id: spiderJson.spider.id, name: spiderJson.spider.name || spiderJson.spider.id, link })
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8")
}

export function generateToken(): string {
  return randomBytes(16).toString("hex")
}
