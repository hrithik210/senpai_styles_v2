import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

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

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      const response = NextResponse.json(
        { success: false, error: 'No token found' },
        { status: 401 }
      )
      return addCorsHeaders(response)
    }

    // Verify JWT token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
      
      // Verify admin exists and is active
      const admin = await prisma.admin.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          name: true,
          isActive: true
        }
      })

      if (!admin || !admin.isActive) {
        const response = NextResponse.json(
          { success: false, error: 'Invalid token' },
          { status: 401 }
        )
        return addCorsHeaders(response)
      }

      const response = NextResponse.json({
        success: true,
        admin
      })
      return addCorsHeaders(response)

    } catch (decodeError) {
      const response = NextResponse.json(
        { success: false, error: 'Invalid session token' },
        { status: 401 }
      )
      return addCorsHeaders(response)
    }

  } catch (error) {
    console.error('Session verification error:', error)
    const response = NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
    return addCorsHeaders(response)
  }
}