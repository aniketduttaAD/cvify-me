import { NextResponse } from 'next/server';

const protectedRoutes = ['/account', '/','my-resumes']; // Add more protected routes if needed

export default async function middleware(req) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const authToken = req.cookies.get('authToken');

  if (isProtectedRoute && !authToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
