import { createSpider } from "@sdk";

const spider = createSpider("yaksha_full")
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
      .profileLink({
        selector: ".tab-summary .post-title a",
        attribute: "href"
      })
      .profileById({
        urlPattern: "https://yakshascans.com/manga/{manga_id}/",
        replace: {
          pattern: "https://yakshascans.com/manga/",
          with: ""
        },
        fetch: true,
        ProfileTarget: {}
      })
      .profileTarget(target =>
        target
          .MangaID({ selector: null, text: true })
          .Name({ selector: ".post-title h1", text: true })
          .Image({ selector: ".summary_image img", attribute: "data-src" })
          .Description({ selector: ".summary__content p", text: true, multiple: true })
          .Genres({ selector: ".genres-content a", text: true, multiple: true })
          .Chapters({
            selector: ".listing-chapters_wrap .wp-manga-chapter a",
            multiple: true,
            arranger: "newestFirst",
            fetch: true
          })
          .PageImage({
            selector: "img.wp-manga-chapter-img",
            attribute: "data-src",
            multiple: true
          })
          .fetch(true)
      )
      .fetch(true)
  )
  .save();
