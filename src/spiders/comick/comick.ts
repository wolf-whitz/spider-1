import { createSpider, ItemConfigBuilder, ProfileTargetBuilder } from "@sdk"

const spider = createSpider("comick_full")
  .name("Comick Full")
  .description("Scrapes search results and profile metadata from comick.live")
  .field("manga_id", "string")
  .field("manga_name", "string")
  .field("manga_image", "url")
  .field("manga_description", "string")
  .field("genres", "string[]")
  .field("manga_chapters", "object[]")
  .field("page_num", "number")
  .targetUrl("https://comick.live/search?q={query}")
  .itemConfig((item: ItemConfigBuilder) => {
    item.selector("script#sv-data")
      .profileTarget((target: ProfileTargetBuilder) => {
        target
          .Url({ selector: "script#sv-data", parseScriptJson: true, jsonPath: "$.data[0].slug" })
          .Image({ selector: "script#sv-data", parseScriptJson: true, jsonPath: "$.data[0].default_thumbnail" })
          .Name({ selector: "script#sv-data", parseScriptJson: true, jsonPath: "$.data[0].title" })
          .Description({ selector: "script#sv-data", parseScriptJson: true, jsonPath: "$.data[0].description" })
          .Genres({ selector: "script#sv-data", parseScriptJson: true, jsonPath: "$.data[0].genres[*].name", multiple: true })
          .MangaID({ selector: "script#sv-data", parseScriptJson: true, jsonPath: "$.data[0].id" })
          .Chapters({ selector: "script#sv-data", parseScriptJson: true, jsonPath: "$.data[0].last_chapter" })
      })
      .profileById({
        urlPattern: "https://comick.live/comic/{manga_id}",
        ProfileTarget: {
          Url: { selector: "script#comic-data", parseScriptJson: true, jsonPath: "$.comic.slug" },
          Image: { selector: "script#comic-data", parseScriptJson: true, jsonPath: "$.comic.thumbnail" },
          Name: { selector: "script#comic-data", parseScriptJson: true, jsonPath: "$.comic.title" },
          Description: { selector: "script#comic-data", parseScriptJson: true, jsonPath: "$.comic.desc" },
          Genres: { selector: "script#comic-data", parseScriptJson: true, jsonPath: "$.comic.genres[*].name", multiple: true },
          MangaID: { selector: "script#comic-data", parseScriptJson: true, jsonPath: "$.comic.id" },
          Chapters: { selector: "script#comic-data", parseScriptJson: true, jsonPath: "$.chapters", multiple: true }
        }
      })
  })

spider.save()
