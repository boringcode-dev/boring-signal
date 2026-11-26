export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  /** Service binding to this same Worker — used to fan out per-source
   * refreshes as fresh invocations (fresh 10ms CPU budget each), instead of
   * a public-internet self-fetch that would need a known hostname. */
  SELF: Fetcher;
  /** Workers AI binding backing the "For You" LlmRanker — see
   * platforms/cloudflare/src/llmRanker.ts. No secret needed. */
  AI: Ai;
  /** Browser Run binding backing the JavaScript-rendered preview fallback. */
  BROWSER: BrowserRun;
  REFRESH_SECRET: string;
  APP_VERSION?: string;
  SIGNAL_ITEMS_PER_SOURCE?: string;
  SIGNAL_USER_AGENT?: string;
  SIGNAL_MAX_ITEMS_PER_SOURCE?: string;
  /** Size of the top-similarity slice the LLM polishes per /api/personalize
   * call — 0 disables the LLM polish pass entirely, serving the
   * embedding-similarity order on its own. See src/index.ts's
   * handlePersonalize. */
  SIGNAL_PERSONALIZE_POLISH_POOL_SIZE?: string;
  /** Set to "false" to disable the Workers AI toMarkdown fallback for
   * non-HTML and empty/truncated article previews. */
  SIGNAL_AI_PREVIEW_FALLBACK?: string;
  /** Set to "false" to disable the Browser Run fallback for JavaScript-
   * rendered HTML previews. */
  SIGNAL_BROWSER_PREVIEW_FALLBACK?: string;
}
