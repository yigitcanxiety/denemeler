import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
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
  const portrait = await readFile(join(process.cwd(), 'public/images/portrait-hero.jpg'))
    .then((buf) => `data:image/jpeg;base64,${buf.toString('base64')}`)
    .catch(() => null);

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: 'linear-gradient(135deg, #FFFFFF 0%, #F6F4FE 45%, #E9E5FB 100%)', color: '#17141F' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 26, padding: '0 64px', width: 700 }}>
          <div style={{ fontSize: 40, letterSpacing: -1 }}>Tonelle</div>
          <div
            style={{
              display: 'flex',
              alignSelf: 'flex-start',
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              color: '#5A3FE0',
              background: '#EDE8FF',
              borderRadius: 999,
              padding: '8px 18px',
            }}
          >
            ✦ {content.hero.eyebrow}
          </div>
          <div style={{ fontSize: 56, lineHeight: 1.05, letterSpacing: -1.5 }}>{content.hero.title}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {palette.map((c) => (
              <div key={c} style={{ width: 54, height: 30, borderRadius: 10, background: c }} />
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flex: 1, padding: '40px 48px 40px 0' }}>
          <div style={{ display: 'flex', flex: 1, borderRadius: 36, overflow: 'hidden', background: '#EFD8E6', position: 'relative' }}>
            {portrait && (
              <img src={portrait} alt="" width={412} height={550} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
