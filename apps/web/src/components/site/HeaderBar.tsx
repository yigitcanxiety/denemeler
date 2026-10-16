'use client';

import type { CoreLocale } from '@tonelle/shared';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { SiteContent } from '@/content';
import { AppStoreCta } from './AppStoreCta';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Logo } from './Logo';

export interface HeaderLabels {
  home: string;
  menu: string;
  closeMenu: string;
  menuTitle: string;
  primaryNavLabel: string;
  legalTitle: string;
}

type NavLink = { href: string; label: string };

/**
 * Aura header: serif wordmark, centred nav (desktop), language switch and the App Store CTA. On small screens a round violet button opens a full-screen
 * menu (native <dialog>: focus trap, Esc).
 */
export function HeaderBar({
  locale,
  labels,
  links,
  legal,
  stores,
}: {
  locale: CoreLocale;
  labels: HeaderLabels;
  links: NavLink[];
  legal: NavLink[];
  stores: SiteContent['stores'];
}) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

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

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line/70 bg-paper/85 backdrop-blur-md">
        <div className="shell flex h-16 items-center justify-between gap-3 lg:h-[72px]">
          <Link href={`/${locale}`} aria-label={labels.home} className="press rounded-md">
            <Logo />
          </Link>
          <nav aria-label={labels.primaryNavLabel} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex h-10 items-center rounded-pill px-3.5 text-[14.5px] font-medium text-ink hover:bg-mist"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher locale={locale} compact className="hidden sm:inline-flex" />
            <div className="hidden sm:block">
              <AppStoreCta labels={stores} size="sm" />
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-label={labels.menu}
              className="press grid size-11 place-items-center rounded-full bg-violet text-white shadow-violet lg:hidden"
            >
              <Menu aria-hidden className="size-5" strokeWidth={1.75} />
            </button>
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
        <div className="flex min-h-full flex-col">
          <div className="shell flex h-16 items-center justify-between gap-2">
            <Link href={`/${locale}`} aria-label={labels.home} onClick={close} className="rounded-md">
              <Logo />
            </Link>
            <button
              type="button"
              onClick={close}
              aria-label={labels.closeMenu}
              className="press grid size-11 place-items-center rounded-full bg-mist text-ink hover:bg-violet-soft"
            >
              <X aria-hidden className="size-5" strokeWidth={1.75} />
            </button>
          </div>

          <div className="shell mt-6 flex flex-1 flex-col gap-8 pb-8">
            <nav aria-label={labels.primaryNavLabel}>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={close}
                      className="group flex min-h-16 items-center justify-between rounded-card bg-mist px-5 py-3"
                    >
                      <span className="serif text-[1.6rem] leading-none text-ink">{link.label}</span>
                      <ArrowUpRight aria-hidden className="size-5 text-violet transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <LanguageSwitcher locale={locale} onNavigate={close} className="self-start" />
            <div>
              <p className="caps text-muted">{labels.legalTitle}</p>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {legal.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} onClick={close} className="inline-flex min-h-10 items-center text-[14px] text-ink hover:text-violet hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto">
              <AppStoreCta labels={stores} fullWidth />
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
