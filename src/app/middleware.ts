import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Get the session from Supabase
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session, redirect to signin
  if (!session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/signin';
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname); // optional for redirect back after login
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/resize', '/resize-signature', '/passport-photo', '/insert-doc'],
};
