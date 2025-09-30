import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Cashfree webhook endpoint is active',
    timestamp: new Date().toISOString(),
    endpoint: '/api/cashfree/webhook',
    methods: ['POST'],
    description: 'This endpoint receives payment notifications from Cashfree'
  })
}

export async function POST(request: NextRequest) {
  // This is a test endpoint to simulate webhook calls
  try {
    const body = await request.json()
    
    console.log('Test webhook call received:', body)
    
    return NextResponse.json({
      success: true,
      message: 'Test webhook received successfully',
      received: body,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to process test webhook',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 })
  }
}