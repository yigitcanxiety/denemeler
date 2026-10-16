import type { ContentOverlay } from './types';

/** Italian catalogue text (see ContentOverlay). */
export const it: ContentOverlay = {
  seasons: {
    light_spring: {
      name: 'Primavera Chiara',
      description: 'Le nuance chiare, calde e fresche sono il tuo punto forte. Pesca, corallo tenue e giallo burro illuminano il viso, mentre i colori molto scuri e pesanti rischiano di sovrastarti.',
    },
    true_spring: {
      name: 'Primavera Calda',
      description: 'I colori dorati, vivaci e allegri sono fatti per te. Corallo, albicocca, verde foglia e turchese danno alla pelle un bagliore caldo; grigi e toni freddi ghiacciati è meglio tenerli lontani.',
    },
    bright_spring: {
      name: 'Primavera Brillante',
      description: 'I colori limpidi, saturi e luminosi ti fanno risplendere. Rosso anguria, turchese acceso e giallo sole ti valorizzano, mentre le nuance polverose e sbiadite possono darti un’aria stanca.',
    },
    light_summer: {
      name: 'Estate Chiara',
      description: 'Le nuance pastello, fredde e delicate ti stanno benissimo. Lavanda, rosa cipria e azzurro tenue creano un’armonia elegante, mentre l’arancione e i colori molto scuri possono risultare duri.',
    },
    true_summer: {
      name: 'Estate Fredda',
      description: 'I colori a base blu, freddi ed equilibrati ti mostrano al meglio. Rosa antico, blu acciaio e lampone ravvivano la pelle, mentre arancione caldo e senape possono stonare.',
    },
    soft_summer: {
      name: 'Estate Tenue',
      description: 'I colori smorzati, grigiati e pacati ti regalano un’eleganza naturale. Prugna, salvia e blu fumo ti stanno d’incanto, mentre i neon e le nuance troppo accese possono sovrastarti.',
    },
    soft_autumn: {
      name: 'Autunno Tenue',
      description: 'I colori terrosi, morbidi e delicatamente caldi ti valorizzano. Cammello, rosa antico, salvia e terracotta tenue si armonizzano con la tua pelle, mentre neon e toni ghiacciati possono risultare duri.',
    },
    true_autumn: {
      name: 'Autunno Caldo',
      description: 'I colori ricchi, caldi e dorati sono il tuo territorio naturale. Ruggine, senape, oliva e verde petrolio danno vita alla pelle, mentre rosa pastello e argento possono spegnerti.',
    },
    deep_autumn: {
      name: 'Autunno Scuro',
      description: 'I colori profondi, caldi e intensi su di te sono magnetici. Bordeaux, cioccolato, oliva scuro e oro antico esaltano il tuo carattere, mentre i pastelli molto chiari possono farti scomparire.',
    },
    deep_winter: {
      name: 'Inverno Scuro',
      description: 'I colori scuri, freddi e decisi ti stanno da favola. Blu notte, rosso vino, smeraldo e bianco ottico ti stanno alla perfezione, mentre beige, pesca e toni caldi sbiaditi attenuano il tuo impatto.',
    },
    true_winter: {
      name: 'Inverno Freddo',
      description: 'I colori limpidi, freddi e ad alto contrasto ti fanno brillare. Cobalto, fucsia, smeraldo e bianco neve sono ideali, mentre arancione, senape e toni terrosi possono rendere la pelle spenta e giallastra.',
    },
    bright_winter: {
      name: 'Inverno Brillante',
      description: 'I colori elettrici, freddi e vividi ti danno energia. Rosa shocking, zaffiro, verde brillante e bianco puro accendono il tuo look, mentre beige e marroni polverosi possono spegnerti.',
    },
  },
  looks: {
    natural_glow: {
      name: 'Luminosità naturale',
      description: 'Fresco, luminoso e senza sforzo: un look leggero per tutti i giorni che fa risplendere la pelle.',
      steps: [
        {
          title: 'Prepara la pelle',
          body: 'Stendi un velo sottile di crema idratante e lasciala assorbire per un minuto. Di giorno non saltare mai la protezione solare.',
        },
        {
          title: 'Base leggera',
          body: 'Sfuma una crema colorata o un fondotinta leggero nella tua gamma consigliata, dal centro del viso verso l’esterno. Applica il correttore solo dove serve.',
        },
        {
          title: 'Blush in crema',
          body: 'Picchietta una delle nuance di blush della tua palette sugli zigomi, nella parte più piena. Parti con poco e aggiungi se serve.',
        },
        {
          title: 'Sguardo aperto',
          body: 'Stendi con il polpastrello la nuance di ombretto più chiara sulla palpebra, poi applica uno strato di mascara.',
        },
        {
          title: 'Labbra colorate',
          body: 'Completa con un balsamo colorato o un gloss in una delle tue nuance di labbra consigliate, vicina al tuo colore naturale.',
        },
      ],
    },
    office_chic: {
      name: 'Chic da ufficio',
      description: 'Dalle riunioni alla cena: un look da lavoro curato, opaco e sicuro.',
      steps: [
        {
          title: 'Base uniforme',
          body: 'Applica con una spugnetta umida un fondotinta a coprenza media nella tua nuance consigliata. Fissa leggermente la zona T con una cipria trasparente.',
        },
        {
          title: 'Sopracciglia in ordine',
          body: 'Spazzola le sopracciglia verso l’alto, riempi i vuoti con tratti sottili simili a peli e fissa con un gel trasparente.',
        },
        {
          title: 'Transizione opaca',
          body: 'Sfuma nella piega dell’occhio una nuance opaca intermedia della tua palette. Traccia una linea interna con una matita marrone scuro e completa con il mascara.',
        },
        {
          title: 'Scolpitura leggera',
          body: 'Aggiungi un tocco di terra appena sotto gli zigomi e un velo leggero del tuo blush consigliato sopra.',
        },
        {
          title: 'Labbra satinate',
          body: 'Applica un rossetto satinato in una nuance consigliata vicina al colore naturale delle tue labbra e definisci i bordi con una matita.',
        },
      ],
    },
    soft_glam: {
      name: 'Soft Glam',
      description: 'Luminoso ma delicato: un glam equilibrato per eventi eleganti e foto.',
      steps: [
        {
          title: 'Base luminosa',
          body: 'Costruisci la tua nuance di fondotinta consigliata su un primer illuminante e illumina il sottocchio con un correttore di un tono più chiaro.',
        },
        {
          title: 'Sfumatura morbida',
          body: 'Sfuma una nuance intermedia della tua palette nella piega dell’occhio e quella più scura nell’angolo esterno. Aggiungi un ombretto shimmer al centro della palpebra.',
        },
        {
          title: 'Ciglia',
          body: 'Applica due strati di mascara e, se ti va, aggiungi qualche ciuffetto di ciglia finte agli angoli esterni.',
        },
        {
          title: 'Blush e illuminante',
          body: 'Stendi il tuo blush consigliato dagli zigomi verso le tempie; aggiungi l’illuminante sulla parte alta degli zigomi e sul dorso del naso.',
        },
        {
          title: 'Labbra piene',
          body: 'Delinea le labbra, riempile con una delle tue nuance consigliate e picchietta un tocco di gloss al centro.',
        },
        {
          title: 'Fissa',
          body: 'Vaporizza uno spray fissante da circa 20 cm di distanza perché tutto resti al suo posto.',
        },
      ],
    },
    evening_smoky: {
      name: 'Smoky eyes da sera',
      description: 'Per uno sguardo profondo e magnetico: uno smoky eye pensato per le serate fuori.',
      steps: [
        {
          title: 'Prima gli occhi',
          body: 'Inizia dagli occhi, così puoi pulire dopo l’eventuale polvere caduta. Applica un primer per ombretti sulla palpebra.',
        },
        {
          title: 'Crea l’effetto smoky',
          body: 'Traccia una matita scura lungo la rima delle ciglia e sfumala verso l’alto con un pennello corto. Picchietta sopra la nuance più scura della tua palette e una intermedia nella piega; sfuma finché non restano bordi netti.',
        },
        {
          title: 'Rima inferiore e mascara',
          body: 'Sfuma delicatamente la stessa nuance scura lungo la rima inferiore e completa con più strati di mascara.',
        },
        {
          title: 'Base pulita',
          body: 'Elimina i residui di ombretto sotto gli occhi, poi applica fondotinta e correttore. Mantieni la pelle opaca e semplice.',
        },
        {
          title: 'Labbra neutre',
          body: 'Con gli occhi protagonisti, scegli la più neutra delle tue nuance di labbra consigliate e applicala con leggerezza.',
        },
      ],
    },
    bridal: {
      name: 'Sposa',
      description: 'Senza tempo, romantico e a lunga tenuta: un look da sposa che viene benissimo in foto.',
      steps: [
        {
          title: 'Idrata e prepara',
          body: 'Prepara la pelle con una maschera idratante, poi applica un primer a lunga tenuta.',
        },
        {
          title: 'Base a lunga tenuta',
          body: 'Applica a strati sottili un fondotinta a lunga tenuta nella tua gamma consigliata. Scegli una cipria senza SPF per evitare l’effetto flash nelle foto.',
        },
        {
          title: 'Occhi romantici',
          body: 'Sfuma sulla palpebra i neutri delicati della tua palette e uno shimmer champagne negli angoli interni. Usa un mascara waterproof.',
        },
        {
          title: 'Guance fresche',
          body: 'Stratifica la tua nuance di blush consigliata, prima in crema e poi in polvere, perché duri tutto il giorno.',
        },
        {
          title: 'Labbra che durano',
          body: 'Riempi tutte le labbra con la matita, applica una delle tue nuance rosate consigliate, tampona e stendi un secondo strato.',
        },
        {
          title: 'Tocco finale',
          body: 'Completa con lo spray fissante e tieni con te cartine opacizzanti e rossetto per i ritocchi.',
        },
      ],
    },
    bold_lip: {
      name: 'Labbra intense',
      description: 'Un solo punto focale: pelle e occhi semplici con la nuance di rossetto intenso che ti dona di più.',
      steps: [
        {
          title: 'Base semplice',
          body: 'Applica con leggerezza la tua nuance di fondotinta consigliata e pulisci il contorno della bocca con il correttore, per bordi precisi.',
        },
        {
          title: 'Occhi minimal',
          body: 'Basta un velo neutro sulla palpebra e ciglia ben pettinate. Lascia la scena alle labbra.',
        },
        {
          title: 'Contorno preciso',
          body: 'Delinea l’arco di Cupido e gli angoli con una matita abbinata alla più intensa delle tue nuance di labbra consigliate.',
        },
        {
          title: 'Stratifica e fissa',
          body: 'Applica il rossetto con un pennello, tampona, picchietta cipria trasparente attraverso un velo di fazzoletto e stendi un secondo strato.',
        },
      ],
    },
    no_makeup_makeup: {
      name: 'No-makeup makeup',
      description: 'Tu, solo con un’aria più riposata: un look naturale, quasi invisibile.',
      steps: [
        {
          title: 'Correttore mirato',
          body: 'Salta il fondotinta e usa il correttore solo dove serve, ad esempio su rossori e occhiaie, sfumando i bordi con il polpastrello.',
        },
        {
          title: 'Sopracciglia naturali',
          body: 'Spazzola le sopracciglia verso l’alto con un gel colorato per dare volume senza cambiarne la forma.',
        },
        {
          title: 'Colorito naturale',
          body: 'Usa con parsimonia il blush più delicato della tua palette, quanto basta per un tocco di vitalità.',
        },
        {
          title: 'Balsamo labbra',
          body: 'Completa con un balsamo colorato di un tono più intenso del colore naturale delle tue labbra.',
        },
      ],
    },
    festival_color: {
      name: 'Colori da festival',
      description: 'Giocoso e audace: occhi grafici con i colori più accesi della tua palette.',
      steps: [
        {
          title: 'Base rugiadosa',
          body: 'Parti da una base leggera e luminosa: la pelle da festival deve apparire fresca e viva.',
        },
        {
          title: 'Colore sulla palpebra',
          body: 'Stendi la nuance più accesa della tua palette su tutta la palpebra e allunga l’angolo esterno verso l’alto.',
        },
        {
          title: 'Eyeliner grafico',
          body: 'Disegna una codina grafica o una linea fluttuante sopra la piega con un eyeliner colorato o bianco.',
        },
        {
          title: 'Brillantini',
          body: 'Aggiungi glitter cosmetici fini, adatti alla pelle, sugli zigomi e negli angoli interni degli occhi.',
        },
        {
          title: 'Labbra lucide',
          body: 'Completa con un gloss in una delle tue nuance consigliate, così non fa concorrenza agli occhi.',
        },
      ],
    },
  },
  profileAxes: {
    warmth: 'Calore',
    depth: 'Profondità',
    contrast: 'Contrasto',
    clarity: 'Brillantezza',
    softness: 'Morbidezza',
    lightness: 'Luminosità',
  },
  shades: {
    Nude: 'Nude',
    Champagne: 'Champagne',
    Peach: 'Pesca',
    Apricot: 'Albicocca',
    Salmon: 'Salmone',
    Coral: 'Corallo',
    Terracotta: 'Terracotta',
    'Tomato red': 'Rosso pomodoro',
    'Classic red': 'Rosso classico',
    Cherry: 'Ciliegia',
    Burgundy: 'Bordeaux',
    Wine: 'Vinaccia',
    Plum: 'Prugna',
    Aubergine: 'Melanzana',
    Caramel: 'Caramello',
    Bronze: 'Bronzo',
    Cinnamon: 'Cannella',
    Chocolate: 'Cioccolato',
    'Dusty rose': 'Rosa antico',
    Mauve: 'Malva',
    Rose: 'Rosa',
    'Powder pink': 'Rosa cipria',
    'Baby pink': 'Rosa confetto',
    'Candy pink': 'Rosa bonbon',
    Fuchsia: 'Fucsia',
    Raspberry: 'Lampone',
    Lilac: 'Lilla',
    Lavender: 'Lavanda',
    Violet: 'Viola',
    Gold: 'Oro',
    Taupe: 'Tortora',
    Sage: 'Salvia',
    Camel: 'Cammello',
    'Rosy beige': 'Beige rosato',
    Brick: 'Mattone',
    Cocoa: 'Cacao',
    Khaki: 'Kaki',
    Olive: 'Oliva',
    Emerald: 'Smeraldo',
    Teal: 'Verde petrolio',
    Navy: 'Blu navy',
    'Icy blue': 'Azzurro ghiaccio',
    Grey: 'Grigio',
    Charcoal: 'Antracite',
  },
  shadeModifiers: {
    light: '{name} chiaro',
    deep: '{name} scuro',
  },
  mock: {
    analysis: {
      foundation: {
        undertoneLabel: 'Neutro caldo (beige dorato)',
        shadeRange: 'Chiaro-medio, beige caldo (es. W2–W3)',
      },
      summary: 'I tuoi colori sono morbidi e delicatamente caldi: per questo sei un Autunno Tenue. Le nuance terrose e smorzate come cammello, salvia e rosa antico si armonizzano con la tua pelle, mentre i colori molto accesi o ghiacciati possono risultare duri vicino al viso.',
    },
    skin: {
      routine: {
        morning: ['Detergente in gel delicato', 'Siero idratante leggero', 'Crema idratante oil-free', 'Protezione solare SPF 50'],
        evening: ['Detergente delicato', 'Siero alla niacinamide', 'Crema che rinforza la barriera cutanea'],
      },
      ingredients: ['Niacinamide', 'Acido ialuronico', 'Ceramidi'],
      summary: 'La tua pelle appare equilibrata, con un po’ di lucidità nella zona T. Una routine leggera e idratante con protezione solare quotidiana la manterrà confortevole e uniforme.',
    },
  },
};
