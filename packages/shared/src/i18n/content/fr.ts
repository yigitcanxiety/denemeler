import type { ContentOverlay } from './types';

/** French (France) catalogue text (see ContentOverlay). */
export const fr: ContentOverlay = {
  seasons: {
    light_spring: {
      name: 'Printemps clair',
      description: 'Les teintes claires, chaudes et fraîches sont faites pour toi. Pêche, corail doux et jaune beurre illuminent ton visage, tandis que les couleurs très sombres et lourdes peuvent t’éteindre.',
    },
    true_spring: {
      name: 'Printemps chaud',
      description: 'Les couleurs dorées, vives et joyeuses sont faites pour toi. Corail, abricot, vert feuille et turquoise donnent à ta peau un éclat chaleureux ; mieux vaut éviter les gris et les teintes froides glacées.',
    },
    bright_spring: {
      name: 'Printemps vif',
      description: 'Les couleurs claires, saturées et lumineuses te font briller. Rouge pastèque, turquoise vif et jaune soleil te mettent en avant, tandis que les teintes poudrées et délavées peuvent te donner l’air fatigué.',
    },
    light_summer: {
      name: 'Été clair',
      description: 'Les teintes pastel, froides et douces te vont à merveille. Lavande, rose poudré et bleu tendre créent une harmonie élégante, tandis que l’orange et les couleurs très sombres peuvent paraître dures.',
    },
    true_summer: {
      name: 'Été froid',
      description: 'Les couleurs à base bleue, froides et équilibrées te subliment. Vieux rose, bleu acier et framboise rafraîchissent ta peau, tandis que l’orange chaud et le moutarde peuvent détonner.',
    },
    soft_summer: {
      name: 'Été doux',
      description: 'Les couleurs sourdes, grisées et apaisées te donnent une élégance naturelle. Prune, sauge et bleu fumé te vont à ravir, tandis que le fluo et les teintes très vives peuvent t’écraser.',
    },
    soft_autumn: {
      name: 'Automne doux',
      description: 'Les couleurs terreuses, douces et légèrement chaudes te mettent en valeur. Camel, vieux rose, sauge et terracotta doux s’harmonisent avec ta peau, tandis que le fluo et les teintes glacées peuvent paraître durs.',
    },
    true_autumn: {
      name: 'Automne chaud',
      description: 'Les couleurs riches, chaudes et dorées sont ton terrain naturel. Rouille, moutarde, olive et bleu canard illuminent ta peau, tandis que le rose pastel et l’argent peuvent te ternir.',
    },
    deep_autumn: {
      name: 'Automne profond',
      description: 'Les couleurs profondes, chaudes et intenses sont saisissantes sur toi. Bordeaux, chocolat, olive foncé et or antique révèlent ton caractère, tandis que les pastels très clairs peuvent t’effacer.',
    },
    deep_winter: {
      name: 'Hiver profond',
      description: 'Les couleurs sombres, froides et puissantes te rendent superbe. Bleu nuit, rouge vin, émeraude et blanc pur te vont parfaitement, tandis que le beige, la pêche et les tons chauds délavés peuvent atténuer ton éclat.',
    },
    true_winter: {
      name: 'Hiver froid',
      description: 'Les couleurs nettes, froides et très contrastées te font rayonner. Cobalt, fuchsia, émeraude et blanc neige sont idéaux, tandis que l’orange, le moutarde et les tons terreux peuvent rendre ton teint terne.',
    },
    bright_winter: {
      name: 'Hiver vif',
      description: 'Les couleurs électriques, froides et vives te donnent de l’éclat. Rose vif, saphir, vert franc et blanc pur dynamisent ton look, tandis que le beige et les bruns poudrés peuvent te ternir.',
    },
  },
  looks: {
    natural_glow: {
      name: 'Bonne mine naturelle',
      description: 'Frais, lumineux et sans effort : un look léger du quotidien qui laisse ta peau rayonner.',
      steps: [
        {
          title: 'Prépare ta peau',
          body: 'Applique une fine couche de crème hydratante et laisse-la pénétrer une minute. En journée, n’oublie jamais la protection solaire.',
        },
        {
          title: 'Teint léger',
          body: 'Estompe une crème teintée ou un fond de teint léger dans ta gamme de teintes recommandée, du centre du visage vers l’extérieur. Ajoute de l’anticernes seulement là où c’est nécessaire.',
        },
        {
          title: 'Blush crème',
          body: 'Tapote l’une des teintes de blush de ta palette sur le haut des pommettes. Commence par une petite quantité et intensifie si besoin.',
        },
        {
          title: 'Regard ouvert',
          body: 'Étire du bout du doigt ton fard le plus clair sur la paupière, puis applique une couche de mascara.',
        },
        {
          title: 'Lèvres teintées',
          body: 'Termine avec un baume teinté ou un gloss dans l’une de tes teintes lèvres recommandées, proche de ta couleur naturelle.',
        },
      ],
    },
    office_chic: {
      name: 'Chic au bureau',
      description: 'De la réunion au dîner : un look de travail soigné, mat et assuré.',
      steps: [
        {
          title: 'Teint unifié',
          body: 'Applique un fond de teint à couvrance moyenne dans ta teinte recommandée avec une éponge humide. Fixe légèrement la zone T avec une poudre libre transparente.',
        },
        {
          title: 'Sourcils structurés',
          body: 'Brosse tes sourcils vers le haut, comble les trous par de petits traits fins imitant le poil et fixe avec un gel transparent.',
        },
        {
          title: 'Transition mate',
          body: 'Estompe une teinte mate intermédiaire de ta palette dans le creux de la paupière. Trace un trait à ras des cils avec un crayon brun foncé et termine par du mascara.',
        },
        {
          title: 'Contouring léger',
          body: 'Ajoute une touche de poudre bronzante juste sous les pommettes et un voile léger de ton blush recommandé juste au-dessus.',
        },
        {
          title: 'Lèvres satinées',
          body: 'Applique un rouge à lèvres satiné dans une teinte recommandée proche de ta couleur naturelle et dessine le contour avec un crayon.',
        },
      ],
    },
    soft_glam: {
      name: 'Glam tout en douceur',
      description: 'Éclatant mais doux : un glam équilibré pour les événements élégants et les photos.',
      steps: [
        {
          title: 'Teint lumineux',
          body: 'Applique ta teinte de fond de teint recommandée sur une base illuminatrice et illumine le dessous des yeux avec un anticernes d’une teinte plus claire.',
        },
        {
          title: 'Dégradé doux',
          body: 'Estompe une teinte intermédiaire de ta palette dans le creux de la paupière et la plus profonde dans le coin externe. Ajoute un fard irisé au centre de la paupière.',
        },
        {
          title: 'Cils',
          body: 'Applique deux couches de mascara et, si tu veux, quelques faux cils individuels aux coins externes.',
        },
        {
          title: 'Blush et highlighter',
          body: 'Étire ton blush recommandé des pommettes vers les tempes ; ajoute de l’enlumineur sur le haut des pommettes et l’arête du nez.',
        },
        {
          title: 'Lèvres pulpeuses',
          body: 'Dessine le contour de tes lèvres, remplis avec l’une de tes teintes recommandées et dépose une touche de gloss au centre.',
        },
        {
          title: 'Fixation',
          body: 'Vaporise un spray fixateur à environ 20 cm pour que tout tienne en place.',
        },
      ],
    },
    evening_smoky: {
      name: 'Smoky eye de soirée',
      description: 'Pour un regard profond et magnétique : un smoky eye pensé pour tes soirées.',
      steps: [
        {
          title: 'Les yeux d’abord',
          body: 'Commence par les yeux pour pouvoir nettoyer les retombées de fard ensuite. Applique une base pour fards sur la paupière.',
        },
        {
          title: 'Crée l’effet fumé',
          body: 'Trace un trait de crayon foncé au ras des cils et estompe-le vers le haut avec un pinceau court. Dépose par-dessus la teinte la plus profonde de ta palette et une teinte intermédiaire dans le creux ; estompe jusqu’à ce qu’il n’y ait plus de démarcation.',
        },
        {
          title: 'Ras des cils inférieurs et mascara',
          body: 'Estompe délicatement la même teinte profonde au ras des cils inférieurs et termine par plusieurs couches de mascara.',
        },
        {
          title: 'Teint net',
          body: 'Nettoie les retombées sous les yeux, puis applique le fond de teint et l’anticernes. Garde un teint mat et simple.',
        },
        {
          title: 'Lèvres neutres',
          body: 'Comme le regard est la star, choisis la plus neutre de tes teintes lèvres recommandées et applique-la en douceur.',
        },
      ],
    },
    bridal: {
      name: 'Mariée',
      description: 'Intemporel, romantique et longue tenue : un maquillage de mariée très photogénique.',
      steps: [
        {
          title: 'Hydrate et prépare',
          body: 'Prépare ta peau avec un masque hydratant, puis applique une base longue tenue.',
        },
        {
          title: 'Teint longue tenue',
          body: 'Applique un fond de teint longue tenue dans ta gamme recommandée en couches fines. Choisis une poudre sans SPF pour éviter l’effet blanc au flash sur les photos.',
        },
        {
          title: 'Regard romantique',
          body: 'Estompe des neutres doux de ta palette sur la paupière et un fard irisé champagne dans les coins internes. Utilise un mascara waterproof.',
        },
        {
          title: 'Joues fraîches',
          body: 'Superpose ta teinte de blush recommandée en crème puis en poudre pour qu’elle tienne toute la journée.',
        },
        {
          title: 'Lèvres longue tenue',
          body: 'Colore toute la lèvre au crayon, applique l’une de tes teintes rosées recommandées, tamponne et applique une seconde couche.',
        },
        {
          title: 'Touche finale',
          body: 'Termine par un spray fixateur et garde sur toi des feuilles matifiantes et ton rouge à lèvres pour les retouches.',
        },
      ],
    },
    bold_lip: {
      name: 'Bouche intense',
      description: 'Un seul point fort : un teint et des yeux simples avec la teinte de lèvres intense qui te va le mieux.',
      steps: [
        {
          title: 'Teint simple',
          body: 'Applique légèrement ta teinte de fond de teint recommandée et nettoie le contour de la bouche avec de l’anticernes pour des bords bien nets.',
        },
        {
          title: 'Yeux minimalistes',
          body: 'Un voile neutre sur la paupière et des cils bien peignés suffisent. Laisse tes lèvres voler la vedette.',
        },
        {
          title: 'Contour précis',
          body: 'Dessine l’arc de Cupidon et les coins avec un crayon assorti à la plus intense de tes teintes lèvres recommandées.',
        },
        {
          title: 'Superpose et fixe',
          body: 'Applique le rouge à lèvres au pinceau, tamponne, dépose de la poudre transparente à travers un mouchoir fin et applique une seconde couche.',
        },
      ],
    },
    no_makeup_makeup: {
      name: 'Maquillage invisible',
      description: 'Toi, en version bien reposée : un look naturel presque invisible.',
      steps: [
        {
          title: 'Anticernes ciblé',
          body: 'Oublie le fond de teint et corrige seulement là où c’est nécessaire, comme les rougeurs et les cernes, en estompant les bords du bout du doigt.',
        },
        {
          title: 'Sourcils naturels',
          body: 'Brosse tes sourcils vers le haut avec un gel teinté pour les étoffer sans changer leur forme.',
        },
        {
          title: 'Bonne mine naturelle',
          body: 'Utilise avec parcimonie le blush le plus doux de ta palette, juste assez pour un soupçon de bonne mine.',
        },
        {
          title: 'Baume à lèvres',
          body: 'Termine avec un baume teinté d’une nuance plus soutenue que ta couleur de lèvres naturelle.',
        },
      ],
    },
    festival_color: {
      name: 'Couleurs festival',
      description: 'Ludique et audacieux : des yeux graphiques avec les couleurs les plus vives de ta palette.',
      steps: [
        {
          title: 'Teint glowy',
          body: 'Commence par un teint léger et lumineux ; en festival, la peau doit paraître fraîche et pleine de vie.',
        },
        {
          title: 'Couleur sur la paupière',
          body: 'Dépose la teinte la plus vive de ta palette sur toute la paupière et prolonge le coin externe vers le haut.',
        },
        {
          title: 'Eye-liner graphique',
          body: 'Trace un trait graphique en aile ou une ligne flottante au-dessus du creux avec un eye-liner coloré ou blanc.',
        },
        {
          title: 'Paillettes',
          body: 'Ajoute des paillettes cosmétiques fines, adaptées à la peau, sur les pommettes et aux coins internes.',
        },
        {
          title: 'Lèvres brillantes',
          body: 'Termine avec un gloss dans l’une de tes teintes recommandées pour ne pas faire concurrence aux yeux.',
        },
      ],
    },
  },
  profileAxes: {
    warmth: 'Chaleur',
    depth: 'Profondeur',
    contrast: 'Contraste',
    clarity: 'Éclat',
    softness: 'Douceur',
    lightness: 'Clarté',
  },
  shades: {
    Nude: 'Nude',
    Champagne: 'Champagne',
    Peach: 'Pêche',
    Apricot: 'Abricot',
    Salmon: 'Saumon',
    Coral: 'Corail',
    Terracotta: 'Terracotta',
    'Tomato red': 'Rouge tomate',
    'Classic red': 'Rouge classique',
    Cherry: 'Cerise',
    Burgundy: 'Bordeaux',
    Wine: 'Lie-de-vin',
    Plum: 'Prune',
    Aubergine: 'Aubergine',
    Caramel: 'Caramel',
    Bronze: 'Bronze',
    Cinnamon: 'Cannelle',
    Chocolate: 'Chocolat',
    'Dusty rose': 'Vieux rose',
    Mauve: 'Mauve',
    Rose: 'Rose',
    'Powder pink': 'Rose poudré',
    'Baby pink': 'Rose layette',
    'Candy pink': 'Rose bonbon',
    Fuchsia: 'Fuchsia',
    Raspberry: 'Framboise',
    Lilac: 'Lilas',
    Lavender: 'Lavande',
    Violet: 'Violet',
    Gold: 'Doré',
    Taupe: 'Taupe',
    Sage: 'Sauge',
    Camel: 'Camel',
    'Rosy beige': 'Beige rosé',
    Brick: 'Brique',
    Cocoa: 'Cacao',
    Khaki: 'Kaki',
    Olive: 'Olive',
    Emerald: 'Émeraude',
    Teal: 'Bleu canard',
    Navy: 'Bleu marine',
    'Icy blue': 'Bleu glacier',
    Grey: 'Gris',
    Charcoal: 'Anthracite',
  },
  shadeModifiers: {
    light: '{name} clair',
    deep: '{name} profond',
  },
  mock: {
    analysis: {
      foundation: {
        undertoneLabel: 'Neutre chaud (beige doré)',
        shadeRange: 'Claire à moyenne, beige chaud (ex. W2–W3)',
      },
      summary: 'Ta colorimétrie est douce et légèrement chaude, ce qui te place dans l’Automne doux. Les teintes terreuses et sourdes comme le camel, la sauge et le vieux rose s’harmonisent avec ta peau, tandis que les couleurs très vives ou glacées peuvent paraître dures près de ton visage.',
    },
    skin: {
      routine: {
        morning: ['Gel nettoyant doux', 'Sérum hydratant léger', 'Crème hydratante non grasse', 'Protection solaire SPF 50'],
        evening: ['Nettoyant doux', 'Sérum à la niacinamide', 'Crème réparatrice de la barrière cutanée'],
      },
      ingredients: ['Niacinamide', 'Acide hyaluronique', 'Céramides'],
      summary: 'Ta peau semble équilibrée, avec une légère brillance sur la zone T. Une routine légère et hydratante avec une protection solaire quotidienne la gardera confortable et uniforme.',
    },
  },
};
