import { buildSpiderJson, saveSpiderJson, generateToken } from "./methods.ts"
import type {
  SpiderJSON,
  SpiderConfig,
  SpiderItemConfig,
  ProfileTargetConfig,
  SelectorConfig,
  ProfileByIdConfig,
  SpiderFieldType,
  IItemConfigBuilder,
  IProfileTargetBuilder,
} from "./types"
import * as fs from "fs"
import * as path from "path"

export class SpiderBuilder {
  private config: SpiderConfig
  private token: string
  private outputFolder: string

  constructor(id: string, outputFolder = "./spider_builds") {
    this.config = { id, types: { fields: [] } }
    this.token = generateToken()
    this.outputFolder = path.resolve(outputFolder)
    if (!fs.existsSync(this.outputFolder)) fs.mkdirSync(this.outputFolder, { recursive: true })
  }

  name(name: string) { this.config.name = name; return this }
  description(desc: string) { this.config.description = desc; return this }
  field(name: string, type: SpiderFieldType) { this.config.types.fields.push({ name, type }); return this }
  targetUrl(url: string) { this.config.targetUrl = url; return this }

  itemConfig(cb: (cfg: ItemConfigBuilder) => void) {
    const builder = new ItemConfigBuilder()
    cb(builder)
    this.config.itemConfig = builder.build()
    return this
  }

  build(): SpiderJSON {
    return buildSpiderJson(this.config)
  }

  save(): string {
    const spiderJson = this.build()
    return saveSpiderJson(spiderJson, this.outputFolder)
  }
}

export class ItemConfigBuilder implements IItemConfigBuilder {
  private config: SpiderItemConfig = {}

  selector(sel: string) { this.config.selector = sel; return this }
  profileLink(cfg: SelectorConfig) { this.config.ProfileLink = cfg; return this }
  profileTarget(cb: (target: ProfileTargetBuilder) => void) {
    const builder = new ProfileTargetBuilder()
    cb(builder)
    this.config.ProfileTarget = builder.build()
    return this
  }
  Name(cfg: SelectorConfig) { this.config.Name = cfg; return this }
  HighlightText(cfg: SelectorConfig) { this.config.HighlightText = cfg; return this }
  Genres(cfg: SelectorConfig) { this.config.Genres = cfg; return this }
  profileById(cfg: ProfileByIdConfig) { this.config.profileById = cfg; return this }
  fetch(fetch?: boolean) {
    if (!this.config.profileById) this.config.profileById = { urlPattern: "", ProfileTarget: {} }
    this.config.profileById.fetch = fetch
    return this
  }
  build() { return this.config }
}

export class ProfileTargetBuilder implements IProfileTargetBuilder {
  private config: ProfileTargetConfig = {}

  Url(cfg: SelectorConfig) { this.config.Url = cfg; return this }
  Image(cfg: SelectorConfig) { this.config.Image = cfg; return this }
  Name(cfg: SelectorConfig) { this.config.Name = cfg; return this }
  Description(cfg: SelectorConfig) { this.config.Description = cfg; return this }
  Genres(cfg: SelectorConfig) { this.config.Genres = cfg; return this }
  MangaID(cfg: SelectorConfig) { this.config.MangaID = cfg; return this }
  Chapters(cfg: SelectorConfig) { this.config.Chapters = cfg; return this }
  PageImage(cfg: any) { this.config.PageImage = cfg; return this }
  fetch(fetch?: boolean) { this.config.fetch = fetch; return this }
  build() { return this.config }
}

export function createSpider(id: string, outputFolder?: string) {
  return new SpiderBuilder(id, outputFolder)
}
