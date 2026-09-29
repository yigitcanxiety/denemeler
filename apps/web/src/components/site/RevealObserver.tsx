'use client';

import { useEffect } from 'react';

const SELECTOR = '[data-reveal],[data-draw],[data-wm],[data-grow],[data-watch]';

declare global {
  interface Window {
    __tIO?: boolean;
  }
}

/**
 * One IntersectionObserver for the whole site. Marks every reveal target with
 * `data-inview` the first time it enters the viewport; CSS (globals.css) does the rest.
 * New targets (client navigation, flow steps) are picked up by a MutationObserver.
 */
export function RevealObserver() {
  useEffect(() => {
    window.__tIO = true;
    document.documentElement.classList.remove('no-io');
    if (typeof IntersectionObserver === 'undefined') {
      document.documentElement.classList.add('no-io');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-inview', '');
          io.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
    );
    const scan = () => {
      document.querySelectorAll(`:is(${SELECTOR}):not([data-inview]):not([data-observed])`).forEach((el) => {
        el.setAttribute('data-observed', '');
        io.observe(el);
      });
    };
    scan();
    let frame = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(frame);
      mo.disconnect();
      io.disconnect();
    };
  }, []);
  return null;
}
