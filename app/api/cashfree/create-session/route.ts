import { NextRequest, NextResponse } from "next/server";

import cashfree from "@/lib/cashfree/cashfree";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let orderId = 'unknown';
  
  try {
    console.log('🚀 [CASHFREE SESSION] Request received at:', new Date().toISOString());
    
    const requestBody = await request.json();
    orderId = requestBody.orderId;
    
    console.log('📋 [CASHFREE SESSION] Processing order:', orderId);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        address: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      console.error('❌ [CASHFREE SESSION] Order not found:', orderId);
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    console.log('✅ [CASHFREE SESSION] Order found:', {
      orderId: order.id,
      amount: order.total,
      paymentMethod: order.paymentMethod,
      userEmail: order.user.email
    });

    // Validate required order data
    if (!order.user.email) {
      return NextResponse.json(
        { success: false, error: "Customer email is required" },
        { status: 400 }
      );
    }

    if (order.total <= 0) {
      return NextResponse.json(
        { success: false, error: "Order amount must be greater than 0" },
        { status: 400 }
      );
    }

    // Ensure phone number is in correct format (Indian mobile number)
    let customerPhone = order.user.phone || order.address.phone || "9999999999";
    if (!customerPhone.match(/^[6-9]\d{9}$/)) {
      customerPhone = "9999999999"; // Default valid Indian mobile number
    }

    let customerName = `${order.user.firstName || "Customer"} ${order.user.lastName || ""}`.trim();
    if (customerName.length < 1) {
      customerName = "Customer";
    }

    const cashfreeOrderData = {
      order_id: order.id,
      order_amount: order.total,
      order_currency: "INR",
      customer_details: {
        customer_id: order.userId,
        customer_email: order.user.email,
        customer_phone: customerPhone,
        customer_name: customerName,
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?order_id=${order.id}`,
        notify_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/cashfree/webhook`,
      },
    };

    console.log("💳 [CASHFREE SESSION] Sending order data to Cashfree:", JSON.stringify(cashfreeOrderData, null, 2));
    console.log("🔗 [CASHFREE SESSION] Webhook URL:", cashfreeOrderData.order_meta.notify_url);

    const apiCallStart = Date.now();
    const response = await cashfree.post("/pg/orders", cashfreeOrderData);
    const apiCallDuration = Date.now() - apiCallStart;
    
    console.log("✅ [CASHFREE SESSION] API call successful in", apiCallDuration, "ms");
    console.log("📦 [CASHFREE SESSION] Response data:", JSON.stringify(response.data, null, 2));

    await prisma.order.update({
      where: { id: orderId },
      data: {
        cashfreeOrderId: response.data.cf_order_id,
        paymentSessionId: response.data.payment_session_id
      }
    })
    
    console.log("💾 [CASHFREE SESSION] Database updated with:", {
      orderId,
      cashfreeOrderId: response.data.cf_order_id,
      paymentSessionId: response.data.payment_session_id
    });

    console.log("🎯 [CASHFREE SESSION] Total processing time:", Date.now() - startTime, "ms");

    return NextResponse.json({
      success: true,
      payment_session_id: response.data.payment_session_id,
      order_id: response.data.order_id,
      cf_order_id: response.data.cf_order_id
    })
  } catch (error: any) {
    const errorTime = Date.now() - startTime;
    console.error('❌ [CASHFREE SESSION] Error occurred after', errorTime, 'ms for order:', orderId);
    console.error('❌ [CASHFREE SESSION] Error details:', error);
    
    // Log detailed error information
    if (error.response) {
      console.error('❌ [CASHFREE SESSION] API Error Response:', JSON.stringify(error.response.data, null, 2));
      console.error('❌ [CASHFREE SESSION] Status Code:', error.response.status);
      console.error('❌ [CASHFREE SESSION] Headers:', error.response.headers);
    } else if (error.request) {
      console.error('❌ [CASHFREE SESSION] Network Error - No response received');
      console.error('❌ [CASHFREE SESSION] Request details:', error.request);
    } else {
      console.error('❌ [CASHFREE SESSION] Setup Error:', error.message);
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create payment session',
        details: error instanceof Error ? error.message : 'Unknown error',
        cashfreeError: error.response?.data || null
      },
      { status: 500 }
    )
  }
}
