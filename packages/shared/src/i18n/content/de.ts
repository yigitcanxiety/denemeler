import type { ContentOverlay } from './types';

/** German catalogue text (see ContentOverlay). Currently an English placeholder awaiting translation. */
export const de: ContentOverlay = {
  seasons: {
    light_spring: {
      name: 'Light Spring',
      description: 'Light, warm and fresh shades are your sweet spot. Peach, soft coral and butter yellow brighten your face, while very dark, heavy colours can overpower you.',
    },
    true_spring: {
      name: 'True Spring',
      description: 'Golden-based, lively and cheerful colours are made for you. Coral, apricot, leaf green and turquoise give your skin a warm glow; greys and icy cool shades are best kept away.',
    },
    bright_spring: {
      name: 'Bright Spring',
      description: 'Clear, saturated and bright colours make you shine. Watermelon red, vivid turquoise and sunny yellow bring you forward, while dusty, faded shades can make you look tired.',
    },
    light_summer: {
      name: 'Light Summer',
      description: 'Pastel, cool and gentle shades suit you beautifully. Lavender, powder pink and soft blue create an elegant harmony, while orange and very dark colours can feel harsh.',
    },
    true_summer: {
      name: 'True Summer',
      description: 'Blue-based, cool and balanced colours show you at your best. Dusty rose, steel blue and raspberry refresh your skin, while warm orange and mustard can clash.',
    },
    soft_summer: {
      name: 'Soft Summer',
      description: 'Muted, grey-toned and calm colours give you an effortless elegance. Plum, sage and smoky blue are lovely on you, while neon and very bright shades can overwhelm you.',
    },
    soft_autumn: {
      name: 'Soft Autumn',
      description: 'Earthy, soft and gently warm colours complement you beautifully. Camel, dusty rose, sage and soft terracotta harmonise with your skin, while neon and icy shades can look harsh.',
    },
    true_autumn: {
      name: 'True Autumn',
      description: 'Rich, warm, golden colours are your natural territory. Rust, mustard, olive and teal bring your skin to life, while pastel pink and silver can wash you out.',
    },
    deep_autumn: {
      name: 'Deep Autumn',
      description: 'Deep, warm and intense colours look striking on you. Burgundy, chocolate, dark olive and antique gold bring out your character, while very light pastels can make you fade.',
    },
    deep_winter: {
      name: 'Deep Winter',
      description: 'Dark, cool and powerful colours make you look stunning. Midnight navy, wine red, emerald and crisp white suit you perfectly, while beige, peach and faded warm tones can dull your impact.',
    },
    true_winter: {
      name: 'True Winter',
      description: 'Clear, cool, high-contrast colours make you glow. Cobalt, fuchsia, emerald and snow white are ideal, while orange, mustard and earthy tones can make your skin look sallow.',
    },
    bright_winter: {
      name: 'Bright Winter',
      description: 'Electric, cool and vivid colours bring you to life. Hot pink, sapphire, bright green and pure white energise your look, while beige and dusty browns can dull you.',
    },
  },
  looks: {
    natural_glow: {
      name: 'Natural Glow',
      description: 'Fresh, luminous and effortless: a light everyday look that lets your skin glow.',
      steps: [
        {
          title: 'Prep your skin',
          body: 'Apply a thin layer of moisturiser and give it a minute to sink in. During the day, never skip sunscreen.',
        },
        {
          title: 'Sheer base',
          body: 'Blend a tinted moisturiser or light foundation in your recommended shade range from the centre of your face outwards. Dot concealer only where you need it.',
        },
        {
          title: 'Cream blush',
          body: 'Tap one of your palette blush shades onto the apples of your cheeks. Start with a little and build up if needed.',
        },
        {
          title: 'Open eyes',
          body: 'Sweep your lightest eyeshadow shade over the lid with a fingertip, then add one coat of mascara.',
        },
        {
          title: 'Tinted lips',
          body: 'Finish with a tinted balm or gloss in one of your recommended lip shades close to your natural colour.',
        },
      ],
    },
    office_chic: {
      name: 'Office Chic',
      description: 'From meetings to dinner: a polished, matte and confident workday look.',
      steps: [
        {
          title: 'Even base',
          body: 'Apply a medium-coverage foundation in your recommended shade with a damp sponge. Lightly set your T-zone with translucent powder.',
        },
        {
          title: 'Groomed brows',
          body: 'Brush your brows upwards, fill gaps with fine hair-like strokes and set with a clear gel.',
        },
        {
          title: 'Matte transition',
          body: 'Diffuse a mid-tone matte shade from your palette into the crease. Tightline with a dark brown pencil and finish with mascara.',
        },
        {
          title: 'Soft sculpt',
          body: 'Add a whisper of bronzer just under your cheekbones and a sheer veil of your recommended blush above.',
        },
        {
          title: 'Satin lips',
          body: 'Apply a satin lipstick in a recommended shade close to your natural lip colour, and define the edges with a liner.',
        },
      ],
    },
    soft_glam: {
      name: 'Soft Glam',
      description: 'Radiant yet soft: a balanced glam for elegant events and photos.',
      steps: [
        {
          title: 'Luminous base',
          body: 'Build your recommended foundation shade over an illuminating primer, and brighten under the eyes with a concealer one shade lighter.',
        },
        {
          title: 'Soft gradient',
          body: 'Blend a mid-tone from your palette into the crease and the deepest shade into the outer corner. Add a shimmer to the centre of the lid.',
        },
        {
          title: 'Lashes',
          body: 'Apply two coats of mascara, and add a few individual lashes at the outer corners if you like.',
        },
        {
          title: 'Blush and highlight',
          body: 'Sweep your recommended blush from the cheekbones towards the temples; add highlighter to the top of the cheekbones and the bridge of the nose.',
        },
        {
          title: 'Plush lips',
          body: 'Line your lips, fill with one of your recommended shades and dab a touch of gloss in the centre.',
        },
        {
          title: 'Set',
          body: 'Mist a setting spray from about 20 cm away so everything stays in place.',
        },
      ],
    },
    evening_smoky: {
      name: 'Evening Smoky Eye',
      description: 'For a deep, magnetic gaze: a smoky eye made for nights out.',
      steps: [
        {
          title: 'Eyes first',
          body: 'Start with the eyes so you can clean up any fallout afterwards. Apply an eyeshadow primer to the lid.',
        },
        {
          title: 'Build the smoke',
          body: 'Draw a dark pencil along the lash line and smudge it upwards with a short brush. Press your deepest palette shade on top and a mid-tone in the crease; blend until no harsh edges remain.',
        },
        {
          title: 'Lower lash line and mascara',
          body: 'Smudge the same deep shade softly along the lower lash line and finish with several coats of mascara.',
        },
        {
          title: 'Clean base',
          body: 'Clean up any fallout under the eyes, then apply foundation and concealer. Keep the skin matte and simple.',
        },
        {
          title: 'Neutral lips',
          body: 'With the eyes as the focus, choose the most neutral of your recommended lip shades and apply it softly.',
        },
      ],
    },
    bridal: {
      name: 'Bridal',
      description: 'Timeless, romantic and long-wearing: a bridal look that photographs beautifully.',
      steps: [
        {
          title: 'Hydrate and prime',
          body: 'Prep with a hydrating mask, then apply a long-wear primer.',
        },
        {
          title: 'Long-wear base',
          body: 'Apply a long-wear foundation in your recommended range in thin layers. Choose a powder without SPF to avoid flashback in photos.',
        },
        {
          title: 'Romantic eyes',
          body: 'Blend soft neutrals from your palette across the lid and a champagne shimmer in the inner corners. Use waterproof mascara.',
        },
        {
          title: 'Fresh cheeks',
          body: 'Layer your recommended blush shade as a cream and then a powder so it lasts all day.',
        },
        {
          title: 'Lasting lips',
          body: 'Fill the whole lip with liner, apply one of your recommended rosy shades, blot and apply a second coat.',
        },
        {
          title: 'Final touch',
          body: 'Finish with setting spray and keep blotting papers and your lipstick with you for touch-ups.',
        },
      ],
    },
    bold_lip: {
      name: 'Bold Lip',
      description: 'One powerful focus: simple skin and eyes with the bold lip shade that suits you best.',
      steps: [
        {
          title: 'Simple base',
          body: 'Apply your recommended foundation shade lightly and clean around the mouth with concealer so the edges look crisp.',
        },
        {
          title: 'Minimal eyes',
          body: 'A neutral wash on the lid and well-combed lashes are enough. Let your lips take the spotlight.',
        },
        {
          title: 'Sharp outline',
          body: 'Outline the cupid’s bow and corners with a liner that matches the boldest of your recommended lip shades.',
        },
        {
          title: 'Layer and set',
          body: 'Apply the lipstick with a brush, blot, press translucent powder through a thin tissue and apply a second coat.',
        },
      ],
    },
    no_makeup_makeup: {
      name: 'No-Makeup Makeup',
      description: 'You, just well rested: an almost invisible, natural look.',
      steps: [
        {
          title: 'Spot conceal',
          body: 'Skip foundation and conceal only where needed, such as redness and under-eye shadows, blending the edges with a fingertip.',
        },
        {
          title: 'Natural brows',
          body: 'Brush your brows up with a tinted gel to add fullness without reshaping them.',
        },
        {
          title: 'Natural flush',
          body: 'Use the softest blush in your palette sparingly, just enough for a hint of life.',
        },
        {
          title: 'Lip balm',
          body: 'Finish with a tinted balm one shade deeper than your natural lip colour.',
        },
      ],
    },
    festival_color: {
      name: 'Festival Colour',
      description: 'Playful and daring: graphic eyes using the brightest colours in your palette.',
      steps: [
        {
          title: 'Dewy base',
          body: 'Start with a light, dewy base; festival skin should look fresh and alive.',
        },
        {
          title: 'Colour on the lid',
          body: 'Pack the brightest shade from your palette across the whole lid and extend the outer corner upwards.',
        },
        {
          title: 'Graphic liner',
          body: 'Draw a graphic wing or floating crease line with a coloured or white liner.',
        },
        {
          title: 'Sparkle',
          body: 'Add fine, skin-safe cosmetic glitter to the cheekbones and inner corners.',
        },
        {
          title: 'Glossy lips',
          body: 'Finish with a gloss in one of your recommended shades so it doesn’t compete with the eyes.',
        },
      ],
    },
  },
  profileAxes: {
    warmth: 'Warmth',
    depth: 'Depth',
    contrast: 'Contrast',
    clarity: 'Clarity',
    softness: 'Softness',
    lightness: 'Lightness',
  },
  shades: {
    Nude: 'Nude',
    Champagne: 'Champagne',
    Peach: 'Peach',
    Apricot: 'Apricot',
    Salmon: 'Salmon',
    Coral: 'Coral',
    Terracotta: 'Terracotta',
    'Tomato red': 'Tomato red',
    'Classic red': 'Classic red',
    Cherry: 'Cherry',
    Burgundy: 'Burgundy',
    Wine: 'Wine',
    Plum: 'Plum',
    Aubergine: 'Aubergine',
    Caramel: 'Caramel',
    Bronze: 'Bronze',
    Cinnamon: 'Cinnamon',
    Chocolate: 'Chocolate',
    'Dusty rose': 'Dusty rose',
    Mauve: 'Mauve',
    Rose: 'Rose',
    'Powder pink': 'Powder pink',
    'Baby pink': 'Baby pink',
    'Candy pink': 'Candy pink',
    Fuchsia: 'Fuchsia',
    Raspberry: 'Raspberry',
    Lilac: 'Lilac',
    Lavender: 'Lavender',
    Violet: 'Violet',
    Gold: 'Gold',
    Taupe: 'Taupe',
    Sage: 'Sage',
    Camel: 'Camel',
    'Rosy beige': 'Rosy beige',
    Brick: 'Brick',
    Cocoa: 'Cocoa',
    Khaki: 'Khaki',
    Olive: 'Olive',
    Emerald: 'Emerald',
    Teal: 'Teal',
    Navy: 'Navy',
    'Icy blue': 'Icy blue',
    Grey: 'Grey',
    Charcoal: 'Charcoal',
  },
  shadeModifiers: {
    light: 'Light {name}',
    deep: 'Deep {name}',
  },
  mock: {
    analysis: {
      foundation: {
        undertoneLabel: 'Warm neutral (golden-beige)',
        shadeRange: 'Light-medium, warm beige (e.g. W2–W3)',
      },
      summary: 'Your colouring is soft and gently warm, which places you in Soft Autumn. Muted earthy shades like camel, sage and dusty rose harmonise with your skin, while very bright or icy colours can feel harsh next to your face.',
    },
    skin: {
      routine: {
        morning: ['Gentle gel cleanser', 'Light hydrating serum', 'Oil-free moisturiser', 'SPF 50 sunscreen'],
        evening: ['Gentle cleanser', 'Niacinamide serum', 'Barrier-repair moisturiser'],
      },
      ingredients: ['Niacinamide', 'Hyaluronic acid', 'Ceramides'],
      summary: 'Your skin looks balanced with a little shine in the T-zone. A light, hydrating routine with daily sunscreen will keep it comfortable and even.',
    },
  },
};
