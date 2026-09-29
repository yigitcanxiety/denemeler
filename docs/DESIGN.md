# Tonelle Design Language v3 ("Aura")

Approved by the founder on 2026-09-29. Replaces v2 ("Editorial Lab"), which was rejected. Reference prototype: `docs/design/prototype-v3.html`. Its screenshots are in the lead's scratchpad; the faces in it are temporary reference crops and must NOT ship.

It is built from two references:
- **Features and flow** follow the Glamour app (competitor), from the founder's screen recording.
- **Visual language** follows the Aura concept on Dribbble: white surfaces, lavender, a high-contrast serif display, floating data chips on a real face photo, radar and bar charts, "% fit" product badges.

If you change a token, change it in both `apps/web/src/styles/tokens.css` and `apps/mobile/src/theme.ts`.

## 1. Scope of v1 (founder decision)

v1 includes exactly two features:
1. **Renk analizi** (colour analysis):
   - selfie tips
   - selfie capture or upload
   - "Harika selfie!" confirmation
   - scan
   - locked result, then paywall
   - full result: season, palette, colour-profile radar, bars, undertone/contrast/face-shape/skin-colour cards
2. **Makyaj denemesi** (makeup try-on): the looks rendered on the user's own face with a before/after slider, look chips, and shade cards with "% uyum" badges.

**Not in v1:** skin analysis, the beauty assistant chat, a shop or cart. Do not show them. Do not show "coming soon" teasers either.

## 2. Tokens

| Token | Hex | Use |
|---|---|---|
| `board` | `#E9E5FB` | lavender page/section backdrops, marketing only |
| `paper` | `#FFFFFF` | app surface |
| `mist` | `#F6F4FE` | tinted wells, chips, secondary cards |
| `ink` | `#17141F` | text, dark phone chrome |
| `muted` | `#6B6679` | secondary text (AA on white) |
| `line` | `#E6E2F3` | hairlines, card borders |
| `violet` | `#7457F5` | primary buttons, progress, selected state, radar |
| `violet-2` | `#8E75FF` | gradient partner for FAB/lock button |
| `violet-soft` | `#EDE8FF` | selected fills, soft badges |
| `rose` | `#E4718A` | makeup accent: try-on card, makeup chips |
| `rose-soft` | `#FCE9EE` | makeup wells |
| `mint` / `mint-ink` | `#CFF3D6` / `#1E7A3A` | "% uyum" ≥ 90, success |
| `butter` / `butter-ink` | `#FFE9A8` / `#8A6400` | "% uyum" 75–89 |
| `rose` pill | `#FCE9EE` / `#B23E5A` | "% uyum" < 75, warnings |

Chart bar colours, as in Aura: warmth `#F29A5E`, contrast `#6C9BEF`, softness `#D983E6`, depth `#5B6BF0`.

Typography:
- Display: **Gloock** (Google), weight 400. Used for headings, the wordmark "Tonelle", big numbers such as prices and %.
- UI and body: **Plus Jakarta Sans** 400/500/600/700.
- No monospace. Remove Inter Tight and JetBrains Mono.
- Scale (mobile): display 26–32, h2 22–25, section 18, body 15, small 12.5, caption 10–11.
- Web hero headline: up to 64 px.

Shape and depth:
- Radii: phone-level cards 22, cards 16–18, chips and pills 999, buttons 999 with 48 px height.
- Shadows are soft and violet-tinted, e.g. `0 10px 24px -12px #7457F5` under primary buttons.
- Floating chips on photos: white at 92% opacity with a backdrop blur, radius 12, a small shadow.
- Iconography is simple line icons, stroke 1.75, e.g. lucide on web and react-native-svg equivalents on mobile. No emoji in production UI.

## 3. Screens (mobile app AND web /analyze flow share these)

Numbers refer to the prototype.

1. **Ana sayfa (Bugün):**
   - top bar with the "Tonelle" serif wordmark and a round settings/menu icon button
   - chip `✦ KENDİNİ KEŞFET`
   - serif headline "Yapay Zekâ ile Yüz Taraması, Anında Sonuç" and a short lead
   - hero portrait in a rounded card, with floating chips (Alt ton, Renk sezonu, a small uyum ring) and a gradient `✦ Tonelle` FAB
   - two feature cards: Renk Analizi (violet-soft) and Makyaj Denemesi (rose-soft)
   - if a result exists, a "Son analizin" card with season and palette
2. **Selfie ipuçları ("En iyi açını yakala"):** a tips well (light, no makeup, hair off face, no filter); "İdeal selfie" row of 3 thumbs with a green outline and ✓; "Kaçınılması gerekenler" row of 3 dimmed thumbs with a red outline and reason chips (Karanlık, Filtre, Açılı); CTA "Selfie çek veya yükle".
3. **Capture:**
   - Mobile: expo-camera with a circular face guide and a violet ring. Web: upload or webcam.
   - Then **"Harika görünüyorsun"**: the photo in a circle with a violet ring, a `✓ Harika selfie!` chip, a ghost button "Başka selfie seç", and the primary "Analizi başlat".
   - Quality problems from the API (`qualityIssues`) show as a warning chip with a retake CTA.
4. **Tarama:** chip `✦ ANALİZ SÜRÜYOR`, serif "Renklerini okuyoruz", the photo in a circle inside a progress ring (0→100 over the request), face-mesh dots/lines overlay, a moving soft violet scan band, a big serif %, and a step checklist (done ✓, current in violet, pending grey). The steps come from the `analyzing.*` copy.
5. **Kilitli sonuç:**
   - a `1/6` pill plus a segmented step bar and a close button
   - avatar photo with a double ring
   - "Senin renk sezonun" with the season name blurred
   - gradient lock button "Sonuçlarını aç"
   - 2×2 locked cards (Cilt alt tonu, Kontrast, Yüz şekli, Cilt rengi) with placeholder bars
   - primary CTA "3 gün ücretsiz dene ✦" and the fine print (price, cancel anytime, Gizlilik · Geri yükle · Kullanım şartları)
6. **Ödeme ekranı:**
   - a close button (triggers the exit offer), "Geri yükle"
   - serif title, a checklist of benefits (colour analysis + makeup try-on only)
   - plan cards: Yıllık selected by default with an "En avantajlı · %X" badge and big serif weekly-equivalent price; Haftalık with intro price; Tek rapor
   - primary CTA and the legal fine print
   - Prices come from shared PRICING/RevenueCat.
7. **Renk sonucu (Sonuçlar tab):**
   - a gradient season card (serif season name + palette swatches)
   - the colour-profile **radar** from `colorProfile(analysis)` with `PROFILE_AXIS_LABELS`
   - 3 coloured **bars** (Sıcaklık, Kontrast, Yumuşaklık)
   - a 2×2 trait card grid (alt ton, kontrast, yüz şekli, göz şekli)
   - "En iyi renklerin" and "Kaçınman gerekenler" swatches
   - foundation guidance
   - a shades section (lip/blush/eyeshadow) where each swatch card shows a "% uyum" pill from `shadeMatch(hex, analysis)`
   - share button
8. **Makyaj denemesi:**
   - back title and horizontally scrollable look chips (from LOOKS; selected = ink pill)
   - a before/after **draggable slider** over the user's photo and the rendered look (`/api/render-look`), with "Önce" and "Sonra" labels and an `✦ AI ile oluşturuldu` pill
   - loading shows a shimmer over the photo
   - "Bu görünüm için tonların": 3 shade cards with "% uyum" pills and a colour tube
   - the look's steps in an accordion
   - Premium-gated; locked users see the paywall.
9. **Tab bar (mobile):** Bugün · Sonuçlar · centre round scan button (starts a new analysis) · Profil (settings, language, restore, delete data, legal). The "Asistan" tab is out of v1.

The share card (1080×1920) uses a white/lavender background, the serif season name, the palette, the portrait in a rounded frame if available, the wordmark, and "AI ile oluşturuldu".

## 4. Web landing (Aura tablet screen as the model)

- Header: serif wordmark, nav (Nasıl çalışır, Makyaj denemesi, Fiyatlar, SSS), language switch, violet pill "✦ Analizi başlat".
- Hero: centred chip, big serif headline, lead, store badges plus a CTA, and a large portrait with floating data chips. On desktop, text cards sit left and right of the portrait, as in Aura.
- "Önce / Sonra": a before/after slider section, with the explanation text on one side and shade cards with "% uyum" on the other.
- 3 steps (selfie → analiz → yüzünde dene), each as a card with a small UI snippet.
- Colour-profile section with a radar and a palette.
- Looks gallery: cards with a portrait and the look name.
- Testimonials: keep the existing data in `content/testimonials.ts` (placeholders, with the small "Örnek kullanıcı senaryoları" caption), restyled as Aura review cards with name, stars, a short quote and an avatar.
- Pricing: the plan cards from the app.
- FAQ accordion, then the footer.
- Remove the preloader, grid lines, giant wordmark, mono type, dark sphere section and sticky dock from v2.
- A simple mobile sticky CTA bar is OK.

## 5. Photography

Real, natural-looking portraits are central to this look. Until the founder uploads the approved AI portraits, reference these files:
- `apps/web/public/images/portrait-hero.jpg`, `portrait-2.jpg`, `portrait-3.jpg`, `portrait-after.jpg`
- `apps/mobile/assets/images/portrait-hero.jpg`, `portrait-2.jpg`, `portrait-3.jpg`

Commit neutral placeholder images at those paths: soft lavender/peach gradient JPGs with a subtle silhouette, generated locally. They will be replaced by the real files without code changes. Never use third-party photos. Dimmed "kaçınılacak" examples reuse the same portraits with CSS/RN filters.

## 6. Motion

Calm and quick:
- screen transitions: 250 ms fade + 8 px rise
- button press: scale to 0.98
- the scan band loops (2.6 s)
- the progress ring and % count smoothly
- radar polygon grows from the centre (600 ms)
- bars fill (500 ms, staggered)
- the before/after slider follows the finger

Respect reduced motion: no loops, fades only.

## 7. Quality bars

- WCAG AA contrast. Violet on white is used only for large or bold text and buttons.
- 44 px tap targets, visible focus rings (2 px violet, with offset).
- No horizontal scroll at 360 px.
- No beauty scoring anywhere. "% uyum" is only about shade/season fit.
