import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      firstName,
      lastName,
      address,
      apartment,
      city,
      state,
      zipCode,
      country = 'India',
      phone,
      items,
      subtotal,
      shipping = 0,
      tax = 0,
      total,
      paymentMethod = 'online'
    } = body

    // Validate payment method
    const validPaymentMethods = ['online', 'cod']
    const lowerCasePaymentMethod = paymentMethod.toLowerCase()
    if (!validPaymentMethods.includes(lowerCasePaymentMethod)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid payment method. Must be online or cod.' 
        },
        { status: 400 }
      )
    }

    // Convert to enum values
    const enumPaymentMethod = lowerCasePaymentMethod === 'online' ? 'ONLINE' : 'COD'

    // Create or find user
    let user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          phone
        }
      })
    }

    // Create address
    const userAddress = await prisma.address.create({
      data: {
        userId: user.id,
        firstName,
        lastName,
        address,
        apartment: apartment || null,
        city,
        state,
        zipCode,
        country,
        phone
      }
    })

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        addressId: userAddress.id,
        subtotal,
        shipping,
        tax,
        total,
        paymentMethod: enumPaymentMethod,
        // If COD, mark as confirmed immediately; online payments stay pending until paid
        status: enumPaymentMethod === 'COD' ? 'CONFIRMED' : 'PENDING',
        paymentStatus: 'PENDING', // Both COD and online start as pending
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.productId || 'forbidden-flame-tee',
            quantity: item.quantity,
            size: item.size,
            price: item.price
          }))
        }
      },
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

    return NextResponse.json({
      success: true,
      order,
      message: enumPaymentMethod === 'COD' 
        ? 'COD order created successfully. Payment will be collected upon delivery.' 
        : 'Order created successfully'
    })

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            product: true
          }
        },
        user: true,
        address: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      orders
    })

  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch orders' 
      },
      { status: 500 }
    )
  }
}