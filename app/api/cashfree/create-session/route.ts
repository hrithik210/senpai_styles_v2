import { NextRequest, NextResponse } from "next/server";

import cashfree from "@/lib/cashfree/cashfree";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

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
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

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

    console.log("Cashfree order data:", JSON.stringify(cashfreeOrderData, null, 2));

    const response = await cashfree.post("/pg/orders", cashfreeOrderData);

    await prisma.order.update({
      where: { id: orderId },
      data: {
        cashfreeOrderId: response.data.cf_order_id,
        paymentSessionId: response.data.payment_session_id
      }
    })

    console.log("cashfree response:", response)

    return NextResponse.json({
      success: true,
      payment_session_id: response.data.payment_session_id,
      order_id: response.data.order_id,
      cf_order_id: response.data.cf_order_id
    })
  } catch (error: any) {
    console.error('Cashfree session creation error:', error)
    
    // Log detailed error information
    if (error.response) {
      console.error('Cashfree API Error Response:', error.response.data)
      console.error('Status:', error.response.status)
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
