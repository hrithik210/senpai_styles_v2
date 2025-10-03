import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true })
  
  // Clear the admin session cookie (update to correct cookie name)
  response.cookies.set('admin-token', '', {
    httpOnly: true,
    secure: true, // Always use secure in production
    sameSite: 'strict',
    maxAge: 0
  })
  
  return response
}