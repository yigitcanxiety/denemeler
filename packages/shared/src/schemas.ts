import { z } from 'zod';

/** Supported UI / content locales. Add a code here plus a dictionary to add a language. */
export const LOCALES = ['tr', 'en'] as const;
export const LocaleSchema = z.enum(LOCALES);
export type Locale = z.infer<typeof LocaleSchema>;
export const DEFAULT_LOCALE: Locale = 'tr';

export const SEASON_IDS = [
  'light_spring',
  'true_spring',
  'bright_spring',
  'light_summer',
  'true_summer',
  'soft_summer',
  'soft_autumn',
  'true_autumn',
  'deep_autumn',
  'deep_winter',
  'true_winter',
  'bright_winter',
] as const;
export const SeasonSchema = z.enum(SEASON_IDS);
export type Season = z.infer<typeof SeasonSchema>;

export const LOOK_IDS = [
  'natural_glow',
  'office_chic',
  'soft_glam',
  'evening_smoky',
  'bridal',
  'bold_lip',
  'no_makeup_makeup',
  'festival_color',
] as const;
export const LookIdSchema = z.enum(LOOK_IDS);
export type LookId = z.infer<typeof LookIdSchema>;

/* ---------- Quiz ---------- */

export const SKIN_TYPES = ['dry', 'oily', 'combination', 'normal', 'sensitive'] as const;
export const EYE_COLORS = ['brown', 'hazel', 'green', 'blue', 'gray', 'black'] as const;
export const OCCASIONS = ['daily', 'work', 'night', 'special'] as const;
export const BUDGETS = ['low', 'mid', 'high'] as const;
export const EXPERIENCE_LEVELS = ['beginner', 'intermediate', 'pro'] as const;

export const QuizAnswersSchema = z.object({
  skinType: z.enum(SKIN_TYPES),
  eyeColor: z.enum(EYE_COLORS),
  occasion: z.enum(OCCASIONS),
  budget: z.enum(BUDGETS),
  experience: z.enum(EXPERIENCE_LEVELS),
});
export type QuizAnswers = z.infer<typeof QuizAnswersSchema>;
export type SkinType = QuizAnswers['skinType'];
export type EyeColor = QuizAnswers['eyeColor'];
export type Occasion = QuizAnswers['occasion'];
export type Budget = QuizAnswers['budget'];
export type ExperienceLevel = QuizAnswers['experience'];

/* ---------- Images ---------- */

/** Max decoded image size accepted by the API (bytes). */
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
/** Max HTTP request body the API accepts (bytes); base64 overhead included. */
export const MAX_BODY_BYTES = 6 * 1024 * 1024;

const DATA_URL_RE = /^data:image\/(jpeg|jpg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/;

/** Decoded byte length of a base64 payload (without decoding it). */
export function base64DecodedLength(b64: string): number {
  const padding = b64.endsWith('==') ? 2 : b64.endsWith('=') ? 1 : 0;
  return Math.floor((b64.length * 3) / 4) - padding;
}

/** Parses an image data URL; returns null if it is not a jpeg/png/webp base64 data URL. */
export function parseImageDataUrl(
  value: string,
): { mimeType: 'image/jpeg' | 'image/png' | 'image/webp'; base64: string; bytes: number } | null {
  const match = DATA_URL_RE.exec(value);
  if (!match) return null;
  const kind = match[1] === 'jpg' ? 'jpeg' : (match[1] as 'jpeg' | 'png' | 'webp');
  const base64 = match[2] as string;
  return { mimeType: `image/${kind}`, base64, bytes: base64DecodedLength(base64) };
}

export const ImageDataUrlSchema = z
  .string()
  .refine((v) => parseImageDataUrl(v) !== null, {
    message: 'Image must be a base64 data URL (jpeg, png or webp)',
  })
  .refine((v) => (parseImageDataUrl(v)?.bytes ?? Infinity) <= MAX_IMAGE_BYTES, {
    message: 'Image must be 4 MB or smaller',
  });

/* ---------- Face analysis ---------- */

export const HexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Expected "#RRGGBB"');

export const QUALITY_ISSUES = [
  'low_light',
  'blurry',
  'face_not_centered',
  'multiple_faces',
  'heavy_makeup',
  'filter_detected',
] as const;
export const UNDERTONES = ['warm', 'cool', 'neutral', 'olive'] as const;
export const SKIN_DEPTHS = ['fair', 'light', 'light_medium', 'medium', 'tan', 'deep'] as const;
export const CONTRASTS = ['low', 'medium', 'high'] as const;
export const FACE_SHAPES = ['oval', 'round', 'square', 'heart', 'long', 'diamond'] as const;
export const EYE_SHAPES = ['almond', 'round', 'hooded', 'monolid', 'downturned', 'upturned'] as const;

export const FaceAnalysisSchema = z.object({
  faceDetected: z.boolean(),
  qualityIssues: z.array(z.enum(QUALITY_ISSUES)),
  undertone: z.enum(UNDERTONES),
  skinDepth: z.enum(SKIN_DEPTHS),
  contrast: z.enum(CONTRASTS),
  faceShape: z.enum(FACE_SHAPES),
  eyeShape: z.enum(EYE_SHAPES),
  season: SeasonSchema,
  seasonConfidence: z.number().min(0).max(1),
  bestColors: z.array(HexColorSchema).min(6).max(10),
  avoidColors: z.array(HexColorSchema).min(3).max(6),
  foundation: z.object({
    undertoneLabel: z.string().min(1),
    shadeRange: z.string().min(1),
  }),
  lip: z.array(HexColorSchema).min(3).max(5),
  blush: z.array(HexColorSchema).min(3).max(5),
  eyeshadow: z.array(HexColorSchema).min(3).max(5),
  summary: z.string().min(1),
});
export type FaceAnalysis = z.infer<typeof FaceAnalysisSchema>;
export type QualityIssue = FaceAnalysis['qualityIssues'][number];
export type Undertone = FaceAnalysis['undertone'];
export type SkinDepth = FaceAnalysis['skinDepth'];
export type Contrast = FaceAnalysis['contrast'];
export type FaceShape = FaceAnalysis['faceShape'];
export type EyeShape = FaceAnalysis['eyeShape'];

/* ---------- Skin analysis ---------- */

export const SKIN_LEVELS = ['low', 'medium', 'high'] as const;
export const SKIN_CONCERNS = ['hydration', 'oiliness', 'pores', 'redness', 'pigmentation', 'texture'] as const;
export type SkinConcern = (typeof SKIN_CONCERNS)[number];
export type SkinLevel = (typeof SKIN_LEVELS)[number];

const SkinLevelSchema = z.enum(SKIN_LEVELS);
const RoutineStepsSchema = z.array(z.string().min(1)).min(2).max(5);

export const SkinAnalysisSchema = z.object({
  faceDetected: z.boolean(),
  qualityIssues: z.array(z.enum(QUALITY_ISSUES)),
  skinType: z.enum(SKIN_TYPES),
  concerns: z.object(
    Object.fromEntries(SKIN_CONCERNS.map((c) => [c, SkinLevelSchema])) as Record<SkinConcern, typeof SkinLevelSchema>,
  ),
  routine: z.object({ morning: RoutineStepsSchema, evening: RoutineStepsSchema }),
  ingredients: z.array(z.string().min(1)).min(2).max(6),
  summary: z.string().min(1),
});
export type SkinAnalysis = z.infer<typeof SkinAnalysisSchema>;

/* ---------- API contracts ---------- */

export const AnalyzeRequestSchema = z.object({
  image: ImageDataUrlSchema,
  locale: LocaleSchema,
  quiz: QuizAnswersSchema.optional(),
});
export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;

export const AnalyzeResponseSchema = z.object({
  analysis: FaceAnalysisSchema,
  recommendedLookIds: z.array(LookIdSchema).length(3),
  mock: z.boolean(),
});
export type AnalyzeResponse = z.infer<typeof AnalyzeResponseSchema>;

export const SkinAnalyzeResponseSchema = z.object({
  skin: SkinAnalysisSchema,
  mock: z.boolean(),
});
export type SkinAnalyzeResponse = z.infer<typeof SkinAnalyzeResponseSchema>;

export const RenderRequestSchema = z.object({
  image: ImageDataUrlSchema,
  lookId: LookIdSchema,
  analysis: FaceAnalysisSchema,
  appUserId: z.string().min(1).max(200).optional(),
  /** Web purchase made through Paddle: its subscription (`sub_…`) or one-time transaction (`txn_…`). */
  paddleRef: z.string().regex(/^(sub|txn)_[a-z0-9]{10,40}$/).optional(),
  locale: LocaleSchema,
});
export type RenderRequest = z.infer<typeof RenderRequestSchema>;

export const RenderResponseSchema = z.object({
  image: z.string().startsWith('data:image/'),
  lookId: LookIdSchema,
  mock: z.boolean(),
});
export type RenderResponse = z.infer<typeof RenderResponseSchema>;

export const API_ERROR_CODES = [
  'bad_request',
  'no_face',
  'too_large',
  'rate_limited',
  'payment_required',
  'quota_exceeded',
  'provider_error',
  'internal',
] as const;
export const ApiErrorCodeSchema = z.enum(API_ERROR_CODES);
export type ApiErrorCode = z.infer<typeof ApiErrorCodeSchema>;

export const ApiErrorSchema = z.object({
  error: z.object({
    code: ApiErrorCodeSchema,
    message: z.string(),
  }),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;

/** HTTP status conventionally paired with each error code. */
export const API_ERROR_STATUS: Record<ApiErrorCode, number> = {
  bad_request: 400,
  no_face: 422,
  too_large: 413,
  rate_limited: 429,
  payment_required: 402,
  quota_exceeded: 403,
  provider_error: 502,
  internal: 500,
};

export const HealthResponseSchema = z.object({
  ok: z.literal(true),
  mock: z.object({ analysis: z.boolean(), render: z.boolean() }),
});
export type HealthResponse = z.infer<typeof HealthResponseSchema>;

/* ---------- Localized content ---------- */

/** A value provided for every supported locale (content catalogues must be complete). */
export type Localized<T = string> = Record<Locale, T>;
