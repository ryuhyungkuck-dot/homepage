import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { supabaseKey, supabaseUrl } from './lib/supabase/env';

export async function middleware(req: NextRequest) {
  const url = supabaseUrl();
  const key = supabaseKey();
  let res = NextResponse.next({ request: req });
  if (!url || !key) return res;

  const sb = createServerClient(url, key, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(list) {
        list.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: req });
        list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });

  const { data } = await sb.auth.getUser();
  const isLogin = req.nextUrl.pathname.startsWith('/admin/login');
  if (!data.user && !isLogin) {
    const to = req.nextUrl.clone();
    to.pathname = '/admin/login';
    return NextResponse.redirect(to);
  }
  return res;
}

export const config = { matcher: ['/admin/:path*'] };
