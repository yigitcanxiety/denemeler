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
  className?: string;
};

const SIZES = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl' } as const;

/** Accessible modal built on the native <dialog> (focus trap, Esc, inert background). */
export function Modal({ open, onClose, title, closeLabel, children, hideTitle, size = 'md', className }: ModalProps) {
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
        'tonelle-dialog m-auto w-[calc(100%-2rem)] rounded-card bg-surface-raised p-0 text-ink shadow-lift',
        SIZES[size],
        className,
      )}
    >
      <div className="relative p-6 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="absolute top-3 right-3 grid size-10 place-items-center rounded-full text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink"
        >
          <X aria-hidden className="size-5" />
        </button>
        <h2 id={titleId} className={clsx('pr-8 font-display text-2xl text-ink', hideTitle && 'sr-only')}>
          {title}
        </h2>
        <div className={clsx(!hideTitle && 'mt-3')}>{children}</div>
      </div>
    </dialog>
  );
}
