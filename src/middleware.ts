import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest): NextResponse {
  const token = request.cookies.get('ACCESS_TOKEN')

  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', '/login') // Add redirect path
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/penyelenggara-negara/:path*',
    '/overview',
    '/pemberitahuan',
    '/user-management',
  ],
}
