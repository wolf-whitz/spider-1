import jp from "jsonpath";
import type {
  SpiderJSON,
  SpiderConfig,
  SpiderItemConfig,
  SelectorConfig,
  SpiderField,
  ProfileTargetConfig
} from "./types.ts";

export function validateSpiderJson(spiderJson: SpiderJSON): void {
  if (!spiderJson) throw new Error("Spider JSON is missing");
  if (!spiderJson.spider) throw new Error("Missing spider config");

  const errors: string[] = [];

  validateSpiderConfig(spiderJson.spider, errors, "spider");

  if (!spiderJson.token || typeof spiderJson.token !== "string")
    errors.push("spider.token must be a non-empty string");

  if (errors.length) throw new Error("Spider JSON validation errors:\n" + errors.join("\n"));
}

function validateSpiderConfig(config: SpiderConfig, errors: string[], path: string) {
  if (!config.id || typeof config.id !== "string")
    errors.push(`${path}.id must be a non-empty string`);

  if (!config.types || !Array.isArray(config.types.fields))
    errors.push(`${path}.types.fields must be an array`);
  else config.types.fields.forEach((field, i) => validateField(field, errors, `${path}.types.fields[${i}]`));

  if (config.itemConfig) validateItemConfig(config.itemConfig, errors, `${path}.itemConfig`);
}

function validateField(field: SpiderField, errors: string[], path: string) {
  if (!field.name || typeof field.name !== "string")
    errors.push(`${path}.name must be a non-empty string`);
  if (!["string", "string[]", "url", "number", "object[]"].includes(field.type))
    errors.push(`${path}.type '${field.type}' is invalid`);
}

function validateItemConfig(itemConfig: SpiderItemConfig, errors: string[], path: string) {
  if (itemConfig.selector && typeof itemConfig.selector !== "string")
    errors.push(`${path}.selector must be a string`);

  if (itemConfig.ProfileTarget) validateProfileTarget(itemConfig.ProfileTarget, errors, `${path}.ProfileTarget`);

  if (itemConfig.profileById) {
    const byId = itemConfig.profileById;
    if (!byId.urlPattern || typeof byId.urlPattern !== "string")
      errors.push(`${path}.profileById.urlPattern must be a non-empty string`);
    validateProfileTarget(byId.ProfileTarget, errors, `${path}.profileById.ProfileTarget`);
  }

  if (itemConfig.ProfileLink && typeof itemConfig.ProfileLink.selector !== "string")
    errors.push(`${path}.ProfileLink.selector must be a string`);
}

function validateProfileTarget(target: ProfileTargetConfig, errors: string[], path: string) {
  const keys: (keyof ProfileTargetConfig)[] =
    ["Url", "Image", "Name", "Description", "Genres", "MangaID", "Chapters", "PageImage"];

  keys.forEach(key => {
    const val = target[key];
    const valPath = `${path}.${key}`;
    if (!val) return;

    if (key !== "PageImage" && typeof val !== "object")
      errors.push(`${valPath} must be an object`);

    if (val && typeof val === "object") {
      const selCfg = val as SelectorConfig;
      if (!selCfg.selector && !selCfg.jsonPath && selCfg.fetch)
        errors.push(`${valPath} requires a selector or jsonPath if fetch=true`);

      if (selCfg.jsonPath) {
        try {
          jp.parse(selCfg.jsonPath);
        } catch {
          errors.push(`${valPath}.jsonPath '${selCfg.jsonPath}' is invalid`);
        }
      }

      if (selCfg.selector && typeof selCfg.selector !== "string")
        errors.push(`${valPath}.selector must be a string`);
    }
  });
}
