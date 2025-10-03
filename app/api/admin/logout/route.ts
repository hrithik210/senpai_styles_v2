import { NextResponse } from 'next/server'

// Add CORS headers to response
function addCorsHeaders(response: NextResponse) {
  const allowedOrigin = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') || 'https://senpaistyles.in'
  response.headers.set('Access-Control-Allow-Origin', allowedOrigin)
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 200 }))
}

export async function POST() {
  const response = NextResponse.json({ success: true })
  
  // Clear the admin session cookie (update to correct cookie name)
  response.cookies.set('admin-token', '', {
    httpOnly: true,
    secure: true, // Always use secure in production
    sameSite: 'strict',
    maxAge: 0
  })
  
  return addCorsHeaders(response)
}