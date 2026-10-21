# NCIIBI_OS 5.0

> A Cyberpunk 2077 / Edgerunners-inspired portfolio interface, built as a fictional
> operating-system menu. Zero build step — plain HTML, CSS and JavaScript.

Live: **https://nciibi.github.io/portfolio/** (enable Pages on this repo, source
branch `main`, root folder)  ·  Source: **github.com/Nciibi/portfolio**

---

## The design system

The interface is built on the **Neomilitarism** style — the sub-language CD
PROJEKT RED defined in the Cyberpunk 2077 UI Art Bible and used for the
in-game HUD and menus.

The rule that governs everything:

> **Red is the default state. Cyan is what is selected. Yellow is what is
> valuable. Green is what is alive. Magenta is what is wrong.**

Nothing is filled with yellow except the single primary action on a screen.
Nothing is filled with red except the one selected list row. A screen has one
dominant colour by area; the rest are punctuation.

| Role | Colour | Where it appears |
| --- | --- | --- |
| Chrome | `#ff5c54` | Rules, borders, labels, metadata, body copy |
| Selection | `#00f0ff` | Active nav row, active perk, focus rings, section headers |
| Value | `#ffef02` | The logo, counters, tier tags, the primary button |
| Status | `#1bd676` | Street cred, online, success |
| Breach | `#deff5e` + `#1bd676` | The netrunner terminal's olive/emerald sub-language |
| Fault | `#ff0044` | Glitch, errors, critical only |

These values were **sampled directly out of the game's own interface**
rather than eyeballed, and the whole system follows four rules the art
bible states:

- **Pure black is the void.** Surfaces step up by luminance, never by shadow.
- **Elevation is emitted light.** Glow replaces the drop-shadow ladder.
- **Every corner is a knife edge.** Border radius is zero, everywhere.
- **Glitch is punctuation, never wallpaper.** It marks a state change.

### Geometry

The shapes come from the game too, and they are not 45° cuts:

| Shape | Used for | How it is built |
| --- | --- | --- |
| **Skewed parallelogram** | nav rows, list rows | `clip-path: polygon(20px 0, 100% 0, calc(100% - 20px) 100%, 0 100%)` |
| **Flat-top hexagon** | perk / attribute nodes | `polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)` |
| **Pointy-top hexagon** | level badge | `polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)` |
| **Stepped-top banner** | perk category cards | `polygon(0 15px, 15px 15px, 15px 0, 48px 0, …)` |
| **Slanted corner** | the information panel | `polygon(22px 0, 100% 0, 100% 100%, 0 100%, 0 22px)` |

Outlines that must follow an angled edge (the nav row frame, the hexagon
border) are drawn as a larger shape with a smaller one punched out of it —
a clipped `border` would just be sliced away.

### Typography

| Role | Face | Why |
| --- | --- | --- |
| Display / labels | **Chakra Petch** | Angular techno face for tabs, buttons, panels |
| Body | **Rajdhani** | The actual Cyberpunk 2077 interface font |
| Data | **Share Tech Mono** | Fixed-width readouts |
| Numerals | **Zen Dots** | Zen Fonts — counters, codes, readouts |
| Katakana | **Zen Kaku Gothic New** | Zen Fonts — Japanese signage, subset to ~180 glyphs |

---

## The twelve modules

| # | Module | Route | What it is |
| --- | --- | --- | --- |
| 01 | PROFILE | `#profile` | Operative dossier, stats, bento, education |
| 02 | CHARACTER | `#character` | CP2077 character screen: attributes, vitals, status effects |
| 03 | PROJECTS | `#projects` | Master/detail case-file browser with datamosh transitions |
| 04 | PERKS | `#perks` | CP2077 perk trees — hex nodes, four neural trees |
| 05 | WORK LOG | `#experience` | Career / involvement / honors |
| 06 | THE ROAD | `#journey` | Year-by-year timeline |
| 07 | GITHUB | `#github` | Live repository index, language bars, activity feed |
| 08 | CODEX | `#codex` | Certifications, awards, languages, practice |
| 09 | NETRUN | `#netrun` | A working terminal — type `help` |
| 10 | CONTACT | `#contact` | Dialogue options and a brief form |
| 11 | OPTIONS | `#options` | Display, audio, accessibility, build info |
| 12 | EXIT | `#exit` | Session termination screen |

Every module is deep-linkable (`#codex`) and also reachable via `?goto=codex`.

---

## The visual engine

Five cooperating layers. Idle cost is close to zero; the expensive paths only
run during a state change.

**1 · WebGL CRT overlay** — `js/crt.js`
A single fullscreen transparent canvas composites the physical artefacts of a
cathode-ray display: scanlines, aperture-grille phosphor triad, a slow rolling
refresh bar, animated film grain, edge vignette, mains flicker, and a *pulse*
channel the glitch engine drives during signal faults. Quality tiers
(`high` / `medium` / `low`) are chosen from core count, DPR and viewport area,
and the render resolution is capped by a pixel budget. If WebGL is unavailable
the module falls back to a pure-CSS scanline layer.

**2 · SVG filter glitch** — `js/glitch.js`
A filter graph built in the DOM and attached to the menu stage:
`feTurbulence` → `feDisplacementMap` tears the live DOM; `feColorMatrix` +
`feOffset` + `feBlend(screen)` produce a **true RGB channel split** of the
rendered page, not a fake text-shadow. Displacement and channel offsets are
driven from JS every frame with *stepped* random values, so the fault reads as
discrete corruption frames rather than a smooth wobble. The filter is attached
only while a burst is active.

**3 · Canvas-2D datamosh** — `js/datamosh.js`
Horizontal band displacement, RGB channel separation, rectangular block
displacement and luminance pixel sorting — the artefacts of a damaged video
stream. Used for the project-artwork transitions, where a new case file
resolves out of a corrupted frame.

**4 · CSS keyframes** — `css/fx.css`
The shard wipe between panels, the asymmetric chromatic title glitch, the
vertical scan sweep on entry, the signal-tear overlay, the FLIP nav cursor and
the HUD reticle.

**5 · Procedural audio** — `js/cyber-audio.js`
Every sound is synthesised with Web Audio nodes — no audio files. Click, hover,
tab chirp, success arpeggio, keypress, a noise-burst signal fault, a refusal
tone, and an optional ambient drone bed.

### Shared runtime

`js/fx-core.js` owns the animation ticker, the motion preference, quality
tiering, the persisted display settings, the text-scramble decoder and the FLIP
helper. Everything else talks to it.

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
- Every display effect is toggleable from the OPTIONS module, and the CRT
  intensity is adjustable
- Skip link, live regions, and visible focus rings throughout

---

## Project layout

```
index.html            the shell and all twelve modules
css/
  tokens.css          design tokens — colour, type, motion, geometry
  base.css            reset, typography, focus, reveal primitive
  shell.css           topbar, nav rail, stage, panel chrome
  components.css      buttons, cards, chips, meters, tags, forms
  panels.css          per-module layouts
  fx.css              keyframes and effect classes
js/
  icon-pack.js        inline SVG icon set + brand colours
  portfolio-data.js   ALL content — the single source of truth
  fx-core.js          ticker, motion preference, quality, settings, FLIP
  crt.js              WebGL CRT overlay
  glitch.js           SVG filter signal-fault engine
  datamosh.js         canvas-2D datamosh
  cyber-audio.js      procedural audio synthesiser
  main.js             router + renderers
  effects.js          HUD reticle, tilt, reveal, count-up, scan sweep
  github.js           live GitHub API with a baked offline snapshot
assets/               WebP imagery (no fallbacks needed)
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

## Credits

Original fan work. Unaffiliated with CD PROJEKT RED, Studio Trigger or
Netflix. *Cyberpunk 2077* and *Cyberpunk: Edgerunners* are trademarks of their
respective owners; this is an homage, not an official product. Portfolio
content and project links belong to their respective owners.
