import { createSpider } from "@sdk";

const spider = createSpider("yaksha_full")
  .name("YakshaScans Manga Search & Chapters")
  .description("Scrapes YakshaScans search results, manga metadata, chapters, and page images")
  .field("manga_id", "string")
  .field("manga_name", "string")
  .field("manga_image", "url")
  .field("manga_description", "string")
  .field("genres", "string[]")
  .field("chapters", "object[]")
  .field("page_images", "string[]")
  .targetUrl("https://yakshascans.com/?s={query}&post_type=wp-manga")
  .itemConfig(item => {
    item.selector(".c-tabs-item__content a");
    item.Name({ selector: ".c-tabs-item__content a", text: true });
    item.profileLink({ selector: ".c-tabs-item__content a", attribute: "href" });

    item.profileTarget(pt => {
      pt.Url({ selector: "head link[rel='canonical']", attribute: "href" });
      pt.Name({ selector: ".post-title h1", text: true });
      pt.Image({ selector: ".summary_image img", attribute: "src" });
      pt.Description({ selector: ".description-summary", text: true });
      pt.Genres({ selector: ".genres-content a", multiple: true, text: true });
      pt.Chapters({ selector: ".listing-chapters_wrap ul.main.version-chap li.wp-manga-chapter a", multiple: true, text: true });
      pt.PageImage({ selector: ".reading-content .wp-manga-chapter-img", multiple: true, attribute: "src" });
    });

    item.profileById({
      urlPattern: "https://yakshascans.com/manga/{manga_id}/",
      fetch: true,
      ProfileTarget: {
        Url: { selector: "head link[rel='canonical']", attribute: "href" },
        Image: { selector: ".summary_image img", attribute: "src" },
        Name: { selector: ".post-title h1", text: true },
        Description: { selector: ".description-summary", text: true },
        Genres: { selector: ".genres-content a", multiple: true, text: true },
        Chapters: { selector: ".listing-chapters_wrap ul.main.version-chap li.wp-manga-chapter a", multiple: true, text: true },
        PageImage: { selector: ".reading-content .wp-manga-chapter-img", multiple: true, attribute: "src" },
      },
    });
  });

spider.save();
