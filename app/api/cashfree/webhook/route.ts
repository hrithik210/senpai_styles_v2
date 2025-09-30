// app/api/cashfree/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

import crypto from 'crypto'
import cashfree from '@/lib/cashfree/cashfree'

function verifyCashfreeSignature(
  timestamp: string,
  rawBody: string,
  signature: string
): boolean {
  const secret = process.env.CASHFREE_SECRET_KEY!
  const signatureData = timestamp + rawBody
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(signatureData)
    .digest('base64')
  
  return generatedSignature === signature
}

export async function POST(request: NextRequest) {
  try {
    const timestamp = request.headers.get('x-webhook-timestamp') || ''
    const signature = request.headers.get('x-webhook-signature') || ''
    const rawBody = await request.text()
    
    // Verify webhook signature (recommended for production)
    // if (!verifyCashfreeSignature(timestamp, rawBody, signature)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    // }

    const body = JSON.parse(rawBody)
    const { type, data } = body

    if (type === 'PAYMENT_SUCCESS_WEBHOOK') {
      const { order } = data

      // Verify payment with Cashfree
      const paymentResponse = await cashfree.get(
        `/pg/orders/${order.order_id}/payments`
      )

      const payment = paymentResponse.data[0]

      if (payment.payment_status === 'SUCCESS') {
        // Update order status
        await prisma.order.update({
          where: { id: order.order_id },
          data: {
            paymentStatus: 'PAID',
            status: 'CONFIRMED'
          }
        })
      }
    } else if (type === 'PAYMENT_FAILED_WEBHOOK') {
      const { order } = data
      
      await prisma.order.update({
        where: { id: order.order_id },
        data: {
          paymentStatus: 'FAILED',
          status: 'CANCELLED'
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}