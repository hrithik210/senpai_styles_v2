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
    
    console.log('Cashfree webhook received:', {
      timestamp,
      signature: signature ? 'Present' : 'Missing',
      bodyLength: rawBody.length
    })
    
    // Verify webhook signature (recommended for production)
    if (signature && timestamp) {
      if (!verifyCashfreeSignature(timestamp, rawBody, signature)) {
        console.error('Invalid webhook signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
      console.log('Webhook signature verified successfully')
    } else {
      console.warn('Webhook signature verification skipped - missing signature or timestamp')
    }

    const body = JSON.parse(rawBody)
    const { type, data } = body
    
    console.log('Webhook data:', { type, data })

    if (type === 'PAYMENT_SUCCESS_WEBHOOK') {
      const { order } = data

      console.log(`Processing successful payment for order: ${order.order_id}`)

      // Verify payment with Cashfree
      const paymentResponse = await cashfree.get(
        `/pg/orders/${order.order_id}/payments`
      )

      const payment = paymentResponse.data[0]
      console.log('Cashfree payment details:', payment)

      if (payment && payment.payment_status === 'SUCCESS') {
        // Check if order exists before updating
        const existingOrder = await prisma.order.findUnique({
          where: { id: order.order_id }
        })
        
        if (!existingOrder) {
          console.error(`Order ${order.order_id} not found in database`)
          return NextResponse.json({ 
            success: false, 
            error: 'Order not found' 
          }, { status: 404 })
        }
        
        // Update order status
        const updatedOrder = await prisma.order.update({
          where: { id: order.order_id },
          data: {
            paymentStatus: 'PAID',
            status: 'CONFIRMED'
          }
        })
        
        console.log(`✅ Order ${order.order_id} marked as PAID and CONFIRMED`)
        
        return NextResponse.json({ 
          success: true, 
          message: 'Payment confirmed and order updated',
          orderId: order.order_id
        })
      } else {
        console.warn(`Payment verification failed for order ${order.order_id}:`, payment)
        return NextResponse.json({ 
          success: false, 
          error: 'Payment verification failed' 
        }, { status: 400 })
      }
      
    } else if (type === 'PAYMENT_FAILED_WEBHOOK') {
      const { order } = data
      
      console.log(`Processing failed payment for order: ${order.order_id}`)
      
      // Check if order exists before updating
      const existingOrder = await prisma.order.findUnique({
        where: { id: order.order_id }
      })
      
      if (!existingOrder) {
        console.error(`Order ${order.order_id} not found in database`)
        return NextResponse.json({ 
          success: false, 
          error: 'Order not found' 
        }, { status: 404 })
      }
      
      const updatedOrder = await prisma.order.update({
        where: { id: order.order_id },
        data: {
          paymentStatus: 'FAILED',
          status: 'CANCELLED'
        }
      })
      
      console.log(`❌ Order ${order.order_id} marked as FAILED and CANCELLED`)
      
      return NextResponse.json({ 
        success: true, 
        message: 'Payment failure processed and order updated',
        orderId: order.order_id
      })
      
    } else if (type === 'PAYMENT_USER_DROPPED_WEBHOOK') {
      const { order } = data
      
      console.log(`Processing user dropped payment for order: ${order.order_id}`)
      
      // User abandoned payment - keep as pending but log it
      console.log(`⚠️ User dropped payment for order ${order.order_id}`)
      
      return NextResponse.json({ 
        success: true, 
        message: 'Payment drop processed',
        orderId: order.order_id
      })
      
    } else {
      console.log(`Unhandled webhook type: ${type}`)
      return NextResponse.json({ 
        success: true, 
        message: 'Webhook received but not processed',
        type 
      })
    }

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { 
        error: 'Webhook processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}