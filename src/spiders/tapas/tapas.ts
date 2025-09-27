import { createSpider, ItemConfigBuilder } from "@sdk"

const spider = createSpider("tapas_full")
  .name("Tapas Full Search & Episodes")
  .description("Scrapes Tapas search results, series metadata, and episodes with page images")
  .field("manga_id", "string")
  .field("manga_name", "string")
  .field("manga_image", "url")
  .field("manga_description", "string")
  .field("genres", "string[]")
  .field("episodes", "object[]")
  .field("page_num", "number")
  .field("page_image", "url")
  .targetUrl("https://tapas.io/search?q={query}")
  .itemConfig((item: ItemConfigBuilder) => {
    item.selector("div.series-list div.series-item")
    item.Name({ selector: "p.title a strong", text: true })
    item.Genres({ selector: "p.tag a", multiple: true })
    item.profileLink({ selector: "p.title a", attribute: "href" })

    item.profileById({
      urlPattern: "https://tapas.io/series/{manga_id}/info",
      ProfileTarget: {
        Url: { selector: "script", parseScriptJson: true, jsonPath: "$.series.slug" },
        Image: { selector: "script", parseScriptJson: true, jsonPath: "$.series.thumbnail" },
        Name: { selector: "script", parseScriptJson: true, jsonPath: "$.series.title" },
        Description: { selector: "script", parseScriptJson: true, jsonPath: "$.series.description" },
        Genres: { selector: "script", parseScriptJson: true, jsonPath: "$.series.genres[*]", multiple: true },
        MangaID: { selector: "script", parseScriptJson: true, jsonPath: "$.series.id" },
        Chapters: {
          selector: `https://tapas.io/series/{manga_id}/episodes?page=1`,
          parseScriptJson: true,
          jsonPath: "$.data.episodes[*]",
          multiple: true,
          arranger: "newestFirst"
        },
        PageImage: {
          arrayVar: {
            variableNames: ["thumb_url"], 
            matchPattern: "https://", 
            scriptMatch: "thumb_url"
          }
        }
      }
    })
  })

spider.save()
