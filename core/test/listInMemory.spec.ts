import { describe, expect, it } from "vitest";
import type { FeedItem } from "../domain.ts";
import {
  fetchedAtForView,
  filterFeedItems,
  paginate,
  sortFeedItems,
} from "../sources/listInMemory.ts";

function item(overrides: Partial<FeedItem>): FeedItem {
  return {
    source: "hackernews",
    externalId: "1",
    title: "title",
    url: "https://example.com",
    sourceRank: 1,
    metadata: {},
    ...overrides,
  };
}

describe("fetchedAtForView", () => {
  const firstSeen = "2026-06-01T00:00:00.000Z";
  const lastSeen = "2026-11-26T00:00:00.000Z";

  it("uses last_seen_at for GitHub in the explicit GitHub view", () => {
    expect(fetchedAtForView("github", firstSeen, lastSeen, "github")).toBe(
      lastSeen,
    );
  });

  it("keeps first_seen_at in the All view", () => {
    expect(fetchedAtForView("github", firstSeen, lastSeen, "")).toBe(firstSeen);
  });

  it("keeps first_seen_at for non-GitHub sources", () => {
    expect(
      fetchedAtForView("hackernews", firstSeen, lastSeen, "github"),
    ).toBe(firstSeen);
  });

  it("surfaces a re-trending GitHub repo in the GitHub view but not in All", () => {
    const reTrending = item({
      source: "github",
      externalId: "re-trending",
      fetchedAt: fetchedAtForView("github", firstSeen, lastSeen, "github"),
      sourceRank: 1,
    });
    const newerFirstSeen = item({
      source: "github",
      externalId: "newer-first-seen",
      fetchedAt: fetchedAtForView(
        "github",
        "2026-11-20T00:00:00.000Z",
        "2026-11-20T00:00:00.000Z",
        "github",
      ),
      sourceRank: 2,
    });
    expect(
      sortFeedItems([newerFirstSeen, reTrending]).map((i) => i.externalId),
    ).toEqual(["re-trending", "newer-first-seen"]);

    const reTrendingAll = item({
      source: "github",
      externalId: "re-trending",
      fetchedAt: fetchedAtForView("github", firstSeen, lastSeen, ""),
      sourceRank: 1,
    });
    const newerFirstSeenAll = item({
      source: "github",
      externalId: "newer-first-seen",
      fetchedAt: fetchedAtForView(
        "github",
        "2026-11-20T00:00:00.000Z",
        "2026-11-20T00:00:00.000Z",
        "",
      ),
      sourceRank: 2,
    });
    expect(
      sortFeedItems([reTrendingAll, newerFirstSeenAll]).map(
        (i) => i.externalId,
      ),
    ).toEqual(["newer-first-seen", "re-trending"]);
  });
});

describe("sortFeedItems", () => {
  it("orders by effective date desc, then first-seen desc, then rank/source/id", () => {
    const older = item({
      externalId: "older",
      publishedAt: "2026-01-01T00:00:00.000Z",
    });
    const newer = item({
      externalId: "newer",
      publishedAt: "2026-06-01T00:00:00.000Z",
    });
    const noDate = item({
      externalId: "no-date",
      fetchedAt: "2026-03-01T00:00:00.000Z",
    });

    const sorted = sortFeedItems([older, noDate, newer]);
    expect(sorted.map((i) => i.externalId)).toEqual([
      "newer",
      "no-date",
      "older",
    ]);
  });

  it("breaks ties by source rank, then source, then external id", () => {
    const a = item({ externalId: "b", source: "github", sourceRank: 2 });
    const b = item({ externalId: "a", source: "github", sourceRank: 1 });
    const c = item({ externalId: "a", source: "huggingface", sourceRank: 1 });
    const sorted = sortFeedItems([a, b, c]);
    expect(sorted.map((i) => `${i.source}:${i.externalId}`)).toEqual([
      "github:a",
      "huggingface:a",
      "github:b",
    ]);
  });
});

describe("paginate", () => {
  it("slices by offset/limit and returns empty past the end", () => {
    const items = [1, 2, 3, 4, 5];
    expect(paginate(items, 2, 1)).toEqual([2, 3]);
    expect(paginate(items, 0, 0)).toEqual(items);
    expect(paginate(items, 2, 10)).toEqual([]);
  });
});

describe("filterFeedItems", () => {
  const items = [
    item({
      externalId: "1",
      source: "hackernews",
      title: "Rust is great",
      summary: "systems programming",
    }),
    item({
      externalId: "2",
      source: "github",
      title: "awesome-go",
      author: "gopher",
    }),
    item({ externalId: "3", source: "github", title: "totally unrelated" }),
  ];

  it("filters by a single source", () => {
    expect(
      filterFeedItems(items, "github", [], "").map((i) => i.externalId),
    ).toEqual(["2", "3"]);
  });

  it("filters by an enabled-sources set when no single source is set", () => {
    expect(
      filterFeedItems(items, "", ["hackernews"], "").map((i) => i.externalId),
    ).toEqual(["1"]);
  });

  it("matches multi-term search across fields, AND across terms", () => {
    expect(
      filterFeedItems(items, "", [], "rust systems").map((i) => i.externalId),
    ).toEqual(["1"]);
    expect(
      filterFeedItems(items, "", [], "gopher").map((i) => i.externalId),
    ).toEqual(["2"]);
    expect(filterFeedItems(items, "", [], "rust gopher")).toEqual([]);
  });
});
