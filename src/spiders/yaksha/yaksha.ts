import { createSpider } from "@sdk";

const spider = createSpider("yaksha_full")
  .name("Yaksha Full Spider")
  .field("manga_id", "string")
  .field("manga_name", "string")
  .field("manga_image", "url")
  .field("manga_description", "string")
  .field("genres", "string[]")
  .field("chapters", "object[]")
  .field("page_images", "string[]")
  .targetUrl("https://yakshascans.com/?s={query}&post_type=wp-manga")
  .itemConfig(item =>
    item
      .selector(".tab-summary")
      .profileLink({
        selector: ".post-title a",
        attribute: "href",
        text: false,
        multiple: false
      })
      .profileById({
        urlPattern: "https://yakshascans.com/manga/{manga_id}/",
        replace: { pattern: "https://yakshascans.com/manga/", with: "" },
        fetch: true,
        ProfileTarget: {
          MangaID: { fromUrlSlug: true }, // <-- use slug from URL
          Name: { selector: ".post-title h1", text: true },
          Image: { selector: ".summary_image img", attribute: "data-src" },
          Description: { selector: ".summary__content p", multiple: true, text: true },
          Genres: { selector: ".genres-content a", multiple: true, text: true },
          Chapters: {
            selector: ".listing-chapters_wrap .wp-manga-chapter a",
            multiple: true,
            arranger: "newestFirst",
            fetch: true
          },
          PageImage: {
            selector: "img.wp-manga-chapter-img",
            attribute: "data-src",
            multiple: true
          },
          fetch: true
        }
      })
      .profileTarget(target =>
        target
          .MangaID({ fromUrlSlug: true }) // <-- slug only
          .Name({ selector: ".post-title h1", text: true })
          .Image({ selector: ".summary_image img", attribute: "data-src" })
          .Description({ selector: ".summary__content p", text: true, multiple: true })
          .Genres({ selector: ".genres-content a", multiple: true, text: true })
          .Chapters({
            selector: ".listing-chapters_wrap .wp-manga-chapter a",
            multiple: true,
            arranger: "newestFirst",
            fetch: true
          })
          .PageImage({ selector: "img.wp-manga-chapter-img", attribute: "data-src", multiple: true })
          .fetch(true)
      )
      .fetch(true)
  )
  .save();
