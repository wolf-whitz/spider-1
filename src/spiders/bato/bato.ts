import { createSpider } from "@sdk";

const spider = createSpider("mto_search_full")
  .name("MTO Search Full")
  .description("Scrapes search results with full metadata from mto.to and fetches chapter pages")
  .field("manga_id", "string")
  .field("manga_name", "string")
  .field("manga_image", "url")
  .field("manga_description", "string")
  .field("genres", "string[]")
  .field("manga_chapters", "object[]")
  .field("page_num", "number")
  .field("page_image", "url")
  .targetUrl("https://mto.to/search?word={query}")
  .itemConfig(item => {
    item.selector("#series-list .col.item.line-b, #series-list .col.item.line-b.no-flag");
    item.profileLink({ selector: "a.item-cover, a.item-title", attribute: "href" });
    item.profileTarget(pt => {
      pt.Url({ selector: "a.item-cover, a.item-title", attribute: "href" });
      pt.Image({ selector: "a.item-cover img", attribute: "src" });
      pt.Name({ selector: "a.item-title" });
      pt.Genres({ selector: ".item-genre span, .item-genre u, .item-genre b", multiple: true });
      pt.MangaID({ selector: "a.item-cover, a.item-title", attribute: "href" });
      pt.Chapters({ selector: ".item-volch a.visited", attribute: "href", text: true, multiple: true, arranger: "newestFirst" });
    });
    item.Name({ selector: "a.item-title" });
    item.HighlightText({ selector: ".highlight-text" });
    item.Genres({ selector: ".item-genre span, .item-genre u, .item-genre b", multiple: true });
    item.profileById({
      urlPattern: "https://mto.to{manga_id}/",
      replace: { pattern: "^/series/", with: "/series/" },
      fetch: true, // <-- fetch full profile page
      ProfileTarget: {
        Url: { selector: "body", attribute: "data-url" },
        Image: { selector: ".attr-cover img", attribute: "src" },
        Name: { selector: ".mt-4.d-flex.justify-content-between.title-set h3.item-title a" },
        Description: { selector: ".row.detail-set .attr-main > div[style*='white-space']" },
        Genres: { selector: ".attr-item b:contains('Genres:') + span span, .attr-item b:contains('Genres:') + span u", multiple: true },
        Chapters: { selector: ".mt-4.episode-list .main .item a.visited.chapt", attribute: "href", text: true, multiple: true, arranger: "newestFirst" },
        PageImage: {
          selector: ".attr-episode img", // <-- real image elements
          attribute: "src",
          multiple: true
        },
        fetch: true // <-- must fetch profile page to extract images
      }
    });
  });

spider.save();
