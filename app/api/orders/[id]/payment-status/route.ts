import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('admin-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!)
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { id: orderId } = await params
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Invalid order ID' },
        { status: 400 }
      )
    }
    
    const { paymentStatus } = await request.json()

    // Validate payment status
    const validPaymentStatuses = ['PENDING', 'PAID', 'FAILED', 'REFUNDED']
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment status' },
        { status: 400 }
      )
    }

    // First, get the order to check if it's COD
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      select: { paymentMethod: true, paymentStatus: true }
    })

    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // Only allow payment status updates for COD orders
    if (existingOrder.paymentMethod !== 'COD') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Payment status can only be manually updated for COD orders. Online payments are managed automatically via webhooks.' 
        },
        { status: 400 }
      )
    }

    // Update payment status and potentially order status
    let newOrderStatus = undefined
    if (paymentStatus === 'PAID' && existingOrder.paymentStatus !== 'PAID') {
      newOrderStatus = 'CONFIRMED' // Auto-confirm COD orders when marked as paid
    }

    const updateData: any = { paymentStatus }
    if (newOrderStatus) {
      updateData.status = newOrderStatus
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        orderItems: {
          include: {
            product: true
          }
        },
        user: true,
        address: true
      }
    })

    const message = newOrderStatus 
      ? `Payment status updated to ${paymentStatus} and order confirmed`
      : `Payment status updated to ${paymentStatus}`

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message
    })

  } catch (error) {
    console.error('Error updating payment status:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update payment status' 
      },
      { status: 500 }
    )
  }
}