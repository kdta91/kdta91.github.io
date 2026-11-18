---
name: Kristoff Ampong
description: A shelf of shipped products, each band painted in its own app's world on a cool concrete frame.
colors:
  frame-concrete: "#e7e7e3"
  frame-graphite: "#121316"
  frame-muted: "#4f5257"
  frame-paper: "#f3f3ef"
  frame-line: "rgba(18, 19, 22, 0.16)"
  liftrix-graphite: "#0f1115"
  liftrix-ink: "#f5f5f7"
  liftrix-muted: "#9aa1ac"
  liftrix-orange: "#f97316"
  liftrix-line: "rgba(245, 245, 247, 0.14)"
  linaw-forest: "#04341f"
  linaw-paper: "#f4f2ea"
  linaw-sage: "#a6dcbc"
  linaw-leaf: "#00c46a"
  linaw-line: "rgba(244, 242, 234, 0.16)"
  dropcove-black: "#000000"
  dropcove-white: "#ffffff"
  dropcove-ash: "#a3a3a3"
  dropcove-line: "rgba(255, 255, 255, 0.16)"
  tortui-slate: "#161d27"
  tortui-ink: "#e6edf3"
  tortui-muted: "#9aaabb"
  tortui-cyan: "#5fd7ff"
  tortui-line: "rgba(230, 237, 243, 0.14)"
  device-black: "#050506"
  device-titanium: "#4a4c52"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 7vw, 5.75rem)"
    fontWeight: 700
    lineHeight: 0.96
    letterSpacing: "-0.03em"
    fontVariation: "\"opsz\" 96, \"wdth\" 90"
  project-name:
    fontFamily: "Bricolage Grotesque, Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(3.5rem, 8.5vw, 5.75rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.035em"
    fontVariation: "\"opsz\" 96, \"wdth\" 88"
  project-name-mono:
    fontFamily: "Martian Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "clamp(3rem, 7.5vw, 5rem)"
    fontWeight: 500
    letterSpacing: "-0.04em"
  section-title:
    fontFamily: "Bricolage Grotesque, Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 4.6vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontVariation: "\"opsz\" 72, \"wdth\" 85"
  index-area:
    fontFamily: "Bricolage Grotesque, Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 2.6vw, 2rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
    fontVariation: "\"opsz\" 36, \"wdth\" 90"
  wordmark:
    fontFamily: "Bricolage Grotesque, Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    letterSpacing: "-0.02em"
    fontVariation: "\"opsz\" 24, \"wdth\" 85"
  project-line:
    fontFamily: "Schibsted Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(1.125rem, 1.6vw, 1.375rem)"
    lineHeight: 1.45
  lede:
    fontFamily: "Schibsted Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(1.0625rem, 1.4vw, 1.25rem)"
    lineHeight: 1.55
  body:
    fontFamily: "Schibsted Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  button:
    fontFamily: "Schibsted Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.975rem"
    fontWeight: 600
  nav:
    fontFamily: "Schibsted Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
  data:
    fontFamily: "Martian Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.8125rem"
    lineHeight: 1.7
    letterSpacing: "0.01em"
    fontFeature: "tnum"
rounded:
  focus: "4px"
  skip: "6px"
  terminal: "12px"
  screen: "18px"
  screen-inner: "8px"
  latest-card: "24px"
  app-icon: "22.5%"
  phone-bezel: "14.5% / 6.7%"
  phone-screen: "12.8% / 5.9%"
  circle: "50%"
  pill: "999px"
spacing:
  gutter: "clamp(1rem, 4vw, 3rem)"
  max-width: "82rem"
  band-block: "clamp(5rem, 12vh, 8rem)"
  band-gap: "clamp(3rem, 6vw, 6rem)"
  detail-gap: "clamp(2.5rem, 5vw, 3.5rem)"
  row: "1.125rem"
  summary-gap: "1.125rem"
  masthead-offset: "6.5rem"
components:
  button-primary-frame:
    backgroundColor: "{colors.frame-graphite}"
    textColor: "{colors.frame-paper}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0.7rem 1.25rem"
    height: "2.875rem"
  button-primary-liftrix:
    backgroundColor: "{colors.liftrix-orange}"
    textColor: "{colors.liftrix-graphite}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0.7rem 1.25rem"
    height: "2.875rem"
  button-primary-linaw:
    backgroundColor: "{colors.linaw-leaf}"
    textColor: "{colors.linaw-forest}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0.7rem 1.25rem"
    height: "2.875rem"
  button-primary-dropcove:
    backgroundColor: "{colors.dropcove-white}"
    textColor: "{colors.dropcove-black}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0.7rem 1.25rem"
    height: "2.875rem"
  button-primary-tortui:
    backgroundColor: "{colors.tortui-cyan}"
    textColor: "{colors.tortui-slate}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0.7rem 1.25rem"
    height: "2.875rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.frame-graphite}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0.7rem 1.25rem"
    height: "2.875rem"
  nav-link:
    textColor: "{colors.frame-muted}"
    typography: "{typography.nav}"
    padding: "0 0.375rem"
    height: "44px"
  loop-toggle:
    rounded: "{rounded.circle}"
    size: "44px"
  app-icon:
    rounded: "{rounded.app-icon}"
    size: "4.5rem"
  phone-frame:
    backgroundColor: "{colors.device-black}"
    rounded: "{rounded.phone-bezel}"
    padding: "1.7%"
  dynamic-island:
    backgroundColor: "#000000"
    rounded: "{rounded.pill}"
    width: "29%"
    height: "3.9%"
  terminal:
    backgroundColor: "{colors.tortui-slate}"
    rounded: "{rounded.terminal}"
  index-row:
    typography: "{typography.index-area}"
    padding: "1.375rem 0"
    height: "44px"
---

# Design System: Kristoff Ampong

## Overview

**Creative North Star: "The Product Shelf"**

The site is a frame, not a brand. A cool concrete ground with graphite ink holds the page and owns no hue of its own; colour arrives only with the work. Each shipped product gets a full-bleed band painted in that app's own palette (Liftrix graphite and orange, Linaw forest and leaf, DropCove black and white, tortui slate and cyan), and the fixed masthead takes on the world of whichever band is passing beneath it. Leaving a product band returns you to concrete.

Density is editorial and sparse: one large condensed grotesque headline per region, generous band padding, and information organised by hairline rules rather than boxes. The only objects with physical presence are the products themselves, shown as running loops inside realistic CSS phones, a Mac screen and a terminal window, and the hero features only the latest of them, in a card painted in its own world. Everything else is flat type on a ground.

Three faces divide the work cleanly. Bricolage Grotesque, condensed and tightly tracked, carries every headline; Schibsted Grotesk carries reading text and controls; Martian Mono is reserved for data (platforms, versions, stacks) and for tortui's own name, which ends in a blinking cyan caret.

**Key Characteristics:**
- A colourless concrete frame; every hue on the page belongs to a product.
- Full-bleed project bands, each a complete world of six tokens (ground, ink, muted, line, accent, on-accent).
- A fixed masthead that inherits the band beneath it and condenses the full name to "KA" on scroll.
- Sticky project summary beside a scrolling media and notes column on wide screens.
- Hairline rules for structure; drop shadows only on device objects.
- Every looping video carries a visible, keyboard-reachable play/pause control.

## Colors

Five worlds share one six-token contract; the frame is achromatic and each product world brings exactly one accent (DropCove's is white, its own product's monochrome).

### Primary
- **Graphite Ink** (frame-graphite): the frame's ink and also its "accent". Primary buttons, focus rings and text selection on concrete are graphite, so the frame never introduces a hue of its own.
- **Concrete** (frame-concrete): the frame ground for the hero, Capabilities, Contact and footer, and the browser `theme-color` at load.

### Secondary
- **Liftrix Orange** (liftrix-orange): the single accent of the Liftrix band; primary button fill, focus ring and selection, with graphite text on it.
- **Linaw Leaf** (linaw-leaf): the Linaw band's accent, carrying forest text.
- **DropCove White** (dropcove-white): the DropCove band's accent, carrying black text; the hero card uses it while DropCove is the latest release.
- **Terminal Cyan** (tortui-cyan): the tortui band's accent, the caret after its name and the `code` highlight in terminal captions.

### Neutral
- **Liftrix Graphite** (liftrix-graphite), **Linaw Forest** (linaw-forest), **DropCove Black** (dropcove-black), **Terminal Slate** (tortui-slate): the band grounds. Each paints the full width of its band and, through the masthead, the `theme-color` meta.
- **Liftrix Ink** (liftrix-ink), **Linaw Paper** (linaw-paper), **Terminal Ink** (tortui-ink): primary text in each product world (graphite plays this role on the frame).
- **Frame Paper** (frame-paper): text on the graphite frame button and selection; never a ground.
- **Frame Muted** (frame-muted), **Liftrix Muted** (liftrix-muted), **Linaw Sage** (linaw-sage), **Terminal Muted** (tortui-muted): ledes, meta lines, note bodies, stacks and inactive nav links.
- **Hairlines** (frame-line, liftrix-line, linaw-line, tortui-line): the ink at 14 to 16% alpha, for every rule, row divider, ghost-button border and band seam.
- **Device Black** (device-black) and **Titanium Edge** (device-titanium): the phone's bezel and its 1.5px edge ring. They are device materials, identical in every world, so a phone reads as the same physical object on concrete, graphite, forest or slate.

### Named Rules
**The No House Colour Rule.** The frame's accent is its own ink. A new frame surface gets graphite on concrete; any hue it shows must come from a product's world, inside that product's band or media.

**The Six-Token World Rule.** A world is exactly `--bg`, `--ink`, `--muted`, `--line`, `--accent` and `--on-accent`, declared on a `[data-theme]` selector. Components read only these custom properties, so a component works in every world without variants. Adding a product means adding one theme block, never per-component colour overrides.

**The Terminal Is Always Tortui Rule.** The terminal window keeps tortui's slate, ink and cyan wherever it appears, because it is tortui's own product chrome.

## Typography

**Display Font:** Bricolage Grotesque (with Schibsted Grotesk, system-ui)
**Body Font:** Schibsted Grotesk (with system-ui, -apple-system, Segoe UI)
**Label/Mono Font:** Martian Mono (with ui-monospace, SF Mono, Menlo), width 87.5

**Character:** A condensed, tightly tracked variable grotesque shouts the headlines while a plain, sturdy grotesque does the reading; the mono appears only where the content is literally data.

### Hierarchy
- **Display** (700, clamp 2.75 to 5.75rem, 0.96, opsz 96 / wdth 90, balanced wrap): the hero headline and the contact headline, one per frame region.
- **Project Name** (800, clamp 3.5 to 5.75rem, 0.92, wdth 88): the product name heading each band.
- **Project Name, Mono** (Martian Mono 500, clamp 3 to 5rem): a product name set in mono only when the product is itself a terminal tool (tortui), followed by the accent caret.
- **Section Title** (700, clamp 2.25 to 3.75rem, 1.0, wdth 85): frame section headings such as Capabilities.
- **Index Area** (600, clamp 1.375 to 2rem, 1.15, wdth 90): one line per capability row.
- **Project Line** (Schibsted, clamp 1.125 to 1.375rem, 1.45, max 30ch, pretty wrap): the one-sentence product description.
- **Lede** (Schibsted, clamp 1.0625 to 1.25rem, 1.55, muted, max 40ch): the paragraph under a display headline.
- **Body** (Schibsted 400, 1.0625rem, 1.6): note bodies at max 58ch, index details at 62ch (48ch on wide screens).
- **Data** (Martian Mono, 0.8125rem, tabular numerals, muted): platform lines, stacks, the stack strip (line-height 1.9, max 110ch) and terminal captions.

### Named Rules
**The Condensed Headline Rule.** Every Bricolage heading uses a reduced width axis (wdth 85 to 90) and negative tracking (-0.02em to -0.035em); larger sizes track tighter. Body sizes never use Bricolage.

**The Mono Means Data Rule.** Martian Mono sets only machine-shaped content: platforms, versions, tech stacks, commands and a terminal product's name. It never sets prose, headings for non-terminal products, or labels above headings; the one exception is the hero card's "Latest release" status tag.

## Layout

A single centred column capped at 82rem with a fluid gutter (`clamp(1rem, 4vw, 3rem)`); every band keeps full-bleed colour while its content aligns to the same max width by padding inline with `max(gutter, (100% - max) / 2)`.

- **Hero:** copy beside one "Latest release" card, never a lineup of every product (the owner, 2026-11-17: the hero can't list everything, so it must not grow with the shelf). The card is a plain `div` (not a landmark) carrying the featured product's own `data-theme`, so it paints that app's world on the concrete: a 24px-radius panel with a hairline ring and a soft drop shadow, a mono "Latest release" tag with an accent dot, the product's media (screen, phone or terminal; a phone is capped at 17rem and centred), and a link row (44px icon, name in the display face, a one-line pitch, a down arrow) that jumps to the product's band. To feature a new release, swap the card's `data-theme`, its media figure and its link; the newest product also leads the Work section. The masthead observer skips the card (`:not(.hero-latest)`). At 900px and up: 5fr copy, 6fr card, vertically centred, hero capped at `min(88svh, 54rem)`. Below 900px the card sits under the copy.
- **Project bands:** vertical padding `clamp(5rem, 12vh, 8rem)`. At 900px and up, 5fr summary and 7fr detail; the summary is sticky at 6.5rem from the top while the media, notes and stack scroll past it. Even-numbered bands mirror to 7fr / 5fr with the summary on the right (`:nth-child(even)`), so bands alternate sides whatever the order. Work runs newest first. Notes stack as hairline-divided rows; in the terminal band they sit as three columns.
- **Capabilities index:** a heavy ink rule opens the list; each row is name, stack and a plus control. At 900px and up rows split into two equal columns plus the control, and the opened detail indents to the 50% line.
- **Contact:** centred at 900px and up, left-aligned below.
- **Breakpoints:** 900px (multi-column), 600px (the band terminal crops to its left pane at 5 / 4), 420px (tighter masthead).

## Elevation & Depth

The page is flat. Grounds are solid colour, chrome separates by one-pixel hairlines (the condensed masthead and band seams draw theirs with a `0 1px 0` line shadow, not a blur), and depth is reserved for the products: phone bezels, the Mac screen, the terminal window, app icons and the hero's latest-release card (a product shown on the shelf) are the only things that cast shadows.

### Shadow Vocabulary
- **Device Body** (`box-shadow: 0 0 0 1.5px #4a4c52, 0 0 0 2.5px #1b1c1f, inset 0 0 0 1px rgba(255,255,255,0.06), 0 30px 60px -20px rgba(0,0,0,0.5), 0 10px 20px -10px rgba(0,0,0,0.3)`): phones. The first two rings draw the titanium edge and its dark outer lip; the last two lift the device.
- **Terminal Lift** (`box-shadow: 0 0 0 1px rgba(255,255,255,0.06) inset, 0 24px 48px -18px rgba(0,0,0,0.5)`): the terminal window.
- **Icon Seat** (`box-shadow: 0 0 0 1px var(--line), 0 10px 24px -12px rgba(0,0,0,0.5)`): app icons; the portrait uses the hairline ring alone.
- **Screen Lift** (`box-shadow: 0 0 0 1px #3a3b40, inset 0 0 0 1px rgba(255,255,255,0.05), 0 30px 60px -24px rgba(255,255,255,0.08)`): the Mac screen frame, its faint light lift reading on black.
- **Card Lift** (`box-shadow: 0 0 0 1px var(--line), 0 40px 80px -40px rgba(0,0,0,0.45)`): the hero's latest-release card.
- **Hairline Seam** (`box-shadow: 0 1px 0 var(--line)` / `0 -1px 0 var(--line)`): the condensed masthead's bottom edge and the seam between adjacent bands.

### Named Rules
**The Only Objects Cast Shadows Rule.** A blur shadow means "this is a device you could hold". Buttons, rows, masthead and sections never get one.

## Shapes

Two shape families. Interface controls are fully round: pill buttons (999px), circular loop toggles and the circular portrait. Product objects follow their real geometry: phones with elliptical corners (14.5% / 6.7%) around screens at 12.8% / 5.9% and a pill-shaped Dynamic Island, an app icon squircle at 22.5%, and a terminal window at 12px with three 10px circular window dots, and a Mac screen at 18px (8px inside). The hero's latest-release card is the one rounded container (24px), because it holds a product's world. Other content containers have no corners at all: notes, index rows and the stack strip are open, bounded only by horizontal hairlines.

## Components

### Buttons
Confident pills that take the band's accent, so the same button is graphite on concrete, orange on Liftrix, leaf on Linaw, white on DropCove and cyan on tortui.
- **Shape:** fully round (pill), minimum height 2.875rem.
- **Primary:** accent fill with on-accent text, 600 weight, a 1.125em inline SVG icon before or after the label (GitHub mark, or an up-right arrow for outbound product links), gap 0.6rem.
- **Hover / Focus:** lifts 1px (200ms ease-out) and settles on press; focus is a 2px accent outline at 3px offset. Colour changes ride the 650ms world transition.
- **Ghost:** transparent with ink text and a hairline border that darkens to ink on hover; used as the secondary action beside a primary.

### Navigation
- **Masthead:** fixed, full width, transparent over the hero. After 40px of scroll it condenses: the ground becomes the current world at 90% with a saturated 14px backdrop blur and a hairline seam, and the wordmark folds "Kristoff Ampong" to "KA" (450ms max-width collapse); hover or focus unfolds it again. An IntersectionObserver sets the masthead's `data-theme` to the band under its top edge, which also updates the browser `theme-color`.
- **Links:** Schibsted 500 at 0.9375rem in the muted colour, ink on hover, each at least 44px tall.

### Project Band (signature)
A full-bleed section with `data-theme` set to its product. The summary holds the app icon (4.5rem squircle, omitted for a CLI), the project name, a mono platform line, the one-line description and one primary plus an optional ghost button. The detail holds the running media, a hairline-divided notes list (600-weight term, muted description) and a mono stack line.

### Device Frames
- **Phone:** a realistic CSS device at aspect 600 / 1304: a thin 1.7% black bezel, a titanium edge ring, and a black Dynamic Island pill (29% by 3.9%, 3.1% from the top) laid over the capture's empty status-bar centre. Video covers the screen with black behind. The phone is identical in every world.
- **Screen:** a Mac display for DropCove: a 0.625rem near-black bezel with an 18px radius and a hairline edge ring, the capture inside at 8px radius. The recording already carries its own menu bar and notch, so the frame draws neither. Video is cropped to 21 / 10 from the 2400 × 840 recording: the left edge lands in the menu-bar gap after "Edit", the clock drops out, and the whole notch panel stays in frame. The loop is re-cut to open on the drop zone (2 s into the source recording) so first play matches the poster. In the hero card the bezel slims to 0.375rem; in the band the screen keeps a 58px bottom margin for its loop control.
- **Terminal:** tortui-slate window with a 30px darker title bar (three dots and the command in mono), video at 1100 / 440, and a hairline-topped mono caption with the command highlighted in cyan.

### Loop Control
Every looping video gets a 44px circular play/pause button injected by script, with an SVG glyph and a label naming the video. On project phones it sits centred 58px below the device, tinted from the world's ink at 10%, so it never covers the app UI being demonstrated. On a screen frame it sits off the capture: below the frame at the right in a band, and at the right end of the "Latest release" tag row in the hero card, tinted from the ink at 12% so the accent focus ring lands on the world ground. On the terminal it sits at the right end of the caption row. Loops play only while 25% visible and never start on their own under reduced motion; a user's pause is respected on re-entry.

### Capabilities Index
A disclosure list: each row names a kind of work, and opening it says what a client gets from it. Each row is a native `details` whose summary sets the capability in the index-area face, its stack in mono, and a 1.5rem plus icon that rotates 45° to an x when open (350ms). Hover underlines the area name with a 1px line; the opened paragraph fades down 4px over 400ms.

### Interactive Layer (playgrounds, palette, Now)
Every project is playable in place, client-side only. `script.js` lazy-loads each demo module from `js/` (`dropcove`, `linaw`, `tortui`, `liftrix`) when its `[data-demo]` element comes within 400px of the viewport, and the palette module on idle. Demos are hidden without script (`html:not(.js)`), so the bands fall back to their loops and notes. Added JS stays under 60 KB unminified.
- **Playground frame (`.play`):** opens with a full-ink rule (like the Capabilities list), a Bricolage title (1.5 to 2rem, wdth 90), a muted one-line sub, then the demo. It reads only the band's world tokens, so the controls (pills, hairline chips, segmented radios) paint themselves in each world.
- **DropCove notch (`.dc-stage`, signature):** a black notch (12.5rem, 18px bottom radius, hairline ring, camera dot) hangs from the top edge of the DropCove band, whose top padding is removed (`.project-notched`). Pressing it, or dragging a file anywhere over the band, grows it (520ms, `interpolate-size`) into the app's drop zone: file header with an `esc` key chip, three ranked action tiles (Convert to WebP, Resize to 1280 px, Compress to JPEG; ranked by use, the top one pre-run with its "≈ size" estimate, keys 1 to 3 and Enter), then the result card ("155 KB → 26 KB" in mono, the delta in display type, Download, Back to actions, "Nothing left your browser."). Encoding uses OffscreenCanvas where available, else canvas; a browser without WebP encoding gets JPEG and is told so. "Try a sample" re-encodes the real DropCove poster capture as a PNG. The notch, its tiles (#141414 on #2a2a2a) and buttons carry literal DropCove colours: it is the product's own chrome.
- **Linaw logging card (`.ln-card`):** a paper card (24px, the app's paper and forest) on the forest band with a running total in display type, rows of category glyph, merchant, category and tabular amount, and a pill input with a leaf mic button (shown only where the browser has speech recognition) and a forest Log button. Example chips sit under it on the band. Copy calls it a demo of the logging flow; never "AI" or "smart".
- **tortui terminal (`.tt-window`):** the terminal device (tortui slate, always) with a 44px key row (/ ↑ ↓ open add back) for touch. Inside, Martian Mono at 0.75rem: the demo banner, tab line, a real search input, results as a grid table (C, Title, Size, S/L, Age, Source; Age and Source drop below a 40rem container), details, and ASCII progress bars. The focused terminal (`role="application"`) takes / j k arrows Enter a q Esc 1 to 4; a polite live region narrates.
- **Liftrix clock (`.lx`):** segmented radios (AMRAP, EMOM, For time; the checked one in the accent), a clock face between hairlines with Bricolage 800 tabular digits at clamp(5rem, 19vw, 9.5rem) in Liftrix orange (ink during the 3-second lead-in), a mono round line, then a length stepper, Start (accent pill), +1 round, Reset and a Sound toggle. Beeps are WebAudio, created on the first Start.
- **Now strip (`.now`):** the hero's first row, between two hairlines: "Now" with a graphite ping dot, then tag + text + mono detail items split by vertical hairlines; it scrolls sideways inside itself on phones. Data lives in the `NOW` array in script.js.
- **Command palette (`.palette`):** a native modal `dialog` in frame colours (concrete ground, 16px, hairline ring, dimmed backdrop, no blur shadow) holding a combobox and grouped listbox (Play, Go to, Open, Contact, Page). The active row inverts to graphite. Opens with ⌘K / Ctrl+K, the masthead trigger (kbd chips on wide screens, a prompt glyph under 600px, where the masthead drops its Capabilities link) and the hero's text button. "Reduce motion" sets `html[data-motion]`, stored per browser, and overrides the system setting for every transition, loop and demo.

## Do's and Don'ts

### Do:
- **Do** add a new product as one `[data-theme]` block of six custom properties and a full-bleed band; let every component read the variables.
- **Do** keep concrete (#e7e7e3) and graphite (#121316) as the only colours of frame regions; the hero's latest-release card is a product world placed on the frame, not frame colour.
- **Do** set headings in Bricolage at a reduced width axis with negative tracking, and reading text in Schibsted Grotesk.
- **Do** separate content with 1px hairlines at the world's line colour; open lists with a full-ink rule.
- **Do** show products as real captures inside CSS device frames, and give every loop a visible 44px play/pause control placed off the app UI.
- **Do** route world colour changes through the 650ms ease-out transition (`cubic-bezier(0.16, 1, 0.3, 1)`) and make them instant under reduced motion.
- **Do** keep every tap target at least 44px tall.
- **Do** make every playground work without a pointer, narrate it through a polite live region, label it honestly as a demo, and keep it local to the browser.

### Don't:
- **Don't** give the frame an accent hue; graphite is its accent.
- **Don't** put blur shadows on chrome (buttons, masthead, rows, sections); shadows belong to devices and icons.
- **Don't** set prose, non-terminal product names or labels above headings in Martian Mono.
- **Don't** wrap projects in same-size cards on a shared ground; each product owns a full-bleed band.
- **Don't** hard-code a world colour inside a component that can appear in more than one world; only the terminal (always tortui), the phone and the Mac screen (device materials) carry literal colours.
