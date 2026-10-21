# NCIIBI_OS 5.0

> A Cyberpunk 2077 / Edgerunners-inspired portfolio interface, built as a fictional
> operating-system menu. Zero build step — plain HTML, CSS and JavaScript.

Live: **https://nciibi.github.io/portfolio/** (enable Pages on this repo, source
branch `main`, root folder)  ·  Source: **github.com/Nciibi/portfolio**

---

## The design system

The interface follows the screen-UI language CD PROJEKT RED defined in the
Cyberpunk 2077 UI Art Bible, filtered through the harder neon of Studio Trigger's
*Cyberpunk: Edgerunners* adaptation.

| Rule | Where it comes from |
| --- | --- |
| Pure black is the void; surfaces step up by luminance, never by shadow | CP2077 |
| Elevation is **emitted light** (glow), never a drop shadow | CP2077 |
| Every corner is a knife edge — border-radius is zero everywhere | CP2077 |
| One dominant signal colour per view; the rest are punctuation | CP2077 |
| Glitch is **punctuation**, never wallpaper — it marks a state change | CP2077 + Edgerunners |
| Hard cel-shaded edges, flat neon that stops abruptly | Edgerunners |
| Katakana signage is a core part of the Night City language | Both |
| A glitch is a signal fault, so it is **sparse** and **brief** | both |

### Colour roles

```
--cp-yellow  #fcee0a   PRIMARY — headline, action, attention
--cp-cyan    #00f0ff   SYSTEM  — readouts, focus rings, links
--cp-magenta #ff0044   DANGER  — glitch, errors, critical only
--cp-red     #c5003c   NEOMILITARISM — the military-system accent, alerts
--cp-green   #00e07a   ONLINE / success
```

Yellow leads. Cyan reports. Magenta only ever warns. Red is the *Neomilitarism*
sub-palette — the in-game military interface — so it is used sparingly and never
competes with yellow for attention.

### Typography

| Role | Face | Why |
| --- | --- | --- |
| Display | Saira Condensed | Tall condensed Eurostile-descended headline face |
| Labels / UI | Chakra Petch | Angular techno face for tabs, buttons, panels |
| Body | **Rajdhani** | The actual Cyberpunk 2077 interface font |
| Data | Share Tech Mono | Fixed-width readouts |
| Katakana | Zen Kaku Gothic New | Zen Fonts — Japanese sci-fi signage |
| Numerals | Zen Dots | Zen Fonts — codes, counters, readouts |

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
