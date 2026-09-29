import { NextResponse, type NextRequest } from 'next/server';
import { LOCALE_COOKIE, localeFromPathname, pickLocale } from './lib/locale';

/** Redirects un-prefixed page requests (e.g. `/`, `/analyze`) to `/{locale}/…`. */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (localeFromPathname(pathname)) return NextResponse.next();

  const locale = pickLocale(request.cookies.get(LOCALE_COOKIE)?.value, request.headers.get('accept-language'));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  url.search = search;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip API routes, Next internals and files with an extension (favicon.ico, images…).
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
