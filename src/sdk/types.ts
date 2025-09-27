export type SpiderFieldType = "string" | "string[]" | "url" | "number" | "object[]"

export interface SpiderField {
  name: string
  type: SpiderFieldType
}

export interface SelectorConfig {
  selector?: string | null
  attribute?: string | null
  text?: boolean
  multiple?: boolean
  arranger?: "newestFirst" | "oldestFirst"
  parseScriptJson?: boolean
  jsonPath?: string
}

export interface ProfileTargetConfig {
  Url?: SelectorConfig
  Image?: SelectorConfig
  Name?: SelectorConfig
  Description?: SelectorConfig
  Genres?: SelectorConfig
  MangaID?: SelectorConfig
  Chapters?: SelectorConfig
  PageImage?: any
}

export interface ProfileByIdConfig {
  urlPattern: string
  replace?: { pattern: string; with: string }
  ProfileTarget: ProfileTargetConfig
}

export interface SpiderItemConfig {
  selector?: string | null
  ProfileLink?: SelectorConfig
  ProfileTarget?: ProfileTargetConfig
  Name?: SelectorConfig
  HighlightText?: SelectorConfig
  Genres?: SelectorConfig
  profileById?: ProfileByIdConfig
}

export interface SpiderConfig {
  id: string
  name?: string
  description?: string
  types: { fields: SpiderField[] }
  targetUrl?: string
  itemConfig?: SpiderItemConfig
}

export interface SpiderJSON {
  spider: SpiderConfig
  token: string
}

export interface ManifestCrawler {
  id: string
  name: string
  link: string
}

export interface ISpiderBuilder {
  name(name: string): this
  description(desc: string): this
  field(name: string, type: SpiderFieldType): this
  targetUrl(url: string): this
  itemConfig(cb: (cfg: IItemConfigBuilder) => void): this
  build(): SpiderJSON
  save(): string
}

export interface IItemConfigBuilder {
  selector(sel: string): this
  profileLink(cfg: SelectorConfig): this
  profileTarget(cb: (target: IProfileTargetBuilder) => void): this
  Name(cfg: SelectorConfig): this
  HighlightText(cfg: SelectorConfig): this
  Genres(cfg: SelectorConfig): this
  profileById(cfg: ProfileByIdConfig): this
  build(): SpiderItemConfig
}

export interface IProfileTargetBuilder {
  Url(cfg: SelectorConfig): this
  Image(cfg: SelectorConfig): this
  Name(cfg: SelectorConfig): this
  Description(cfg: SelectorConfig): this
  Genres(cfg: SelectorConfig): this
  MangaID(cfg: SelectorConfig): this
  Chapters(cfg: SelectorConfig): this
  PageImage(cfg: any): this
  build(): ProfileTargetConfig
}

export type ItemConfigBuilder = IItemConfigBuilder
export type ProfileTargetBuilder = IProfileTargetBuilder
export type SpiderBuilder = ISpiderBuilder
