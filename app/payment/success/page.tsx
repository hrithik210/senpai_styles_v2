"use client"
import React  from 'react'
import { Button } from '@/components/ui/button'

const PaymentSuccessPage = () => {

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="font-orbitron text-2xl md:text-3xl font-bold tracking-wider mb-4 text-[#EA2831]">
          Order Placed Successfully!
        </h1>
        
        <p className="text-white/70 mb-6">
          Thank you for your order. We'll send you a confirmation email shortly with your order details.
        </p>

        {/* Order Information */}
        <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#EA2831]/20 mb-6">
          <p className="text-sm text-white/70 mb-2">What's next?</p>
          <ul className="text-sm text-white/80 space-y-2 text-left">
            <li className="flex items-start space-x-2">
              <span className="text-[#EA2831] font-bold">1.</span>
              <span>Order confirmation will be sent to your email</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[#EA2831] font-bold">2.</span>
              <span>We'll prepare your order for shipping</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[#EA2831] font-bold">3.</span>
              <span>You'll receive tracking information once shipped</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => window.location.href = '/'}
            className="w-full bg-[#EA2831] text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-all duration-300"
          >
            Continue Shopping
          </Button>
          
          <Button
            onClick={() => window.location.href = '/orders'}
            variant="outline"
            className="w-full border-[#EA2831]/50 text-[#EA2831] hover:bg-[#EA2831]/10"
          >
            View Order History
          </Button>
        </div>

        {/* Support Information */}
        <div className="mt-8 p-4 bg-black/30 rounded-lg border border-[#EA2831]/10">
          <p className="text-xs text-white/60 mb-2">Need help with your order?</p>
          <p className="text-xs text-white/70">
            Contact our support team at{' '}
            <a href="mailto:support@senpaistyles.com" className="text-[#EA2831] hover:underline">
              support@senpaistyles.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccessPage