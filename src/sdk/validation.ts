import jp from "jsonpath"
import type { SpiderJSON, SpiderConfig, SpiderItemConfig, SelectorConfig, SpiderField, ProfileTargetConfig } from "./types.ts"

export function validateSpiderJson(spiderJson: SpiderJSON): void {
  if (!spiderJson) throw new Error("Spider JSON is missing")
  if (!spiderJson.spider) throw new Error("Missing spider config")
  validateSpiderConfig(spiderJson.spider)
  if (!spiderJson.token || typeof spiderJson.token !== "string") {
    throw new Error("Invalid or missing token")
  }
}

function validateSpiderConfig(config: SpiderConfig) {
  if (!config.id || typeof config.id !== "string") throw new Error("Spider must have a valid id")
  if (!config.types || !Array.isArray(config.types.fields)) throw new Error("Spider types.fields must be an array")
  config.types.fields.forEach(validateField)
  if (config.itemConfig) validateItemConfig(config.itemConfig)
}

function validateField(field: SpiderField) {
  if (!field.name || typeof field.name !== "string") throw new Error("Field must have a name")
  if (!["string", "string[]", "url", "number", "object[]"].includes(field.type)) throw new Error(`Invalid field type: ${field.type}`)
}

function validateItemConfig(itemConfig: SpiderItemConfig) {
  if (itemConfig.ProfileTarget) validateProfileTarget(itemConfig.ProfileTarget)
  if (itemConfig.profileById) {
    const profileById = itemConfig.profileById
    if (!profileById.urlPattern || typeof profileById.urlPattern !== "string") throw new Error("profileById must have a urlPattern")
    validateProfileTarget(profileById.ProfileTarget)
  }
}

function validateProfileTarget(target: ProfileTargetConfig) {
  const keys: (keyof ProfileTargetConfig)[] = ["Url", "Image", "Name", "Description", "Genres", "MangaID", "Chapters", "PageImage"]

  keys.forEach(key => {
    const val = target[key]
    if (val !== undefined && key !== "PageImage") {
      if (typeof val !== "object") throw new Error(`ProfileTarget ${key} must be an object`)
      if ("jsonPath" in val && val.jsonPath) {
        try {
          jp.parse(val.jsonPath) 
        } catch (err) {
          throw new Error(`Invalid jsonPath in ProfileTarget.${key}: ${val.jsonPath}`)
        }
      }
    }
  })
}
