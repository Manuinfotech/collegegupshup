import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database, UserRole } from '@/types/database';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  // Protected routes — each role has its own panel
  const protectedPaths = ['/dashboard', '/admin', '/manager', '/student'];
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !userId) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Prevent authenticated users from visiting auth pages
  const authPaths = ['/login', '/register', '/forgot-password'];
  const isAuthPath = authPaths.some((path) => request.nextUrl.pathname.startsWith(path));
  
  let role: UserRole | null = null;
  if (userId && (isProtected || isAuthPath)) {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .maybeSingle();
    role = userData?.role ?? null;
  }

  // Redirect authenticated users away from auth pages to their respective panels
  if (userId && isAuthPath) {
    const redirectUrl = getRoleDashboard(role);
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Role-based access control — each role can only access their panel
  if (userId && isProtected && role) {
    const pathname = request.nextUrl.pathname;

    // Super admin can access /admin only
    // College admin can access /dashboard only
    // Student can access /student only
    // Manager can access /manager only

    if (pathname.startsWith('/admin') && role !== 'super_admin') {
      return NextResponse.redirect(new URL(getRoleDashboard(role), request.url));
    }

    if (pathname.startsWith('/dashboard') && role !== 'college_admin') {
      return NextResponse.redirect(new URL(getRoleDashboard(role), request.url));
    }

    if (pathname.startsWith('/student') && role !== 'student') {
      return NextResponse.redirect(new URL(getRoleDashboard(role), request.url));
    }

    if (pathname.startsWith('/manager') && !['super_admin', 'manager'].includes(role)) {
      return NextResponse.redirect(new URL(getRoleDashboard(role), request.url));
    }
  }

  return supabaseResponse;
}

function getRoleDashboard(role: UserRole | null): string {
  switch (role) {
    case 'super_admin':
      return '/admin';
    case 'college_admin':
      return '/dashboard';
    case 'student':
      return '/student';
    case 'manager':
      return '/manager';
    default:
      return '/login';
  }
}
