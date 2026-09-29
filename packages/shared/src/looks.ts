import {
  LOOK_IDS,
  type ExperienceLevel,
  type FaceAnalysis,
  type Localized,
  type LookId,
  type Occasion,
  type QuizAnswers,
} from './schemas';
import { SEASONS } from './seasons';

export type LookIntensity = 'subtle' | 'medium' | 'bold';
export type LookStepArea = 'prep' | 'base' | 'eyes' | 'brows' | 'cheeks' | 'lips' | 'finish';

export interface LookStep {
  area: LookStepArea;
  title: Localized;
  body: Localized;
}

export interface Look {
  id: LookId;
  name: Localized;
  description: Localized;
  /** Occasions this look is designed for (used as tags and for recommendations). */
  occasions: Occasion[];
  intensity: LookIntensity;
  /** Experience level the steps are written for. */
  level: ExperienceLevel;
  steps: LookStep[];
  /**
   * Makeup description sent to the image model. Placeholders filled by `buildRenderPrompt`:
   * {lip} {blush} {eyeshadow} (hex lists from the analysis), {undertone}, {season}.
   */
  promptTemplate: string;
}

const step = (area: LookStepArea, title: Localized, body: Localized): LookStep => ({ area, title, body });

export const LOOKS: Record<LookId, Look> = {
  natural_glow: {
    id: 'natural_glow',
    name: { tr: 'Doğal Işıltı', en: 'Natural Glow' },
    description: {
      tr: 'Taze, aydınlık ve zahmetsiz: cildini parlatan hafif bir günlük makyaj.',
      en: 'Fresh, luminous and effortless: a light everyday look that lets your skin glow.',
    },
    occasions: ['daily', 'work'],
    intensity: 'subtle',
    level: 'beginner',
    steps: [
      step(
        'prep',
        { tr: 'Cildi hazırla', en: 'Prep your skin' },
        {
          tr: 'Nemlendiriciyi ince bir katman hâlinde sür ve bir dakika emilmesini bekle. Gündüzse güneş koruyucuyu atlama.',
          en: 'Apply a thin layer of moisturiser and give it a minute to sink in. During the day, never skip sunscreen.',
        },
      ),
      step(
        'base',
        { tr: 'Hafif ten', en: 'Sheer base' },
        {
          tr: 'Önerilen ton aralığındaki renkli nemlendirici ya da hafif fondöteni parmak uçlarınla yüzün ortasından dışa doğru yay. Kapatıcıyı yalnızca gereken yerlere nokta nokta uygula.',
          en: 'Blend a tinted moisturiser or light foundation in your recommended shade range from the centre of your face outwards. Dot concealer only where you need it.',
        },
      ),
      step(
        'cheeks',
        { tr: 'Krem allık', en: 'Cream blush' },
        {
          tr: 'Paletindeki allık tonlarından birini elmacık kemiklerinin üstüne tapotman yaparak yedir. Az miktarla başla, gerekirse katman ekle.',
          en: 'Tap one of your palette blush shades onto the apples of your cheeks. Start with a little and build up if needed.',
        },
      ),
      step(
        'eyes',
        { tr: 'Açık göz', en: 'Open eyes' },
        {
          tr: 'Göz kapağına en açık far tonunu parmakla sür, ardından kirpiklere tek kat maskara uygula.',
          en: 'Sweep your lightest eyeshadow shade over the lid with a fingertip, then add one coat of mascara.',
        },
      ),
      step(
        'lips',
        { tr: 'Renkli nem', en: 'Tinted lips' },
        {
          tr: 'Dudak renginle uyumlu, önerilen ruj tonlarından birinde renkli dudak balmı ya da parlatıcı kullan.',
          en: 'Finish with a tinted balm or gloss in one of your recommended lip shades close to your natural colour.',
        },
      ),
    ],
    promptTemplate:
      'a fresh, natural "glowy skin" makeup look: sheer, skin-like base that keeps freckles and pores visible, soft cream blush in {blush} on the apples of the cheeks, a light wash of {eyeshadow} on the lids, one coat of brown-black mascara, tinted balm lips in {lip}, subtle dewy highlight on the high points of the face',
  },
  office_chic: {
    id: 'office_chic',
    name: { tr: 'Ofis Şıklığı', en: 'Office Chic' },
    description: {
      tr: 'Toplantıdan akşam yemeğine: düzenli, mat ve kendinden emin bir iş makyajı.',
      en: 'From meetings to dinner: a polished, matte and confident workday look.',
    },
    occasions: ['work', 'daily'],
    intensity: 'medium',
    level: 'beginner',
    steps: [
      step(
        'base',
        { tr: 'Dengeli ten', en: 'Even base' },
        {
          tr: 'Orta kapatıcılıkta, önerilen tonundaki fondöteni süngerle uygula. T bölgesini şeffaf pudrayla hafifçe sabitle.',
          en: 'Apply a medium-coverage foundation in your recommended shade with a damp sponge. Lightly set your T-zone with translucent powder.',
        },
      ),
      step(
        'brows',
        { tr: 'Düzenli kaşlar', en: 'Groomed brows' },
        {
          tr: 'Kaşlarını yukarı doğru tara, boşlukları ince uçlu kaş kalemiyle kıl kıl doldur ve şeffaf jelle sabitle.',
          en: 'Brush your brows upwards, fill gaps with fine hair-like strokes and set with a clear gel.',
        },
      ),
      step(
        'eyes',
        { tr: 'Mat geçiş', en: 'Matte transition' },
        {
          tr: 'Paletindeki orta tonlu mat farı göz kapağı çukuruna yumuşakça dağıt. Kirpik diplerine koyu kahve kalemle ince bir çizgi çekip maskara sür.',
          en: 'Diffuse a mid-tone matte shade from your palette into the crease. Tightline with a dark brown pencil and finish with mascara.',
        },
      ),
      step(
        'cheeks',
        { tr: 'Hafif şekillendirme', en: 'Soft sculpt' },
        {
          tr: 'Elmacık kemiklerinin hemen altına çok hafif bronzer, üstüne ise önerilen allık tonunu ince bir tül gibi uygula.',
          en: 'Add a whisper of bronzer just under your cheekbones and a sheer veil of your recommended blush above.',
        },
      ),
      step(
        'lips',
        { tr: 'Saten dudak', en: 'Satin lips' },
        {
          tr: 'Dudak rengine yakın, önerilen ruj tonlarından birini saten bitişli rujla uygula; kenarları dudak kalemiyle netleştir.',
          en: 'Apply a satin lipstick in a recommended shade close to your natural lip colour, and define the edges with a liner.',
        },
      ),
    ],
    promptTemplate:
      'a polished, professional office makeup look: even medium-coverage matte base, groomed natural brows, soft matte {eyeshadow} diffused in the crease, thin brown tightline and mascara, light sculpting under the cheekbones with a sheer {blush} blush, satin lipstick in {lip}',
  },
  soft_glam: {
    id: 'soft_glam',
    name: { tr: 'Yumuşak Glam', en: 'Soft Glam' },
    description: {
      tr: 'Işıltılı ama yumuşak: sofistike davetler ve fotoğraflar için dengeli bir glam.',
      en: 'Radiant yet soft: a balanced glam for elegant events and photos.',
    },
    occasions: ['special', 'night'],
    intensity: 'medium',
    level: 'intermediate',
    steps: [
      step(
        'base',
        { tr: 'Işıltılı ten', en: 'Luminous base' },
        {
          tr: 'Aydınlatıcı bir baz üzerine önerilen tonundaki fondöteni katman katman uygula; göz altını bir ton açık kapatıcıyla aydınlat.',
          en: 'Build your recommended foundation shade over an illuminating primer, and brighten under the eyes with a concealer one shade lighter.',
        },
      ),
      step(
        'eyes',
        { tr: 'Yumuşak degrade', en: 'Soft gradient' },
        {
          tr: 'Paletindeki sıcak ya da serin orta tonu çukura, en koyu tonu dış köşeye uygula ve iyice dağıt. Göz kapağının ortasına ışıltılı bir ton ekle.',
          en: 'Blend a mid-tone from your palette into the crease and the deepest shade into the outer corner. Add a shimmer to the centre of the lid.',
        },
      ),
      step(
        'eyes',
        { tr: 'Kirpikler', en: 'Lashes' },
        {
          tr: 'İki kat maskara sür; istersen dış köşelere birkaç tutam takma kirpik ekle.',
          en: 'Apply two coats of mascara, and add a few individual lashes at the outer corners if you like.',
        },
      ),
      step(
        'cheeks',
        { tr: 'Allık ve aydınlatıcı', en: 'Blush and highlight' },
        {
          tr: 'Önerilen allığı elmacık kemiklerinden şakaklara doğru dağıt; aydınlatıcıyı elmacık kemiklerinin en üstüne ve burun kemerine sür.',
          en: 'Sweep your recommended blush from the cheekbones towards the temples; add highlighter to the top of the cheekbones and the bridge of the nose.',
        },
      ),
      step(
        'lips',
        { tr: 'Dolgun dudak', en: 'Plush lips' },
        {
          tr: 'Dudak kalemiyle konturu çiz, önerilen tonlardan birinde rujunu sür ve dudağın ortasına bir damla parlatıcı ekle.',
          en: 'Line your lips, fill with one of your recommended shades and dab a touch of gloss in the centre.',
        },
      ),
      step(
        'finish',
        { tr: 'Sabitle', en: 'Set' },
        {
          tr: 'Sabitleyici spreyi yüzüne 20 cm mesafeden sık; makyajın gün boyu yerinde kalır.',
          en: 'Mist a setting spray from about 20 cm away so everything stays in place.',
        },
      ),
    ],
    promptTemplate:
      'a soft glam makeup look: luminous full-coverage but skin-like base, blended gradient eyeshadow using {eyeshadow} with a shimmer on the centre of the lid, fluffy defined lashes, diffused {blush} blush towards the temples, soft highlight on the cheekbones, lined plush lips in {lip} with a touch of gloss',
  },
  evening_smoky: {
    id: 'evening_smoky',
    name: { tr: 'Gece Dumanlı Göz', en: 'Evening Smoky Eye' },
    description: {
      tr: 'Derin bakışlar için: gece dışarı çıkarken dikkat çeken dumanlı bir göz makyajı.',
      en: 'For a deep, magnetic gaze: a smoky eye made for nights out.',
    },
    occasions: ['night', 'special'],
    intensity: 'bold',
    level: 'intermediate',
    steps: [
      step(
        'eyes',
        { tr: 'Önce gözler', en: 'Eyes first' },
        {
          tr: 'Dökülmeleri sonra temizleyebilmek için göz makyajıyla başla. Kapağa far bazı sür.',
          en: 'Start with the eyes so you can clean up any fallout afterwards. Apply an eyeshadow primer to the lid.',
        },
      ),
      step(
        'eyes',
        { tr: 'Dumanlı katmanlar', en: 'Build the smoke' },
        {
          tr: 'Koyu kalemi kirpik dibine çek ve kısa bir fırçayla yukarı doğru dağıt. Üzerine paletindeki en koyu tonu, çukura ise orta tonu uygula; kenarlarda sert çizgi kalmayana kadar dağıt.',
          en: 'Draw a dark pencil along the lash line and smudge it upwards with a short brush. Press your deepest palette shade on top and a mid-tone in the crease; blend until no harsh edges remain.',
        },
      ),
      step(
        'eyes',
        { tr: 'Alt kirpik ve maskara', en: 'Lower lash line and mascara' },
        {
          tr: 'Aynı koyu tonu alt kirpik diplerine ince bir şekilde dağıt; birkaç kat maskarayla bitir.',
          en: 'Smudge the same deep shade softly along the lower lash line and finish with several coats of mascara.',
        },
      ),
      step(
        'base',
        { tr: 'Temiz ten', en: 'Clean base' },
        {
          tr: 'Göz altındaki dökülmeleri temizle, ardından fondöten ve kapatıcını uygula. Ten mat ve sade kalsın.',
          en: 'Clean up any fallout under the eyes, then apply foundation and concealer. Keep the skin matte and simple.',
        },
      ),
      step(
        'lips',
        { tr: 'Nötr dudaklar', en: 'Neutral lips' },
        {
          tr: 'Gözler ön planda olduğu için önerilen tonlarından en nötr olanını seç ve dudaklara yumuşak bir şekilde uygula.',
          en: 'With the eyes as the focus, choose the most neutral of your recommended lip shades and apply it softly.',
        },
      ),
    ],
    promptTemplate:
      'an evening smoky eye makeup look: deep smudged smoky eyeshadow built from the darkest tones of {eyeshadow} with a soft diffused edge, smudged lower lash line, voluminous black lashes, clean matte base, subtle {blush} contour-blush, soft neutral lips in the most muted tone of {lip}',
  },
  bridal: {
    id: 'bridal',
    name: { tr: 'Gelin Makyajı', en: 'Bridal' },
    description: {
      tr: 'Zamansız, romantik ve uzun ömürlü: fotoğraflarda kusursuz görünen bir gelin makyajı.',
      en: 'Timeless, romantic and long-wearing: a bridal look that photographs beautifully.',
    },
    occasions: ['special'],
    intensity: 'medium',
    level: 'intermediate',
    steps: [
      step(
        'prep',
        { tr: 'Nem ve baz', en: 'Hydrate and prime' },
        {
          tr: 'Nemlendirici maskeyle cildi hazırla, ardından uzun kalıcı bir makyaj bazı uygula.',
          en: 'Prep with a hydrating mask, then apply a long-wear primer.',
        },
      ),
      step(
        'base',
        { tr: 'Kalıcı ten', en: 'Long-wear base' },
        {
          tr: 'Önerilen ton aralığındaki kalıcı fondöteni ince katmanlarla uygula. Flaşta beyaz iz bırakmaması için SPF içermeyen pudra tercih et.',
          en: 'Apply a long-wear foundation in your recommended range in thin layers. Choose a powder without SPF to avoid flashback in photos.',
        },
      ),
      step(
        'eyes',
        { tr: 'Romantik gözler', en: 'Romantic eyes' },
        {
          tr: 'Paletindeki yumuşak nötr tonları kapağa, ışıltılı şampanya tonunu iç köşeye uygula. Kirpiklere suya dayanıklı maskara sür.',
          en: 'Blend soft neutrals from your palette across the lid and a champagne shimmer in the inner corners. Use waterproof mascara.',
        },
      ),
      step(
        'cheeks',
        { tr: 'Taze yanaklar', en: 'Fresh cheeks' },
        {
          tr: 'Önerilen allık tonunu krem ve pudra olarak iki katmanda uygula; böylece gün boyu solmaz.',
          en: 'Layer your recommended blush shade as a cream and then a powder so it lasts all day.',
        },
      ),
      step(
        'lips',
        { tr: 'Kalıcı dudak', en: 'Lasting lips' },
        {
          tr: 'Dudağın tamamını kalemle doldur, önerilen gül tonlarından birinde rujunu sür, peçeteyle bastırıp bir kat daha uygula.',
          en: 'Fill the whole lip with liner, apply one of your recommended rosy shades, blot and apply a second coat.',
        },
      ),
      step(
        'finish',
        { tr: 'Son dokunuş', en: 'Final touch' },
        {
          tr: 'Sabitleyici spreyle bitir ve gün içi rötuş için yanına kâğıt mendil ile rujunu al.',
          en: 'Finish with setting spray and keep blotting papers and your lipstick with you for touch-ups.',
        },
      ),
    ],
    promptTemplate:
      'an elegant, timeless bridal makeup look: flawless long-wear luminous base, soft romantic neutral eyeshadow from {eyeshadow} with champagne shimmer in the inner corners, defined fluttery lashes, rosy {blush} blush, softly defined rosy lips in {lip}, gentle radiant highlight',
  },
  bold_lip: {
    id: 'bold_lip',
    name: { tr: 'İddialı Dudak', en: 'Bold Lip' },
    description: {
      tr: 'Tek bir güçlü odak: sade ten ve göz, sana en çok yakışan cesur ruj tonu.',
      en: 'One powerful focus: simple skin and eyes with the bold lip shade that suits you best.',
    },
    occasions: ['night', 'work', 'special'],
    intensity: 'bold',
    level: 'intermediate',
    steps: [
      step(
        'base',
        { tr: 'Sade ten', en: 'Simple base' },
        {
          tr: 'Önerilen tonundaki fondöteni ince uygula, dudak çevresini kapatıcıyla temizle; kenarlar böylece daha net görünür.',
          en: 'Apply your recommended foundation shade lightly and clean around the mouth with concealer so the edges look crisp.',
        },
      ),
      step(
        'eyes',
        { tr: 'Minimal gözler', en: 'Minimal eyes' },
        {
          tr: 'Kapağa nötr bir ton ve iyi taranmış kirpikler yeterli. Dikkat dudaklarda kalsın.',
          en: 'A neutral wash on the lid and well-combed lashes are enough. Let your lips take the spotlight.',
        },
      ),
      step(
        'lips',
        { tr: 'Keskin kontur', en: 'Sharp outline' },
        {
          tr: 'Önerilen ruj tonlarının en canlısına uygun bir dudak kalemiyle dudak kavisini ve köşeleri çiz.',
          en: 'Outline the cupid’s bow and corners with a liner that matches the boldest of your recommended lip shades.',
        },
      ),
      step(
        'lips',
        { tr: 'Katmanla ve sabitle', en: 'Layer and set' },
        {
          tr: 'Rujunu fırçayla sür, peçeteyle bastır, ince bir tül arasından şeffaf pudra dokundur ve ikinci katı uygula.',
          en: 'Apply the lipstick with a brush, blot, press translucent powder through a thin tissue and apply a second coat.',
        },
      ),
    ],
    promptTemplate:
      'a bold statement lip makeup look: crisp, precisely lined matte lipstick in the most saturated tone of {lip}, clean even base, minimal neutral eyes with a light wash of {eyeshadow} and combed lashes, very soft {blush} blush',
  },
  no_makeup_makeup: {
    id: 'no_makeup_makeup',
    name: { tr: 'Makyajsız Makyaj', en: 'No-Makeup Makeup' },
    description: {
      tr: 'Senin, ama en dinlenmiş hâlin: neredeyse görünmeyen, doğal bir makyaj.',
      en: 'You, just well rested: an almost invisible, natural look.',
    },
    occasions: ['daily'],
    intensity: 'subtle',
    level: 'beginner',
    steps: [
      step(
        'base',
        { tr: 'Nokta kapatma', en: 'Spot conceal' },
        {
          tr: 'Fondöten yerine yalnızca kızarıklık ve göz altı gibi gereken bölgelere kapatıcı uygula ve kenarlarını parmakla yedir.',
          en: 'Skip foundation and conceal only where needed, such as redness and under-eye shadows, blending the edges with a fingertip.',
        },
      ),
      step(
        'brows',
        { tr: 'Doğal kaşlar', en: 'Natural brows' },
        {
          tr: 'Kaşlarını renkli kaş jeliyle yukarı doğru tara; şekil vermeden sadece dolgunluk kazandır.',
          en: 'Brush your brows up with a tinted gel to add fullness without reshaping them.',
        },
      ),
      step(
        'cheeks',
        { tr: 'Doğal kızarıklık', en: 'Natural flush' },
        {
          tr: 'Paletindeki en yumuşak allık tonunu çok az miktarda kullan; sadece hafif bir canlılık hissi yeter.',
          en: 'Use the softest blush in your palette sparingly, just enough for a hint of life.',
        },
      ),
      step(
        'lips',
        { tr: 'Dudak balmı', en: 'Lip balm' },
        {
          tr: 'Kendi dudak renginden bir ton koyu, renkli bir balm ile bitir.',
          en: 'Finish with a tinted balm one shade deeper than your natural lip colour.',
        },
      ),
    ],
    promptTemplate:
      'a "no-makeup makeup" look that is barely visible: skin remains fully natural with visible texture, only light concealing of redness, softly groomed natural brows, a barely-there flush of the softest tone of {blush}, clear or brown-black mascara, tinted balm lips close to the natural lip colour ({lip} as a guide)',
  },
  festival_color: {
    id: 'festival_color',
    name: { tr: 'Festival Renkleri', en: 'Festival Colour' },
    description: {
      tr: 'Eğlenceli ve cesur: paletindeki en canlı renklerle grafik bir göz makyajı.',
      en: 'Playful and daring: graphic eyes using the brightest colours in your palette.',
    },
    occasions: ['night', 'special'],
    intensity: 'bold',
    level: 'pro',
    steps: [
      step(
        'base',
        { tr: 'Işıltılı ten', en: 'Dewy base' },
        {
          tr: 'Hafif, nemli bitişli bir ten ile başla; festival makyajında cilt canlı ve taze görünmeli.',
          en: 'Start with a light, dewy base; festival skin should look fresh and alive.',
        },
      ),
      step(
        'eyes',
        { tr: 'Renkli kapak', en: 'Colour on the lid' },
        {
          tr: 'Paletindeki en canlı far tonunu tüm kapağa yoğun şekilde uygula, dış köşeyi yukarı doğru uzat.',
          en: 'Pack the brightest shade from your palette across the whole lid and extend the outer corner upwards.',
        },
      ),
      step(
        'eyes',
        { tr: 'Grafik eyeliner', en: 'Graphic liner' },
        {
          tr: 'Renkli ya da beyaz bir eyeliner ile göz kapağı çizgisinin üzerine grafik bir kanat veya çizgi çiz.',
          en: 'Draw a graphic wing or floating crease line with a coloured or white liner.',
        },
      ),
      step(
        'finish',
        { tr: 'Işıltı', en: 'Sparkle' },
        {
          tr: 'Elmacık kemiklerine ve iç köşelere kozmetik uyumlu, cilde uygun ince sim ekle.',
          en: 'Add fine, skin-safe cosmetic glitter to the cheekbones and inner corners.',
        },
      ),
      step(
        'lips',
        { tr: 'Parlak dudaklar', en: 'Glossy lips' },
        {
          tr: 'Gözlerle yarışmaması için önerilen tonlarından birinde parlatıcı ile bitir.',
          en: 'Finish with a gloss in one of your recommended shades so it doesn’t compete with the eyes.',
        },
      ),
    ],
    promptTemplate:
      'a playful festival makeup look: vivid saturated eyeshadow using the brightest tones of {eyeshadow} packed on the lid and winged out, a graphic coloured eyeliner accent, fine cosmetic glitter on the cheekbones and inner corners, dewy base, {blush} flush, glossy lips in {lip}',
  },
};

/** All looks in canonical order. */
export const LOOK_LIST: Look[] = LOOK_IDS.map((id) => LOOKS[id]);

export function getLook(id: LookId): Look {
  return LOOKS[id];
}

const INTENSITY_RANK: Record<LookIntensity, number> = { subtle: 0, medium: 1, bold: 2 };
const LEVEL_RANK: Record<ExperienceLevel, number> = { beginner: 0, intermediate: 1, pro: 2 };

function scoreLook(look: Look, analysis: FaceAnalysis, quiz?: QuizAnswers): number {
  let score = 0;
  const intensity = INTENSITY_RANK[look.intensity];

  // Occasion is the strongest signal; without a quiz we assume everyday wear.
  const occasion = quiz?.occasion ?? 'daily';
  if (look.occasions.includes(occasion)) score += quiz ? 6 : 3;

  // Contrast: high-contrast colouring carries bolder looks, low contrast suits softer ones.
  const contrastTarget = { low: 0, medium: 1, high: 2 }[analysis.contrast];
  score += 2 - Math.abs(intensity - contrastTarget);

  // Seasons with clear/bright colouring get a nudge towards statement looks.
  const season = SEASONS[analysis.season];
  if (season.contrast === 'high' && look.intensity === 'bold') score += 1;
  if (season.contrast === 'low' && look.intensity === 'subtle') score += 1;

  if (quiz) {
    const gap = LEVEL_RANK[look.level] - LEVEL_RANK[quiz.experience];
    if (gap > 0) score -= gap * 2; // Too advanced for the user.
    if (quiz.experience === 'beginner' && look.intensity === 'subtle') score += 1;
    if (quiz.experience === 'pro' && look.intensity === 'bold') score += 1;
  }

  return score;
}

/**
 * Deterministically picks the 3 best looks for an analysis (and optional quiz answers).
 * Ties are broken by catalogue order, so the same input always yields the same output.
 */
export function recommendLooks(analysis: FaceAnalysis, quiz?: QuizAnswers): [LookId, LookId, LookId] {
  const ranked = LOOK_LIST.map((look, index) => ({ id: look.id, index, score: scoreLook(look, analysis, quiz) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.id);
  return [ranked[0], ranked[1], ranked[2]] as [LookId, LookId, LookId];
}
