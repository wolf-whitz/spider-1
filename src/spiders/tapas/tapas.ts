import { createSpider, ItemConfigBuilder } from "@sdk";

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
    item.selector(
      "div.body div.global-page section.page-section ul.content-list-wrap li.search-item-wrap"
    );

    item.Name({ selector: "p.title a strong", text: true });
    item.Genres({ selector: "p.tag a", multiple: true });
    item.profileLink({ selector: "p.title a", attribute: "href" });

    item.profileById({
      urlPattern: "https://tapas.io/series/{manga_id}/info",
      fetch: true,
      ProfileTarget: {
        MangaID: {
          selector: "script",
          parseScriptJson: true,
          jsonPath: "$.series.id",
          fetch: true,
        },
        Name: {
          selector: "script",
          parseScriptJson: true,
          jsonPath: "$.series.title",
          fetch: true,
        },
        Image: {
          selector: "script",
          parseScriptJson: true,
          jsonPath: "$.series.thumbnail",
          fetch: true,
        },
        Description: {
          selector: "script",
          parseScriptJson: true,
          jsonPath: "$.series.description",
          fetch: true,
        },
        Genres: {
          selector: "script",
          parseScriptJson: true,
          jsonPath: "$.series.genres[*]",
          multiple: true,
          fetch: true,
        },
        Chapters: {
          selector: "https://tapas.io/series/{manga_id}/episodes?page=1",
          parseScriptJson: true,
          jsonPath: "$.data.episodes[*]",
          multiple: true,
          arranger: "newestFirst",
          fetch: true,
        },
        PageImage: {
          arrayVar: {
            variableNames: ["thumb_url"],
            matchPattern: "https://",
            scriptMatch: "thumb_url",
          },
          fetch: true,
        },
      },
    });
  });

spider.save();
