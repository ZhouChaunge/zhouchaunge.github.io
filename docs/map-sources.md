# Collaboration map sources

The Research Collaborations map shows selected **coauthor affiliations**, not formal partnerships between institutions. Its public detail cards display cities, institutions and deduplicated paper links; collaborator names and author-role labels are omitted. Locations are approximate city centers, not street addresses. Every collaborator in the underlying data must have a paper link. Names, roles and evidence are retained below for maintenance and validation. Audit date: 6 October 2026.

## Selection and evidence policy

- When Changjian Zhou is a first author, include every other author.
- Otherwise, include the first author(s), including explicitly marked equal first authors, and every explicitly identified corresponding author. Deduplicate people and paper associations.
- Do not infer correspondence from author order, seniority, supervision, email domain, or a bibliographic database's unverified flag.
- Prefer the author block and footnotes of the paper itself. Preserve multiple affiliations when the paper assigns them. Where the paper omits affiliations or is inaccessible, identify the official-profile fallback and its limitation below.
- An empty `correspondingAuthors` array for a first-authored paper means no corresponding author has been verified for display; it does not prove the paper has none. This does not affect selection of all other authors.
- KAN-GSA is excluded at the owner's request. Metadata for similarly named researchers must not be merged into this author's record.

The seven audited papers select 18 distinct collaborators and 26 distinct person–paper associations. A dual affiliation can display one association at two institutions without counting it twice. The locations are Melbourne, Singapore, Oslo, Hefei, Shanghai, Beijing and Chengdu. Bologna is excluded under the requested author-role rule: Alessio Mentani is neither the first nor the corresponding author of `anchor-uncertainty`.

## Basemap

- Natural Earth, `ne_110m_land`, 1:110 million land polygons.
- Downloaded 6 October 2026 from the [Natural Earth vector repository](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson), [raw GeoJSON](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson).
- The unmodified source is stored in `assets/map/ne_110m_land.geojson`. The build projects its actual polygon coordinates to a small equirectangular SVG, rounds output coordinates to a tenth of an SVG unit, and clips the visible latitude range to 85°N–68°S. No geographic runtime or network request is required in the browser.
- Natural Earth data is [public domain](https://www.naturalearthdata.com/about/terms-of-use/). The website includes a short credit.
- Curves indicate coauthorship connections schematically; they are not physical routes or distances.

## Paper-by-paper audit

### `physguard`

**Source:** [arXiv 2606.16602, PDF page 1](https://arxiv.org/pdf/2606.16602), independently checked as text and rendered image; [HTML author block](https://arxiv.org/html/2606.16602).

Author order: Changjian Zhou, Junfeng Fang, Negin Yousefpour, Peng Wu, Bin Yan, Guillermo A. Narsilio. Changjian is first, so all five other authors are selected. No equal-contribution or correspondence marker was found on the inspected first page; none is inferred.

| Selected author(s) | Paper affiliation | City |
| --- | --- | --- |
| Junfeng Fang | School of Computing, National University of Singapore | Singapore |
| Negin Yousefpour; Bin Yan; Guillermo A. Narsilio | Faculty of Engineering and IT, University of Melbourne | Melbourne |
| Peng Wu | Artificial Intelligence Research Institute, IFLYTEK Co., Ltd. | Hefei |

Hefei is an institution-location inference supported by [iFLYTEK's official contact address](https://www.iflytek.com/en/about-us/contact-us.html); the paper identifies the company but does not print a city. Bin Yan's affiliation for this paper is Melbourne, regardless of his affiliations on other papers.

### `trace`

**Source:** [arXiv 2609.02991v2, PDF page 1](https://arxiv.org/pdf/2609.02991v2), latest checked version dated 26 September 2026; [HTML](https://arxiv.org/html/2609.02991v2).

Author order: Changjian Zhou, Negin Yousefpour, Jie Qi, Junfeng Fang, Guillermo A. Narsilio, Hans Petter Jostad. All five other authors are selected. The double-dagger footnote explicitly identifies Changjian Zhou and Negin Yousefpour as corresponding authors. It is not an equal-first-author marker.

| Selected author(s) | Paper affiliation | City |
| --- | --- | --- |
| Negin Yousefpour; Jie Qi; Guillermo A. Narsilio | Faculty of Engineering and Information Technology, The University of Melbourne, Victoria 3010 | Melbourne |
| Junfeng Fang | School of Computing, National University of Singapore, Singapore 117417 | Singapore |
| Hans Petter Jostad | Norwegian Geotechnical Institute, Oslo 0855 | Oslo |

Jie Qi belongs to the Melbourne group in this paper. Oslo is also confirmed by [NGI's contact page](https://www.ngi.no/om-ngi/kontakt-oss/kontakt-oss/).

### `shanghai-model`

**Source:** [SSRN 5179194](https://ssrn.com/abstract=5179194), author-uploaded manuscript, PDF page 1. Downloaded through the normal browser; superscripts, institution block and correspondence footnote were checked visually as well as by text extraction.

Author order and affiliation letters: Changjian Zhou (a), Bin Yan (a,d), Weidong Wang (b,c), Zhonghua Xu (b,c), Wenxuan Zhu (a), Guanlin Ye (a). All five other authors are selected. The footnote explicitly names Zhonghua Xu and Bin Yan as co-corresponding authors; no shared-first-author statement was found.

| Letter | Institution/unit in the manuscript | City |
| --- | --- | --- |
| a | Department of Civil Engineering, School of Ocean and Civil Engineering, Shanghai Jiao Tong University | Shanghai, China 200240 |
| b | Shanghai Underground Space Engineering Design & Research Institute, East China Architecture Design & Research Institute Co., Ltd | Shanghai, China 200002 |
| c | Shanghai Engineering Research Center of Safety Control for Facilities Adjacent to Deep Excavations | Shanghai, China 200002 |
| d | Department of Infrastructure Engineering, Faculty of Engineering and Information Technology, The University of Melbourne | Melbourne, Australia, Victoria 3010 |

The map preserves both Shanghai institutions b and c for Weidong Wang and Zhonghua Xu, and both Shanghai and Melbourne affiliations for Bin Yan. Current employer biographies are not substituted for this paper's author block.

### `constitutive-identification`

**Source:** [Computers and Geotechnics, DOI 10.1016/j.compgeo.2024.106268](https://www.sciencedirect.com/science/article/pii/S0266352X24002040), volume 170, June 2024. Publisher PII: `S0266352X24002040`.

Author order is confirmed by publisher metadata and the publisher-deposited [Crossref record](https://api.crossref.org/works/10.1016/j.compgeo.2024.106268): Changjian Zhou, Bin Gao, Bin Yan, Wenxuan Zhu, Guanlin Ye. All four other authors are therefore selected.

**Evidence limit:** the full paper and its author-affiliation/footnote block could not be retrieved during this audit. The publisher's public first-page endpoint did not return a PDF; Elsevier's article API returned bibliographic core data only. The [ResearchGate paper page](https://www.researchgate.net/publication/388411754_A_combined_machine_learningsearch_algorithm-based_method_for_the_identification_of_constitutive_parameters_from_laboratory_tests_and_in-situ_tests) has no public full text. No corresponding-author or equal-contribution claim is made. An empty correspondence list remains unverified, not a claim that there was no corresponding author.

Shanghai Jiao Tong University is supported at institution level by these primary sources; the exact department/laboratory strings printed in the 2024 paper remain unverified:

| Selected author | Official or primary affiliation corroboration |
| --- | --- |
| Bin Gao | [SJTU doctoral-defense announcement, 30 April 2024](https://naoce.sjtu.edu.cn/dabiangonggao/13629.html): civil-engineering doctoral student, supervised by Guanlin Ye; thesis concerns suction-bucket foundation response. The contemporaneous record supports the SJTU identification. |
| Bin Yan | [SJTU doctoral-defense announcement](https://naoce.sjtu.edu.cn/dabiangonggao/15752.html), alongside his directly verified SJTU affiliation in the `shanghai-model` manuscript. This corroborates the institution but does not prove the complete 2024 printed affiliation list. |
| Wenxuan Zhu | [SJTU journal author block](https://xuebao.sjtu.edu.cn/CN/abstract/abstract48461.shtml): manuscript received and accepted in 2024, published in 2026, explicitly assigns Zhu to SJTU; the `shanghai-model` manuscript independently agrees. |
| Guanlin Ye | [Official SJTU faculty profile](https://oce.sjtu.edu.cn/teachers/5719.html), and the same [SJTU journal author block](https://xuebao.sjtu.edu.cn/CN/abstract/abstract48461.shtml). |

Bibliographic aggregators were used only to look for an openly available manuscript. Their correspondence flags, author identifiers and granular affiliation strings are not treated as primary verification. In particular, a person's affiliation from a later paper is not added as another 2024 affiliation.

### `anchor-uncertainty`

**Source:** [Springer Nature article, author information and corresponding-author section](https://link.springer.com/article/10.1007/s10706-026-03824-0#author-information).

Author order: Negin Yousefpour, Bo Wang, Changjian Zhou, Alessio Mentani. The publisher explicitly identifies Negin Yousefpour as corresponding author. She is also first author, so **only Negin Yousefpour** is selected under the requested rule. Her affiliation is the Department of Infrastructure Engineering, The University of Melbourne, Parkville, Victoria 3010, Australia. Bo Wang and Alessio Mentani remain in the publication author list but do not create map entries for this paper.

### `structureclaw`

**Role source:** [arXiv 2607.14896v2, PDF page 1](https://arxiv.org/pdf/2607.14896v2), visually inspected. The dagger marks Sizhong Qin and Yi Gu as equal contributors. The asterisk marks Wenjie Liao and Xinzheng Lu as corresponding authors. Changjian Zhou is a coauthor, so the selected set is **Sizhong Qin, Yi Gu, Wenjie Liao, Xinzheng Lu**.

**Affiliation limit:** the inspected 21-page manuscript has no institution block. Institution-level locations below use primary author/laboratory/university pages, not publication-time superscripts:

| Selected author | Institution and city | Primary corroboration |
| --- | --- | --- |
| Sizhong Qin | Tsinghua University, Beijing | [Author's homepage](https://qinsizhong.com/). His Berkeley visit ended in February 2026; it is not added as a current second node. |
| Yi Gu | Tsinghua University, Beijing | [Research group's publication page](https://www.luxinzheng.net/AI-Papers/2025-Gu-CII.htm). This is an institution-level fallback, not the StructureClaw affiliation block. |
| Wenjie Liao | Southwest Jiaotong University, Chengdu | [Official faculty profile](https://faculty.swjtu.edu.cn/liaowj/en/index.htm). |
| Xinzheng Lu | Tsinghua University, Beijing | [Official faculty profile](https://www.civil.tsinghua.edu.cn/ceen/info/1063/1221.htm). |

### `guided-waves`

**Source:** [Author-uploaded manuscript, SSRN 6694622](https://ssrn.com/abstract=6694622), PDF page 1, visually inspected; published-paper identifier [DOI 10.1016/j.oceaneng.2026.126622](https://doi.org/10.1016/j.oceaneng.2026.126622).

Author order: Anchen Ni, Wenbin Wei, Tao Zhuge, Changjian Zhou, Facheng Wang. The sole first author is Anchen Ni (a,b); the sole asterisk-marked corresponding author is Facheng Wang (a,b,*). No equal-contribution marker appears. **Anchen Ni and Facheng Wang** are selected.

Both selected authors have two Tsinghua units: (a) School of Civil Engineering; (b) Institute for Ocean Engineering. Both are in Beijing 100084, China. The map groups these units into one Tsinghua University institution, while retaining the two-unit evidence here.

## Location conventions and remaining limits

Affiliations describe the selected paper where its block is available, and may differ from present employment. Profile-based fallback applies to `structureclaw` and the institution-level mapping of `constitutive-identification`, as detailed above. A future available original author block should supersede those fallbacks.

| City | Approximate latitude | Approximate longitude |
| --- | ---: | ---: |
| Melbourne | -37.8136 | 144.9631 |
| Singapore | 1.3521 | 103.8198 |
| Oslo | 59.9139 | 10.7522 |
| Hefei | 31.8206 | 117.2272 |
| Shanghai | 31.2304 | 121.4737 |
| Beijing | 39.9042 | 116.4074 |
| Chengdu | 30.5728 | 104.0668 |

Raw PDFs, rendering screenshots and failed retrieval responses are audit material outside the website repository in the workspace's `collaboration-audit/` directory. They are not published as site assets. Accessible original-paper links above remain the public evidence trail.

## Renderer contract

`prepareCollaborationMap(data, publications, ownerName)` from `lib/collaboration-selection.mjs` applies the author-role rule before rendering, deduplicates associations and rejects missing required collaborators. `renderCollaborationMap(collaborations, publications)` from `lib/collaboration-map.mjs` returns an SVG map, native city-selection buttons, and readable detail cards.

- `collaborations.home`: `{ id, city, country, longitude, latitude, institution, institutions }`; its institution list includes collaborators based in the home city.
- `collaborations.locations`: `[{ id, city, country, longitude, latitude, institutions: [{ name, url?, collaborators: [{ name, paperIds: [] }] }] }]`.
- Each publication supplies `id`, `title`, its full `authors` string, and `authorship: { firstAuthors: [], correspondingAuthors: [] }`. Paper ids omit the `pub-` anchor prefix. Prepared collaborator records use `papers: [{ id, roles }]`.
- Location ids must be distinct lowercase slugs. Referenced paper ids must exist. Institution URLs, if supplied, must use HTTPS.
- An optional location `labelOffset: [x, y]` moves its number label by finite SVG units, while preserving the marker's geographic coordinates. Negative horizontal offsets right-align the label, positive offsets left-align it, and zero centers it. This separates nearby labels in eastern China.
- The renderer uses prepared collaborator records to collect unique papers per institution, but never includes their names or roles in the map HTML. The publication bibliography remains unchanged.
- Load `collaboration-map.css` and `collaboration-map.js` once. Without JavaScript every institution and paper link remains visible; the map and markers remain readable. Print also reveals every detail card, even if one city is selected on screen.
