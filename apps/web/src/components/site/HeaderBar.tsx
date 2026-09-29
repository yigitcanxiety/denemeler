'use client';

import type { Locale } from '@tonelle/shared';
import clsx from 'clsx';
import { ArrowUpRight, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { NumberTag } from '@/components/lab/primitives';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Logo } from './Logo';

export interface HeaderLabels {
  home: string;
  menu: string;
  closeMenu: string;
  menuTitle: string;
  startCta: string;
  primaryNavLabel: string;
  legalTitle: string;
}

type NavLink = { href: string; label: string };

function MenuGlyph() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-4">
      <circle cx="4.5" cy="4.5" r="2.6" fill="currentColor" />
      <circle cx="11.5" cy="4.5" r="2.6" fill="currentColor" opacity="0.45" />
      <circle cx="4.5" cy="11.5" r="2.6" fill="currentColor" />
      <circle cx="11.5" cy="11.5" r="2.6" fill="currentColor" />
    </svg>
  );
}

/**
 * Floating header: logo in a pale box on the left; `Menu` + dark primary pill on the right.
 * Turns dark over `[data-header-theme="night"]` sections. `Menu` opens a full-screen sheet
 * (native <dialog>: focus trap, Esc) with the navigation and the language switch.
 */
export function HeaderBar({
  locale,
  labels,
  links,
  legal,
  ctaHref,
}: {
  locale: Locale;
  labels: HeaderLabels;
  links: NavLink[];
  legal: NavLink[];
  ctaHref: string;
}) {
  const [open, setOpen] = useState(false);
  const [night, setNight] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Header theme follows the section underneath it.
  useEffect(() => {
    const targets = document.querySelectorAll('[data-header-theme="night"]');
    if (!targets.length || typeof IntersectionObserver === 'undefined') return;
    const active = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) active.add(e.target);
          else active.delete(e.target);
        }
        setNight(active.size > 0);
      },
      { rootMargin: '0px 0px -94% 0px' },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  const close = () => setOpen(false);
  const box = night
    ? 'bg-[#211918]/85 text-ink-inverse ring-1 ring-white/10'
    : 'bg-paper-raised/85 text-ink ring-1 ring-line';

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <div className="shell flex items-start justify-between gap-2 pt-3 sm:pt-4">
          <Link
            href={`/${locale}`}
            aria-label={labels.home}
            className={clsx(
              'press pointer-events-auto flex h-[52px] items-center rounded-[14px] px-4 backdrop-blur-md transition-colors',
              box,
            )}
          >
            <Logo inverse={night} />
          </Link>
          <div className={clsx('pointer-events-auto flex items-center gap-1 rounded-[14px] p-1 backdrop-blur-md transition-colors', box)}>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={open}
              className="press flex h-11 min-w-11 items-center justify-center gap-2 rounded-[10px] px-3 text-[15px] font-medium hover:bg-current/5"
            >
              <MenuGlyph />
              <span className="sr-only sm:not-sr-only">{labels.menu}</span>
            </button>
            <Link
              href={ctaHref}
              className={clsx(
                'press flex h-11 items-center rounded-[10px] px-4 text-[15px] font-medium whitespace-nowrap',
                night ? 'bg-ink-inverse text-[#231816] hover:bg-white' : 'bg-ink text-ink-inverse hover:bg-ink-soft',
              )}
            >
              {labels.startCta}
            </Link>
          </div>
        </div>
      </header>

      <dialog
        ref={dialogRef}
        aria-label={labels.menuTitle}
        className="menu-sheet"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
      >
        <div className="relative flex min-h-full flex-col">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="cgrid">
              {Array.from({ length: 8 }, (_, i) => (
                <i key={i} />
              ))}
            </div>
          </div>
          <div className="shell relative flex items-start justify-between gap-2 pt-3 sm:pt-4">
            <Link
              href={`/${locale}`}
              aria-label={labels.home}
              onClick={close}
              className="press flex h-[52px] items-center rounded-[14px] bg-paper-raised px-4 ring-1 ring-line"
            >
              <Logo />
            </Link>
            <button
              type="button"
              onClick={close}
              className="press flex h-[52px] items-center gap-2 rounded-[14px] bg-ink px-4 text-[15px] font-medium text-ink-inverse"
            >
              <X aria-hidden className="size-4" />
              {labels.closeMenu}
            </button>
          </div>

          <div className="shell relative mt-10 grid flex-1 gap-10 pb-10 lg:mt-20 lg:grid-cols-[1.4fr_1fr]">
            <nav aria-label={labels.primaryNavLabel}>
              <ol className="border-t border-line-strong">
                {links.map((link, i) => (
                  <li key={link.href} className="menu-item border-b border-line-strong" style={{ '--i': i } as CSSProperties}>
                    <Link
                      href={link.href}
                      onClick={close}
                      className="group flex min-h-16 items-center gap-4 py-3 text-[clamp(2rem,9vw,4.5rem)] leading-none font-semibold tracking-[-0.05em] text-ink"
                    >
                      <NumberTag n={i + 1} className="group-hover:bg-accent" />
                      <span className="flex-1">{link.label}</span>
                      <ArrowUpRight aria-hidden className="size-6 text-ink-subtle transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>
            <div className="menu-item flex flex-col gap-8" style={{ '--i': links.length } as CSSProperties}>
              <LanguageSwitcher locale={locale} compact={false} onNavigate={close} className="self-start" />
              <div>
                <p className="mono-caps text-ink-muted">{labels.legalTitle}</p>
                <ul className="mt-3 grid gap-1">
                  {legal.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} onClick={close} className="mono inline-flex min-h-9 items-center text-ink hover:text-accent hover:underline">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={ctaHref}
                onClick={close}
                className="press mt-auto flex h-14 items-center justify-center rounded-pill bg-ink px-6 text-base font-medium text-ink-inverse hover:bg-ink-soft"
              >
                {labels.startCta}
              </Link>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
