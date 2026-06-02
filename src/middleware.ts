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
  const referer = req.headers.get('referer') ?? '';
  return (
    req.headers.get('Sec-Fetch-Dest') === 'iframe' ||
    !!req.nextUrl.searchParams.get('live_preview') ||
    referer.includes('live_preview=')
  );
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secFetchDest = req.headers.get('Sec-Fetch-Dest');
  const livePreviewParam = req.nextUrl.searchParams.get('live_preview');
  const referer = req.headers.get('referer') ?? '';
  const inIframe = isIframeRequest(req);

  // Auth guard: redirect unauthenticated users to login (skip when embedded in iframe)
  if (inIframe) {
    console.log('[middleware] in iframe — skipping auth check for path:', pathname);
  }
  else if (!pathname.startsWith('/api') && !isPublicPath(pathname)) {
    console.log('[middleware] not in iframe — checking auth for path:', pathname);
    const authCookie = req.cookies.get('icsc_auth');
    if (!authCookie?.value) {
      const locale = getLocaleFromPath(pathname);
      console.log('[middleware] redirecting to login — secFetchDest:', secFetchDest, 'live_preview:', livePreviewParam, 'referer:', referer);
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
      return response;
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-personalize-variants', variantParam || '');
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)',],
};
