import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

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

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      const response = NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
      return addCorsHeaders(response)
    }

    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!admin || !admin.isActive) {
      const response = NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
      return addCorsHeaders(response)
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password)
    
    if (!isPasswordValid) {
      const response = NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
      return addCorsHeaders(response)
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        id: admin.id, 
        email: admin.email,
        role: 'admin'
      }, 
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Create response with success
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name
      }
    })

    // Set the JWT token as an httpOnly cookie
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: true, // Always use secure in production
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return addCorsHeaders(response)

  } catch (error) {
    console.error('Admin login error:', error)
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