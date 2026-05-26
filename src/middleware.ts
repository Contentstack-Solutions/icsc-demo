import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { initializePersonalize } from './lib/cspersonalize';

const LOCALES = ['en', 'es', 'fr', 'de'];
const PUBLIC_PATHS = ['/login', '/register'];

const intlMiddleware = createMiddleware({
  locales: LOCALES,
  defaultLocale: 'en',
});

function isPublicPath(pathname: string): boolean {
  for (const locale of LOCALES) {
    for (const path of PUBLIC_PATHS) {
      if (pathname === `/${locale}${path}` || pathname.startsWith(`/${locale}${path}/`)) {
        return true;
      }
    }
  }
  return false;
}

function getLocaleFromPath(pathname: string): string {
  const match = pathname.match(/^\/(en|es|fr|de)(\/|$)/);
  return match ? match[1] : 'en';
}

function isIframeRequest(req: NextRequest): boolean {
  return (
    req.headers.get('Sec-Fetch-Dest') === 'iframe' ||
    !!req.cookies.get('icsc_embed')?.value
  );
}

function markEmbedCookie(req: NextRequest, response: NextResponse): NextResponse {
  // On the initial iframe load, set a session cookie so all subsequent navigations
  // within the iframe also skip the auth guard.
  if (req.headers.get('Sec-Fetch-Dest') === 'iframe' && !req.cookies.get('icsc_embed')?.value) {
    response.cookies.set('icsc_embed', '1', { path: '/', sameSite: 'none', secure: true });
  }
  return response;
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const inIframe = isIframeRequest(req);

  // Auth guard: redirect unauthenticated users to login (skip when embedded in iframe)
  if (!inIframe && !pathname.startsWith('/api') && !isPublicPath(pathname)) {
    const authCookie = req.cookies.get('icsc_auth');
    if (!authCookie?.value) {
      const locale = getLocaleFromPath(pathname);
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }
  }

  if (!process.env.HOSTING || process.env.HOSTING !== 'launch') {
    const projectUid = process.env.CONTENTSTACK_PERSONALIZATION as string;
    const { variantParam, personalize } = await initializePersonalize(
      req,
      process.env.CONTENTSTACK_PERSONALIZE_EDGE_API_URL,
      projectUid
    );

    if (!pathname.startsWith('/api')) {
      const parsedUrl = new URL(req.url);
      const newReq = new NextRequest(parsedUrl.toString(), req);
      newReq.headers.set('x-personalize-variants', variantParam || '');
      const response = intlMiddleware(newReq);
      personalize?.addStateToResponse(response);
      return markEmbedCookie(req, response);
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-personalize-variants', variantParam || '');
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    personalize?.addStateToResponse(response);
    return markEmbedCookie(req, response);
  }

  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  return markEmbedCookie(req, intlMiddleware(req));
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)',],
};
