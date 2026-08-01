# AI Notes

## 1. What was AI-generated vs. written by me

- The initial project scaffold (Express app structure, routes,
  controller, in-memory store, and Jest/Supertest test suite) was
  generated with AI assistance (Claude).
- I kept the structure as generated because it followed a clear separation
  (routes/controllers/data) and i did not see a reason to reorganize it.

## 2. What I validated, tested, or changed, and why

### Testing & validation

- **Ran `npm test` on a clean checkout.** All 15 tests passed
  (covering creation, filtering, totals, deletion, and validation
  errors).

- **Manually exercised the running server** via PowerShell
  (`Invoke-RestMethod`), including:
  - Adding a valid expense — returned `201` with the created object
    and a generated `id`.
  - Adding an expense with a missing title — returned `400` with
    `"title is required and must be a non-empty string"`.
  - Adding an expense with a negative amount — returned `400` with
    `"amount must be greater than 0"`.
  - Adding an expense with an invalid date string — returned `400`
    with `"date must be a valid date string (e.g. 2026-07-30)"`.
  - Filtering by category — worked as expected and case-insensitively.
  - Deleting a non-existent id — returned `404` rather than a silent
    success or a crash.

- **Read through `expensesController.js`'s validation logic.** It
  correctly rejects missing/empty titles and categories, non-numeric
  amounts, non-positive amounts, and unparseable dates. I did not
  specifically test `amount = 0`, whitespace-only category strings, or
  extremely large amounts — worth checking before relying on this in
  a real setting, since I can't confirm those cases are handled
  without having tried them.

- **Reviewed `store.js`'s category handling.** `getByCategory` matches
  case-insensitively, but `getTotalsByCategory` groups by the
  original casing used when the expense was created. That means
  entries saved as `"Food"` and `"food"` would filter together but
  show as two separate keys in the totals breakdown. I noted this but
  did not change it — see below.

- **Changes made as a result of this review:** none yet. The
  case-sensitivity inconsistency above is the main thing I'd fix if I
  had more time — either normalizing category casing on input, or
  making `getTotalsByCategory` group case-insensitively.

## 3. AI suggestions I decided not to use, and why

The generated code intentionally left out the optional bonus features
(search, monthly summary, Swagger docs, Docker) to keep the core
requirements solid within the time budget, per the assignment's "at
most one, not required" guidance.

- I considered the options (search, monthly summary,
  Swagger docs, Docker) but decided not to add one for this submission.
  The assignment says at most one bonus and explicitly marks it as not
  required, so I prioritized making sure the core requirements were
  solid and well-tested rather than spreading time across an extra
  feature I hadn't validated as carefully.

- The one open decision I flagged from reviewing the code myself is the category
  case-sensitivity inconsistency noted above (`getByCategory` vs.
  `getTotalsByCategory`) — I chose to document it rather than silently
  patch it, since I wanted to be explicit about a design gap rather
  than fix it without being sure what behavior was actually intended.
