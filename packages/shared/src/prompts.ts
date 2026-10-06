import { getLook, type Look } from './looks';
import {
  CONTRASTS,
  EYE_SHAPES,
  FACE_SHAPES,
  QUALITY_ISSUES,
  SEASON_IDS,
  SKIN_CONCERNS,
  SKIN_LEVELS,
  SKIN_TYPES,
  SKIN_DEPTHS,
  UNDERTONES,
  type FaceAnalysis,
  type Locale,
  type LookId,
  type QuizAnswers,
} from './schemas';
import { SEASONS } from './seasons';

export interface AnalysisPrompt {
  /** System message. */
  system: string;
  /** User message text; the selfie is attached alongside it as an image part. */
  user: string;
}

const LANGUAGE_NAMES: Record<Locale, string> = { tr: 'Turkish', en: 'English' };

const oneOf = (values: readonly string[]) => values.map((v) => `"${v}"`).join(' | ');

const FACE_ANALYSIS_SHAPE = `{
  "faceDetected": boolean,
  "qualityIssues": Array<${oneOf(QUALITY_ISSUES)}>,
  "undertone": ${oneOf(UNDERTONES)},
  "skinDepth": ${oneOf(SKIN_DEPTHS)},
  "contrast": ${oneOf(CONTRASTS)},
  "faceShape": ${oneOf(FACE_SHAPES)},
  "eyeShape": ${oneOf(EYE_SHAPES)},
  "season": ${oneOf(SEASON_IDS)},
  "seasonConfidence": number between 0 and 1,
  "bestColors": 6 to 10 hex strings "#RRGGBB",
  "avoidColors": 3 to 6 hex strings "#RRGGBB",
  "foundation": { "undertoneLabel": string, "shadeRange": string },
  "lip": 3 to 5 hex strings "#RRGGBB",
  "blush": 3 to 5 hex strings "#RRGGBB",
  "eyeshadow": 3 to 5 hex strings "#RRGGBB",
  "summary": string
}`;

/** Prompt for the vision LLM that produces a `FaceAnalysis`. */
export function buildAnalysisPrompt(locale: Locale, quiz?: QuizAnswers): AnalysisPrompt {
  const language = LANGUAGE_NAMES[locale];

  const system = [
    'You are an expert makeup artist and personal colour analyst (12-season system).',
    'You analyse a single selfie and describe colouring objectively: skin undertone, skin depth, contrast between skin, hair and eyes, face shape and eye shape.',
    'Rules:',
    '- Respond with strict JSON only: a single object, no markdown, no code fences, no comments, no extra keys.',
    `- The JSON must match exactly this shape:\n${FACE_ANALYSIS_SHAPE}`,
    '- All colours are uppercase 6-digit hex strings like "#C2A383".',
    '- Never rate, score or compare attractiveness or beauty. Never comment on weight, age or flaws. Describe only what colours and techniques suit the person.',
    '- If no human face is visible, set "faceDetected": false and fill the remaining fields with your best neutral defaults.',
    '- Report every photo problem you notice in "qualityIssues" (e.g. low light, blur, filters, heavy existing makeup), but still give your best analysis.',
    '- "seasonConfidence" reflects how certain you are given lighting and photo quality.',
    `- "summary" is 2–3 warm, encouraging sentences in ${language} explaining the season and what suits the person. "foundation.undertoneLabel" and "foundation.shadeRange" are short and in ${language}.`,
  ].join('\n');

  const quizLines = quiz
    ? [
        'Self-reported answers (use as hints; trust the photo when they conflict):',
        `- skin type: ${quiz.skinType}`,
        `- eye colour: ${quiz.eyeColor}`,
        `- occasion they want makeup for: ${quiz.occasion}`,
        `- budget: ${quiz.budget}`,
        `- makeup experience: ${quiz.experience}`,
      ].join('\n')
    : 'No questionnaire answers were provided.';

  const user = [
    'Analyse the attached selfie and return the JSON object.',
    quizLines,
    `Write human-readable text in ${language}. Return JSON only.`,
  ].join('\n\n');

  return { system, user };
}

const SKIN_ANALYSIS_SHAPE = `{
  "faceDetected": boolean,
  "qualityIssues": Array<${oneOf(QUALITY_ISSUES)}>,
  "skinType": ${oneOf(SKIN_TYPES)},
  "concerns": { ${SKIN_CONCERNS.map((c) => `"${c}": ${oneOf(SKIN_LEVELS)}`).join(', ')} },
  "routine": { "morning": 2 to 5 short strings, "evening": 2 to 5 short strings },
  "ingredients": 2 to 6 short strings,
  "summary": string
}`;

/** Prompt for the vision LLM that produces a `SkinAnalysis` (skincare, not colour). */
export function buildSkinAnalysisPrompt(locale: Locale): AnalysisPrompt {
  const language = LANGUAGE_NAMES[locale];

  const system = [
    'You are an experienced skincare consultant. You look at a single selfie and describe the visible state of the facial skin for a cosmetic skincare routine.',
    'Rules:',
    '- Respond with strict JSON only: a single object, no markdown, no code fences, no comments, no extra keys.',
    `- The JSON must match exactly this shape:\n${SKIN_ANALYSIS_SHAPE}`,
    '- "concerns" rates how visible each item is: "hydration" is how well-hydrated the skin looks ("low" = looks dehydrated), "oiliness" is visible shine, "pores" is pore visibility, "redness" is visible redness, "pigmentation" is uneven tone or dark spots, "texture" is visible unevenness of the surface.',
    '- This is cosmetic guidance, not a medical diagnosis. Never name diseases or conditions (no acne type, rosacea, eczema, melasma diagnoses), never mention age, weight or attractiveness, and keep the tone kind and neutral.',
    '- "routine" steps are short, generic product types with a purpose (e.g. "Gentle gel cleanser"), never brand names. Always include sunscreen in the morning.',
    '- "ingredients" are well-known cosmetic ingredients that suit the observed skin (e.g. niacinamide, hyaluronic acid).',
    '- If no human face is visible, set "faceDetected": false and fill the remaining fields with your best neutral defaults.',
    '- Report every photo problem you notice in "qualityIssues" (low light, blur, filters, heavy makeup hide the skin), but still give your best analysis.',
    `- "summary" is 2–3 warm, practical sentences in ${language}. "routine" and "ingredients" are in ${language}.`,
  ].join('\n');

  const user = ['Analyse the skin in the attached selfie and return the JSON object.', `Write human-readable text in ${language}. Return JSON only.`].join('\n\n');

  return { system, user };
}

const hexList = (colors: string[]) => colors.join(', ');

/** Prompt for the image-editing model that applies a look to the user's own photo. */
export function buildRenderPrompt(look: Look | LookId, analysis: FaceAnalysis): string {
  const resolved = typeof look === 'string' ? getLook(look) : look;
  const season = SEASONS[analysis.season];

  const makeup = resolved.promptTemplate
    .replaceAll('{lip}', hexList(analysis.lip))
    .replaceAll('{blush}', hexList(analysis.blush))
    .replaceAll('{eyeshadow}', hexList(analysis.eyeshadow))
    .replaceAll('{undertone}', analysis.undertone)
    .replaceAll('{season}', season.name.en);

  return [
    'Edit this photo by applying makeup only.',
    `Apply ${makeup}.`,
    `The colours are chosen for a ${season.name.en} colouring with a ${analysis.undertone} undertone; match the foundation to the existing skin tone exactly.`,
    'Strict requirements:',
    '- Keep the person’s identity exactly the same: same person, recognisable at a glance.',
    '- Keep face geometry unchanged: do not reshape, slim, enlarge or move the face, jaw, nose, lips, eyes or eyebrows. No retouching of face shape.',
    '- Keep natural skin texture (pores, freckles, fine lines) visible; do not airbrush or smooth the skin beyond what the makeup itself does.',
    '- Keep hair, clothing, accessories, background, lighting, camera angle, framing and image resolution unchanged.',
    '- Only add makeup. Do not add or remove any objects, and do not change age, expression or body.',
    '- The result must be photorealistic, as if the makeup had been applied in real life and photographed in the same conditions.',
  ].join('\n');
}
