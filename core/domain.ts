// Port of internal/domain/models.go.
//
// Dates are ISO 8601 strings end-to-end (not Date objects) to mirror the Go
// side, which stores RFC3339Nano strings directly and avoids re-parsing them
// on every read.

export interface FeedItem {
  source: string;
  externalId: string;
  title: string;
  url: string;
  summary?: string;
  author?: string;
  score?: number;
  commentsUrl?: string;
  publishedAt?: string;
  /**
   * First-seen timestamp for the item. The explicit GitHub source view
   * substitutes `last_seen_at` here so re-trending repositories sort by their
   * latest appearance; every other view keeps the first-seen value.
   */
  fetchedAt?: string;
  sourceRank: number;
  metadata: Record<string, unknown>;
}

export interface SyncState {
  source: string;
  lastAttemptAt?: string;
  lastSuccessAt?: string;
  lastError?: string;
  itemCount: number;
}

export interface SourceSnapshot {
  source: string;
  label: string;
  homepageUrl: string;
  lastAttemptAt?: string;
  lastSuccessAt?: string;
  lastError?: string;
  itemCount: number;
  items: FeedItem[];
}

export interface RefreshOutcome {
  source: string;
  ok: boolean;
  itemCount: number;
  error?: string;
}

export interface CardView {
  source: string;
  index: number;
  title: string;
  url: string;
  commentsUrl?: string;
  brief?: string;
  briefPrefix?: string;
  briefSuffix?: string;
  briefDateIso?: string;
  briefDateKind: string;
  host: string;
}

export interface ErrorView {
  source: string;
  label: string;
  error: string;
}
