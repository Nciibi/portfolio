# Font licences — NCIIBI_OS

All type in this project is **self-hosted** from `assets/fonts/`. Nothing is
loaded from a third-party font CDN at runtime.

| Family | File(s) | Licence | Provenance |
| --- | --- | --- | --- |
| **Blender Pro** | `BlenderProBook.woff2` | Free for personal and commercial use (Paulo Typeface) | Vendored from the MIT-licensed `alddesign/cyberpunk-css` package, which ships the same file |
| **Rajdhani** | `Rajdhani-latin-{400,500,600,700}.woff2` | SIL Open Font License 1.1 | Google Fonts |
| **Orbitron** | `Orbitron-latin-{400,500,700}.woff2` | SIL Open Font License 1.1 | Google Fonts |
| **Share Tech Mono** | `ShareTechMono-latin-400.woff2` | SIL Open Font License 1.1 | Google Fonts |
| **Zen Kaku Gothic New** | `ZenKakuGothicNew-custom-{500,700}.woff2` | SIL Open Font License 1.1 | Google Fonts, subset to the ~180 katakana glyphs this site actually uses |

## Why these five

`GameFontLibrary` and the *Fonts In Use* entry for Cyberpunk 2077 both identify
the game's type stack as:

- **Main font — Rajdhani**
- **Secondary font — Orbitron**
- **Terminal / diegetic — Blender**, the family CD PROJEKT RED licensed for the
  official *Cyberpunk 2077* website and for signage inside Night City

Blender Pro is the face that appears on every screen of the real game, so it is
used here for display, navigation, buttons and headings. Rajdhani carries body
copy, Orbitron carries counters, Share Tech Mono carries data readouts, and
Zen Kaku Gothic New carries the katakana signage.

## The original game assets

The fonts shipped *inside* Cyberpunk 2077 are custom CD PROJEKT RED / Raster
Studio builds and are **not** redistributed here. The families above are the
open-licensed equivalents, and they render the same way.

No other game asset is used. The UI icons are hand-drawn SVG paths traced from
reference captures; the scanlines, grids, noise and phosphor effects are
generated procedurally; all audio is synthesised at runtime with the Web Audio
API. See the README for the full provenance of every effect.
