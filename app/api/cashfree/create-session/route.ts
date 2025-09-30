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

    const cashfreeOrderData = {
      order_id: order.id,
      order_amount: order.total,
      order_currency: "INR",
      customer_details: {
        customer_id: order.userId,
        customer_email: order.user.email,
        customer_phone: order.user.phone || order.address.phone || "9999999999",
        customer_name: `${order.user.firstName || ""} ${
          order.user.lastName || ""
        }`.trim(),
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/confirmation?order_id={order_id}`,
        notify_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/cashfree/webhook`,
        payment_methods: "cc,dc,upi,nb,wallet,app,paylater",
      },
    };

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
  } catch (error) {
    console.error('Cashfree session creation error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create payment session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
