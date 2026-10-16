import type { ContentOverlay } from './types';

/** Brazilian Portuguese catalogue text (see ContentOverlay). */
export const pt: ContentOverlay = {
  seasons: {
    light_spring: {
      name: 'Primavera Clara',
      description: 'Tons claros, quentes e frescos são o seu ponto forte. Pêssego, coral suave e amarelo-manteiga iluminam o seu rosto, enquanto cores muito escuras e pesadas podem apagar você.',
    },
    true_spring: {
      name: 'Primavera Pura',
      description: 'Cores douradas, vivas e alegres foram feitas para você. Coral, damasco, verde-folha e turquesa dão um brilho quente à sua pele; cinzas e tons frios e gelados ficam melhor longe do rosto.',
    },
    bright_spring: {
      name: 'Primavera Brilhante',
      description: 'Cores limpas, saturadas e vibrantes fazem você brilhar. Vermelho-melancia, turquesa intenso e amarelo-sol valorizam você, enquanto tons empoeirados e desbotados podem deixar você com ar cansado.',
    },
    light_summer: {
      name: 'Verão Claro',
      description: 'Tons pastel, frios e delicados ficam lindos em você. Lavanda, rosa pó e azul suave criam uma harmonia elegante, enquanto laranja e cores muito escuras podem pesar.',
    },
    true_summer: {
      name: 'Verão Puro',
      description: 'Cores frias, equilibradas e com fundo azulado mostram o seu melhor. Rosa antigo, azul-aço e framboesa deixam a pele com ar fresco, enquanto laranja quente e mostarda podem destoar.',
    },
    soft_summer: {
      name: 'Verão Suave',
      description: 'Cores suaves, acinzentadas e serenas dão a você uma elegância natural. Ameixa, verde-sálvia e azul esfumado ficam lindos em você, enquanto neon e tons muito vibrantes podem dominar o visual.',
    },
    soft_autumn: {
      name: 'Outono Suave',
      description: 'Cores terrosas, suaves e levemente quentes combinam muito com você. Camelo, rosa antigo, verde-sálvia e terracota suave se harmonizam com a sua pele, enquanto neon e tons gelados podem ficar duros.',
    },
    true_autumn: {
      name: 'Outono Puro',
      description: 'Cores ricas, quentes e douradas são o seu território natural. Ferrugem, mostarda, verde-oliva e verde-petróleo dão vida à sua pele, enquanto rosa pastel e prata podem apagar você.',
    },
    deep_autumn: {
      name: 'Outono Profundo',
      description: 'Cores profundas, quentes e intensas ficam marcantes em você. Bordô, chocolate, oliva escuro e dourado envelhecido realçam a sua personalidade, enquanto tons pastel muito claros podem apagar você.',
    },
    deep_winter: {
      name: 'Inverno Profundo',
      description: 'Cores escuras, frias e poderosas deixam você deslumbrante. Azul-meia-noite, vinho, esmeralda e branco puro caem perfeitamente, enquanto bege, pêssego e tons quentes desbotados podem tirar o seu impacto.',
    },
    true_winter: {
      name: 'Inverno Puro',
      description: 'Cores limpas, frias e de alto contraste fazem você brilhar. Azul-cobalto, fúcsia, esmeralda e branco-neve são ideais, enquanto laranja, mostarda e tons terrosos podem deixar a pele amarelada.',
    },
    bright_winter: {
      name: 'Inverno Brilhante',
      description: 'Cores elétricas, frias e vibrantes dão vida a você. Rosa-choque, safira, verde vivo e branco puro energizam o visual, enquanto bege e marrons empoeirados podem apagar você.',
    },
  },
  looks: {
    natural_glow: {
      name: 'Glow Natural',
      description: 'Fresca, luminosa e sem esforço: uma make leve para o dia a dia que deixa a sua pele brilhar.',
      steps: [
        {
          title: 'Prepare a pele',
          body: 'Aplique uma camada fina de hidratante e espere um minuto para absorver. Durante o dia, nunca dispense o protetor solar.',
        },
        {
          title: 'Base leve',
          body: 'Espalhe um hidratante com cor ou uma base leve na faixa de tom recomendada, do centro do rosto para fora. Use corretivo só onde precisar.',
        },
        {
          title: 'Blush em creme',
          body: 'Dê batidinhas de um dos blushes da sua cartela nas maçãs do rosto. Comece com pouco e aumente se precisar.',
        },
        {
          title: 'Olhar aberto',
          body: 'Passe a sombra mais clara da sua cartela na pálpebra com a ponta do dedo e finalize com uma camada de máscara de cílios.',
        },
        {
          title: 'Lábios com cor',
          body: 'Finalize com um balm com cor ou gloss em um dos tons de lábios recomendados, próximo da sua cor natural.',
        },
      ],
    },
    office_chic: {
      name: 'Chique no Trabalho',
      description: 'Da reunião ao jantar: uma make polida, matte e confiante para o dia de trabalho.',
      steps: [
        {
          title: 'Base uniforme',
          body: 'Aplique uma base de cobertura média no tom recomendado com uma esponja úmida. Sele levemente a zona T com pó translúcido.',
        },
        {
          title: 'Sobrancelhas alinhadas',
          body: 'Penteie as sobrancelhas para cima, preencha as falhas com traços finos imitando fios e fixe com gel incolor.',
        },
        {
          title: 'Transição matte',
          body: 'Esfume um tom médio matte da sua cartela no côncavo. Preencha a raiz dos cílios com um lápis marrom-escuro e finalize com máscara de cílios.',
        },
        {
          title: 'Contorno suave',
          body: 'Aplique um toque de bronzer logo abaixo das maçãs do rosto e um véu leve do blush recomendado logo acima.',
        },
        {
          title: 'Lábios acetinados',
          body: 'Aplique um batom acetinado em um tom recomendado próximo da cor natural dos seus lábios e defina o contorno com lápis.',
        },
      ],
    },
    soft_glam: {
      name: 'Glam Suave',
      description: 'Radiante, mas suave: um glam equilibrado para eventos elegantes e fotos.',
      steps: [
        {
          title: 'Base luminosa',
          body: 'Construa a base no tom recomendado sobre um primer iluminador e ilumine a região dos olhos com um corretivo um tom mais claro.',
        },
        {
          title: 'Degradê suave',
          body: 'Esfume um tom médio da sua cartela no côncavo e o tom mais escuro no canto externo. Aplique uma sombra cintilante no centro da pálpebra.',
        },
        {
          title: 'Cílios',
          body: 'Aplique duas camadas de máscara de cílios e, se quiser, alguns cílios postiços em tufos nos cantos externos.',
        },
        {
          title: 'Blush e iluminador',
          body: 'Espalhe o blush recomendado das maçãs do rosto em direção às têmporas; aplique iluminador no alto das maçãs e no dorso do nariz.',
        },
        {
          title: 'Lábios volumosos',
          body: 'Contorne os lábios, preencha com um dos tons recomendados e aplique um toque de gloss no centro.',
        },
        {
          title: 'Fixe',
          body: 'Borrife um spray fixador a cerca de 20 cm de distância para manter tudo no lugar.',
        },
      ],
    },
    evening_smoky: {
      name: 'Esfumado Noturno',
      description: 'Para um olhar profundo e magnético: um esfumado feito para sair à noite.',
      steps: [
        {
          title: 'Olhos primeiro',
          body: 'Comece pelos olhos para poder limpar os resíduos de sombra depois. Aplique um primer de sombra na pálpebra.',
        },
        {
          title: 'Construa o esfumado',
          body: 'Passe um lápis escuro rente aos cílios e esfume para cima com um pincel curto. Pressione por cima o tom mais escuro da sua cartela e um tom médio no côncavo; esfume até não sobrar nenhum contorno marcado.',
        },
        {
          title: 'Linha inferior e máscara',
          body: 'Esfume suavemente o mesmo tom escuro na linha dos cílios inferiores e finalize com várias camadas de máscara de cílios.',
        },
        {
          title: 'Base limpa',
          body: 'Limpe os resíduos de sombra embaixo dos olhos e depois aplique base e corretivo. Mantenha a pele matte e simples.',
        },
        {
          title: 'Lábios neutros',
          body: 'Com os olhos em destaque, escolha o tom de lábios mais neutro entre os recomendados e aplique de leve.',
        },
      ],
    },
    bridal: {
      name: 'Noiva',
      description: 'Atemporal, romântica e de longa duração: uma make de noiva que fica linda nas fotos.',
      steps: [
        {
          title: 'Hidrate e prepare',
          body: 'Prepare a pele com uma máscara hidratante e depois aplique um primer de longa duração.',
        },
        {
          title: 'Base de longa duração',
          body: 'Aplique uma base de longa duração na faixa de tom recomendada em camadas finas. Escolha um pó sem FPS para evitar o efeito flashback nas fotos.',
        },
        {
          title: 'Olhos românticos',
          body: 'Esfume tons neutros suaves da sua cartela na pálpebra e uma sombra cintilante champanhe nos cantos internos. Use máscara de cílios à prova d’água.',
        },
        {
          title: 'Bochechas coradas',
          body: 'Aplique o blush recomendado em camadas, primeiro em creme e depois em pó, para durar o dia todo.',
        },
        {
          title: 'Lábios duradouros',
          body: 'Preencha todo o lábio com lápis, aplique um dos tons rosados recomendados, retire o excesso com um lenço e aplique uma segunda camada.',
        },
        {
          title: 'Toque final',
          body: 'Finalize com spray fixador e tenha sempre por perto papel absorvente de oleosidade e o seu batom para retoques.',
        },
      ],
    },
    bold_lip: {
      name: 'Boca Marcante',
      description: 'Um único ponto de destaque: pele e olhos simples com o batom marcante que mais combina com você.',
      steps: [
        {
          title: 'Base simples',
          body: 'Aplique levemente a base no tom recomendado e limpe o contorno da boca com corretivo para as bordas ficarem bem definidas.',
        },
        {
          title: 'Olhos minimalistas',
          body: 'Um toque de sombra neutra na pálpebra e cílios bem penteados bastam. Deixe os lábios roubarem a cena.',
        },
        {
          title: 'Contorno preciso',
          body: 'Contorne o arco do cupido e os cantos com um lápis no mesmo tom do mais intenso entre os batons recomendados.',
        },
        {
          title: 'Camadas e fixação',
          body: 'Aplique o batom com pincel, retire o excesso, pressione pó translúcido sobre um lenço fino e aplique uma segunda camada.',
        },
      ],
    },
    no_makeup_makeup: {
      name: 'Make Sem Make',
      description: 'Você com cara de quem dormiu bem: uma make natural, quase invisível.',
      steps: [
        {
          title: 'Corretivo pontual',
          body: 'Dispense a base e use corretivo só onde precisar, como vermelhidão e olheiras, esfumando as bordas com a ponta do dedo.',
        },
        {
          title: 'Sobrancelhas naturais',
          body: 'Penteie as sobrancelhas para cima com um gel com cor para dar volume sem mudar o desenho.',
        },
        {
          title: 'Rubor natural',
          body: 'Use com moderação o blush mais suave da sua cartela, só o suficiente para dar um ar de vida.',
        },
        {
          title: 'Balm labial',
          body: 'Finalize com um balm com cor um tom mais escuro que a cor natural dos seus lábios.',
        },
      ],
    },
    festival_color: {
      name: 'Cores de Festival',
      description: 'Divertida e ousada: olhos gráficos com as cores mais vibrantes da sua cartela.',
      steps: [
        {
          title: 'Base iluminada',
          body: 'Comece com uma base leve e com efeito glow; pele de festival deve parecer fresca e viva.',
        },
        {
          title: 'Cor na pálpebra',
          body: 'Aplique o tom mais vibrante da sua cartela em toda a pálpebra e estenda o canto externo para cima.',
        },
        {
          title: 'Delineado gráfico',
          body: 'Faça um gatinho gráfico ou uma linha flutuante acima do côncavo com um delineador colorido ou branco.',
        },
        {
          title: 'Brilho',
          body: 'Aplique glitter cosmético fino, próprio para a pele, nas maçãs do rosto e nos cantos internos dos olhos.',
        },
        {
          title: 'Lábios com gloss',
          body: 'Finalize com um gloss em um dos tons recomendados, para não competir com os olhos.',
        },
      ],
    },
  },
  profileAxes: {
    warmth: 'Calor',
    depth: 'Profundidade',
    contrast: 'Contraste',
    clarity: 'Nitidez',
    softness: 'Suavidade',
    lightness: 'Claridade',
  },
  shades: {
    Nude: 'Nude',
    Champagne: 'Champanhe',
    Peach: 'Pêssego',
    Apricot: 'Damasco',
    Salmon: 'Salmão',
    Coral: 'Coral',
    Terracotta: 'Terracota',
    'Tomato red': 'Vermelho-tomate',
    'Classic red': 'Vermelho clássico',
    Cherry: 'Cereja',
    Burgundy: 'Bordô',
    Wine: 'Vinho',
    Plum: 'Ameixa',
    Aubergine: 'Berinjela',
    Caramel: 'Caramelo',
    Bronze: 'Bronze',
    Cinnamon: 'Canela',
    Chocolate: 'Chocolate',
    'Dusty rose': 'Rosa antigo',
    Mauve: 'Malva',
    Rose: 'Rosa',
    'Powder pink': 'Rosa pó',
    'Baby pink': 'Rosa bebê',
    'Candy pink': 'Rosa chiclete',
    Fuchsia: 'Fúcsia',
    Raspberry: 'Framboesa',
    Lilac: 'Lilás',
    Lavender: 'Lavanda',
    Violet: 'Violeta',
    Gold: 'Dourado',
    Taupe: 'Taupe',
    Sage: 'Verde-sálvia',
    Camel: 'Camelo',
    'Rosy beige': 'Bege rosado',
    Brick: 'Tijolo',
    Cocoa: 'Cacau',
    Khaki: 'Cáqui',
    Olive: 'Verde-oliva',
    Emerald: 'Esmeralda',
    Teal: 'Verde-petróleo',
    Navy: 'Azul-marinho',
    'Icy blue': 'Azul-gelo',
    Grey: 'Cinza',
    Charcoal: 'Grafite',
  },
  shadeModifiers: {
    light: '{name} claro',
    deep: '{name} escuro',
  },
  mock: {
    analysis: {
      foundation: {
        undertoneLabel: 'Neutro quente (bege dourado)',
        shadeRange: 'Clara a média, bege quente (ex.: W2–W3)',
      },
      summary: 'Sua coloração é suave e levemente quente, o que coloca você no Outono Suave. Tons terrosos e suaves como camelo, verde-sálvia e rosa antigo se harmonizam com a sua pele, enquanto cores muito vibrantes ou geladas podem ficar duras perto do rosto.',
    },
    skin: {
      routine: {
        morning: ['Gel de limpeza suave', 'Sérum hidratante leve', 'Hidratante oil-free', 'Protetor solar FPS 50'],
        evening: ['Sabonete facial suave', 'Sérum de niacinamida', 'Hidratante que fortalece a barreira da pele'],
      },
      ingredients: ['Niacinamida', 'Ácido hialurônico', 'Ceramidas'],
      summary: 'Sua pele parece equilibrada, com um pouco de brilho na zona T. Uma rotina leve e hidratante com protetor solar diário ajuda a mantê-la confortável e uniforme.',
    },
  },
};
