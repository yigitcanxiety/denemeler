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

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'linear-gradient(135deg, #fdf9f6 0%, #fae6e6 55%, #e8cfbf 100%)',
          color: '#2b2124',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              background: 'linear-gradient(135deg, #e8cfbf, #c96a71, #a7775e)',
            }}
          />
          <div style={{ fontSize: 48, fontWeight: 600, letterSpacing: -1 }}>Tonelle</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 68, lineHeight: 1.08, fontWeight: 600, letterSpacing: -1.5, maxWidth: 900 }}>
            {content.hero.title}
          </div>
          <div style={{ fontSize: 30, color: '#6b5a5e' }}>{content.hero.ctaNote}</div>
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          {palette.map((c) => (
            <div key={c} style={{ width: 64, height: 64, borderRadius: 999, background: c, border: '4px solid #ffffff' }} />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
