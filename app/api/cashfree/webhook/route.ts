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
  const webhookStartTime = Date.now();
  const requestId = `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    console.log('🎯 [WEBHOOK]', requestId, 'Received at:', new Date().toISOString());
    
    const timestamp = request.headers.get('x-webhook-timestamp') || ''
    const signature = request.headers.get('x-webhook-signature') || ''
    const rawBody = await request.text()
    
    console.log('📋 [WEBHOOK]', requestId, 'Headers and body:', {
      timestamp,
      signature: signature ? 'Present' : 'Missing',
      bodyLength: rawBody.length,
      userAgent: request.headers.get('user-agent'),
      body: rawBody
    });
    
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
    
    console.log('🔍 [WEBHOOK]', requestId, 'Parsed webhook data:', { 
      type, 
      orderId: data?.order?.order_id || 'unknown',
      eventData: JSON.stringify(data, null, 2)
    });

    if (type === 'PAYMENT_SUCCESS_WEBHOOK') {
      const { order } = data
      const orderId = order.order_id;

      console.log(`💰 [WEBHOOK SUCCESS]`, requestId, `Processing successful payment for order: ${orderId}`);

      // Verify payment with Cashfree
      console.log(`🔍 [WEBHOOK SUCCESS]`, requestId, `Verifying payment status with Cashfree API...`);
      const paymentResponse = await cashfree.get(
        `/pg/orders/${orderId}/payments`
      )

      const payment = paymentResponse.data[0]
      console.log(`📋 [WEBHOOK SUCCESS]`, requestId, `Cashfree payment verification result:`, {
        paymentId: payment?.cf_payment_id,
        status: payment?.payment_status,
        amount: payment?.payment_amount,
        fullDetails: JSON.stringify(payment, null, 2)
      });

      if (payment && payment.payment_status === 'SUCCESS') {
        console.log(`✅ [WEBHOOK SUCCESS]`, requestId, `Payment verified as SUCCESS, updating database...`);
        
        // Check if order exists before updating
        const existingOrder = await prisma.order.findUnique({
          where: { id: orderId },
          select: { id: true, paymentStatus: true, status: true }
        })
        
        if (!existingOrder) {
          console.error(`❌ [WEBHOOK SUCCESS]`, requestId, `Order ${orderId} not found in database`);
          return NextResponse.json({ 
            success: false, 
            error: 'Order not found' 
          }, { status: 404 })
        }
        
        console.log(`📄 [WEBHOOK SUCCESS]`, requestId, `Current order state:`, existingOrder);
        
        // Update order status
        console.log(`💾 [WEBHOOK SUCCESS]`, requestId, `Updating order ${orderId} to PAID/CONFIRMED...`);
        const updatedOrder = await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: 'PAID',
            status: 'CONFIRMED'
          }
        })
        
        console.log(`🎉 [WEBHOOK SUCCESS]`, requestId, `Order ${orderId} successfully updated to PAID and CONFIRMED!`);
        const totalTime = Date.now() - webhookStartTime;
        console.log(`⏱️ [WEBHOOK SUCCESS]`, requestId, `Total processing time: ${totalTime}ms`);
        
        return NextResponse.json({ 
          success: true, 
          message: 'Payment confirmed and order updated',
          orderId: orderId,
          processingTime: totalTime
        })
      } else {
        console.warn(`⚠️ [WEBHOOK SUCCESS]`, requestId, `Payment verification FAILED for order ${orderId}. Expected: SUCCESS, Got: ${payment?.payment_status}`);
        console.warn(`⚠️ [WEBHOOK SUCCESS]`, requestId, `Full payment data:`, JSON.stringify(payment, null, 2));
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
    const errorTime = Date.now() - webhookStartTime;
    console.error('❌ [WEBHOOK ERROR]', requestId, `Fatal error after ${errorTime}ms:`, error);
    console.error('❌ [WEBHOOK ERROR]', requestId, 'Stack trace:', error instanceof Error ? error.stack : 'No stack available');
    
    return NextResponse.json(
      { 
        error: 'Webhook processing failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        requestId,
        processingTime: errorTime
      },
      { status: 500 }
    )
  }
}