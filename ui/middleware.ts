import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // Redirect /discover to home page
  if (request.nextUrl.pathname.startsWith('/discover')) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}
 
export const config = {
  matcher: '/discover/:path*',
}
