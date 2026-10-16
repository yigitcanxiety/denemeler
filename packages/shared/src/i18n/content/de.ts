import type { ContentOverlay } from './types';

/** German catalogue text (see ContentOverlay). */
export const de: ContentOverlay = {
  seasons: {
    light_spring: {
      name: 'Heller Frühling',
      description: 'Helle, warme und frische Nuancen sind genau dein Ding. Pfirsich, zartes Koralle und Buttergelb lassen dein Gesicht strahlen, während sehr dunkle, schwere Farben dich erschlagen können.',
    },
    true_spring: {
      name: 'Warmer Frühling',
      description: 'Goldene, lebendige und fröhliche Farben sind wie für dich gemacht. Koralle, Aprikose, Blattgrün und Türkis geben deiner Haut einen warmen Glow; Grautöne und eisig kühle Nuancen hältst du besser fern.',
    },
    bright_spring: {
      name: 'Klarer Frühling',
      description: 'Klare, satte und leuchtende Farben bringen dich zum Strahlen. Wassermelonenrot, kräftiges Türkis und Sonnengelb rücken dich in den Vordergrund, während staubige, verwaschene Töne dich müde wirken lassen können.',
    },
    light_summer: {
      name: 'Heller Sommer',
      description: 'Pastellige, kühle und sanfte Nuancen stehen dir wunderbar. Lavendel, Puderrosa und zartes Blau sorgen für eine elegante Harmonie, während Orange und sehr dunkle Farben hart wirken können.',
    },
    true_summer: {
      name: 'Kühler Sommer',
      description: 'Blaustichige, kühle und ausgewogene Farben zeigen dich von deiner besten Seite. Altrosa, Stahlblau und Himbeere lassen deine Haut frisch wirken, während warmes Orange und Senfgelb sich beißen können.',
    },
    soft_summer: {
      name: 'Sanfter Sommer',
      description: 'Gedeckte, gräuliche und ruhige Farben verleihen dir eine mühelose Eleganz. Pflaume, Salbei und rauchiges Blau sehen toll an dir aus, während Neon und sehr grelle Töne dich überstrahlen können.',
    },
    soft_autumn: {
      name: 'Sanfter Herbst',
      description: 'Erdige, weiche und sanft warme Farben ergänzen dich wunderschön. Camel, Altrosa, Salbei und zartes Terrakotta harmonieren mit deiner Haut, während Neon und eisige Töne hart wirken können.',
    },
    true_autumn: {
      name: 'Warmer Herbst',
      description: 'Satte, warme, goldene Farben sind dein natürliches Terrain. Rost, Senfgelb, Oliv und Petrol bringen deine Haut zum Leben, während Pastellrosa und Silber dich blass wirken lassen können.',
    },
    deep_autumn: {
      name: 'Dunkler Herbst',
      description: 'Tiefe, warme und intensive Farben sehen an dir umwerfend aus. Burgunder, Schokobraun, dunkles Oliv und Altgold unterstreichen deinen Charakter, während sehr helle Pastelltöne dich verblassen lassen können.',
    },
    deep_winter: {
      name: 'Dunkler Winter',
      description: 'Dunkle, kühle und kraftvolle Farben lassen dich umwerfend aussehen. Mitternachtsblau, Weinrot, Smaragd und klares Weiß stehen dir perfekt, während Beige, Pfirsich und verwaschene warme Töne deine Ausstrahlung dämpfen können.',
    },
    true_winter: {
      name: 'Kühler Winter',
      description: 'Klare, kühle, kontrastreiche Farben bringen dich zum Leuchten. Kobaltblau, Fuchsia, Smaragd und Schneeweiß sind ideal, während Orange, Senfgelb und Erdtöne deine Haut fahl wirken lassen können.',
    },
    bright_winter: {
      name: 'Klarer Winter',
      description: 'Elektrisierende, kühle und leuchtende Farben erwecken dich zum Leben. Pink, Saphirblau, Knallgrün und reines Weiß geben deinem Look Energie, während Beige und staubige Brauntöne dich matt wirken lassen können.',
    },
  },
  looks: {
    natural_glow: {
      name: 'Natürlicher Glow',
      description: 'Frisch, strahlend und mühelos: ein leichter Alltagslook, der deine Haut glowen lässt.',
      steps: [
        {
          title: 'Haut vorbereiten',
          body: 'Trag eine dünne Schicht Feuchtigkeitscreme auf und lass sie eine Minute einziehen. Tagsüber den Sonnenschutz nie vergessen.',
        },
        {
          title: 'Leichte Basis',
          body: 'Verblende eine getönte Tagescreme oder leichte Foundation in deinem empfohlenen Nuancenbereich von der Gesichtsmitte nach außen. Concealer nur dort auftupfen, wo du ihn brauchst.',
        },
        {
          title: 'Cream-Rouge',
          body: 'Tupfe eine deiner Paletten-Rouge-Nuancen auf die Wangenäpfel. Fang mit wenig an und bau bei Bedarf auf.',
        },
        {
          title: 'Wache Augen',
          body: 'Streich deinen hellsten Lidschatten mit der Fingerspitze über das Lid und trag dann eine Schicht Mascara auf.',
        },
        {
          title: 'Getönte Lippen',
          body: 'Zum Schluss einen getönten Balm oder Gloss in einer deiner empfohlenen Lippennuancen, nah an deiner natürlichen Farbe.',
        },
      ],
    },
    office_chic: {
      name: 'Office-Chic',
      description: 'Vom Meeting bis zum Dinner: ein gepflegter, matter und selbstbewusster Look für den Arbeitstag.',
      steps: [
        {
          title: 'Ebenmäßige Basis',
          body: 'Trag eine mittel deckende Foundation in deiner empfohlenen Nuance mit einem feuchten Schwämmchen auf. Fixiere die T-Zone leicht mit transparentem Puder.',
        },
        {
          title: 'Gepflegte Brauen',
          body: 'Bürste die Brauen nach oben, füll Lücken mit feinen, härchenartigen Strichen und fixiere sie mit klarem Gel.',
        },
        {
          title: 'Matter Übergang',
          body: 'Verblende einen matten mittleren Ton aus deiner Palette in der Lidfalte. Zieh mit einem dunkelbraunen Stift einen Tightline-Strich und schließe mit Mascara ab.',
        },
        {
          title: 'Sanftes Contouring',
          body: 'Gib einen Hauch Bronzer direkt unter die Wangenknochen und einen zarten Schleier deines empfohlenen Rouges darüber.',
        },
        {
          title: 'Satin-Lippen',
          body: 'Trag einen Satin-Lippenstift in einer empfohlenen Nuance nah an deiner natürlichen Lippenfarbe auf und definiere die Konturen mit einem Lipliner.',
        },
      ],
    },
    soft_glam: {
      name: 'Soft Glam',
      description: 'Strahlend und doch sanft: ein ausgewogener Glam-Look für elegante Anlässe und Fotos.',
      steps: [
        {
          title: 'Strahlende Basis',
          body: 'Bau deine empfohlene Foundation-Nuance über einem Glow-Primer auf und hell die Augenpartie mit einem Concealer auf, der eine Nuance heller ist.',
        },
        {
          title: 'Sanfter Verlauf',
          body: 'Verblende einen mittleren Ton aus deiner Palette in der Lidfalte und die dunkelste Nuance im äußeren Augenwinkel. Setz einen Schimmer in die Lidmitte.',
        },
        {
          title: 'Wimpern',
          body: 'Trag zwei Schichten Mascara auf und setz nach Belieben ein paar Einzelwimpern an die äußeren Augenwinkel.',
        },
        {
          title: 'Rouge und Highlighter',
          body: 'Streich dein empfohlenes Rouge von den Wangenknochen Richtung Schläfen; gib Highlighter auf die Wangenknochen und den Nasenrücken.',
        },
        {
          title: 'Volle Lippen',
          body: 'Umrande deine Lippen, füll sie mit einer deiner empfohlenen Nuancen und tupfe etwas Gloss in die Mitte.',
        },
        {
          title: 'Fixieren',
          body: 'Sprüh aus etwa 20 cm Abstand ein Fixierspray auf, damit alles an Ort und Stelle bleibt.',
        },
      ],
    },
    evening_smoky: {
      name: 'Abend-Smoky-Eyes',
      description: 'Für einen tiefen, magnetischen Blick: Smoky Eyes für den Abend.',
      steps: [
        {
          title: 'Augen zuerst',
          body: 'Fang mit den Augen an, damit du herabgefallene Pigmente danach entfernen kannst. Trag eine Lidschattenbase auf das Lid auf.',
        },
        {
          title: 'Smoky aufbauen',
          body: 'Zieh einen dunklen Kajal am Wimpernkranz entlang und verwische ihn mit einem kurzen Pinsel nach oben. Drück die dunkelste Nuance deiner Palette darauf und einen mittleren Ton in die Lidfalte; verblende, bis keine harten Kanten mehr bleiben.',
        },
        {
          title: 'Unterer Wimpernkranz und Mascara',
          body: 'Verwische dieselbe dunkle Nuance sanft am unteren Wimpernkranz und schließe mit mehreren Schichten Mascara ab.',
        },
        {
          title: 'Klare Basis',
          body: 'Entferne herabgefallene Pigmente unter den Augen und trag dann Foundation und Concealer auf. Halte die Haut matt und schlicht.',
        },
        {
          title: 'Neutrale Lippen',
          body: 'Da die Augen im Fokus stehen, wähl die neutralste deiner empfohlenen Lippennuancen und trag sie sanft auf.',
        },
      ],
    },
    bridal: {
      name: 'Braut-Look',
      description: 'Zeitlos, romantisch und langanhaltend: ein Braut-Look, der auf Fotos wunderschön aussieht.',
      steps: [
        {
          title: 'Feuchtigkeit und Primer',
          body: 'Bereite die Haut mit einer Feuchtigkeitsmaske vor und trag dann einen langanhaltenden Primer auf.',
        },
        {
          title: 'Langanhaltende Basis',
          body: 'Trag eine langanhaltende Foundation in deinem empfohlenen Bereich in dünnen Schichten auf. Wähl einen Puder ohne LSF, um Blitzlicht-Reflexe auf Fotos zu vermeiden.',
        },
        {
          title: 'Romantische Augen',
          body: 'Verblende sanfte Neutraltöne aus deiner Palette auf dem Lid und einen Champagner-Schimmer in den inneren Augenwinkeln. Nimm wasserfeste Mascara.',
        },
        {
          title: 'Frische Wangen',
          body: 'Schichte deine empfohlene Rouge-Nuance erst als Creme, dann als Puder, damit sie den ganzen Tag hält.',
        },
        {
          title: 'Haltbare Lippen',
          body: 'Füll die ganze Lippe mit Lipliner aus, trag eine deiner empfohlenen Rosé-Nuancen auf, tupfe ab und trag eine zweite Schicht auf.',
        },
        {
          title: 'Letzter Schliff',
          body: 'Schließe mit Fixierspray ab und halte Blotting-Papier und deinen Lippenstift zum Nachbessern bereit.',
        },
      ],
    },
    bold_lip: {
      name: 'Statement-Lippen',
      description: 'Ein starker Fokus: schlichte Haut und Augen mit der kräftigen Lippenfarbe, die dir am besten steht.',
      steps: [
        {
          title: 'Schlichte Basis',
          body: 'Trag deine empfohlene Foundation-Nuance leicht auf und säubere die Mundpartie mit Concealer, damit die Konturen klar wirken.',
        },
        {
          title: 'Minimale Augen',
          body: 'Ein neutraler Hauch auf dem Lid und gut getuschte Wimpern reichen. Die Bühne gehört deinen Lippen.',
        },
        {
          title: 'Präzise Kontur',
          body: 'Umrande Amorbogen und Mundwinkel mit einem Lipliner passend zur kräftigsten deiner empfohlenen Lippennuancen.',
        },
        {
          title: 'Schichten und fixieren',
          body: 'Trag den Lippenstift mit einem Pinsel auf, tupfe ab, drück transparenten Puder durch ein dünnes Tuch und trag eine zweite Schicht auf.',
        },
      ],
    },
    no_makeup_makeup: {
      name: 'No-Make-up-Look',
      description: 'Du, nur ausgeschlafen: ein fast unsichtbarer, natürlicher Look.',
      steps: [
        {
          title: 'Punktuell abdecken',
          body: 'Lass die Foundation weg und deck nur ab, wo nötig, etwa Rötungen und Augenschatten; verblende die Ränder mit der Fingerspitze.',
        },
        {
          title: 'Natürliche Brauen',
          body: 'Bürste deine Brauen mit getöntem Gel nach oben, für mehr Fülle, ohne ihre Form zu verändern.',
        },
        {
          title: 'Natürliche Frische',
          body: 'Nimm das zarteste Rouge deiner Palette sparsam, gerade genug für einen Hauch Frische.',
        },
        {
          title: 'Lippenbalsam',
          body: 'Zum Schluss einen getönten Balm, eine Nuance dunkler als deine natürliche Lippenfarbe.',
        },
      ],
    },
    festival_color: {
      name: 'Festival-Farben',
      description: 'Verspielt und mutig: grafische Augen mit den leuchtendsten Farben deiner Palette.',
      steps: [
        {
          title: 'Dewy Basis',
          body: 'Starte mit einer leichten, taufrischen Basis; Festival-Haut soll frisch und lebendig aussehen.',
        },
        {
          title: 'Farbe aufs Lid',
          body: 'Trag die leuchtendste Nuance deiner Palette deckend auf das ganze Lid auf und zieh den äußeren Winkel nach oben aus.',
        },
        {
          title: 'Grafischer Liner',
          body: 'Zieh mit einem farbigen oder weißen Liner einen grafischen Wing oder eine schwebende Lidfalten-Linie.',
        },
        {
          title: 'Glitzer',
          body: 'Setz feinen, hautverträglichen Kosmetik-Glitzer auf die Wangenknochen und in die inneren Augenwinkel.',
        },
        {
          title: 'Glossy Lippen',
          body: 'Schließe mit einem Gloss in einer deiner empfohlenen Nuancen ab, damit er nicht mit den Augen konkurriert.',
        },
      ],
    },
  },
  profileAxes: {
    warmth: 'Wärme',
    depth: 'Tiefe',
    contrast: 'Kontrast',
    clarity: 'Klarheit',
    softness: 'Weichheit',
    lightness: 'Helligkeit',
  },
  shades: {
    Nude: 'Nude',
    Champagne: 'Champagner',
    Peach: 'Pfirsich',
    Apricot: 'Aprikose',
    Salmon: 'Lachs',
    Coral: 'Koralle',
    Terracotta: 'Terrakotta',
    'Tomato red': 'Tomatenrot',
    'Classic red': 'Klassisches Rot',
    Cherry: 'Kirsche',
    Burgundy: 'Burgunder',
    Wine: 'Weinrot',
    Plum: 'Pflaume',
    Aubergine: 'Aubergine',
    Caramel: 'Karamell',
    Bronze: 'Bronze',
    Cinnamon: 'Zimt',
    Chocolate: 'Schokolade',
    'Dusty rose': 'Altrosa',
    Mauve: 'Mauve',
    Rose: 'Rosé',
    'Powder pink': 'Puderrosa',
    'Baby pink': 'Babyrosa',
    'Candy pink': 'Bonbonrosa',
    Fuchsia: 'Fuchsia',
    Raspberry: 'Himbeere',
    Lilac: 'Flieder',
    Lavender: 'Lavendel',
    Violet: 'Violett',
    Gold: 'Gold',
    Taupe: 'Taupe',
    Sage: 'Salbei',
    Camel: 'Camel',
    'Rosy beige': 'Rosébeige',
    Brick: 'Ziegelrot',
    Cocoa: 'Kakao',
    Khaki: 'Khaki',
    Olive: 'Oliv',
    Emerald: 'Smaragd',
    Teal: 'Petrol',
    Navy: 'Marineblau',
    'Icy blue': 'Eisblau',
    Grey: 'Grau',
    Charcoal: 'Anthrazit',
  },
  shadeModifiers: {
    light: '{name} hell',
    deep: '{name} dunkel',
  },
  mock: {
    analysis: {
      foundation: {
        undertoneLabel: 'Warm-neutral (Goldbeige)',
        shadeRange: 'Hell bis mittel, warmes Beige (z. B. W2–W3)',
      },
      summary: 'Deine Farben sind sanft und leicht warm, damit bist du ein Sanfter Herbst. Gedeckte Erdtöne wie Camel, Salbei und Altrosa harmonieren mit deiner Haut, während sehr grelle oder eisige Farben neben deinem Gesicht hart wirken können.',
    },
    skin: {
      routine: {
        morning: ['Mildes Reinigungsgel', 'Leichtes Feuchtigkeitsserum', 'Ölfreie Feuchtigkeitscreme', 'Sonnenschutz LSF 50'],
        evening: ['Milde Reinigung', 'Niacinamid-Serum', 'Barriere-stärkende Feuchtigkeitscreme'],
      },
      ingredients: ['Niacinamid', 'Hyaluronsäure', 'Ceramide'],
      summary: 'Deine Haut wirkt ausgeglichen, mit etwas Glanz in der T-Zone. Eine leichte, feuchtigkeitsspendende Routine mit täglichem Sonnenschutz hält sie angenehm und ebenmäßig.',
    },
  },
};
