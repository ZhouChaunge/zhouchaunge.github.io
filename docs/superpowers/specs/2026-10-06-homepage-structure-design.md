# Homepage structure, publication media, and collaborations

The user has specified the new page order and authorized these edits in the current conversation. Keep the existing quiet single-page layout, personal sidebar, and Nunito typography.

## Page order

1. About Me: retain the research introduction; remove the repeated education paragraph because the next section provides this detail.
2. Education & Experience: combined chronology with Education, Research, and Industry pills. Include the user's iFLYTEK experience after checking their LinkedIn / ResearchGate information. Dates and roles must be sourced, never inferred from gaps.
3. Research Interests: retain the existing four interests.
4. Publications: retain the unified chronological list, direction filters, keyword tags, and explicit Preprint statuses. Introduce a left preview for an image or native video. Use actual project assets where available; otherwise use a clearly labelled typographic paper link, never a fabricated research figure. Preserve research software in an expandable subsection.
5. Selected Honors: separate section using the current verified awards.
6. Collaboration Map: compact geographic view of selected coauthors' institutions, based on paper affiliations. Each location exposes names and links to related publications. This represents coauthorship, not institutional partnerships. Keep contact information in the sidebar and a short closing invitation.

## Portrait and media

Use the user-provided headshot.jpg directly. Following the user's preview feedback, retain the complete 4:3 rectangular photograph with softly rounded corners; do not enlarge or crop the face. Cache-version local assets. Paper images use descriptive alternative text. Videos use native controls, no autoplay, preload none, optional poster and captions. Phone layouts place the preview above the paper body without horizontal scrolling.

The user directly confirmed that both iFLYTEK and Tsinghua were full-time employment; these labels supersede LinkedIn's employment labels. The user also requested removal of Industrial Securities from the homepage.

## Map

Use a bundled public-domain world outline and source-backed location records, with no map API, analytics, tracking, or runtime external dependencies. The map, location buttons, and details must work for keyboard and touch users. Without JavaScript all location information remains visible. Clicking an associated publication must continue to reveal that paper even when filtered.

## Validation

Build the complete static HTML; verify all six sections, unique IDs, referenced local assets, and valid paper links. Run the existing publication interaction tests plus focused new media/map checks. Inspect desktop and mobile, portrait crop, filter behavior, and map selection. Publish to the existing GitHub Pages site, verify deployment and live UI, then save proof screenshots.
