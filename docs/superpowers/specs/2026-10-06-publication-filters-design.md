# Publication browsing

The user approved this design on 6 October 2026. The existing single-page sidebar layout and Nunito typography remain the visual foundation.

## Reading experience

- Use one publication list, ordered by descending year. Within a year preserve the explicit order in the profile data.
- Show preprint status beside the venue in the individual record. Do not create a separate Preprints section.
- Offer three filter buttons: All, Physical AI, and Engineering & Mechanics. Counts are derived from the records.
- Physical AI contains PhysGuard and TRACE. The other five current records belong to Engineering & Mechanics.
- Every record may have several research topics, but is rendered only once. Each record also has one or two descriptive, non-interactive keyword tags.
- Filtering updates the existing list without navigating away or forcing a page scroll. The pressed button and result count identify the current selection.
- All seven current records are visible by default. When a selected set reaches twelve records, initially show eight and offer Show all. After expansion offer Show fewer. Smaller sets remain fully visible.
- Use natural page scrolling on both desktop and mobile. No nested scroll area or compact-view toggle is included in this version.

## Implementation boundaries

- `content.js` holds one canonical publications array with unique ids, topics, tags, venue/status, and existing author/resource information.
- `build.mjs` creates complete static HTML including every record. Controls start hidden and become available only after the JavaScript interaction initializes.
- `app.js` adds filtering, result counts and optional expansion; standard buttons preserve keyboard focus and expose pressed state.
- A direct `#pub-...` link reveals its target even if a filter or collapsed view would otherwise hide it.
- Printing includes the entire bibliography. Without JavaScript the entire list remains readable.
- No new bibliography facts, papers, CV content, or publication-status claims are introduced.

## Validation

Check all/physical-AI/engineering counts (7/2/5), mixed publication status, keyword tags, keyboard activation and focus, mobile wrapping, no-JavaScript output, and print rules. Exercise the future twelve-record threshold, expansion, collapse and multi-topic behavior with test fixtures. Confirm GitHub Pages publishes the reviewed commit and loads the new versioned assets.
