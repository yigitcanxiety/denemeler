'use client';

import clsx from 'clsx';
import { X } from 'lucide-react';
import { useEffect, useId, useRef, type ReactNode } from 'react';

type ModalProps = {
  open: boolean;
  /** Called on Esc, backdrop click or the close button. */
  onClose: () => void;
  title: string;
  closeLabel: string;
  children: ReactNode;
  /** Hide the title visually (still announced). */
  hideTitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** `ink` renders a dark BRIK card. */
  tone?: 'paper' | 'ink';
  className?: string;
};

const SIZES = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl' } as const;

/** Accessible modal built on the native <dialog> (focus trap, Esc, inert background). */
export function Modal({ open, onClose, title, closeLabel, children, hideTitle, size = 'md', tone = 'paper', className }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={clsx(
        'tonelle-dialog m-auto w-[calc(100%-2rem)] rounded-card p-0 shadow-lift',
        tone === 'paper' ? 'bg-paper-raised text-ink' : 'bg-ink text-ink-inverse',
        SIZES[size],
        className,
      )}
    >
      <div className="relative p-6 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className={clsx(
            'press absolute top-3 right-3 grid size-11 place-items-center rounded-full',
            tone === 'paper' ? 'text-ink-muted hover:bg-ink/5 hover:text-ink' : 'text-ink-inverse-muted hover:bg-white/10 hover:text-ink-inverse',
          )}
        >
          <X aria-hidden className="size-5" />
        </button>
        <h2 id={titleId} className={clsx('pr-10 text-[1.7rem]', hideTitle && 'sr-only')}>
          {title}
        </h2>
        <div className={clsx(!hideTitle && 'mt-3')}>{children}</div>
      </div>
    </dialog>
  );
}
