import { SEASONS, isLocale } from '@tonelle/shared';
import { ImageResponse } from 'next/og';
import { getContent } from '@/content';

export const alt = 'Tonelle';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : 'tr';
  const content = getContent(locale);
  const palette = SEASONS.soft_autumn.palette;

  const lines = [150, 300, 450, 600, 750, 900, 1050];
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: '#E6DED7', color: '#231816' }}>
        {lines.map((x) => (
          <div key={x} style={{ position: 'absolute', top: 0, bottom: 0, left: x, width: 1, background: 'rgba(35,24,22,0.12)' }} />
        ))}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 404, height: 1, background: 'rgba(35,24,22,0.14)' }} />
        <div style={{ position: 'absolute', left: 760, top: 40, width: 380, height: 380, borderRadius: 999, border: '2px solid #C8354A', display: 'flex' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 229, height: 2, background: '#C8354A' }} />
        <div
          style={{
            position: 'absolute',
            left: 830,
            top: 110,
            width: 240,
            height: 240,
            borderRadius: 999,
            background: 'radial-gradient(circle, #7A1F2B 0%, #C8354A 30%, #E0775E 55%, #F3B27A 75%, rgba(251,227,198,0) 100%)',
            display: 'flex',
          }}
        />
        <div style={{ position: 'absolute', left: 64, top: 56, display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 640 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 28, height: 28, background: '#231816', color: '#E6DED7', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>01</div>
            <div style={{ fontSize: 22, letterSpacing: 1, textTransform: 'uppercase', color: '#6E605B' }}>{content.hero.ctaNote}</div>
          </div>
          <div style={{ fontSize: 54, lineHeight: 1, fontWeight: 600, letterSpacing: -2 }}>{content.hero.title}</div>
          <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
            {palette.map((c) => (
              <div key={c} style={{ width: 52, height: 22, background: c }} />
            ))}
          </div>
        </div>
        <div style={{ position: 'absolute', left: 40, bottom: -28, fontSize: 270, fontWeight: 600, letterSpacing: -16, lineHeight: 1 }}>TONELLE</div>
      </div>
    ),
    size,
  );
}
