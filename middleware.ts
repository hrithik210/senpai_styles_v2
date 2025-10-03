import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Only protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const sessionToken = request.cookies.get('admin-token')?.value

    if (!sessionToken) {
      // Redirect to admin login if no session
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      // Call verification API to check token validity
      const verifyUrl = new URL('/api/admin/verify', request.url)
      const verifyResponse = await fetch(verifyUrl.toString(), {
        method: 'GET',
        headers: {
          'Cookie': `admin-token=${sessionToken}`
        }
      })

      if (!verifyResponse.ok) {
        throw new Error('Token verification failed')
      }

      const verifyData = await verifyResponse.json()
      
      if (!verifyData.success) {
        throw new Error('Invalid token')
      }

      // Token is valid, allow access
      return NextResponse.next()

    } catch (error) {
      console.error('Middleware authentication error:', error)
      // Invalid session token, redirect to login
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.set('admin-token', '', {
        httpOnly: true,
        secure: true, // Always use secure in production
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