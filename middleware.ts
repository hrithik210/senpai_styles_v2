import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Only protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const sessionToken = request.cookies.get('admin-session')?.value

    if (!sessionToken) {
      // Redirect to admin login if no session
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      // Verify session token (simplified validation)
      const decoded = Buffer.from(sessionToken, 'base64').toString('utf-8')
      const [adminId, timestamp] = decoded.split(':')
      
      // Check if session is expired (7 days)
      const sessionAge = Date.now() - parseInt(timestamp)
      const maxAge = 60 * 60 * 24 * 7 * 1000 // 7 days in milliseconds
      
      if (sessionAge > maxAge || !adminId) {
        // Clear expired session and redirect to login
        const response = NextResponse.redirect(new URL('/admin/login', request.url))
        response.cookies.set('admin-session', '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 0
        })
        return response
      }

      // Session is valid, allow access
      return NextResponse.next()

    } catch (error) {
      // Invalid session token, redirect to login
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.set('admin-session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0
      })
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*'
  ]
}