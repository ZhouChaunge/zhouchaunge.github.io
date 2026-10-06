# Collaboration map sources

The map shows selected **coauthor affiliations**, not formal partnerships between institutions. Locations are approximate city centers, not street addresses. A paper link is required for every named collaborator.

## Basemap

- Natural Earth, `ne_110m_land`, 1:110 million land polygons.
- Downloaded 6 October 2026 from the [Natural Earth vector repository](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson), [raw GeoJSON](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson).
- The unmodified source is stored in `assets/map/ne_110m_land.geojson`. The build projects its actual polygon coordinates to a small equirectangular SVG, rounds output coordinates to a tenth of an SVG unit, and clips the visible latitude range to 85°N–68°S. No geographic runtime or network request is required in the browser.
- Natural Earth data is [public domain](https://www.naturalearthdata.com/about/terms-of-use/). The website includes a short credit.
- Curves indicate coauthorship connections schematically; they are not physical routes or distances.

## Coauthor affiliation evidence

- Singapore — National University of Singapore, Junfeng Fang: the author blocks of [PhysGuard](https://arxiv.org/html/2606.16602) and [TRACE](https://arxiv.org/html/2609.02991v2).
- Oslo, Norway — Norwegian Geotechnical Institute, Hans Petter Jostad: [TRACE, first page](https://arxiv.org/pdf/2609.02991v2), with city corroborated by [NGI contact information](https://www.ngi.no/om-ngi/kontakt-oss/kontakt-oss/).
- Bologna, Italy — University of Bologna, Alessio Mentani: [Stochastic Polynomial Surrogate Models, author information](https://link.springer.com/article/10.1007/s10706-026-03824-0#author-information).
- Hefei, China — iFLYTEK, Peng Wu: [PhysGuard author block](https://arxiv.org/html/2606.16602), with city corroborated by [iFLYTEK contact information](https://www.iflytek.com/en/about-us/contact-us.html).
- Beijing, China — Tsinghua University, Anchen Ni and Facheng Wang: the [author-uploaded guided-wave manuscript](https://ssrn.com/abstract=6694622); [publisher author profile for Facheng Wang](https://www.sciencedirect.com/author/56970028500/facheng-wang) corroborates Tsinghua in Beijing.
- Shanghai, China — Shanghai Jiao Tong University, Guanlin Ye: the [official faculty profile](https://oce.sjtu.edu.cn/teachers/5719.html), together with the coauthor records for `shanghai-model` and `constitutive-identification` in the site's verified publication data. The marker uses the approximate city center (31.2304°N, 121.4737°E).
- Melbourne, Australia — current base, The University of Melbourne. [TRACE, first page](https://arxiv.org/pdf/2609.02991v2) assigns Changjian Zhou, Negin Yousefpour, Jie Qi and Guillermo A. Narsilio to Melbourne. In particular, Jie Qi is not assigned to Singapore.

Affiliations describe the selected papers and need not be each author's present employment. The content data determines which of these verified places are displayed.

## Renderer contract

`renderCollaborationMap(collaborations, publications)` from `lib/collaboration-map.mjs` returns an SVG map, native city-selection buttons, and readable detail cards.

- `collaborations.home`: `{ id, city, country, longitude, latitude, institution }`.
- `collaborations.locations`: `[{ id, city, country, longitude, latitude, institutions: [{ name, url?, collaborators: [{ name, paperIds: [] }] }] }]`.
- `publications`: the existing paper records, with `id` and `title`; paper ids omit the `pub-` anchor prefix.
- Location ids must be distinct lowercase slugs. Referenced paper ids must exist. Institution URLs, if supplied, must use HTTPS.
- An optional location `labelOffset: [x, y]` moves its number label by finite SVG units, while preserving the marker's geographic coordinates. Negative horizontal offsets right-align the label, positive offsets left-align it, and zero centers it. This separates nearby labels in eastern China.
- Load `collaboration-map.css` and `collaboration-map.js` once. Without JavaScript every affiliation and paper link remains visible; the map and markers remain readable. Print also reveals every detail card, even if one city is selected on screen.
