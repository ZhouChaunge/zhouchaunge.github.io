# Publication preview sources

These images are original figures from the researcher's papers or their official code repositories. They were downloaded unchanged on 6 October 2026 for this author's academic homepage. CSS displays the complete image with `object-fit: contain`; no result, label or plot has been generated or altered.

| Local asset | Original source | Content |
| --- | --- | --- |
| `assets/publications/physguard-method.png` | [PhysGuard, `figures/method.png`, commit 608ded67](https://github.com/ZhouChaunge/PhysGuard/blob/608ded67e1759a3efc807536321fb8310ed89a7d/figures/method.png) | PhysGuard method diagram: Fisher subspace estimation and gradient projection. |
| `assets/publications/trace-memory.png` | [TRACE, arXiv:2609.02991v1, Figure 3](https://arxiv.org/html/2609.02991v1#S2.F3) ([original image](https://arxiv.org/html/2609.02991v1/figures/003-edge-memory-access-mechanism.png)) | Contact-edge memory matrix, identity dictionary, and memory retrieval across time steps. |
| `assets/publications/structureclaw-overview.png` | [StructureClaw, arXiv:2607.14896v1, Figure 1](https://arxiv.org/html/2607.14896v1#S1.F1) ([original image](https://arxiv.org/html/2607.14896v1/teaser.png)) | Structural-engineering request and the skills, tools, and artifacts preserved by StructureClaw. |

The PhysGuard figures are covered by the repository's MIT license; its full copyright and permission notice is retained at `assets/publications/PhysGuard-LICENSE.txt`. The other two figures are used as previews of the user's coauthored papers and retain the authors' original rights; arXiv hosting is not a blanket license for third-party reuse.

## Add or replace media

### TRACE video

On 7 October 2026, the author supplied `x_trace_k500_mu0.4_a25a30_story.mp4` for the homepage. `assets/publications/trace-demo.mp4` is a web-optimized copy: 34.96 seconds, 1920 × 1080, 25 fps, H.264/yuv420p, with fast-start metadata. It preserves all 874 frames and the full timeline, reducing the file from 43,471,436 to 15,088,430 bytes. The source has no audio stream. `assets/publications/trace-demo-poster.jpg` is a 1280 × 720 frame extracted at 26 seconds, showing sand and rigid 30-degree slopes side by side. The video demonstrates TRACE-3D quadruped locomotion on sand and rigid slopes; no scene or result was generated or modified. The original source file remains unchanged.

### Media configuration

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
