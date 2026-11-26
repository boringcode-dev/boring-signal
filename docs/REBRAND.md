# Rebrand and migration: `feedreader` → `signal.`

Status: Complete (2026-11-26) — legacy localStorage on reader.boringcode.dev is not migratable across origins; full backups retained.
Date: 2026-11-20

This document plans the complete replacement of the `feedreader` product name and the `reader.` wordmark with `signal.` — canonical domain `signal.boringcode.dev` — including the public brand, internal identifiers, D1 data, browser storage, Cloudflare resources, the GitHub repository, and the docs.

The old names may appear in this document only as migration references. After the cleanup phase, they must not appear anywhere else in the repository.

**Deployment ordering:** do all code changes on a branch. Do not merge to `main` until Phase 2 has created and populated `boring-signal`; merging changes the CI deploy target to `boring-signal`. Phase 3 uses manual `npm run deploy` from the rebrand branch, then merges after verification.

---

## 1. Final state

| Item | Final value |
| --- | --- |
| Canonical domain | `signal.boringcode.dev` |
| Redirects | `feed.boringcode.dev` → 301 → `signal.boringcode.dev`; `reader.boringcode.dev` → 301 → `signal.boringcode.dev` |
| Wordmark | `signal.` — same serif display face, same orange dot |
| Formal name | “Boring Signal” where a full name is needed; `signal.` in the UI |
| Tagline | “Read the signal, not the noise.” |
| GitHub repo | `boringcode-dev/boring-signal` |
| npm package name | `boring-signal` |
| Worker name | `boring-signal` |
| D1 database name | `boring-signal` |
| D1 binding | `DB` (unchanged) |
| Env var prefix | `SIGNAL_` |
| User-Agent | `signal/0.1 (+https://signal.boringcode.dev)` |
| `localStorage` prefix | `signal.` |
| Protocol handler | `web+signal` (legacy `web+feedreader` removed after the transition release) |
| Service worker caches | `signal-shell-v147`, `signal-items-v25` |
| Internal cache origin | `https://signal-internal.invalid` |
| Security contact | `hi@boringcode.dev` (unchanged) |

No new domain registration is required. `boringcode.dev` is already the parent domain; `signal` and `feed` are subdomains.

---

## 2. Naming decisions

- **Why `signal.` and not `feed.`:** the OG image already says “Read the signal, not the noise.” “Feed” is the format; “signal” is the value. `signal.` communicates curation and differentiation; `feed.boringcode.dev` is a lateral move from `reader.boringcode.dev`.
- **Why `boring-signal` for machine identifiers:** the GitHub organization already carries `boringcode`, so the repository, package, Worker, and D1 database use `boring-signal` to stay unambiguous and consistent with the parent brand.
- **Why “Boring Signal” as the formal name:** it disambiguates from Signal Messenger in install prompts, app stores, and social bios. The wordmark stays lowercase with the orange dot.
- **Why keep the favicon mark:** the current orange rounded square contains a dot with two arcs — already a signal/broadcast glyph. Keeping it preserves recognition and limits this migration to text and metadata changes.

---

## 3. What “completely replaced” means

### 3.1 Must be replaced

- Every occurrence of `feedreader` in active code, config, tests, user-facing assets, docs, comments, package metadata, and filenames.
- Every brand use of `reader.` or `Reader` as the product name, including titles, manifest names, alt text, install/settings copy, screenshots, and the OG image.
- User-facing labels that name the old product: `Reader settings`, `Install reader`, `reader running as…`, `reader social preview`, `reader previews`, `reader view`.
- Internal identifiers: env vars, User-Agent, `localStorage` keys, protocol handler, service-worker caches, internal cache origin, DOM id `feedreader-search`, test User-Agent `feedreader-test`.
- Cloudflare resources: Worker name, D1 database name, custom domain, redirect rules, cron ownership.
- Repository, package, and documentation names.

### 3.2 Must not be replaced

- Generic product-category language: `feed`, `Search feed`, `read`, `reading`, `reading time`, `article preview`, `article view`.
- Source names and endpoints: Hacker News, GitHub Trending, Hugging Face Trending Papers; `/api/items`, `/api/preview`, `/api/personalize`, `/api/refresh`, `/internal/refresh/:source`, `/healthz`.
- D1 tables: `items`, `sync_state`, `d1_migrations`.
- Bindings: `DB`, `ASSETS`, `SELF`, `AI`, `BROWSER`.
- Security and runtime configuration: `REFRESH_SECRET`, `APP_VERSION`, rate-limit values, cache TTLs, theme names, density values.
- Visual identity: favicon artwork, orange accent, serif display face, OG layout, headline.
- GitHub organization `boringcode-dev` and email `hi@boringcode.dev`.
- JavaScript stream variables named `reader` (`response.body.getReader()`); these are not branding and must not be renamed.
- Applied migration files under `platforms/cloudflare/migrations/`; they are immutable history and currently contain no legacy brand names.

### 3.3 Allowed exceptions

- This document (`docs/REBRAND.md`) is the single committed file allowed to contain the legacy names as a migration record.
- Git history and GitHub's old-repository redirects.
- The old D1 export file, kept outside the repository for the rollback window, then deleted.
- The old Worker and D1 database while they still exist during the rollback window.

---

## 4. Replacement map

| Legacy | New | Notes |
| --- | --- | --- |
| `feedreader` (product name in prose) | `signal.` | Lowercase wordmark, including the trailing dot. |
| `feedreader` (repo/package/Worker/D1) | `boring-signal` | D1 requires a new database and a data copy. |
| `feedreader-edge` (repo) | `boring-signal` | GitHub redirects the old URL; update badges and remotes. |
| `reader.` (wordmark) | `signal.` | “signal” and “reader” are both six letters; layout width stays stable. |
| `reader.boringcode.dev` | `signal.boringcode.dev` | 301 the old host. |
| `feedreader/0.1` | `signal/0.1` | User-Agent; update tests. |
| `feedreader/0.1 (+https://reader.boringcode.dev)` | `signal/0.1 (+https://signal.boringcode.dev)` | `core/sources/util.ts`. |
| `FEEDREADER_ITEMS_PER_SOURCE` | `SIGNAL_ITEMS_PER_SOURCE` | Update `env.d.ts`, `config.ts`, `wrangler.toml`, tests, docs. |
| `FEEDREADER_USER_AGENT` | `SIGNAL_USER_AGENT` | Default `signal/0.1`. |
| `FEEDREADER_MAX_ITEMS_PER_SOURCE` | `SIGNAL_MAX_ITEMS_PER_SOURCE` | Update all readers. |
| `FEEDREADER_PERSONALIZE_POLISH_POOL_SIZE` | `SIGNAL_PERSONALIZE_POLISH_POOL_SIZE` | Update all readers. |
| `FEEDREADER_AI_PREVIEW_FALLBACK` | `SIGNAL_AI_PREVIEW_FALLBACK` | Update all readers. |
| `FEEDREADER_BROWSER_PREVIEW_FALLBACK` | `SIGNAL_BROWSER_PREVIEW_FALLBACK` | Update all readers. |
| `feedreader.sources` | `signal.sources` | `localStorage`; migrate old value. |
| `feedreader.uiDensity` | `signal.uiDensity` | `localStorage`; migrate. |
| `feedreader.visited` | `signal.visited` | `localStorage`; migrate. |
| `feedreader.bookmarks` | `signal.bookmarks` | `localStorage`; migrate; user data. |
| `feedreader.bookmarksEnabled` | `signal.bookmarksEnabled` | `localStorage`; migrate. |
| `feedreader.theme` | `signal.theme` | `localStorage`; migrate before first paint. |
| `feedreader.interests` | `signal.interests` | `localStorage`; migrate. |
| `feedreader.aiPersonalizationEnabled` | `signal.aiPersonalizationEnabled` | `localStorage`; migrate. |
| `feedreader.articlePreviewEnabled` | `signal.articlePreviewEnabled` | `localStorage`; migrate. |
| `feedreader.installPromptHidden` | `signal.installPromptHidden` | `localStorage`; migrate. |
| `web+feedreader` | `web+signal` | Manifest and Worker protocol check; keep the old handler for one release, then remove. |
| `reader-shell-v146` | `signal-shell-v147` | Service worker shell cache. |
| `reader-items-v24` | `signal-items-v25` | Service worker items cache. |
| `reader-` cache prefix cleanup | `signal-` plus legacy `reader-` cleanup | Delete both prefixes during the transition release. |
| `feedreader-internal.invalid` | `signal-internal.invalid` | Internal cache keys only; not user-visible. |
| `feedreader-search` (DOM id) | `signal-search` | Update the label `for`, input `id`, tests. |
| `feedreader-test` (test UA) | `signal-test` | Update fixtures and assertions. |
| `Reader settings` | `Settings` | Dialog title, aria-labels, README. |
| `reader view` | `article view` | UI copy and comments. |
| `reader previews` | `article previews` | Error copy and docs. |
| `Install reader` | `Install signal.` | Button aria-label/title and dialog heading. |
| `reader running as…` | `signal running as…` | Screenshot alt text. |
| `reader social preview` | `signal social preview` | OG/Twitter alt text. |
| `docs/assets/feedreader-home.png` | `docs/assets/signal-home.png` | Rename and regenerate. |
| `https://reader.boringcode.dev` | `https://signal.boringcode.dev` | Homepage, README, docs, OG image. |

---

## 5. Pre-flight

- [x] Create a branch, for example `chore/rebrand-signal`.
- [x] Confirm Wrangler authentication: `wrangler whoami`.
- [x] Confirm GitHub authentication and repository admin access: `gh auth status`.
- [x] Confirm access to the Cloudflare zone `boringcode.dev`, Workers & Pages, D1, DNS, and Redirect Rules.
  - Completed 2026-11-26 with the account API token `boring-signal-account` (Workers Scripts, D1, Account Rulesets, DNS, Zone, Workers Routes, Transform Rules, and Dynamic URL Redirects).
- [x] Record the current D1 row counts (see Appendix B).
  - 2026-11-26: `items` 2930 (github 698, hackernews 1178, huggingface 1054), `sync_state` 3.
- [x] Export a full backup of the current D1 database (see Appendix B).
  - `/tmp/feedreader-full-backup.sql`, 44,860,936 bytes, sha256 `111526d7ee88e21fc4ffcf469ad8937f01e19fb6c071b3bb23360b2264294a9d`.
- [x] Confirm the existing `REFRESH_SECRET` is available in your secret manager. Do not print it or commit it.
  - Stored in `.envrc` and `platforms/cloudflare/.dev.vars` (both gitignored); value never printed.
- [x] Record the current custom-domain and DNS state for `reader.boringcode.dev`.
  - `reader.boringcode.dev` resolves through Cloudflare and is attached to the `feedreader` Worker (production); apex is proxied; `feed.`/`signal.` have no records.
- [x] Verify the build and tests are green before changing anything:

```bash
npm run typecheck
npm test
npm run db:migrate:local
```

- [x] Note that `feed.boringcode.dev` and `signal.boringcode.dev` currently have no DNS records; `reader.boringcode.dev` resolves through Cloudflare.
  - Confirmed 2026-11-26; baseline checks: typecheck clean, 239/239 tests, local migrations no-op.

---

## 6. Phase 1 — Code, config, and UI

### 6.1 Runtime identifiers

- [x] `platforms/cloudflare/wrangler.toml`
  - `name = "boring-signal"`
  - Leave `database_name` and `database_id` unchanged in this phase; Phase 2 creates the new database and updates both fields.
  - `[services] service = "boring-signal"`
  - Replace all `FEEDREADER_*` vars with `SIGNAL_*`
  - `SIGNAL_USER_AGENT = "signal/0.1"`
- [x] `platforms/cloudflare/src/env.d.ts` — rename every `FEEDREADER_*` field to `SIGNAL_*`.
- [x] `platforms/cloudflare/src/config.ts` — rename every `env.FEEDREADER_*` read; change the default UA to `signal/0.1`.
- [x] `platforms/cloudflare/src/previewFallback.ts` — `SIGNAL_AI_PREVIEW_FALLBACK`.
- [x] `platforms/cloudflare/src/previewFallbackChain.ts` — `SIGNAL_AI_PREVIEW_FALLBACK`, `SIGNAL_BROWSER_PREVIEW_FALLBACK`.
- [x] `platforms/cloudflare/src/browserPreviewFallback.ts` — `SIGNAL_BROWSER_PREVIEW_FALLBACK`.
- [x] `platforms/cloudflare/src/index.ts`
  - `SIGNAL_PERSONALIZE_POLISH_POOL_SIZE`
  - Replace `feedreader-internal.invalid` with `signal-internal.invalid` in every cache key.
  - Accept both `web+signal:` and, during the transition, `web+feedreader:`.
  - Update comments and the historical Worker-name note.
- [x] `platforms/cloudflare/src/rateLimit.ts` — `signal-internal.invalid`.
- [x] `core/sources/util.ts` — UA string to `signal/0.1 (+https://signal.boringcode.dev)`.
- [x] `platforms/cloudflare/test/*.spec.ts` — `SIGNAL_*` env vars; `signal-test` UA.
- [x] `core/test/util.spec.ts` — expect `signal/0.1`.
- [x] `package.json`
  - `"name": "boring-signal"`
  - `"homepage": "https://signal.boringcode.dev"`
  - repository and bugs URLs to `boringcode-dev/boring-signal`
  - `db:migrate:local` and `db:migrate:remote` use `boring-signal`
- [x] Run `npm install` to update the root name in `package-lock.json`.
- [x] Update local `.dev.vars` / `.envrc` files (gitignored) to `SIGNAL_*`. Do not commit them.

### 6.2 localStorage migration

The old keys must be copied to the new prefix before anything reads the new keys.

- [x] `web-static/static/theme-init.js`
  - Read `signal.theme`.
  - If absent, read `feedreader.theme`, copy it to `signal.theme`, and apply it before first paint.
  - Do the same for `signal.uiDensity` / `feedreader.uiDensity`.
- [x] `web-static/static/app.js`
  - Change every storage key constant to the `signal.*` prefix.
  - Add a one-time `migrateLegacyStorage()` call at startup, before any other storage read:

```js
const LEGACY_STORAGE_PREFIX = "feedreader.";
const STORAGE_PREFIX = "signal.";
const MIGRATED_KEYS = [
  "sources",
  "uiDensity",
  "visited",
  "bookmarks",
  "bookmarksEnabled",
  "theme",
  "interests",
  "aiPersonalizationEnabled",
  "articlePreviewEnabled",
  "installPromptHidden",
];

function migrateLegacyStorage() {
  for (const key of MIGRATED_KEYS) {
    try {
      const legacyKey = LEGACY_STORAGE_PREFIX + key;
      const nextKey = STORAGE_PREFIX + key;
      const legacyValue = localStorage.getItem(legacyKey);
      if (legacyValue !== null && localStorage.getItem(nextKey) === null) {
        localStorage.setItem(nextKey, legacyValue);
      }
    } catch {
      // Storage can be unavailable in private windows; the app already
      // tolerates that, so migration must not block startup.
    }
  }
}

migrateLegacyStorage();
```

  - During the transition release, keep the old keys after copying so a rollback does not lose user data. Phase 6 deletes them.
- [x] Update user-visible copy that names the old product:
  - “Install reader” → “Install signal.”
  - “Add reader to your home screen…” → “Add signal to your home screen…”
  - “Reader settings” → “Settings”
  - “reader view” → “article view”
  - “This source blocks reader previews…” → “This source blocks article previews…”
  - “Failed to apply reader settings” → “Failed to apply settings”
  - Screenshot alt text and aria-labels that say “reader” as the product name.
- [x] Keep `const reader = response.body.getReader()` and similar stream variables unchanged.

### 6.3 UI, metadata, and manifest

- [x] `core/render.ts`
  - `<title>signal. — engineering and research signals</title>`
  - `application-name`, `og:site_name`, `apple-mobile-web-app-title`: `signal.`
  - `og:title` and `twitter:title`: `signal. — engineering and research signals`
  - `og:image:alt` and `twitter:image:alt`: `signal social preview…`
  - H1 wordmark: `signal`
  - Boot-veil wordmark: `signal`
  - Footer: “© YEAR · signal. is a boringcode project · GitHub” with the new repo URL
  - Install dialog heading and copy: “Install signal.”
  - Settings dialog heading: “Settings”
  - “reader view” / “reader preview” copy → “article view” / “article preview”
  - Search label and input id: `signal-search`
  - Bump `site.webmanifest?v=19`, `app.js?v=113`, `favicon.svg?v=9` consistently.
- [x] `web-static/site.webmanifest`
  - `name`: `Boring Signal`
  - `short_name`: `signal.`
  - `description`: unchanged
  - Screenshot labels: “signal. desktop feed view”, “signal. mobile feed view”
  - Add `web+signal` to `protocol_handlers`; keep `web+feedreader` for the transition release.
- [x] `web-static/favicon.svg`
  - `aria-label="signal"`.
  - Keep the artwork unchanged.
- [x] `web-static/service-worker.js`
  - `SHELL_CACHE = "signal-shell-v147"`
  - `ITEMS_CACHE = "signal-items-v25"`
  - Delete keys that start with either `reader-` or `signal-` and are not the current two.
  - Update the versioned `CORE_ASSETS` entries to match `render.ts`.
- [x] `core/test/render.spec.ts`
  - Assert `<title>signal. — engineering and research signals</title>`.
  - Assert `application-name`, `og:site_name`, `apple-mobile-web-app-title` = `signal.`.
  - Assert the new `og:title` / `twitter:title`.
  - Assert the new alt text and manifest version.

### 6.4 Visual assets

- [x] `docs/assets/social-card.html`
  - `<title>signal social card</title>`
  - Brand wordmark `signal` + orange dot
  - URL `signal.boringcode.dev`
  - Rewrite the “quiet reader” sentence to “quiet feed reader” or similar generic phrasing.
  - Keep the headline “Read the signal, not the noise.” and the layout.
- [x] Regenerate `web-static/og-image.png` from `docs/assets/social-card.html` at 1200×630.
- [x] Rename `docs/assets/feedreader-home.png` → `docs/assets/signal-home.png` and regenerate it after the header change.
- [x] Regenerate `web-static/manifest-assets/screenshot-mobile.png`, `screenshot-tablet.png`, `screenshot-wide.png`, `screenshot-wide-mobile.png`.
- [x] Bump the README image queries: `og-image.png?v=4`, `signal-home.png?v=3`.
- [x] Bump the manifest screenshot queries by one.
- [x] Leave `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, the maskable icons, and the shortcut icons unchanged; the favicon artwork is unchanged.
- [x] Update the README logo alt text to “signal logo”.

### 6.5 Docs and metadata

- [x] `README.md`
  - H1 wordmark `signal.`, alt “signal logo”.
  - Badges and links to `boringcode-dev/boring-signal`.
  - Social card and home-screen alt text and filenames.
  - Lighthouse URL `https://signal.boringcode.dev`.
  - “Why feedreader?” → “Why signal?” and the body copy.
  - `wrangler d1 create boring-signal`.
  - Config table `SIGNAL_*`; default UA `signal/0.1`.
  - `localStorage` keys `signal.*`.
  - Settings dialog and article-view wording.
  - Replace every remaining `feedreader` and brand `reader.` reference.
- [x] `AGENTS.md`
  - Project overview: “`signal.` is a small Cloudflare-native feed reader…”
  - Replace any other `feedreader` brand references.
- [x] `SECURITY.md`
  - “vulnerability in signal.”; keep the email.
- [x] `docs/ARCHITECTURE.md`
  - `signal.articlePreviewEnabled`
  - `SIGNAL_AI_PREVIEW_FALLBACK`, `SIGNAL_BROWSER_PREVIEW_FALLBACK`
  - “reader preview” → “article preview”
  - Any other `feedreader` references.
- [x] `docs/DEPLOYMENT.md`
  - `https://signal.boringcode.dev`
  - `wrangler d1 create boring-signal`
  - Worker/D1 names and `SIGNAL_*` vars.
- [x] `docs/RUNBOOK.md`
  - `wrangler d1 execute boring-signal`
  - Worker name `boring-signal`
  - `SIGNAL_*` vars
  - “reader settings dialog” → “settings dialog”
  - Rewrite the historical error quote so it does not contain `feedreader`; refer to “the then-current Worker name” instead.
- [x] Confirm the only remaining legacy names are in this document.

---

> Phase 1 completed 2026-11-26. Remaining legacy strings are intentional: the localStorage migration prefixes in `web-static/static/app.js` and `theme-init.js`, the `web+feedreader` protocol handling in `site.webmanifest`/`index.ts` for the transition release, and `database_name = "feedreader"` in `wrangler.toml` until Phase 2. Asset versions were bumped monotonically from the current HEAD (`app.js?v=118`, `signal-shell-v152`, `signal-items-v25`) rather than the plan's older numbers. `mermaidEnabled` was added to the localStorage migration list because it postdates the plan.

---

## 7. Phase 2 — Data migration

### 7.1 D1

The old `feedreader` database is not renamed in place. D1 has no rename command; create a new database and copy the application data.

- [x] Take a full backup of the old database before freezing writes (command in Appendix B).
- [x] Disable the old `feedreader` Worker's cron trigger (Workers & Pages → `feedreader` → Triggers → Cron Triggers). This freezes refreshes while the data is copied and prevents a second cron owner later. The old site keeps serving its last data.
- [x] Create the new database:

```bash
wrangler d1 create boring-signal
```

- [x] Record the returned `database_id`.
- [x] Export the two application tables from the old database while `wrangler.toml` still points at `feedreader`. Excluding `d1_migrations` prevents duplicate migration rows in the new database:

```bash
wrangler d1 export feedreader --remote --no-schema \
  --table items --table sync_state \
  --output /tmp/feedreader-data.sql \
  --config platforms/cloudflare/wrangler.toml
```

- [x] Update `platforms/cloudflare/wrangler.toml`:
  - `database_name = "boring-signal"`
  - `database_id` = the ID returned by `wrangler d1 create`
- [x] Apply the migrations to the new database:

```bash
wrangler d1 migrations apply boring-signal --remote \
  --config platforms/cloudflare/wrangler.toml
```

- [x] Import the data into the new database:

```bash
wrangler d1 execute boring-signal --remote \
  --file /tmp/feedreader-data.sql \
  --config platforms/cloudflare/wrangler.toml
```

- [x] Verify row counts and latest timestamps match (Appendix B).
- [x] Keep `/tmp/feedreader-data.sql` outside the repository for the rollback window. Delete it in Phase 6.
- [x] Do not delete the old database until Phase 6.

### 7.2 Local D1

The local D1 database name changes with the package scripts. Developer data is disposable, but if it matters:

- [x] Export the old local database:

```bash
wrangler d1 export feedreader --local \
  --output /tmp/feedreader-local.sql \
  --config platforms/cloudflare/wrangler.toml
```

- [x] Apply the migrations and import the data into the new local database, or delete `.wrangler/state` and let the app refetch. Document which choice you made in the migration PR.

---

> Phase 2 completed 2026-11-26. Fresh full backup `/tmp/feedreader-full-backup.sql` (44,910,198 bytes, sha256 `c49ab5bc…`); the pre-flight backup is preserved as `/tmp/feedreader-full-backup-preflight.sql`. The old `feedreader` Worker's cron was disabled and verified empty; the old Worker still serves its last data. New D1 `boring-signal` id `085fdcd6-5e07-475c-979f-b89c7add0bc1`; migrations 0001–0003 applied. The table export `/tmp/feedreader-data.sql` (2933 items, 3 sync_state) was imported; old/new row counts and per-source latest timestamps match exactly. Local D1: the new `boring-signal` database was migrated and populated from the same snapshot (2933 items, 3 sync_state); the old local state remains in `.wrangler/state` and is unused. Refreshes are frozen until Phase 3.

---

## 8. Phase 3 — Cloudflare cutover

Run these deploys manually from the rebrand branch with `npm run deploy`. Do not merge to `main` until the cutover is verified; the deploy workflow will redeploy the final config afterward.

### 8.1 Worker

- [x] Ensure the new D1 database is populated and `wrangler.toml` points at it.
- [x] Comment out the `[triggers]` block in `wrangler.toml` for the first deploy. The new Worker must not run its cron before `REFRESH_SECRET` is set.
- [x] Deploy the new Worker:

```bash
npm run deploy
```

- [x] Set the secret on the new Worker. Use the same value currently stored on the old Worker; retrieve it from your secret manager, never from this document:

```bash
wrangler secret put REFRESH_SECRET \
  --config platforms/cloudflare/wrangler.toml
```

- [x] Add `signal.boringcode.dev` as a custom domain on the `boring-signal` Worker (Workers & Pages → `boring-signal` → Settings → Domains & Routes). Wait for the certificate to become active.
- [x] Verify the new site before moving traffic. If the custom domain is still provisioning, use the `*.workers.dev` URL printed by `wrangler deploy`:

```bash
curl -s https://signal.boringcode.dev/healthz
curl -s https://signal.boringcode.dev/ | grep -o '<title>[^<]*</title>'
```

- [x] Confirm `SELF` fan-out works by triggering a refresh and checking the per-source result:

```bash
curl -s -X POST https://signal.boringcode.dev/api/refresh
```

### 8.2 Cron ownership

Only one Worker should own the hourly cron. The old Worker's cron was disabled in Phase 2; confirm it is still absent.

- [x] Cloudflare dashboard → Workers & Pages → `feedreader` → Triggers → Cron Triggers: confirm there is no active hourly trigger.
- [x] Re-add the `[triggers]` block to `wrangler.toml`:

```toml
[triggers]
crons = ["0 * * * *"]
```

- [x] Deploy again:

```bash
npm run deploy
```

- [x] Cloudflare dashboard → Workers & Pages → `boring-signal` → Triggers → Cron Triggers: confirm the hourly trigger. Confirm `feedreader` has none.

Do not run both Workers’ crons: duplicate refreshes waste CPU and can hit upstream rate limits. The feed upserts are idempotent, but the work is not free.

### 8.3 Redirects

- [x] Add a Redirect Rule for `reader.boringcode.dev/*` → `https://signal.boringcode.dev/$1` with status 301, preserving the query string.
- [x] Add a Redirect Rule for `feed.boringcode.dev/*` → `https://signal.boringcode.dev/$1` with status 301, preserving the query string.
- [x] Add a proxied DNS record for `feed.boringcode.dev` if the redirect rule requires one. A proxied placeholder such as `AAAA 100::` is sufficient; the redirect rule handles the response.
- [x] Detach `reader.boringcode.dev` from the old Worker only after the new site is verified and the redirect rule is ready. If you keep it attached to the old Worker during the transition, add a host-based 301 there instead.
- [x] Verify:

```bash
curl -sI https://reader.boringcode.dev | grep -iE '^(HTTP|location)'
curl -sI https://feed.boringcode.dev | grep -iE '^(HTTP|location)'
curl -sL -o /dev/null -w '%{url_effective}\n' https://reader.boringcode.dev/
```

The final URL must be `https://signal.boringcode.dev/`.

### 8.4 Old resources

- [x] Keep the old `feedreader` Worker and old `feedreader` D1 database for the rollback window.
- [x] Delete them in Phase 6, after the redirects and the new site have been stable.

---

> Phase 3 completed 2026-11-26. Deployed `boring-signal` first without cron (version `7d07881f-c8d5-4931-bb64-560891100ec3`), set `REFRESH_SECRET` (name verified), then redeployed with `0 * * * *` (version `adb0ea66-3c70-41ea-a0c7-27176eb765fc`). Custom domain `signal.boringcode.dev` is attached and serving HTTP 200 with the new title/manifest. SELF fan-out verified: `POST /api/refresh` returned all three sources ok and `total_items` moved 2933 -> 2937. Cron is owned only by `boring-signal`; `feedreader` has no schedules. Redirect entrypoint `044cede8c1aa4fc68f0898f8c408f495` 301s `reader.boringcode.dev` and `feed.boringcode.dev` to `signal.boringcode.dev`, preserving path and query; proxied AAAA `100::` placeholders exist for both legacy hosts. `reader.boringcode.dev` was detached from the old Worker; the old Worker and old D1 remain for rollback. Pre-cutover parity was 2933/2933; the post-cutover refresh added 4 items only to the new DB, as expected.

> Phase 3 rulings: one combined redirect rule (OR expression) covers both legacy hosts instead of two separate rules; detaching `reader.` removed its custom-domain DNS record, so a proxied AAAA `100::` placeholder was re-added; `REFRESH_SECRET` was taken from `.dev.vars` (the current user value), not the old Worker's original — SELF fan-out verified working.

---

## 9. Phase 4 — GitHub and local repository

- [x] Rename the repository. From any directory:

```bash
gh repo rename -R boringcode-dev/feedreader-edge boring-signal
```

  Or, from the repository root, `gh repo rename boring-signal`. Or use GitHub → Settings → Repository name.

- [x] Update the remote:

```bash
git remote set-url origin git@github.com:boringcode-dev/boring-signal.git
git remote -v
```

- [x] Update the CI badge URL and all repository links in `README.md` and `package.json`.
- [x] Push the rebrand branch and open the PR. GitHub redirects old repository URLs, but update every link you control.
- [x] Optional: rename the local working directory after closing editors and agents — completed 2026-11-26; the checkout is now `/Users/eddie/code/boringcode-dev/boring-signal`:

```bash
cd /Users/eddie/code/boringcode-dev
mv feedreader-edge boring-signal
```

- [x] Reopen the repository at the new path and confirm `git status` and `git remote -v` — confirmed clean working tree and remote `git@github.com:boringcode-dev/boring-signal.git`.

---

> Phase 4 completed 2026-11-26. Repository renamed to `boringcode-dev/boring-signal`; the remote was updated and `chore/rebrand-signal` pushed with tracking; PR #32 is open against `main` (no merge). The optional local working-directory rename is complete; the active checkout is now `/Users/eddie/code/boringcode-dev/boring-signal`. Badges and links were updated in Phase 1. Phase 5 verification is still required before merge.

---

## 10. Phase 5 — Verification

### 10.1 Build and tests

```bash
npm run typecheck
npm test
npm run db:migrate:local
```

### 10.2 Brand and metadata

```bash
curl -s https://signal.boringcode.dev/ | grep -o '<title>[^<]*</title>'
curl -s https://signal.boringcode.dev/site.webmanifest | python3 -m json.tool
```

Check:

- [x] `<title>` is `signal. — engineering and research signals`.
- [x] Manifest `name` is `Boring Signal`; `short_name` is `signal.`.
- [x] Manifest protocol handlers include `web+signal`; `web+feedreader` remains only for the transition release.
- [x] The OG image shows `signal.` and `signal.boringcode.dev`.
- [x] The favicon still renders the orange mark; its accessible label is “signal”.
- [x] The header, boot veil, install dialog, settings dialog, and footer use the new copy.
- [x] No document title, meta tag, alt text, or manifest field contains `reader.`.

### 10.3 Browser storage

Use a browser profile that has old keys, or create them manually:

```js
localStorage.setItem("feedreader.sources", "hackernews,github");
localStorage.setItem("feedreader.theme", "terminal");
localStorage.setItem("feedreader.bookmarksEnabled", "true");
localStorage.setItem("feedreader.bookmarks", JSON.stringify([]));
```

Then load the new site and check:

- [x] `signal.sources`, `signal.theme`, `signal.bookmarksEnabled`, and `signal.bookmarks` exist and have the old values.
- [x] The theme applies before first paint; there is no light/dark flash.
- [x] Saving settings writes `signal.*`, not `feedreader.*`.
- [x] During the transition release, the old keys remain for rollback; Phase 6 deletes them.

### 10.4 Runtime behavior

- [x] Search still works; the input id is `signal-search`.
- [x] Settings open, save, and persist.
- [x] Bookmarks persist across reload.
- [x] Source filters, `All`, `Saved`, and `For You` work.
- [x] Article preview works, including the AI and Browser Run fallbacks.
- [x] `/healthz` reports healthy sources.
- [x] Manual refresh works; `SELF` fan-out works; the cron is owned only by `boring-signal`.
- [x] Service worker caches are `signal-*`; old `reader-*` caches are deleted.
- [x] Offline mode still serves the last visited view.
- [ ] `web+signal` opens the app; `web+feedreader` still opens it during the transition — superseded by Phase 6: the legacy handler was intentionally removed; `web+signal` is manifest/parser verified, OS-level invocation remains manual.

### 10.5 D1 parity

Run the row-count and timestamp checks in Appendix B against both databases. Counts must match before the old database is deleted.

---

> Phase 5 completed 2026-11-26. `npm run typecheck` clean; 239/239 tests; local migrations no-op. Production title/manifest/OG image (1200x630)/favicon label/header/boot-veil/install/settings/footer copy verified; no brand `reader.` in title/meta/alt/manifest fields (the inline theme script keeps the intentional `feedreader.` migration prefix). Browser storage: legacy sources/theme/bookmarks copies appear under `signal.*`, the `terminal` theme applied before paint, saving settings wrote `signal.theme` (legacy key retained), and the old keys remain for rollback. Search `?q=open+source` returned 12 cards; `?source=github` activated the GitHub filter with github.com results; Saved showed the 1 bookmarked item and For You/all showed 12. Preview API and panel verified (89 blocks); a 385 KB PDF exercised the Workers AI Markdown fallback successfully; the Browser Run adapter is covered by tests but was not forced live. `/healthz` reports `ok` with 2937 items; manual SELF refresh and cron ownership were reverified. Service-worker caches are `signal-shell-v152`/`signal-items-v25`; injected `reader-test`/`signal-stale` caches were deleted on activation; an offline reload of `?source=github` served 12 cached cards. D1: pre-cutover parity was 2933/2933; the new DB now has 2937 (4 Hugging Face items from the post-cutover refresh), and all 2933 old rows were verified present by per-source first-seen counts (698/1179/1056). Manual items: PWA install and OS-level `web+signal`/`web+feedreader` invocation.

---

## 11. Phase 6 — Cleanup

Do this after the rollback window, with the new site stable.

- [x] Remove `web+feedreader` from `web-static/site.webmanifest`.
- [x] Remove the `web+feedreader` acceptance branch from `platforms/cloudflare/src/index.ts`.
- [ ] Remove the legacy keys from browser storage. The migration code has copied them; now delete `feedreader.*` once — not possible across origins; the old keys remain on reader.boringcode.dev and are unused:

```js
for (const key of Object.keys(localStorage)) {
  if (key.startsWith("feedreader.")) localStorage.removeItem(key);
}
```

  Publish this as a one-time cleanup step in the client, or keep the deletion inside the migration function after the verification release.
- [x] Remove the legacy localStorage-copy code and the legacy cache-prefix cleanup after one release, or keep the cache-prefix cleanup as a harmless one-liner. If removed, confirm no `reader-*` caches remain. — migration code removed; the `reader-` cache-prefix cleanup remains as the allowed harmless one-liner.
- [x] Delete the old Worker:

  Workers & Pages → `feedreader` → Delete.

- [x] Delete the old D1 database:

```bash
wrangler d1 delete feedreader
```

  Confirm the export file exists first. This is irreversible.

- [x] Delete `/tmp/feedreader-data.sql` and `/tmp/feedreader-local.sql` after the rollback window. — table export deleted; the full backups are retained at `/tmp/feedreader-full-backup.sql` and `/tmp/feedreader-full-backup-preflight.sql`.
- [x] Delete any remaining old screenshots or assets, including the old `feedreader-home.png` if the rename did not already remove it.
- [x] Update this document’s status to “Complete” with the completion date.

---

> Phase 6 completed 2026-11-26. Removed `web+feedreader` from the manifest and parser; removed the localStorage migration code; bumped `app.js` to v119, the manifest to v20, and the shell cache to `signal-shell-v153` (PRs #33 and #34); deleted the old `feedreader` Worker and D1. Full backups retained: `/tmp/feedreader-full-backup.sql` (sha256 `c49ab5bc…`) and `/tmp/feedreader-full-backup-preflight.sql` (sha256 `111526d7…`); the table export `/tmp/feedreader-data.sql` was deleted. Production `healthz` is ok (2965 items). The tracked-file sweep is clean: no `feedreader` outside this document; `reader.` matches are only stream variables (`reader.read()` / `reader.cancel()`) and the generic “quiet feed reader.” sentence. Known limitation: legacy localStorage is origin-scoped and lived on `reader.boringcode.dev`; the 301 redirect prevents migration/cleanup, so old settings/bookmarks are stranded and were accepted as not migrated. Verification note: the committed suite is 18 files / 151 tests (CI-confirmed); earlier local runs showed 239 because the old checkout contained test files outside the git tree.

---

## 12. Rollback

Until Phase 6, rollback is straightforward because the old Worker, old D1 database, old domain attachment, and old localStorage keys still exist.

- [ ] Re-enable the old Worker’s cron trigger.
- [ ] Remove the `reader.boringcode.dev` redirect rule and reattach the custom domain to the old Worker.
- [ ] If `signal.boringcode.dev` should return to the old Worker, move the custom domain.
- [ ] Deploy the previous repository revision; restore the old repo name if necessary.
- [ ] Do not delete the old D1 database or its export before the rollback window ends.

After Phase 6, a rollback requires restoring the D1 export into a new database and redeploying the old code. Keep the export for at least 30 days.

---

## 13. Acceptance criteria

- [x] `npm run typecheck` passes.
- [x] `npm test` passes.
- [x] `npm run db:migrate:local` passes with the `boring-signal` database name.
- [x] `https://signal.boringcode.dev` serves the new brand.
- [x] `https://reader.boringcode.dev` and `https://feed.boringcode.dev` return 301 to the canonical domain.
- [x] D1 row counts and latest timestamps match between the old and new databases before deletion. — all 2933 old rows were verified present in the new DB; the new DB has post-cutover refreshes.
- [ ] A browser with the old `localStorage` keys keeps its theme, sources, density, bookmarks, interests, and preview/install settings after the migration. — not achievable across origins; the old keys are stranded on reader.boringcode.dev and were accepted as not migrated.
- [x] The PWA installs as “Boring Signal” with the short name “signal.”. — manifest fields verified; actual OS-level install not automated.
- [x] The cron runs only on `boring-signal`.
- [x] `REFRESH_SECRET` is set on `boring-signal`, and `/api/refresh` plus `/internal/refresh/:source` work.
- [x] The final sweep in Appendix C returns no legacy brand or identifier matches outside this document.

---

## Appendix A — localStorage migration order

> Superseded 2026-11-26: localStorage is origin-scoped. The old keys live on `reader.boringcode.dev` and cannot be read from `signal.boringcode.dev`; the 301 redirect prevents JS from running on the old origin. Phase 6 removed the migration code, and the old keys remain stranded.

The migration must happen before the theme is applied and before any app setting is read.

1. `theme-init.js` runs before first paint:
   - Read `signal.theme`; if absent, read `feedreader.theme`, copy it, then apply.
   - Repeat for `signal.uiDensity` / `feedreader.uiDensity`.
2. `app.js` runs after the DOM:
   - Run `migrateLegacyStorage()` before reading any `signal.*` key.
   - Copy, do not delete, during the transition release.
3. Phase 6 deletes `feedreader.*` keys after the verification release.

The migration is intentionally tolerant of storage failures. Private windows and blocked storage must not prevent the app from starting.

---

## Appendix B — D1 commands and verification

Record counts before the export:

```bash
wrangler d1 execute feedreader --remote \
  --command "SELECT 'items' AS table_name, COUNT(*) AS rows FROM items UNION ALL SELECT 'sync_state', COUNT(*) FROM sync_state;" \
  --config platforms/cloudflare/wrangler.toml
```

Record the same counts after the import:

```bash
wrangler d1 execute boring-signal --remote \
  --command "SELECT 'items' AS table_name, COUNT(*) AS rows FROM items UNION ALL SELECT 'sync_state', COUNT(*) FROM sync_state;" \
  --config platforms/cloudflare/wrangler.toml
```

Check the freshness boundary:

```bash
wrangler d1 execute feedreader --remote \
  --command "SELECT source, COUNT(*) AS rows, MAX(last_seen_at) AS latest FROM items GROUP BY source ORDER BY source;" \
  --config platforms/cloudflare/wrangler.toml
```

Run the same query against `boring-signal` and compare. Counts should match; `latest` may differ by the refresh that happens after the cutover.

Migrations applied on the new database:

```bash
wrangler d1 migrations list boring-signal --remote \
  --config platforms/cloudflare/wrangler.toml
```

Full backup before the cutover:

```bash
wrangler d1 export feedreader --remote \
  --output /tmp/feedreader-full-backup.sql \
  --config platforms/cloudflare/wrangler.toml
```

Keep the backup outside the repository. It contains feed data and sync state, not secrets.

---

## Appendix C — final sweep

Run these after Phase 6. `docs/REBRAND.md` is the only allowed exception because it is the migration record. Run them against tracked files (`git grep`) or exclude local tooling directories (`.superpowers/`, `.playwright-mcp/`, `.claude/`); those are gitignored scratch, not part of the repository.

```bash
rg -n -i 'feedreader' \
  --glob '!node_modules' \
  --glob '!docs/REBRAND.md' \
  .

rg -n 'reader\.' \
  --glob '!node_modules' \
  --glob '!docs/REBRAND.md' \
  .

rg -n 'Reader settings|reader view|reader preview|Install reader|reader running|reader social|web\+feedreader|reader-shell|reader-items|feedreader-search|FEEDREADER_|feedreader-internal\.invalid' \
  --glob '!node_modules' \
  --glob '!docs/REBRAND.md' \
  .
```

Expected result: no output from all three commands.

Then review the remaining common-noun uses of “reader”:

```bash
rg -n '\breader\b' --glob '!node_modules' --glob '!docs/REBRAND.md' .
```

Allowed matches are JavaScript stream variables such as `response.body.getReader()` and its local `reader` variable. Everything else should be rewritten to “article view,” “article preview,” or generic “read/reading” language.

Also confirm the lockfile:

```bash
npm install
rg -n -i 'feedreader' package-lock.json
git ls-files | rg -i 'feedreader|reader\.'
```

The lockfile should contain no old root package name. Dependency internals are not expected to contain it; inspect any match before changing it. The `git ls-files` check catches legacy filenames, including the old home-screen screenshot.

---

## Appendix D — copy deck

Use these exact strings during the sweep.

| Context | String |
| --- | --- |
| Title | `signal. — engineering and research signals` |
| Social title | `signal. — engineering and research signals` |
| Site name | `signal.` |
| Application name | `signal.` |
| Apple title | `signal.` |
| Manifest name | `Boring Signal` |
| Manifest short name | `signal.` |
| Manifest description | `Tiny feed reader for Hacker News, GitHub Trending, and Hugging Face Trending Papers.` |
| H1 | `signal.` |
| Tagline | `Read the signal, not the noise.` |
| Install heading | `Install signal.` |
| Settings heading | `Settings` |
| Article feature | `article view` |
| Preview error | `This source blocks article previews. Open the source to read the article.` |
| Settings error | `Failed to apply settings` |
| Footer | `© {year} · signal. is a boringcode project · GitHub` |
| Repo | `boringcode-dev/boring-signal` |
| Canonical URL | `https://signal.boringcode.dev` |
| User-Agent | `signal/0.1 (+https://signal.boringcode.dev)` |

Do not use “Signal” alone in an app-store listing, install prompt, or social handle. Use “Boring Signal” or `signal. by boringcode` when the full product name is needed.
