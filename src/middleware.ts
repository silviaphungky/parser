import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest): NextResponse {
  const token = request.cookies.get('ACCESS_TOKEN')
  const xForwardedHost = request.headers.get('x-forwarded-host')
  const origin = request.headers.get('origin')
  console.log({ xForwardedHost, origin })

  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', '/login') // Add redirect path
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/daftar-monitor/:path*',
    '/overview',
    '/pemberitahuan',
    '/user-management',
  ],
}
