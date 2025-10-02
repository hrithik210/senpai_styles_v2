"use client"
import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'

const Cart = () => {
  const { items, updateQuantity, getSubtotal } = useCart()
  
  return (
    <div className='flex flex-col justify-center items-center p-4 md:p-8 min-h-screen overflow-x-hidden'>
        <div className='mb-6 md:mb-10 w-full'>
         <h1 className="font-orbitron text-2xl md:text-4xl lg:text-5xl font-bold tracking-wider text-center px-4">Your Cart</h1>
        </div>
        
        {/* Cart Items */}
        {items.map((item) => (
          <div key={item.id} className='relative flex flex-col p-3 md:p-6 bg-[#1a1a1a] rounded-lg border border-[#EA2831]/20 w-full max-w-4xl mt-4 md:mt-8 gap-3 md:gap-4 mx-4'>
            {/* Mobile Layout: Stack vertically */}
            <div className='block md:hidden'>
              {/* Product Info Section */}
              <div className='flex items-start space-x-3 mb-3'>
                <Image
                    alt={item.name}
                    className="w-20 h-20 rounded-md object-cover flex-shrink-0"
                    src={item.image}
                    width={80}
                    height={80}
                />
                <div className='min-w-0 flex-1'>
                    <h2 className="font-bold text-base leading-tight mb-1">{item.name}</h2>
                    <p className="text-[#ffffff]/70 text-sm">₹{item.price}</p>
                    <p className="text-[#EA2831] text-xs font-medium">Size: {item.size}</p>
                </div>
              </div>
              
              {/* Quantity Controls - Full width on mobile */}
              <div className='flex items-center justify-center space-x-4 py-2'>
                <button
                  className="p-2 rounded-full bg-[#b30000] hover:bg-[#EA2831] transition-colors flex items-center justify-center"
                  aria-label="Remove item"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
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
                <span className="w-12 text-center text-base font-medium">{item.quantity}</span>
                <button
                    className="p-2 rounded-full bg-[#b30000] hover:bg-[#EA2831] transition-colors flex items-center justify-center"
                    aria-label="Add item"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= 3}
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

            {/* Desktop Layout: Original horizontal layout */}
            <div className='hidden md:flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                  <Image
                      alt={item.name}
                      className="w-20 h-20 rounded-md object-cover flex-shrink-0"
                      src={item.image}
                      width={80}
                      height={80}
                  />
                  <div className='min-w-0 flex-1'>
                      <h2 className="font-bold text-lg truncate">{item.name}</h2>
                      <p className="text-[#ffffff]/70 text-base">₹{item.price}</p>
                      <p className="text-[#EA2831] text-sm font-medium">Size: {item.size}</p>
                  </div>
              </div>

              <div className='flex items-center justify-center space-x-2'>
                  <button
                  className="p-2 rounded-full bg-[#b30000] hover:bg-[#EA2831] transition-colors flex items-center justify-center"
                  aria-label="Remove item"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
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
                  <span className="w-8 text-center text-base">{item.quantity}</span>
                  <button
                      className="p-2 rounded-full bg-[#b30000] hover:bg-[#EA2831] transition-colors flex items-center justify-center"
                      aria-label="Add item"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= 3}
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
        ))}

        {/* Cart Summary */}
        <div className="w-full max-w-4xl flex flex-col items-center md:items-end mt-6 md:mt-8 px-4">
            <div className="w-full md:w-auto md:min-w-[320px] pt-6 border-t border-[#EA2831]/20">
                <div className="text-center md:text-right space-y-2">
                    <p className="text-base md:text-lg text-white/80">
                      Subtotal: <span className="font-bold text-white">₹{getSubtotal().toFixed(2)}</span>
                    </p>
                    <p className="text-xs md:text-sm text-white/60">
                      Taxes and shipping calculated at checkout.
                    </p>
                </div>
            </div>

            <div className="mt-6 md:mt-8 w-full md:w-auto">
                <Link href={"/checkout"}>
                    <Button 
                    className="w-full md:w-auto relative group bg-[#EA2831] text-white font-bold py-4 md:py-8 px-6 md:px-10 rounded-xl hover:scale-105 md:hover:scale-110 transition-all duration-300 overflow-hidden text-base md:text-lg tracking-wide"
                    >
                    <span className="relative z-10">Checkout with Cashfree</span>
                    </Button>
                </Link>
            </div>
        </div>
    </div>
  )
}

export default Cart