# Tonelle — Architecture & Contracts

Single source of truth for everyone working on the codebase. If code and this file disagree, fix one of them in the same change.

Product: selfie → AI face/colour analysis → personalised makeup looks rendered on the user's own face → shade/product guidance. Markets: Türkiye (TR) and EU. Languages at launch: `tr`, `en` (structure must allow `de`, `fr`, `es`, `it`, `pl`, `nl` later by adding a dictionary only).
Publisher: Doribleg Trade Ltd.

## Repo layout (pnpm workspaces)

```
/                         pnpm-workspace.yaml, root package.json, tsconfig.base.json, .npmrc
packages/shared           @tonelle/shared — pure TypeScript, no React, no Node-only APIs
apps/web                  @tonelle/web — Next.js (App Router). Marketing site + web flow + ALL backend API routes
apps/mobile               @tonelle/mobile — Expo app (iOS + Android). Calls apps/web API over HTTPS
docs/                     this file, setup docs
```

There is no separate backend service. The Next.js app on Vercel (EU region `fra1`) is the backend for both web and mobile.

## Core principles

1. **We do not train or host models.** Analysis = a vision LLM via OpenRouter (model id from env). Rendering = an image-editing model (Gemini image, fal.ai or Kie.ai Nano Banana) via env. With only `KIE_API_KEY`, both analysis and rendering go through Kie.ai.
2. **We never store selfies.** Photos arrive in the request body, are forwarded to the AI provider, and are dropped when the request ends. No DB, no bucket, no logs of image bytes. Analysis results live on the client (localStorage / AsyncStorage).
3. **Mock mode.** When the relevant API key is missing (or `TONELLE_MOCK=1`), endpoints return deterministic fixture data so the whole product runs locally and in CI with zero keys.
4. **Rendering costs money, so it is paid-only.** `/api/render-look` requires a verified entitlement (except in mock mode).
5. **No attractiveness scores.** Never rate beauty. Language is always "what suits you".
6. **AI-generated images are labelled** ("AI ile oluşturuldu" / "AI-generated") in the UI and share card (EU AI Act Art. 50).

## Shared package (`@tonelle/shared`)

Exports (all from `src/index.ts`):

- `schemas.ts` — zod schemas + inferred types:
  - `QuizAnswers` `{ skinType: 'dry'|'oily'|'combination'|'normal'|'sensitive', eyeColor: 'brown'|'hazel'|'green'|'blue'|'gray'|'black', occasion: 'daily'|'work'|'night'|'special', budget: 'low'|'mid'|'high', experience: 'beginner'|'intermediate'|'pro' }`
  - `AnalyzeRequest` `{ image: string /* data URL, jpeg/png/webp, ≤ 4 MB decoded */, locale: Locale, quiz?: QuizAnswers }`
  - `FaceAnalysis` (the LLM must return exactly this JSON):
    ```
    {
      faceDetected: boolean,
      qualityIssues: ('low_light'|'blurry'|'face_not_centered'|'multiple_faces'|'heavy_makeup'|'filter_detected')[],
      undertone: 'warm'|'cool'|'neutral'|'olive',
      skinDepth: 'fair'|'light'|'light_medium'|'medium'|'tan'|'deep',
      contrast: 'low'|'medium'|'high',
      faceShape: 'oval'|'round'|'square'|'heart'|'long'|'diamond',
      eyeShape: 'almond'|'round'|'hooded'|'monolid'|'downturned'|'upturned',
      season: Season,                       // one of the 12 below
      seasonConfidence: number,             // 0..1
      bestColors: string[],                 // 6–10 hex "#RRGGBB"
      avoidColors: string[],                // 3–6 hex
      foundation: { undertoneLabel: string, shadeRange: string },
      lip: string[], blush: string[], eyeshadow: string[],   // 3–5 hex each
      summary: string                       // 2–3 sentences in requested locale, warm tone, no beauty scoring
    }
    ```
  - `AnalyzeResponse` `{ analysis: FaceAnalysis, recommendedLookIds: LookId[] /* 3 */, mock: boolean }`
  - `RenderRequest` `{ image: string, lookId: LookId, analysis: FaceAnalysis, appUserId?: string, locale: Locale }`
  - `RenderResponse` `{ image: string /* data URL */, lookId: LookId, mock: boolean }`
  - `ApiError` `{ error: { code: 'bad_request'|'no_face'|'too_large'|'rate_limited'|'payment_required'|'provider_error'|'internal', message: string } }`
- `seasons.ts` — `SEASONS` (12: `light_spring, true_spring, bright_spring, light_summer, true_summer, soft_summer, soft_autumn, true_autumn, deep_autumn, deep_winter, true_winter, bright_winter`), each with localized name/description and a reference palette (hex).
- `looks.ts` — `LOOKS` catalogue (ids: `natural_glow, office_chic, soft_glam, evening_smoky, bridal, bold_lip, no_makeup_makeup, festival_color`). Each: localized name, short description, tags (occasion), step-by-step guide (localized, 4–7 steps), and a `promptTemplate` used by the renderer. `recommendLooks(analysis, quiz?) → LookId[3]`.
- `prompts.ts` — `buildAnalysisPrompt(locale, quiz?)` (system + user text instructing strict JSON matching `FaceAnalysis`), `buildRenderPrompt(look, analysis)` (must say: keep identity, face geometry, skin texture, hair, background, lighting unchanged; only apply makeup; photorealistic; no retouching of face shape).
- `i18n/` — `Locale = 'tr'|'en'`, `dictionaries` (`tr.ts`, `en.ts`) with all UI copy used by BOTH web and mobile (onboarding, quiz, consent, analysis, paywall, results, errors, legal short texts). `t(locale, key)` helper. Missing keys fall back to `en`.
- `pricing.ts` — plan definitions used for display only (actual prices come from the stores / RevenueCat): TR weekly ₺129.99 with first-week intro ₺39.99, TR yearly ₺799.99 (3-day trial), TR one-time report ₺199; EU weekly €3.99, EU yearly €24.99 (3-day trial), EU one-time €6.99; exit offer = 50% off yearly. Product ids: `tonelle_weekly`, `tonelle_yearly`, `tonelle_report`. RevenueCat entitlement id: `premium`.
- `fixtures.ts` — `MOCK_ANALYSIS` (valid `FaceAnalysis`, soft_autumn) used by mock mode and tests.

## HTTP API (apps/web, `app/api/*/route.ts`, Node runtime)

All JSON. CORS allows the mobile app (no cookies). Body limit 6 MB.

| Method | Path | Body | Response | Notes |
|---|---|---|---|---|
| POST | `/api/analyze` | `AnalyzeRequest` | `AnalyzeResponse` | Free. Rate limit 10/hour/IP. 422 `no_face` if `faceDetected=false`. |
| POST | `/api/render-look` | `RenderRequest` | `RenderResponse` | Paid. Verifies `appUserId` has RevenueCat entitlement `premium` via REST API (`REVENUECAT_SECRET_KEY`). 402 `payment_required` otherwise. Rate limit 30/hour/user. |
| GET | `/api/health` | – | `{ ok: true, mock: { analysis: boolean, render: boolean } }` | |

Server env (`apps/web/.env.example`):
```
OPENROUTER_API_KEY=
ANALYSIS_MODEL=stealth/space-bunny-alpha      # swap to e.g. google/gemini-2.5-flash without code changes
ANALYSIS_FALLBACK_MODEL=google/gemini-2.5-flash
KIE_API_KEY=                                   # Kie.ai: analysis fallback when no OpenRouter key + renders
KIE_ANALYSIS_MODEL=gemini-3-flash
KIE_IMAGE_MODEL=google/nano-banana-edit
IMAGE_PROVIDER=                                # gemini | fal | kie (empty: kie if only KIE_API_KEY is set)
GEMINI_API_KEY=
GEMINI_IMAGE_MODEL=gemini-2.5-flash-image
FAL_KEY=
FAL_IMAGE_MODEL=fal-ai/nano-banana/edit
REVENUECAT_SECRET_KEY=
TONELLE_MOCK=                                  # 1 forces mock mode
NEXT_PUBLIC_SITE_URL=https://tonelle.app
NEXT_PUBLIC_APP_STORE_URL=
NEXT_PUBLIC_PLAY_STORE_URL=
```

## Web (apps/web)

Routes (locale prefix, default `tr`, `en` available; `/` redirects by Accept-Language):
- `/[locale]` landing (hero with before/after, how it works, looks gallery, pricing, FAQ, store badges)
- `/[locale]/analyze` web flow: consent → quiz → selfie (upload or webcam) → scanning animation → blurred teaser → paywall → results (season, palette, 3 looks, shade guidance, steps) → share card (PNG download)
- `/[locale]/privacy`, `/[locale]/kvkk` (aydınlatma metni), `/[locale]/consent` (açık rıza metni), `/[locale]/terms`, `/[locale]/contact`
- Web payment is not live yet: the web paywall shows plans and routes to the app stores (env URLs). Keep a `PaymentProvider` seam for Paddle/Stripe later.

Design: see docs/DESIGN.md (v3 "Aura"; v1 scope = colour analysis + makeup try-on). Tokens in `apps/web/src/styles/tokens.css`, mirrored in `apps/mobile/src/theme.ts`.

## Mobile (apps/mobile)

Expo (SDK 57), TypeScript, expo-router. Tabs: Bugün (home) · Sonuçlar (results) · centre scan button · Profil (settings, preferences quiz, restore, delete data, legal). Flow: consent (first time) → selfie tips → camera/upload + "Harika görünüyorsun" confirmation → analyzing → teaser (locked result) → paywall (RevenueCat, weekly + yearly + one-time report, intro price, exit offer) → results → look try-on (before/after slider) → share card. API base URL from `EXPO_PUBLIC_API_URL`. RevenueCat keys from `EXPO_PUBLIC_RC_IOS_KEY` / `EXPO_PUBLIC_RC_ANDROID_KEY`; when absent the app runs in "dev purchases" mode that unlocks locally. Bundle id / package: `app.tonelle`.

## Quality gates

`pnpm -r typecheck`, `pnpm -r lint`, `pnpm -r test`, `pnpm --filter @tonelle/web build` must pass. Unit tests with vitest for shared + API logic.
