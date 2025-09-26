"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import { Button } from './ui/button'

const Cart = () => {
  const [quantity, setQuantity] = useState<number>(1)
  return (
    <div className='flex flex-col justify-center items-center p-8'>
        <div className='mb-10'>
         <h1 className="font-orbitron text-4xl md:text-5xl font-bold tracking-wider">Your Cart</h1>
        </div>
        <div className='relative flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg border border-[#EA2831]/20 w-full max-w-4xl mt-8'>
            <div className='flex items-center space-x-4'>
                <Image
                    alt="Forbidden Flame Tee"
                    className="w-30 h-20 rounded-md object-cover"
                    src="/product.png"
                    width={20}
                    height={20}
                />
            <div>
                <h2 className="font-bold text-lg">The Forbidden Flame Tee</h2>
                <p className="text-[#ffffff]/70">$29.99</p>
            </div>
            </div>

            <div className='flex items-center space-x-4'>
                <div className='flex items-center justify-center space-x-2'>
                    <button
                    className="p-1 rounded-full bg-[#b30000] hover:bg-[#EA2831] transition-colors flex items-center justify-center"
                    aria-label="Remove item"
                    onClick={() => setQuantity(x => Math.max(1, x-1))}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                    <span className="w-8 text-center">{quantity}</span>
                    <button
                        className="p-1 rounded-full bg-[#b30000] hover:bg-[#EA2831] transition-colors flex items-center justify-center"
                        aria-label="Add item"
                        onClick={() => setQuantity(x => x + 1)}
                        disabled={quantity >= 3}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <line x1="12" y1="6" x2="12" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
            </div>

        </div>

        <div className="mt-8 pt-6 border-t border-[#EA2831]/20">
            <p className="text-lg text-text-color/80">
              Subtotal: <span className="font-bold text-text-color">$124.96</span>
            </p>
            <p className="text-sm text-text-color/60">
              Taxes and shipping calculated at checkout.
            </p>
        </div>

        <div className="mt-8 flex justify-end">
            <Button
              className="relative group bg-[#EA2831] text-white font-bold py-8 px-10 rounded-xl hover:scale-110 transition-all duration-300 overflow-hidden text-lg tracking-wide"
            >
              <span className="relative z-10">Checkout with Razorpay</span>
            </Button>
          </div>
    </div>
  )
}

export default Cart