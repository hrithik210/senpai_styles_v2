"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart-context'

const indianStatesAndUTs = [
  // States
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",

  // Union Territories
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];


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
    country: 'India',
    phone: '',
    sameAsShipping: true,
    billingAddress: '',
    billingApartment: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    billingCountry: 'India',
    paymentMethod: 'online'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isProcessing, setIsProcessing] = useState(false)

  // Validation functions
  const validateEmail = (email: string): string => {
    if (!email) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Please enter a valid email address'
    return ''
  }

  const validatePhone = (phone: string): string => {
    if (!phone) return 'Phone number is required'
    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(phone.replace(/[\s-()]/g, ''))) {
      return 'Please enter a valid 10-digit Indian mobile number'
    }
    return ''
  }

  const validateName = (name: string, fieldName: string): string => {
    if (!name) return `${fieldName} is required`
    if (name.length < 2) return `${fieldName} must be at least 2 characters`
    if (name.length > 50) return `${fieldName} must be less than 50 characters`
    if (!/^[a-zA-Z\s]+$/.test(name)) return `${fieldName} can only contain letters and spaces`
    return ''
  }

  const validateAddress = (address: string): string => {
    if (!address) return 'Address is required'
    if (address.length < 10) return 'Please enter a complete address'
    if (address.length > 200) return 'Address is too long'
    return ''
  }

  const validateCity = (city: string): string => {
    if (!city) return 'City is required'
    if (city.length < 2) return 'Please enter a valid city name'
    if (!/^[a-zA-Z\s]+$/.test(city)) return 'City can only contain letters and spaces'
    return ''
  }

  const validateState = (state: string): string => {
    if (!state) return 'State is required'
    if (!indianStatesAndUTs.includes(state)) return 'Please select a valid state'
    return ''
  }

  const validateZipCode = (zipCode: string): string => {
    if (!zipCode) return 'PIN code is required'
    const zipRegex = /^[1-9][0-9]{5}$/
    if (!zipRegex.test(zipCode)) return 'Please enter a valid 6-digit PIN code'
    return ''
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validate required fields
    newErrors.email = validateEmail(formData.email)
    newErrors.firstName = validateName(formData.firstName, 'First name')
    newErrors.lastName = validateName(formData.lastName, 'Last name')
    newErrors.address = validateAddress(formData.address)
    newErrors.city = validateCity(formData.city)
    newErrors.state = validateState(formData.state)
    newErrors.zipCode = validateZipCode(formData.zipCode)
    newErrors.phone = validatePhone(formData.phone)

    // Validate billing address if different from shipping
    if (!formData.sameAsShipping) {
      newErrors.billingAddress = validateAddress(formData.billingAddress)
      newErrors.billingCity = validateCity(formData.billingCity)
      newErrors.billingState = validateState(formData.billingState)
      newErrors.billingZipCode = validateZipCode(formData.billingZipCode)
    }

    // Remove empty errors
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key]
    })

    setErrors(newErrors)
    
    // Scroll to first error field
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0]
      const element = document.getElementById(firstErrorField)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.focus()
      }
    }
    
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      let processedValue = value
      
      // Format phone number - remove non-digits and limit to 10 digits
      if (name === 'phone') {
        processedValue = value.replace(/\D/g, '').slice(0, 10)
      }
      
      // Format PIN code - remove non-digits and limit to 6 digits
      if (name === 'zipCode' || name === 'billingZipCode') {
        processedValue = value.replace(/\D/g, '').slice(0, 6)
      }
      
      // Format names - remove numbers and special characters except spaces
      if (name === 'firstName' || name === 'lastName') {
        processedValue = value.replace(/[^a-zA-Z\s]/g, '')
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: processedValue
      }))
      
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form before submission
    if (!validateForm()) {
      return
    }
    
    setIsProcessing(true)
    
    try {
      // Prepare order data
      const orderData = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        apartment: formData.apartment,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        phone: formData.phone,
        items: cartItems,
        subtotal: subtotal,
        shipping: shipping,
        tax: 0,
        total: total,
        paymentMethod: formData.paymentMethod
      }

      // Submit order to API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (result.success) {
        if (formData.paymentMethod === 'cod') {
          // For COD orders, show success message and redirect
          alert(`Order placed successfully! Order ID: ${result.order.id}\n\nYour order will be delivered with Cash on Delivery option. Please keep exact change ready.`)
          window.location.href = '/payment/success'
        } else if (formData.paymentMethod === 'online') {
          // For online payments, create Cashfree payment session
          try {
            const cashfreeResponse = await fetch('/api/cashfree/create-session', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ orderId: result.order.id }),
            })

            const cashfreeResult = await cashfreeResponse.json()

            if (cashfreeResult.success) {
              // Load Cashfree checkout and redirect to payment
              const script = document.createElement('script')
              script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js'
              script.onload = () => {
                // Initialize Cashfree Checkout
                const cashfree = (window as any).Cashfree({
                  mode: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
                })

                const checkoutOptions = {
                  paymentSessionId: cashfreeResult.payment_session_id,
                  returnUrl: `${window.location.origin}/payment/success?order_id=${result.order.id}`,
                }

                cashfree.checkout(checkoutOptions).then((checkoutResult: any) => {
                  if (checkoutResult.error) {
                    console.error('Payment failed:', checkoutResult.error)
                    alert('Payment failed. Please try again.')
                  }
                })
              }
              document.head.appendChild(script)
            } else {
              throw new Error(cashfreeResult.error || 'Failed to create payment session')
            }
          } catch (cashfreeError) {
            console.error('Cashfree integration error:', cashfreeError)
            alert('Failed to initialize payment. Please try again.')
          }
        }
      } else {
        throw new Error(result.error || 'Failed to create order')
      }
    } catch (error) {
      console.error('Order submission error:', error)
      alert('Failed to process order. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const subtotal = getSubtotal()
  const shipping = 49
  const total = subtotal

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
              {/* Form Validation Summary */}
              {Object.keys(errors).length > 0 && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center space-x-2 text-red-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm font-medium">Please fill these missing fields:</p>
                  </div>
                  <ul className="mt-2 text-xs text-red-300 space-y-1">
                    {Object.entries(errors).map(([field, error]) => (
                      <li key={field}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
              
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
                    className={`w-full px-3 py-2 bg-black border rounded-lg focus:outline-none transition-colors text-sm ${
                      errors.email 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-[#EA2831]/30 focus:border-[#EA2831]'
                    }`}
                    placeholder="your.email@example.com"
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
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
                      className={`w-full px-3 py-2 bg-black border rounded-lg focus:outline-none transition-colors text-sm ${
                        errors.firstName 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-[#EA2831]/30 focus:border-[#EA2831]'
                      }`}
                      required
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                    )}
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
                      className={`w-full px-3 py-2 bg-black border rounded-lg focus:outline-none transition-colors text-sm ${
                        errors.lastName 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-[#EA2831]/30 focus:border-[#EA2831]'
                      }`}
                      required
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                    )}
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
                    className={`w-full px-3 py-2 bg-black border rounded-lg focus:outline-none transition-colors text-sm ${
                      errors.address 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-[#EA2831]/30 focus:border-[#EA2831]'
                    }`}
                    placeholder="123 Main Street"
                    required
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                  )}
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
                      className={`w-full px-3 py-2 bg-black border rounded-lg focus:outline-none transition-colors text-sm ${
                        errors.city 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-[#EA2831]/30 focus:border-[#EA2831]'
                      }`}
                      required
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                    )}
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
                      className={`w-full px-3 py-2 bg-black border rounded-lg focus:outline-none transition-colors text-sm ${
                        errors.state 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-[#EA2831]/30 focus:border-[#EA2831]'
                      }`}
                      required
                    >
                      <option value="" disabled>Select State</option>
                      {indianStatesAndUTs.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium mb-1">
                      PIN Code <span className="text-[#EA2831]">*</span>
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-black border rounded-lg focus:outline-none transition-colors text-sm ${
                        errors.zipCode 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-[#EA2831]/30 focus:border-[#EA2831]'
                      }`}
                      placeholder="110001"
                      maxLength={6}
                      required
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">
                    Phone Number <span className="text-[#EA2831]">*</span>
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
                      className={`flex-1 px-3 py-2 bg-black border border-r-0 focus:outline-none transition-colors text-sm ${
                        errors.phone 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-[#EA2831]/30 focus:border-[#EA2831]'
                      }`}
                      placeholder="9876543210"
                      maxLength={10}
                      required
                    />
                    <div className={`w-3 border border-l-0 rounded-r-lg ${
                      errors.phone 
                        ? 'border-red-500' 
                        : 'border-[#EA2831]/30'
                    }`}></div>
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#EA2831]/20">
              <h2 className="font-orbitron text-lg font-bold mb-4 text-[#EA2831]">Payment Method</h2>
              <div className="space-y-3">
                {/* Online Payment Option */}
                <div className={`flex items-center space-x-3 p-3 border rounded-lg transition-all ${
                  formData.paymentMethod === 'online' 
                    ? 'border-[#EA2831] bg-[#EA2831]/10' 
                    : 'border-[#EA2831]/30 bg-transparent hover:bg-[#EA2831]/5'
                }`}>
                  <input
                    type="radio"
                    id="online"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === 'online'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#EA2831] bg-black border-[#EA2831]/30 focus:ring-[#EA2831] focus:ring-2"
                  />
                  <label htmlFor="online" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">Online Payment</span>
                      <div className="flex space-x-2">
                        <span className="text-xs bg-[#EA2831] text-white px-2 py-1 rounded">
                          Secure
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-white/70 mt-1">
                      Pay instantly with credit card, debit card, UPI, or net banking
                    </p>
                  </label>
                </div>

                {/* Cash on Delivery Option */}
                <div className={`flex items-center space-x-3 p-3 border rounded-lg transition-all ${
                  formData.paymentMethod === 'cod' 
                    ? 'border-[#EA2831] bg-[#EA2831]/10' 
                    : 'border-[#EA2831]/30 bg-transparent hover:bg-[#EA2831]/5'
                }`}>
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#EA2831] bg-black border-[#EA2831]/30 focus:ring-[#EA2831] focus:ring-2"
                  />
                  <label htmlFor="cod" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">Cash on Delivery</span>
                      <div className="flex space-x-2">
                        <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                          COD
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-white/70 mt-1">
                      Pay with cash when your order is delivered to your doorstep
                    </p>
                  </label>
                </div>

                {/* COD Note */}
                {formData.paymentMethod === 'cod' && (
                  <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <svg className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div className="text-xs text-amber-300">
                        <p className="font-medium">Important COD Information:</p>
                        <ul className="mt-1 space-y-1 text-amber-200">
                          <li>• Please keep exact change ready</li>
                          <li>• COD orders are subject to verification</li>
                          <li>• Delivery may take 1-2 additional days</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
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
                      <p className="text-white/70 text-xs">Qty: {item.quantity} • Size: {item.size}</p>
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