import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  console.log('🧪 [WEBHOOK TEST] Test endpoint hit at:', new Date().toISOString());
  
  return NextResponse.json({
    message: 'Webhook endpoint is accessible',
    timestamp: new Date().toISOString(),
    endpoint: '/api/cashfree/webhook'
  })
}

export async function POST(request: NextRequest) {
  console.log('🧪 [WEBHOOK TEST] POST test at:', new Date().toISOString());
  
  try {
    const body = await request.text()
    console.log('🧪 [WEBHOOK TEST] Body received:', body);
    
    return NextResponse.json({
      message: 'Test webhook received',
      bodyLength: body.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('🧪 [WEBHOOK TEST] Error:', error);
    return NextResponse.json({ error: 'Test failed' }, { status: 500 })
  }
}