# K&I WealthTech Navigator — Frontend Assignment

Responsive React + TypeScript interface for discovering fictional Loan Against Securities (LAS) opportunities. Users enter a requirement, browse matching lenders, inspect details, compare 2–3 offers, and run an eligibility check with a clear next action.

- **Live Demo**: [https://k-i-wealth-assignment.vercel.app](https://k-i-wealth-assignment.vercel.app)
- **GitHub Repository**: [https://github.com/sunnywinsler/k-I-Wealth-Assignment](https://github.com/sunnywinsler/k-I-Wealth-Assignment)

This dataset is fictional and must not be treated as real financial advice or live provider terms.

## Setup

```bash
cd SunnyKumar_Frontend_Assignment
npm install
```

## Run

```bash
npm run dev
```

Open the URL printed by Vite (typically `http://localhost:5173`).

```bash
npm run build      # production build
npm run preview    # serve the production build
npm run lint       # Oxlint
```

## Tests

```bash
npm test
```

Vitest + Testing Library cover:

- Eligibility outcomes: eligible, conditional (risk / top-of-range), not eligible (amount and tenure)
- Search, amount/tenure/risk filters, and sort helpers
- Requirement form validation
- Comparison selection cap (max 3) and the “need at least 2” guard

## Architecture

```
src/
  api/            Mock API matching API_CONTRACT.md (latency + simulated failure)
  data/           Normalised opportunity dataset from opportunities.csv
  utils/          Pure filter, sort, and eligibility logic
  hooks/          Async loaders for listing, detail, compare, eligibility
  context/        Journey state: screen, requirement, filters, compare tray
  components/     Requirement form, listing, cards, comparison, detail, eligibility
  types/          Shared TypeScript contracts
tests/            Unit and UI behaviour tests
```

Presentation components call hooks; hooks call `src/api`; API uses pure utilities against the in-memory dataset. UI journey state lives in `AppContext`.

## API / mock approach

There is no live backend. `src/api/index.ts` implements:

| Contract | Mock |
|---|---|
| `GET /api/opportunities` | `getOpportunities` — amount, tenure, risk, search, sort, page, limit |
| `GET /api/opportunities/{id}` | `getOpportunityById` |
| `POST /api/eligibility/check` | `postEligibilityCheck` |
| `POST /api/compare` | `postCompare` |

Calls wait ~600 ms in development so loading and skeleton states are visible. In tests, latency is 0. Use **Test Error State** on the listing screen to force the next call to fail and exercise retry.

Eligibility rules (client-side, documented for the mock):

- **Not eligible** if amount is outside min/max or tenure is outside the product window
- **Conditional** if amount is in the top 10% of the range, or the user’s risk preference is lower than the product risk profile
- **Eligible** otherwise

## User journey

1. Enter amount, tenure, risk preference, and pledged collateral type
2. Browse matching opportunities; search, filter by risk, and sort
3. Open details or add 2–3 cards to comparison
4. Run eligibility (inputs can be adjusted in the modal)
5. Follow the CTA: apply, upload documents, or adjust/explore other lenders

## Assumptions

- Collateral type is captured and sent to eligibility, but the CSV has no per-security LTV table, so listing is not filtered by security type.
- User risk preference is used in eligibility. Listing risk chips filter by the *product* risk profile, not by the form preference (so users can still inspect higher-risk offers).
- Pagination is implemented in the mock (`page`, `limit`) but the 12-row dataset is shown in one page.
- “Apply” is a demonstration confirmation only; nothing is persisted.
- Comparison on viewports ≤768px uses stacked cards instead of a wide table.

## Edge cases implemented

| Case | Where it appears |
|---|---|
| No matching opportunities | Listing empty state + Reset Filters |
| API/network failure with retry | Listing, comparison, detail, eligibility |
| Invalid / incomplete input | Requirement form validation banner |
| Amount above maximum | Eligibility **Not Eligible** + reasons |
| Tenure outside range | Eligibility **Not Eligible** + reasons |
| Conditional eligibility | Eligibility **Conditional** + documentation CTA |
| Comparison limit reached | Selecting a 4th card; notice on listing |
| Long provider/product names | `overflow-wrap` on card and comparison titles |
| Loading / skeleton | Listing skeleton cards; modal/compare spinners |

## Screenshots

Optional. Capture from `npm run dev` if submitting `screenshots/`.
