"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart-context'

const CheckoutPage = () => {
  const { items: cartItems, getSubtotal } = useCart()
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
    sameAsShipping: true,
    billingAddress: '',
    billingApartment: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    billingCountry: 'United States',
    paymentMethod: 'razorpay'
  })

  const [isProcessing, setIsProcessing] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false)
      alert('Order processing... This is a demo checkout!')
    }, 2000)
  }

  const subtotal = getSubtotal()
  const shipping = 49
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="font-orbitron text-2xl md:text-3xl lg:text-4xl font-bold tracking-wider">
            Checkout
          </h1>
          <p className="text-white/70 mt-1">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Checkout Form (spans 2 columns on lg) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#EA2831]/20">
              <h2 className="font-orbitron text-lg font-bold mb-4 text-[#EA2831]">Contact Information</h2>
              <div className="space-y-3">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email Address <span className="text-[#EA2831]">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-black border border-[#EA2831]/30 rounded-lg focus:border-[#EA2831] focus:outline-none transition-colors text-sm"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#EA2831]/20">
              <h2 className="font-orbitron text-lg font-bold mb-4 text-[#EA2831]">Shipping Address</h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                      First Name <span className="text-[#EA2831]">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-black border border-[#EA2831]/30 rounded-lg focus:border-[#EA2831] focus:outline-none transition-colors text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                      Last Name <span className="text-[#EA2831]">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-black border border-[#EA2831]/30 rounded-lg focus:border-[#EA2831] focus:outline-none transition-colors text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-1">
                    Address <span className="text-[#EA2831]">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-black border border-[#EA2831]/30 rounded-lg focus:border-[#EA2831] focus:outline-none transition-colors text-sm"
                    placeholder="123 Main Street"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="apartment" className="block text-sm font-medium mb-1">
                    Apartment, Suite, etc.
                  </label>
                  <input
                    type="text"
                    id="apartment"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-black border border-[#EA2831]/30 rounded-lg focus:border-[#EA2831] focus:outline-none transition-colors text-sm"
                    placeholder="Optional"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium mb-1">
                      City <span className="text-[#EA2831]">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-black border border-[#EA2831]/30 rounded-lg focus:border-[#EA2831] focus:outline-none transition-colors text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium mb-1">
                      State <span className="text-[#EA2831]">*</span>
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-black border border-[#EA2831]/30 rounded-lg focus:border-[#EA2831] focus:outline-none transition-colors text-sm"
                      required
                    >
                      <option value="">Select State</option>
                      <option value="CA">California</option>
                      <option value="NY">New York</option>
                      <option value="TX">Texas</option>
                      <option value="FL">Florida</option>
                      {/* Add more states as needed */}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium mb-1">
                      ZIP Code <span className="text-[#EA2831]">*</span>
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-black border border-[#EA2831]/30 rounded-lg focus:border-[#EA2831] focus:outline-none transition-colors text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">
                    Phone Number
                  </label>
                  <div className="flex">
                    <span className="px-3 py-2 bg-[#1a1a1a] border border-[#EA2831]/30 border-r-0 rounded-l-lg flex items-center text-white/70 text-sm">
                      +91
                    </span>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="flex-1 px-3 py-2 bg-black border border-[#EA2831]/30 rounded-r-lg focus:border-[#EA2831] focus:outline-none transition-colors text-sm"
                      placeholder="9876543210"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#EA2831]/20">
              <h2 className="font-orbitron text-lg font-bold mb-4 text-[#EA2831]">Payment Method</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border border-[#EA2831]/30 rounded-lg bg-[#EA2831]/10">
                  <input
                    type="radio"
                    id="razorpay"
                    name="paymentMethod"
                    value="razorpay"
                    checked={formData.paymentMethod === 'razorpay'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#EA2831] bg-black border-[#EA2831]/30 focus:ring-[#EA2831] focus:ring-2"
                  />
                  <label htmlFor="razorpay" className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">Razorpay</span>
                      <div className="flex space-x-2">
                        <span className="text-xs bg-[#EA2831] text-white px-2 py-1 rounded">
                          Secure
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-white/70 mt-1">
                      Pay securely with credit card, debit card, or UPI
                    </p>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#EA2831]/20">
              <h2 className="font-orbitron text-lg font-bold mb-4 text-[#EA2831]">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="relative">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="rounded-lg object-cover"
                      />
                      <span className="absolute -top-2 -right-2 bg-[#EA2831] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-xs">{item.name}</h3>
                      <p className="text-white/70 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="border-t border-[#EA2831]/20 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Shipping</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-[#EA2831]/20">
                  <span>Total</span>
                  <span className="text-[#EA2831]">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Complete Order Button */}
              <div className="mt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="w-full relative group bg-[#EA2831] text-white font-bold py-4 px-6 rounded-xl hover:scale-105 transition-all duration-300 overflow-hidden text-base tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10">
                    {isProcessing ? 'Processing...' : `Complete Order - ₹${total.toFixed(2)}`}
                  </span>
                  {isProcessing && (
                    <div className="absolute inset-0 bg-[#EA2831]/80 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </div>
                  )}
                </Button>
                <p className="text-xs text-white/60 text-center mt-2">
                  By completing your order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-3 bg-[#1a1a1a] p-3 rounded-lg border border-[#EA2831]/20">
              <div className="flex items-center justify-center space-x-2 text-xs text-white/70">
                <svg className="w-3 h-3 text-[#EA2831]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Secure 256-bit SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage