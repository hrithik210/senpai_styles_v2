"use client"
import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'

const Cart = () => {
  const { items, updateQuantity, getSubtotal } = useCart()
  
  return (
    <div className='flex flex-col justify-center items-center p-4 md:p-8'>
        <div className='mb-6 md:mb-10'>
         <h1 className="font-orbitron text-3xl md:text-4xl lg:text-5xl font-bold tracking-wider text-center">Your Cart</h1>
        </div>
        
        {/* Cart Items */}
        {items.map((item) => (
          <div key={item.id} className='relative flex flex-col md:flex-row md:items-center md:justify-between p-4 md:p-6 bg-[#1a1a1a] rounded-lg border border-[#EA2831]/20 w-full max-w-4xl mt-4 md:mt-8 gap-4 md:gap-0'>
            <div className='flex items-center space-x-3 md:space-x-4'>
                <Image
                    alt={item.name}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-md object-cover flex-shrink-0"
                    src={item.image}
                    width={80}
                    height={80}
                />
                <div className='min-w-0 flex-1'>
                    <h2 className="font-bold text-base md:text-lg truncate">{item.name}</h2>
                    <p className="text-[#ffffff]/70 text-sm md:text-base">${item.price}</p>
                </div>
            </div>

            <div className='flex items-center justify-between md:justify-end space-x-4 md:space-x-6'>
                <div className='flex items-center justify-center space-x-2'>
                    <button
                    className="p-1.5 md:p-2 rounded-full bg-[#b30000] hover:bg-[#EA2831] transition-colors flex items-center justify-center"
                    aria-label="Remove item"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3 md:w-4 md:h-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                    <span className="w-8 text-center text-sm md:text-base">{item.quantity}</span>
                    <button
                        className="p-1.5 md:p-2 rounded-full bg-[#b30000] hover:bg-[#EA2831] transition-colors flex items-center justify-center"
                        aria-label="Add item"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= 3}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3 md:w-4 md:h-4 text-white"
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
        ))}

        {/* Cart Summary - Aligned to the right */}
        <div className="w-full max-w-4xl flex flex-col items-end mt-6 md:mt-8">
            <div className="w-full md:w-auto min-w-[280px] md:min-w-[320px] pt-6 border-t border-[#EA2831]/20">
                <div className="text-right space-y-2">
                    <p className="text-base md:text-lg text-text-color/80">
                      Subtotal: <span className="font-bold text-text-color">${getSubtotal().toFixed(2)}</span>
                    </p>
                    <p className="text-xs md:text-sm text-text-color/60">
                      Taxes and shipping calculated at checkout.
                    </p>
                </div>
            </div>

            <div className="mt-6 md:mt-8 w-full md:w-auto">
                <Link href={"/checkout"}>
                    <Button 
                    className="w-full md:w-auto relative group bg-[#EA2831] text-white font-bold py-6 md:py-8 px-8 md:px-10 rounded-xl hover:scale-105 md:hover:scale-110 transition-all duration-300 overflow-hidden text-base md:text-lg tracking-wide"
                    >
                    <span className="relative z-10">Checkout with Razorpay</span>
                    </Button>
                </Link>
            </div>
        </div>
    </div>
  )
}

export default Cart