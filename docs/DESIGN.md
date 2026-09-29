# Tonelle Design Language v2 ("Editorial Lab")

Inspired by two references the founder supplied (Neurotrace web concept, BRIK mobile concept), adapted to Tonelle's makeup/colour world. Both web and mobile MUST follow this file. If you change a token, change it in `apps/web/src/styles/tokens.css` AND `apps/mobile/src/theme.ts`.

## 1. What we took from the references

**From the web reference (Neurotrace):**
- Warm light-grey "paper" canvas with faint grain.
- Hairline construction grid: vertical and horizontal lines, and big circle/arc outlines like a technical drawing.
- A single hot accent colour, used ONLY for lines, markers and small tags.
- A gigantic tight-tracked grotesk wordmark that runs edge to edge.
- Heavy grotesk headlines. Monospace annotations ("/AI that…") with black numbered square tags `01` `02`.
- Floating header: logo in a pale rounded box on the left; `Menu` + a dark primary pill on the right.
- A sticky dark bottom dock holding the store CTA.
- A single centred "hero object" with a heat-map glow.
- A radial sunburst preloader with a `000%` counter.
- A dark section with a glass sphere whose object changes colour per step.
- Scroll-driven phone mockup with annotation cards linked to it by accent lines.
- Testimonial columns in monospace.

**From the mobile reference (BRIK):**
- Stacked dark rounded cards on a light phone background, joined by little "pinched/notched" necks, so the stack reads as one continuous organic shape.
- A pale accent used for chips and progress.
- Big light-weight numerals.
- Segmented bar progress indicators (`||||||||`).
- A pill segmented bottom navigation flanked by round icon buttons.
- Small uppercase chips such as `3H 41M LEFT`.
- A countdown or timer in huge pale digits.
- Calm, springy motion.

## 2. Tonelle adaptation: tokens

Colour (warm, makeup-toned rather than cold grey/red):

| Token | Hex | Use |
|---|---|---|
| `paper` | `#E6DED7` | page canvas (warm greige) |
| `paper-raised` | `#EFE9E3` | header box, light cards |
| `paper-sunken` | `#D9D0C8` | wells, inputs |
| `line` | `rgba(35,24,22,0.14)` | hairline grid |
| `line-strong` | `rgba(35,24,22,0.28)` | circles/arcs |
| `ink` | `#231816` | text, dark cards, primary buttons (espresso) |
| `ink-soft` | `#3A2A27` | dark card hover/secondary |
| `ink-muted` | `#6E605B` | secondary text |
| `ink-subtle` | `#9A8C86` | captions |
| `accent` | `#C8354A` | "lipstick" red: lines, markers, tags, focus. Never large fills |
| `accent-soft` | `#F2C9CB` | pale blush: chips/progress on dark cards (BRIK lavender → blush) |
| `accent-contrast` | `#FFFFFF` | text on accent |
| `night` | `#161010` | dark section canvas |
| `night-line` | `rgba(242,201,203,0.12)` | grid on dark |
| `success` `#3F7D5C`, `warning` `#B7791F`, `danger` `#B42335` | | states |

Heat-map gradient (the "makeup glow", replaces the brain heat map): radial blobs mixing `#7A1F2B` (deep berry) → `#C8354A` → `#E0775E` (terracotta) → `#F3B27A` (peach) → `#FBE3C6` (champagne), with soft blur. In the dark sphere section the blobs cycle through season palettes (spring: coral/peach/warm yellow; summer: rose/lavender/powder blue; autumn: terracotta/olive/camel; winter: berry/icy pink/cobalt).

Typography:
- Display / UI: **Inter Tight** (Google). Display weight 600, letter-spacing −0.04em to −0.06em, line-height 0.9 for the giant wordmark and 0.95–1.0 for headlines.
- Monospace annotations, labels, numbers-in-tags: **JetBrains Mono** 400/500, 12–15 px, line-height 1.35.
- Body: Inter Tight 400, 16–17 px.
- Big numerals (BRIK-style): Inter Tight 300, huge (48–120 px), tabular-nums.
- Fraunces is retired.

Shape:
- Radii: `sm 8`, `md 14`, `card 24`, `xl 32`, `pill 999`.
- Dark stacked cards use radius 24. Where two cards stack vertically with a 8–10 px gap, draw a "neck": a small rounded bridge that makes them look pinched together. Web uses an SVG/CSS pseudo-element; mobile uses an absolutely positioned View with concave corners, or an SVG from react-native-svg.
- Numbered tag: 28×28 black square, mono 12 px white text `01`.
- Connector bar (from the reference): a thin 1 px accent line ending in a small filled accent rectangle "plug", with a 22 px accent square containing `ıll` glyph bars.

Grain: an SVG feTurbulence noise overlay at 3–5 % opacity on `paper` and `night` (web only; skip on mobile).

## 3. Motion system

Principles: precise, technical, calm. Ease `cubic-bezier(0.22, 1, 0.36, 1)` (out-expo-ish) for reveals, spring for UI (mobile: damping 18, stiffness 180). Durations 400–900 ms for reveals, 180–240 ms for UI. **`prefers-reduced-motion` / OS reduce-motion: no transforms or loops; opacity fades ≤150 ms only.** Animate only transform, opacity and stroke-dashoffset. No layout thrash; 60 fps on a mid-range phone.

Signature animations (web; mobile equivalents in §5):
1. **Preloader (first visit per session, ≤2.2 s, skippable, never blocks LCP content for bots):**
   - Radial sunburst lines draw outward from a circle (stroke-dashoffset, staggered).
   - The four season labels `İLKBAHAR · YAZ · SONBAHAR · KIŞ` type in at N/E/S/W.
   - A dark pill bottom-left counts `000%` → `100%` in mono (leading zeros dimmed).
   - Then the circle scales into the hero's heat-map object, and the preloader fades.
2. **Wordmark reveal:** giant `TONELLE` letters slide up from a clip mask, staggered 40 ms, and span the full viewport width (`font-size` computed so the word fits 100% width at every breakpoint).
3. **Construction lines:** grid lines fade/scale in; the big accent circle draws via stroke-dashoffset; connector bars slide in from the screen edges toward the hero object.
4. **Hero object:** a line-art face (single-weight strokes, like the reference head/hand drawings) with heat-map makeup blobs on lips, cheeks and eyelids that slowly breathe (scale 0.97↔1.03, hue shift within the palette). A small accent tag `ANALİZ EDİLİYOR…` / `ANALYZING…` with a moving scan line crosses the face.
5. **Scroll story (sticky):** a phone mockup centred and pinned. As the user scrolls, the screen content changes: selfie → scan → season result → look on face. Numbered annotation cards `01 02 03` appear left and right, connected to the phone by accent lines that draw in. On mobile widths the phone is not pinned side-by-side: it becomes a full-width sticky card, with annotations stacked beneath and crossfading.
6. **Dark sphere section:** a glass sphere (radial gradients, specular highlight ellipse, an orbit ring) holds the heat-map blob. Per scroll step the blob recolours through the 4 season palettes, and a side panel with a mono title + body swaps text.
7. **Mono typewriter** for short annotations (character reveal, 12 ms/char, only once when in view).
8. **Sticky bottom dock:** a dark rounded dock with the store badge(s) / primary CTA. It slides up after the hero and hides near the footer.
9. **Micro-interactions:**
   - Buttons press to 0.97.
   - Segmented progress bars fill bar by bar.
   - Big numerals count up.
   - Cards enter with an 8 px rise plus fade, staggered.

## 4. Web page structure (landing)

Mobile-first. Everything must work at 360–430 px width first, then scale up. Order:
1. Header: logo box and `Menu` / `Ücretsiz dene` pill.
2. Hero:
   - Giant wordmark.
   - Mono subline.
   - Heat-map face object with connector bars.
   - Primary CTA and "free analysis · ~1 min · no sign-up".
3. Sticky phone scroll story (4 steps).
4. "Made for Mediterranean skin tones": sunburst of the 12 seasons around the face.
5. Dark sphere section (season palettes).
6. Looks catalogue: horizontal snap-scroll of dark BRIK-style cards with notched stacking.
7. How people use Tonelle: 3 mono columns. **Use clearly illustrative personas** (line-art avatars, labelled "Örnek senaryo"/"Example scenario"). No fake photos, no fabricated testimonials presented as real.
8. Pricing: dark stacked cards, yearly highlighted, big numerals.
9. FAQ: mono question labels.
10. Footer: the giant wordmark again.

Plus the sticky dock throughout.

Legal pages: same header/footer, paper canvas, mono section numbers, generous reading width (68ch), no heavy decoration.

## 5. App / flow screens (web `/analyze` and Expo app share this look)

- Canvas `paper`. Content lives in stacked dark `ink` cards with notch necks (BRIK). Light cards are used for secondary info.
- Top bar card: wordmark + small accent-soft chip (e.g. step `2/5` or `PREMIUM`).
- Quiz: one question per dark card; options as full-width light pills. Segmented bar progress (`||||||` 20 segments) at the top.
- Camera/selfie: oval guide made of dashed hairlines plus a crosshair; the accent corner ticks.
- **Analyzing:** the sunburst preloader from §3.1, wrapped around the user's photo in a circle. Counter `000%→100%`, rotating mono status lines, `ANALİZ EDİLİYOR…` accent tag, scan line.
- Teaser: season name in giant grotesk; palette and looks blurred under a frosted card.
- Paywall: stacked dark cards per plan. The selected plan gets the accent-soft outline and chip (`EN AVANTAJLI`). Big light numerals for price. The primary CTA is a full-width ink pill. Legal text in mono 11 px.
- Results:
  - Hero card with the season in huge type.
  - Metric cards in pairs joined by necks: `Alt ton / Sıcak`, `Kontrast / Düşük` (BRIK "Best score / Reaction speed" layout).
  - Palette as a segmented swatch bar.
  - Look cards with an "AI" accent-soft chip.
- Bottom navigation (mobile app): pill segmented control `SONUÇLAR | GÖRÜNÜMLER` flanked by round ink icon buttons (share, settings).
- Share card (1080×1920): paper canvas, grid lines, giant season name, heat-map blob, palette bar, mono caption, wordmark, "AI ile oluşturuldu".

## 6. Accessibility & performance guardrails
- Contrast:
  - Body text on paper must be ≥ 4.5:1: `ink-muted` on `paper` passes; `ink-subtle` is for ≥ 14 px captions only.
  - Accent red is never used for body text.
- Focus: a 2 px accent outline with a 2 px offset.
- Tap targets ≥ 44 px.
- Web: LCP element = the wordmark (text, not an image). The preloader must not delay it for crawlers or users with reduced motion. JS for animations < 25 kB gz beyond what's already shipped (prefer CSS + IntersectionObserver + rAF; a small library like `motion` is allowed if needed).
- Mobile: use react-native-reanimated for continuous animations (already in the dependency tree via expo-router; add it explicitly if needed) and react-native-svg for lines/sunburst.
