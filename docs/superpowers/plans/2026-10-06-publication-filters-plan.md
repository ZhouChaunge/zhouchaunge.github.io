# Implementation plan

1. Merge current bibliography data into one publications array; add stable ids, research topics and two descriptive tags to each existing record.
2. Generate accessible filter controls and a single static article list. Validate topic references and ids during the build.
3. Add browser filtering and the future expansion threshold while preserving existing navigation, keyboard focus, no-JavaScript reading and direct article links.
4. Style small rounded topic controls and muted keyword tags using the existing typography and palette. Let mobile controls wrap naturally and print all records.
5. Document how future entries inherit filtering and expansion. Adapt the local CV authoring helper to the canonical data shape without changing the existing PDF.
6. Run interaction tests and build checks; verify desktop and mobile behavior in the actual browser. Review the diff, publish and verify the live page.

The root agent owns data, static generation, styles, integration and deployment. A delegated agent owns browser interaction code and focused tests. Final review runs against the integrated result.
