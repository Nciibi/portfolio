# NCIIBI_OS 5.1

> A Cyberpunk 2077 / Edgerunners-inspired portfolio interface, built as a
> fictional operating-system menu. Zero build step — plain HTML, CSS and
> JavaScript.

Source: **github.com/Nciibi/portfolio**

---

## The design system

The interface is built on the **Neomilitarism** style — the sub-language CD
PROJEKT RED defined in the Cyberpunk 2077 UI Art Bible and used for the
in-game HUD and menus. The palette and the geometry were measured directly
out of the game rather than approximated.

The rule that governs everything:

> **Red is the default state. Cyan is what is selected. Yellow is what is
> valuable. Green is what is alive. Magenta is what is wrong.**

Nothing is filled with yellow except the single primary action on a screen.
Nothing is filled with red except the one selected list row.

### Colour

Sampled from the game itself, not eyeballed:

| Role | Value | Where it appears |
| --- | --- | --- |
| Chrome | `#ff5c54` | Rules, borders, labels, metadata, body copy |
| Selection | `#00f0ff` | Active nav row, active perk, focus rings, section headers |
| Value | `#ffef02` | The wordmark, counters, tier tags, the primary button |
| Status | `#1bd676` | Street cred, online, success, resolved perk trees |
| Breach | `#deff5e` + `#1bd676` | The netrunner terminal's olive/emerald sub-language |
| Fault | `#ff0044` | Glitch, errors, critical only |
| Void | `#000000` | The surface everything sits on |

### Typography

`GameFontLibrary` and the *Fonts In Use* entry for Cyberpunk 2077 both
identify the game's stack as **Rajdhani (main)** and **Orbitron (secondary)**,
with **Blender** — the family CD PROJEKT RED licensed for the official site
and for Night City signage — carrying the display type.

| Role | Face | Weights |
| --- | --- | --- |
| Display / headings / nav / buttons | **Blender Pro** | 400 |
| Body copy | **Rajdhani** | 400–700 |
| Numerals / counters | **Orbitron** | 400–700 |
| Data / terminal / micro-tags | **Share Tech Mono** | 400 |
| Katakana signage | **Zen Kaku Gothic New** | 500, 700 |

All five are **self-hosted** from `assets/fonts/` — 177 KB total, no
third-party font CDN at runtime, and the Japanese subset to the ~180 glyphs
this site actually uses. See `assets/fonts/LICENCE.md`.

### Geometry

The shapes come from the game, and they are not 45° cuts:

| Shape | Used for | Built with |
| --- | --- | --- |
| **Skewed parallelogram** | nav rows, list rows | `polygon(0% 0%, 100% 0%, 100% 100%, 40% calc(100% - 9px), 0% 100%, 1% 62%)` |
| **Flat-top hexagon** | perk / attribute nodes | `polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)` |
| **Pointy-top hexagon** | level badge, tier markers | `polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)` |
| **Notched button** | every action | `polygon(0 0, 100% 0, 100% 100%, 95% 100%, 95% 90%, 80% 90%, 80% 100%, cut 100%, 0 calc(100% - cut))` |
| **Stepped heading rule** | under every title | `polygon(0 0, 85px 0, 90px 5px, 100% 5px, 100% 6px, 85px 6px, 80px 10px, 0 10px)` |
| **Machined razor edge** | between modules | the game's own 1920×40 SVG silhouette |
| **Chevron bullet** | list markers | `polygon(50% 0, 100% 50%, 20% 100%, 30% 50%)` |

### The border technique

A CSS `border` cannot follow a clipped edge — `clip-path` slices the border
away with everything else. The game builds its frames the other way round: a
second, larger clipped shape sits behind the first and the difference between
the two reads as a border that hugs the angled edges exactly.

Two implementations of that idea, both in `css/borders.css`:

```css
/* a solid border layer behind a punched-out face */
.cp-frame::before { clip-path: var(--clip); background: var(--accent); transform: translate(3px, 0); }
.cp-frame::after  { clip-path: var(--clip); background: var(--face); }

/* a 1px frame that follows the clip, via a two-layer background */
.cp-edge {
  border: 1px solid transparent;
  background:
    linear-gradient(var(--edge-face), var(--edge-face)) padding-box,
    linear-gradient(var(--edge-accent), var(--edge-accent)) border-box;
  clip-path: var(--clip);
}
```

### The box tree

The PERKS module is the game's **box tree**: dashed connector borders, stem
drops between cells, `RESOLVED` / `IN PROGRESS` / `NO ACCESS` watermarks, and
the perk nodes themselves as flat-top hexagons with circuit traces between
them.

---

## The visual engine

Five cooperating layers. Idle cost stays close to zero; the expensive paths
only run during a state change.

**1 · WebGL CRT overlay** — `js/crt.js`
A single fullscreen transparent canvas composites the physical artefacts of a
cathode-ray display: scanlines, aperture-grille phosphor triad, a rolling
refresh bar, animated film grain, edge vignette, mains flicker, and a *pulse*
channel the glitch engine drives during signal faults. Quality tiers
(`high` / `medium` / `low`) are chosen from core count, DPR and viewport area,
and the render resolution is capped by a pixel budget. If WebGL is
unavailable it falls back to a pure-CSS scanline layer.

**2 · SVG filter glitch** — `js/glitch.js`
A filter graph built in the DOM and attached to the menu stage:
`feTurbulence` → `feDisplacementMap` tears the live DOM;
`feColorMatrix` + `feOffset` + `feBlend(screen)` produce a **true RGB channel
split** of the rendered page, not a fake text-shadow. Displacement and channel
offsets are driven from JS every frame with *stepped* random values, so the
fault reads as discrete corruption frames rather than a smooth wobble. The
filter is attached only while a burst is active.

**3 · Canvas-2D datamosh** — `js/datamosh.js`
Horizontal band displacement, RGB channel separation, rectangular block
displacement and luminance pixel sorting — the artefacts of a damaged video
stream. The project-artwork transitions resolve out of a corrupted frame.

**4 · CSS keyframes** — `css/fx.css`
The game's own motion set: the seven-state **button tear** with lateral
shims, the heading skew with its rule tearing in sympathy, the **list-row
jitter** with per-`nth-child` durations so a column never pulses in unison,
the separator tear, the scan sweeps, the travelling link underline, the image
flicker, the blinking cursor, and the shard wipe between modules.

**5 · Procedural audio** — `js/cyber-audio.js`
Every sound is synthesised with Web Audio nodes — no audio files. Click,
hover, tab chirp, success arpeggio, keypress, a noise-burst signal fault, a
refusal tone, and an optional ambient drone bed.

`js/fx-core.js` owns the shared runtime: the animation ticker, the motion
preference, quality tiering, the persisted display settings, the text-scramble
decoder and the FLIP helper.

---

## The twelve modules

| # | Module | Route | What it is |
| --- | --- | --- | --- |
| 01 | PROFILE | `#profile` | Operative dossier, stats, bento, education |
| 02 | CHARACTER | `#character` | CP2077 character screen — attributes, vitals, status effects |
| 03 | PROJECTS | `#projects` | Master/detail case-file browser with datamosh transitions |
| 04 | PERKS | `#perks` | The box tree — four neural trees, hex nodes, circuit traces |
| 05 | WORK LOG | `#experience` | Career / involvement / honors |
| 06 | THE ROAD | `#journey` | Year-by-year timeline |
| 07 | GITHUB | `#github` | Live repository index, language bars, activity feed |
| 08 | CODEX | `#codex` | Certifications, awards, languages, practice |
| 09 | NETRUN | `#netrun` | A working terminal — type `help` |
| 10 | CONTACT | `#contact` | Dialogue options and a brief form |
| 11 | OPTIONS | `#options` | Display, audio, accessibility, build info |
| 12 | EXIT | `#exit` | Session termination screen |

Every module is deep-linkable (`#codex`) and reachable via `?goto=codex`.

---

## Accessibility

- Full ARIA `tablist` / `tabpanel` with roving `tabindex`
- Keyboard: `↑ ↓ ← →` navigate · `Home` / `End` jump · `Enter` select ·
  `Esc` back · `M` focus the menu
- Focus trap and focus restoration in the mobile drawer; `inert` on the stage
  while the drawer is open
- A `<noscript>` fallback that unfurls the module system into a plain document
- `prefers-reduced-motion` is honoured in **three** places: the CSS, the FX
  runtime, and the WebGL/canvas modules — the whole engine degrades to a
  static composition rather than merely slowing down
- Every display effect is toggleable from OPTIONS, and the CRT intensity is
  adjustable
- Skip link, live regions, and visible focus rings throughout

---

## Project layout

```
index.html              the shell and all twelve modules
css/
  fonts.css             the self-hosted @font-face stack
  tokens.css            design tokens — colour, type, motion, geometry
  base.css              reset, typography, focus, reveal primitive
  shell.css             topbar, nav rail, stage, panel chrome
  borders.css           the border system: clips, frames, nav row, buttons
  sections.css          the machined razor edges
  components.css        cards, chips, meters, tags, forms, hexagons
  panels.css            per-module layouts
  fx.css                the game's keyframe sets
js/
  icon-pack.js          inline SVG icon set + brand colours
  portfolio-data.js     ALL content — the single source of truth
  fx-core.js            ticker, motion preference, quality, settings, FLIP
  crt.js                WebGL CRT overlay
  glitch.js             SVG filter signal-fault engine
  datamosh.js           canvas-2D datamosh
  cyber-audio.js        procedural audio synthesiser
  main.js               router + renderers
  effects.js            HUD reticle, tilt, reveal, count-up, scan sweep
  github.js             live GitHub API with a baked offline snapshot
assets/
  fonts/                the five self-hosted families + LICENCE.md
  *.webp                imagery (no fallbacks needed)
```

### Script load order

`icon-pack → portfolio-data → fx-core → crt → glitch → datamosh → cyber-audio → main → effects → github`

All scripts are `defer`red, so they execute in document order. The cache-bust
query on every asset is the build version — bump it when you change a file.

---

## Editing content

Everything lives in `js/portfolio-data.js`. No build step, no templating.

```js
PORTFOLIO_DATA.profile     // identity, socials
PORTFOLIO_DATA.stats       // the four headline counters
PORTFOLIO_DATA.about       // the bento dossier cards
PORTFOLIO_DATA.skills      // the four perk trees
PORTFOLIO_DATA.projects    // case files
PORTFOLIO_DATA.experience  // work log entries, tagged by tab
PORTFOLIO_DATA.journey     // timeline milestones
PORTFOLIO_DATA.character   // character sheet — attributes, vitals, effects
PORTFOLIO_DATA.codex       // codex records
PORTFOLIO_DATA.netrun      // terminal command table
GITHUB_SNAPSHOT            // baked offline fallback for the GitHub module
```

Adding a project is one object in `projects`. Adding a perk is one object in
`skills[].items`. Adding a terminal command is one entry in `netrun.commands`.

Icons resolve through `ICON_SLUGS` in the same file; unknown names fall back
to a generic node mark.

---

## Running it locally

The site is static — any static server works.

```bash
# Node
npx serve .

# or Python
python -m http.server 8000
```

Opening `index.html` straight from the filesystem also works, though a local
server is preferable (the GitHub module needs a real origin for CORS).

---

## Provenance

No game asset is redistributed. The fonts shipped *inside* Cyberpunk 2077 are
custom CD PROJEKT RED / Raster Studio builds and are not used here — the
open-licensed families listed above are their equivalents and render the same
way. The UI icons are hand-drawn SVG paths traced from reference captures;
the scanlines, grids, noise and phosphor effects are generated procedurally;
all audio is synthesised at runtime.

Original fan work. Unaffiliated with CD PROJEKT RED, Studio Trigger or
Netflix. *Cyberpunk 2077* and *Cyberpunk: Edgerunners* are trademarks of
their respective owners.
