import type { Locale } from '@tonelle/shared';

/**
 * "How people use Tonelle" entries.
 *
 * IMPORTANT: every entry below is an invented, illustrative scenario (`isPlaceholder: true`),
 * not a review by a real customer. EU (UCPD / Omnibus Directive) and Turkish consumer law
 * (Ticari Reklam ve Haksız Ticari Uygulamalar Yönetmeliği) prohibit presenting invented
 * reviews as genuine. While any placeholder is shown, the landing page renders the
 * `people.caption` disclosure ("Örnek kullanıcı senaryoları" / "Example user scenarios"),
 * and these entries are never emitted as schema.org Review data.
 *
 * To publish real reviews: replace an entry with the customer's verified, consented text and
 * set `isPlaceholder: false`. Portraits are always illustrated avatars (no photos).
 */
export interface Testimonial {
  id: string;
  isPlaceholder: boolean;
  /** Which illustrated avatar to draw (0–2). */
  avatar: 0 | 1 | 2;
  name: string;
  age: number;
  role: Record<Locale, string>;
  quote: Record<Locale, string>;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'elif',
    isPlaceholder: true,
    avatar: 0,
    name: 'Elif',
    age: 27,
    role: { tr: 'Öğretmen', en: 'Teacher' },
    quote: {
      tr: 'Yıllarca soğuk pembe rujlar aldım, hepsi çekmecede kaldı. Alt tonumun zeytin olduğunu görünce neden hiçbirinin tutmadığını anladım. Artık alışverişe paletim açıkken gidiyorum.',
      en: 'For years I bought cool pink lipsticks and they all ended up in a drawer. Seeing that my undertone is olive, it finally made sense why none of them worked. Now I shop with my palette open.',
    },
  },
  {
    id: 'zeynep',
    isPlaceholder: true,
    avatar: 1,
    name: 'Zeynep',
    age: 34,
    role: { tr: 'Mimar', en: 'Architect' },
    quote: {
      tr: 'Sabahları beş dakikam var. Ofis görünümünün adımlarını bir kez takip ettim, şimdi ezbere yapıyorum. Fondöten ton aralığı da mağazada seçim yaparken işimi kolaylaştırdı.',
      en: 'I have five minutes in the morning. I followed the office look’s steps once and now I do it by heart. The foundation shade range made choosing in the shop much easier.',
    },
  },
  {
    id: 'deniz',
    isPlaceholder: true,
    avatar: 2,
    name: 'Deniz',
    age: 22,
    role: { tr: 'Öğrenci', en: 'Student' },
    quote: {
      tr: 'Mezuniyet için gece makyajını önce kendi fotoğrafımda denedim. Koyu far bana göre değildi ama sıcak bronz tonlar çok iyi durdu; o akşam tam onu yaptım.',
      en: 'Before graduation I tried the evening look on my own photo first. Dark shadow wasn’t for me, but the warm bronze shades looked great, so that’s exactly what I wore that night.',
    },
  },
];

export function hasPlaceholderTestimonials(list: Testimonial[] = TESTIMONIALS): boolean {
  return list.some((t) => t.isPlaceholder);
}
