# Publication preview sources

These images are original figures from the researcher's papers or their official code repositories. They were downloaded unchanged on 6 October 2026 for this author's academic homepage. CSS displays the complete image with `object-fit: contain`; no result, label or plot has been generated or altered.

| Local asset | Original source | Content |
| --- | --- | --- |
| `assets/publications/physguard-method.png` | [PhysGuard, `figures/method.png`, commit 608ded67](https://github.com/ZhouChaunge/PhysGuard/blob/608ded67e1759a3efc807536321fb8310ed89a7d/figures/method.png) | PhysGuard method diagram: Fisher subspace estimation and gradient projection. |
| `assets/publications/trace-memory.png` | [TRACE, arXiv:2609.02991v1, Figure 3](https://arxiv.org/html/2609.02991v1#S2.F3) ([original image](https://arxiv.org/html/2609.02991v1/figures/003-edge-memory-access-mechanism.png)) | Contact-edge memory matrix, identity dictionary, and memory retrieval across time steps. |
| `assets/publications/structureclaw-overview.png` | [StructureClaw, arXiv:2607.14896v1, Figure 1](https://arxiv.org/html/2607.14896v1#S1.F1) ([original image](https://arxiv.org/html/2607.14896v1/teaser.png)) | Structural-engineering request and the skills, tools, and artifacts preserved by StructureClaw. |

The PhysGuard figures are covered by the repository's MIT license; its full copyright and permission notice is retained at `assets/publications/PhysGuard-LICENSE.txt`. The other two figures are used as previews of the user's coauthored papers and retain the authors' original rights; arXiv hosting is not a blanket license for third-party reuse.

## Add or replace media

Put media in `assets/publications/`, then set a publication's `media` property in `content.js`:

```js
media: {
  type: 'image',
  src: './assets/publications/example.png',
  alt: 'A concise description of the actual figure',
  caption: 'Optional short caption'
}
```

For videos, use `type: 'video'` and an `.mp4`, `.webm` or `.ogv` source. An optional `poster` uses a local image; `alt` describes the demo. Videos use native controls and load on demand, with no autoplay. If the video contains speech, set `hasSpokenAudio: true` and add a WebVTT captions track:

```js
captions: {
  src: './assets/publications/example-en.vtt',
  srclang: 'en',
  label: 'English'
}
```

The build rejects unsupported types, remote media URLs, directory traversal, and missing alternative text. Cache versions are generated from each asset's content. An entry without media shows a neutral, explicitly labelled Paper link, not a simulated research figure. `shortTitle` can customize this fallback label. Record new image or video provenance here.
