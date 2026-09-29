import clsx from 'clsx';
import type { ReactNode } from 'react';

/**
 * Dark glass sphere (radial gradients + specular highlight + orbit ring) that holds a
 * heat-map object. Pure CSS; the content inside recolours per scroll step.
 */
export function GlassSphere({ children, className, badge }: { children: ReactNode; className?: string; badge?: ReactNode }) {
  return (
    <div className={clsx('relative aspect-square', className)}>
      {/* body */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full border border-white/20"
        style={{
          background:
            'radial-gradient(circle at 50% 38%, rgb(255 255 255 / 0.07), rgb(255 255 255 / 0.015) 58%, rgb(255 255 255 / 0.07) 100%), radial-gradient(circle at 50% 110%, rgb(242 201 203 / 0.10), transparent 60%)',
          boxShadow: 'inset 0 -30px 60px rgb(0 0 0 / 0.45), inset 0 20px 50px rgb(255 255 255 / 0.04)',
        }}
      />
      {/* back half of the orbit ring */}
      <div aria-hidden className="absolute top-[52%] left-[-3%] h-[26%] w-[106%] rounded-[50%] border-[5px] border-[#e9e1db]/80" />
      <div aria-hidden className="absolute top-[57%] left-[18%] h-[16%] w-[64%] rounded-[50%] border border-white/15 bg-black/30" />
      {/* object */}
      <div className="absolute inset-[16%] bottom-[22%]">{children}</div>
      {/* specular highlight */}
      <div aria-hidden className="absolute top-[7%] left-[13%] h-[27%] w-[36%] -rotate-[28deg] rounded-[50%] border border-white/25 bg-white/[0.05]" />
      <div aria-hidden className="absolute top-[30%] left-[4.5%] h-[7%] w-[5%] -rotate-[20deg] rounded-[50%] border border-white/25" />
      {badge && (
        <div className="absolute bottom-[9%] left-1/2 grid size-[22%] -translate-x-1/2 place-items-center rounded-full border border-white/25 bg-night/70">
          {badge}
        </div>
      )}
    </div>
  );
}
