import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token found' },
        { status: 401 }
      )
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
        return NextResponse.json(
          { success: false, error: 'Invalid token' },
          { status: 401 }
        )
      }

      return NextResponse.json({
        success: true,
        admin
      })

    } catch (decodeError) {
      return NextResponse.json(
        { success: false, error: 'Invalid session token' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('Session verification error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}