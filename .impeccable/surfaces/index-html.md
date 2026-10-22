---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface brief: index.html (portfolio home)

Mode: Experience (the work leads), with a Persuade close: freelance and contract clients should come away believing "he ships whole products" and open GitHub.

## Direction contract

THESIS: The page is a shelf of shipped products, and each product brings its own world. Each project is a full-bleed band in that app's own palette: Liftrix's graphite and orange, then Linaw's forest and leaf. It refuses the category default of a dark page with a grid of same-size project cards and a résumé underneath.

OWN-WORLD: The frame is cool concrete (#E7E7E3) with graphite ink (#121316) and no accent of its own, so the projects carry the colour. Bricolage Grotesque for display (condensed width, -0.03em), Schibsted Grotesk for body, and Martian Mono only for data (platforms, versions, stacks) and for tortui's own name, which carries a blinking cyan cursor. (Geist was swapped out after the detector flagged it as overused.) Hairline rules, no shadows on chrome, phone media in rounded device bezels drawn in CSS.

STORY: In the first viewport the visitor understands what kind of builder this is and sees the products running, Liftrix readable at the front. Scrolling through Work, each app takes over the page. Bands alternate sides (Linaw puts its media on the left). A one-line-per-row Capabilities index replaces the résumé, followed by a single stack strip. The page closes on one action: talk on GitHub.

FIRST VIEWPORT: A fixed masthead with the full name, condensing to "KA" on scroll, and links on the right. On the left (5 of 11 columns) a display headline of about 5.75rem over three lines, a lede, the primary button "Start a conversation on GitHub" and an availability line in body type. On the right (6 of 11) two phones side by side, Liftrix and then Linaw set lower, about 300px each at 1440 in realistic frames (thin black bezel, titanium edge, Dynamic Island), shown in full above a bottom pad so they never touch the band below. They never overlap: the owner rejected the overlapping shelf. tortui lives in its own band. One play/pause control in the left gutter runs both.

FORM: Pinned by the user's references (killerportfolio development showcase: kirillz.com sticky project summary, alright.studio index lines with mini case studies, harryjatkins.com name-to-initials header). Seed: pinned-by-user (no roll).

SIGNATURE INTERACTION: Each project band paints its app's world, and the masthead takes on the palette of the band beneath it (custom properties, 650ms ease-out). The left project summary stays sticky while the media column scrolls, and the name condenses to KA. Under reduced motion the swaps are instant and the videos show posters until the visitor plays them. Every loop has a visible, keyboard-reachable play/pause button (WCAG 2.2.2). (Revised from a whole-body palette morph after QA: the morph painted one project's sticky content on the next project's ground.)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
