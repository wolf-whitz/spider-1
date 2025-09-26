# 🕷️ Spider Config Guide

A spider config is a JSON object validated by `SpiderSchema`.
It defines:

1. Identification (`id`, `name`, `description`)
2. Data structure (`types.fields`)
3. Search URL (`targetUrl`)
4. How to scrape (`itemConfig`)

---

## 1. Structure

```json
{
  "spider": {
    "id": "unique_id_here",
    "name": "Human Readable Name",
    "description": "What this spider does",
    "types": {
      "fields": [
        { "name": "manga_id", "type": "string" },
        { "name": "manga_name", "type": "string" },
        { "name": "manga_image", "type": "url" }
      ]
    },
    "targetUrl": "https://example.com/search?q={query}",
    "itemConfig": { ... }
  }
}
```

---

## 2. Field Types

Allowed field types:

* `"string"`
* `"string[]"`
* `"url"`
* `"number"`
* `"object[]"`

---

## 3. `itemConfig`

Defines scraping rules.

### 3.1 Top-level Selector

```json
"selector": "#series-list .col.item.line-b"
```

### 3.2 ProfileLink

```json
"ProfileLink": {
  "selector": "a.item-title",
  "attribute": "href"
}
```

### 3.3 ProfileTarget

```json
"ProfileTarget": {
  "Url": { "selector": "a.item-title", "attribute": "href" },
  "Image": { "selector": "a.item-cover img", "attribute": "src" },
  "Name": { "selector": "a.item-title" },
  "Description": { "selector": ".item-desc" },
  "Genres": { "selector": ".item-genre span", "multiple": true },
  "MangaID": { "selector": "a.item-title", "attribute": "href" },
  "Chapters": { "selector": ".chapter-list a", "attribute": "href" }
}
```

`Chapters` is required by the schema.

---

## 4. Profile by ID

Fetches detail pages after search.

```json
"profileById": {
  "urlPattern": "https://example.com{manga_id}",
  "replace": {
    "pattern": "^/series/",
    "with": "/series/"
  },
  "ProfileTarget": {
    "Url": { "selector": "body", "attribute": "data-url" },
    "Image": { "selector": ".cover img", "attribute": "src" },
    "Name": { "selector": "h1.title" },
    "Description": { "selector": ".desc" },
    "Genres": { "selector": ".genres span", "multiple": true },
    "MangaID": { "selector": "body", "attribute": "data-id" },
    "Chapters": { "selector": ".chapter-list a", "attribute": "href" }
  }
}
```

---

## 5. Example

```json
{
  "spider": {
    "id": "mto_search",
    "name": "MTO Search",
    "description": "Scrapes search results from mto.to",
    "types": {
      "fields": [
        { "name": "manga_id", "type": "string" },
        { "name": "manga_name", "type": "string" },
        { "name": "manga_image", "type": "url" }
      ]
    },
    "targetUrl": "https://mto.to/search?word={query}",
    "itemConfig": {
      "selector": "#series-list .col.item.line-b",
      "ProfileLink": {
        "selector": "a.item-title",
        "attribute": "href"
      },
      "ProfileTarget": {
        "Url": { "selector": "a.item-title", "attribute": "href" },
        "Image": { "selector": "a.item-cover img", "attribute": "src" },
        "Name": { "selector": "a.item-title" },
        "Description": { "selector": ".item-desc" },
        "Genres": { "selector": ".item-genre span", "multiple": true },
        "MangaID": { "selector": "a.item-title", "attribute": "href" },
        "Chapters": { "selector": ".item-volch a", "attribute": "href" }
      }
    }
  }
}
```
