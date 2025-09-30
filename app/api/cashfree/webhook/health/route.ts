import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get recent orders with their payment status
    const recentOrders = await prisma.order.findMany({
      where: {
        paymentMethod: 'ONLINE',
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      select: {
        id: true,
        paymentStatus: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        total: true,
        cashfreeOrderId: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    })

    // Calculate webhook health metrics
    const totalOnlineOrders = recentOrders.length
    const paidOrders = recentOrders.filter(o => o.paymentStatus === 'PAID').length
    const failedOrders = recentOrders.filter(o => o.paymentStatus === 'FAILED').length
    const pendingOrders = recentOrders.filter(o => o.paymentStatus === 'PENDING').length

    // Check for orders that might need attention (pending for more than 1 hour)
    const staleOrders = recentOrders.filter(order => {
      if (order.paymentStatus === 'PENDING') {
        const hoursSinceCreation = (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60)
        return hoursSinceCreation > 1
      }
      return false
    })

    return NextResponse.json({
      success: true,
      webhookHealth: {
        last24Hours: {
          totalOnlineOrders,
          paidOrders,
          failedOrders,
          pendingOrders,
          staleOrders: staleOrders.length
        },
        percentageCompleted: totalOnlineOrders > 0 ? Math.round(((paidOrders + failedOrders) / totalOnlineOrders) * 100) : 0,
        webhookEndpoint: '/api/cashfree/webhook',
        lastChecked: new Date().toISOString()
      },
      staleOrderDetails: staleOrders.map(order => ({
        id: order.id,
        cashfreeOrderId: order.cashfreeOrderId,
        total: order.total,
        createdAt: order.createdAt,
        hoursPending: Math.round((Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60))
      }))
    })

  } catch (error) {
    console.error('Error checking webhook health:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check webhook health',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}