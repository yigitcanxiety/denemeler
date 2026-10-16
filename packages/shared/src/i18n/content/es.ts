import type { ContentOverlay } from './types';

/** Spanish catalogue text (neutral, Latin America + Spain; see ContentOverlay). */
export const es: ContentOverlay = {
  seasons: {
    light_spring: {
      name: 'Primavera Clara',
      description: 'Los tonos claros, cálidos y frescos son lo tuyo. El melocotón, el coral suave y el amarillo mantequilla iluminan tu cara, mientras que los colores muy oscuros y pesados pueden opacarte.',
    },
    true_spring: {
      name: 'Primavera Cálida',
      description: 'Los colores de base dorada, vivos y alegres están hechos para ti. El coral, el albaricoque, el verde hoja y el turquesa le dan a tu piel un brillo cálido; es mejor alejar los grises y los tonos fríos helados.',
    },
    bright_spring: {
      name: 'Primavera Brillante',
      description: 'Los colores limpios, saturados y brillantes te hacen resaltar. El rojo sandía, el turquesa vivo y el amarillo sol te dan protagonismo, mientras que los tonos empolvados y apagados pueden darte un aspecto cansado.',
    },
    light_summer: {
      name: 'Verano Claro',
      description: 'Los tonos pastel, fríos y delicados te quedan de maravilla. El lavanda, el rosa empolvado y el azul suave crean una armonía elegante, mientras que el naranja y los colores muy oscuros pueden resultar duros.',
    },
    true_summer: {
      name: 'Verano Frío',
      description: 'Los colores de base azul, fríos y equilibrados sacan tu mejor versión. El rosa palo, el azul acero y el frambuesa refrescan tu piel, mientras que el naranja cálido y el mostaza pueden desentonar.',
    },
    soft_summer: {
      name: 'Verano Suave',
      description: 'Los colores apagados, agrisados y serenos te dan una elegancia natural. El ciruela, el verde salvia y el azul humo te quedan preciosos, mientras que el neón y los tonos muy brillantes pueden eclipsarte.',
    },
    soft_autumn: {
      name: 'Otoño Suave',
      description: 'Los colores terrosos, suaves y ligeramente cálidos te complementan de maravilla. El camel, el rosa palo, el verde salvia y la terracota suave armonizan con tu piel, mientras que el neón y los tonos helados pueden verse duros.',
    },
    true_autumn: {
      name: 'Otoño Cálido',
      description: 'Los colores intensos, cálidos y dorados son tu territorio natural. El óxido, el mostaza, el verde oliva y el verde azulado le dan vida a tu piel, mientras que el rosa pastel y el plateado pueden apagarte.',
    },
    deep_autumn: {
      name: 'Otoño Profundo',
      description: 'Los colores profundos, cálidos e intensos te quedan espectaculares. El borgoña, el chocolate, el verde oliva oscuro y el oro viejo realzan tu personalidad, mientras que los pasteles muy claros pueden desdibujarte.',
    },
    deep_winter: {
      name: 'Invierno Profundo',
      description: 'Los colores oscuros, fríos y potentes te hacen lucir increíble. El azul medianoche, el rojo vino, el esmeralda y el blanco puro te quedan perfectos, mientras que el beige, el melocotón y los tonos cálidos apagados le restan fuerza a tu imagen.',
    },
    true_winter: {
      name: 'Invierno Frío',
      description: 'Los colores limpios, fríos y de alto contraste te hacen brillar. El cobalto, el fucsia, el esmeralda y el blanco nieve son ideales, mientras que el naranja, el mostaza y los tonos tierra pueden darle a tu piel un aspecto apagado.',
    },
    bright_winter: {
      name: 'Invierno Brillante',
      description: 'Los colores eléctricos, fríos y vivos te llenan de vida. El rosa intenso, el zafiro, el verde brillante y el blanco puro dan energía a tu look, mientras que el beige y los marrones empolvados pueden apagarte.',
    },
  },
  looks: {
    natural_glow: {
      name: 'Brillo natural',
      description: 'Fresco, luminoso y sin esfuerzo: un look ligero para el día a día que deja brillar tu piel.',
      steps: [
        {
          title: 'Prepara tu piel',
          body: 'Aplica una capa fina de crema hidratante y deja que se absorba un minuto. De día, nunca te saltes el protector solar.',
        },
        {
          title: 'Base ligera',
          body: 'Difumina una crema con color o una base ligera de tu gama recomendada desde el centro de la cara hacia fuera. Aplica corrector solo donde lo necesites.',
        },
        {
          title: 'Rubor en crema',
          body: 'Da toquecitos de uno de los rubores de tu paleta en la parte alta de las mejillas. Empieza con poco y ve aumentando si hace falta.',
        },
        {
          title: 'Mirada abierta',
          body: 'Extiende con la yema del dedo la sombra más clara de tu paleta por el párpado y luego aplica una capa de máscara de pestañas.',
        },
        {
          title: 'Labios con color',
          body: 'Termina con un bálsamo con color o un gloss en uno de tus tonos de labios recomendados, cercano a tu color natural.',
        },
      ],
    },
    office_chic: {
      name: 'Chic de oficina',
      description: 'De la reunión a la cena: un look de trabajo pulido, mate y seguro.',
      steps: [
        {
          title: 'Base uniforme',
          body: 'Aplica una base de cobertura media en tu tono recomendado con una esponja húmeda. Sella ligeramente la zona T con polvo translúcido.',
        },
        {
          title: 'Cejas definidas',
          body: 'Peina las cejas hacia arriba, rellena los huecos con trazos finos que imiten el vello y fíjalas con un gel transparente.',
        },
        {
          title: 'Transición mate',
          body: 'Difumina en la cuenca un tono mate intermedio de tu paleta. Delinea la línea interna de las pestañas superiores con un lápiz marrón oscuro y termina con máscara de pestañas.',
        },
        {
          title: 'Contorno suave',
          body: 'Aplica un toque mínimo de bronceador justo debajo de los pómulos y un velo ligero de tu rubor recomendado por encima.',
        },
        {
          title: 'Labios satinados',
          body: 'Aplica un labial satinado en un tono recomendado cercano a tu color natural de labios y define los bordes con un perfilador.',
        },
      ],
    },
    soft_glam: {
      name: 'Soft glam',
      description: 'Radiante pero suave: un glam equilibrado para eventos elegantes y fotos.',
      steps: [
        {
          title: 'Base luminosa',
          body: 'Construye tu tono de base recomendado sobre una prebase iluminadora e ilumina las ojeras con un corrector un tono más claro.',
        },
        {
          title: 'Degradado suave',
          body: 'Difumina un tono intermedio de tu paleta en la cuenca y el tono más oscuro en el extremo exterior. Añade una sombra con brillo en el centro del párpado.',
        },
        {
          title: 'Pestañas',
          body: 'Aplica dos capas de máscara de pestañas y, si quieres, añade algunas pestañas individuales en los extremos exteriores.',
        },
        {
          title: 'Rubor e iluminador',
          body: 'Extiende tu rubor recomendado desde los pómulos hacia las sienes; aplica iluminador en la parte alta de los pómulos y en el puente de la nariz.',
        },
        {
          title: 'Labios jugosos',
          body: 'Perfila los labios, rellénalos con uno de tus tonos recomendados y da un toque de gloss en el centro.',
        },
        {
          title: 'Fijación',
          body: 'Pulveriza un spray fijador a unos 20 cm para que todo se mantenga en su sitio.',
        },
      ],
    },
    evening_smoky: {
      name: 'Smoky eye de noche',
      description: 'Para una mirada profunda y magnética: un smoky eye pensado para salir de noche.',
      steps: [
        {
          title: 'Primero los ojos',
          body: 'Empieza por los ojos para poder limpiar después los restos de sombra que caigan. Aplica una prebase de sombras en el párpado.',
        },
        {
          title: 'Crea el ahumado',
          body: 'Traza un lápiz oscuro a lo largo de la línea de las pestañas y difumínalo hacia arriba con una brocha corta. Presiona encima el tono más oscuro de tu paleta y un tono intermedio en la cuenca; difumina hasta que no queden bordes marcados.',
        },
        {
          title: 'Línea inferior y máscara',
          body: 'Difumina suavemente el mismo tono oscuro a lo largo de la línea inferior de las pestañas y termina con varias capas de máscara de pestañas.',
        },
        {
          title: 'Base limpia',
          body: 'Limpia los restos de sombra bajo los ojos y luego aplica base y corrector. Mantén la piel mate y sencilla.',
        },
        {
          title: 'Labios neutros',
          body: 'Como los ojos son el centro de atención, elige el más neutro de tus tonos de labios recomendados y aplícalo con suavidad.',
        },
      ],
    },
    bridal: {
      name: 'Novia',
      description: 'Atemporal, romántico y de larga duración: un look de novia que sale precioso en las fotos.',
      steps: [
        {
          title: 'Hidrata y prepara',
          body: 'Prepara la piel con una mascarilla hidratante y luego aplica una prebase de larga duración.',
        },
        {
          title: 'Base de larga duración',
          body: 'Aplica en capas finas una base de larga duración de tu gama recomendada. Elige un polvo sin SPF para evitar el efecto flash en las fotos.',
        },
        {
          title: 'Ojos románticos',
          body: 'Difumina tonos neutros suaves de tu paleta por el párpado y una sombra champán con brillo en los lagrimales. Usa máscara de pestañas a prueba de agua.',
        },
        {
          title: 'Mejillas frescas',
          body: 'Aplica tu tono de rubor recomendado primero en crema y después en polvo para que dure todo el día.',
        },
        {
          title: 'Labios duraderos',
          body: 'Rellena todo el labio con perfilador, aplica uno de tus tonos rosados recomendados, retira el exceso con un pañuelo y aplica una segunda capa.',
        },
        {
          title: 'Toque final',
          body: 'Termina con spray fijador y lleva contigo papel matificante y tu labial para los retoques.',
        },
      ],
    },
    bold_lip: {
      name: 'Labios intensos',
      description: 'Un solo protagonista: piel y ojos sencillos con el labial intenso que mejor te queda.',
      steps: [
        {
          title: 'Base sencilla',
          body: 'Aplica tu tono de base recomendado en poca cantidad y limpia el contorno de la boca con corrector para que los bordes queden nítidos.',
        },
        {
          title: 'Ojos mínimos',
          body: 'Basta con un velo de sombra neutra en el párpado y las pestañas bien peinadas. Deja que tus labios se lleven el protagonismo.',
        },
        {
          title: 'Contorno preciso',
          body: 'Perfila el arco de Cupido y las comisuras con un perfilador a juego con el más intenso de tus tonos de labios recomendados.',
        },
        {
          title: 'Capas y fijación',
          body: 'Aplica el labial con pincel, retira el exceso con un pañuelo, presiona polvo translúcido a través de un pañuelo fino y aplica una segunda capa.',
        },
      ],
    },
    no_makeup_makeup: {
      name: 'Efecto sin maquillaje',
      description: 'Tú, como después de dormir bien: un look natural casi invisible.',
      steps: [
        {
          title: 'Corrector puntual',
          body: 'Prescinde de la base y aplica corrector solo donde haga falta, como en rojeces y ojeras, difuminando los bordes con la yema del dedo.',
        },
        {
          title: 'Cejas naturales',
          body: 'Peina las cejas hacia arriba con un gel con color para darles volumen sin cambiar su forma.',
        },
        {
          title: 'Rubor natural',
          body: 'Usa con moderación el rubor más suave de tu paleta, solo lo justo para dar un toque de vida.',
        },
        {
          title: 'Bálsamo labial',
          body: 'Termina con un bálsamo con color un tono más intenso que tu color natural de labios.',
        },
      ],
    },
    festival_color: {
      name: 'Color de festival',
      description: 'Divertido y atrevido: ojos gráficos con los colores más vivos de tu paleta.',
      steps: [
        {
          title: 'Base jugosa',
          body: 'Empieza con una base ligera y jugosa; la piel de festival debe verse fresca y llena de vida.',
        },
        {
          title: 'Color en el párpado',
          body: 'Aplica el tono más vivo de tu paleta por todo el párpado y alarga el extremo exterior hacia arriba.',
        },
        {
          title: 'Delineado gráfico',
          body: 'Dibuja un delineado gráfico en ala o una línea flotante sobre la cuenca con un delineador de color o blanco.',
        },
        {
          title: 'Brillo',
          body: 'Añade purpurina cosmética fina, apta para la piel, en los pómulos y los lagrimales.',
        },
        {
          title: 'Labios con gloss',
          body: 'Termina con un gloss en uno de tus tonos recomendados para que no compita con los ojos.',
        },
      ],
    },
  },
  profileAxes: {
    warmth: 'Calidez',
    depth: 'Profundidad',
    contrast: 'Contraste',
    clarity: 'Viveza',
    softness: 'Suavidad',
    lightness: 'Claridad',
  },
  shades: {
    Nude: 'Nude',
    Champagne: 'Champán',
    Peach: 'Melocotón',
    Apricot: 'Albaricoque',
    Salmon: 'Salmón',
    Coral: 'Coral',
    Terracotta: 'Terracota',
    'Tomato red': 'Rojo tomate',
    'Classic red': 'Rojo clásico',
    Cherry: 'Cereza',
    Burgundy: 'Borgoña',
    Wine: 'Vino',
    Plum: 'Ciruela',
    Aubergine: 'Berenjena',
    Caramel: 'Caramelo',
    Bronze: 'Bronce',
    Cinnamon: 'Canela',
    Chocolate: 'Chocolate',
    'Dusty rose': 'Rosa palo',
    Mauve: 'Malva',
    Rose: 'Rosa',
    'Powder pink': 'Rosa empolvado',
    'Baby pink': 'Rosa bebé',
    'Candy pink': 'Rosa chicle',
    Fuchsia: 'Fucsia',
    Raspberry: 'Frambuesa',
    Lilac: 'Lila',
    Lavender: 'Lavanda',
    Violet: 'Violeta',
    Gold: 'Dorado',
    Taupe: 'Topo',
    Sage: 'Salvia',
    Camel: 'Camel',
    'Rosy beige': 'Beige rosado',
    Brick: 'Ladrillo',
    Cocoa: 'Cacao',
    Khaki: 'Caqui',
    Olive: 'Oliva',
    Emerald: 'Esmeralda',
    Teal: 'Verde azulado',
    Navy: 'Azul marino',
    'Icy blue': 'Azul hielo',
    Grey: 'Gris',
    Charcoal: 'Gris carbón',
  },
  shadeModifiers: {
    light: '{name} claro',
    deep: '{name} oscuro',
  },
  mock: {
    analysis: {
      foundation: {
        undertoneLabel: 'Neutro cálido (beige dorado)',
        shadeRange: 'Clara-media, beige cálido (p. ej., W2–W3)',
      },
      summary: 'Tu colorimetría es suave y ligeramente cálida, lo que te sitúa en Otoño Suave. Los tonos tierra apagados como el camel, el verde salvia y el rosa palo armonizan con tu piel, mientras que los colores muy brillantes o helados pueden verse duros junto a tu cara.',
    },
    skin: {
      routine: {
        morning: ['Limpiador en gel suave', 'Sérum hidratante ligero', 'Crema hidratante sin aceite', 'Protector solar SPF 50'],
        evening: ['Limpiador suave', 'Sérum de niacinamida', 'Crema reparadora de la barrera cutánea'],
      },
      ingredients: ['Niacinamida', 'Ácido hialurónico', 'Ceramidas'],
      summary: 'Tu piel se ve equilibrada, con un poco de brillo en la zona T. Una rutina ligera e hidratante con protector solar a diario la mantendrá cómoda y uniforme.',
    },
  },
};
