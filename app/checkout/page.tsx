"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart-context'
import toast from 'react-hot-toast'

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
  const [discountCode, setDiscountCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState<{code: string, percentage: number} | null>(null)
  const [discountError, setDiscountError] = useState('')

  // Handle discount code application
  const handleApplyDiscount = () => {
    const trimmedCode = discountCode.trim().toUpperCase()

    if (!trimmedCode) {
      setDiscountError('Please enter a discount code')
      return
    }

    if (trimmedCode === 'SS10') {
      setAppliedDiscount({ code: trimmedCode, percentage: 10 })
      setDiscountError('')
      toast.success('Discount code applied! You saved 10%', {
        id: 'discount-success'
      })
    } else {
      setDiscountError('Invalid discount code')
      setAppliedDiscount(null)
    }
  }

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null)
    setDiscountCode('')
    setDiscountError('')
  }

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
        discount: appliedDiscount ? {
          code: appliedDiscount.code,
          percentage: appliedDiscount.percentage,
          amount: discountAmount
        } : null,
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
          toast.dismiss()
          toast.success(`Order placed successfully! Order ID: ${result.order.id}`, {
            duration: 5000,
            id: 'order-success'
          })
          toast('Your order will be delivered with Cash on Delivery. Please keep exact change ready.', {
            icon: '💰',
            duration: 6000,
            id: 'cod-info'
          })
          setTimeout(() => {
            window.location.href = '/payment/success'
          }, 2000)
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
                const cashfreeMode = process.env.NEXT_PUBLIC_CASHFREE_ENV === 'PRODUCTION' ? 'production' : 'sandbox'
                const cashfree = (window as any).Cashfree({
                  mode: cashfreeMode
                })


                const checkoutOptions = {
                  paymentSessionId: cashfreeResult.payment_session_id,
                  returnUrl: `${window.location.origin}/payment/success?order_id=${result.order.id}`,
                }

                cashfree.checkout(checkoutOptions).then((checkoutResult: any) => {
                  if (checkoutResult.error) {
                    console.error('Payment failed:', checkoutResult.error)
                    toast.dismiss()
                    toast.error('Payment failed. Please try again.', {
                      id: 'payment-error'
                    })
                  }
                })
              }
              document.head.appendChild(script)
            } else {
              throw new Error(cashfreeResult.error || 'Failed to create payment session')
            }
          } catch (cashfreeError) {
            console.error('Cashfree integration error:', cashfreeError)
            toast.dismiss()
            toast.error('Failed to initialize payment. Please try again.', {
              id: 'payment-init-error'
            })
          }
        }
      } else {
        throw new Error(result.error || 'Failed to create order')
      }
    } catch (error) {
      console.error('Order submission error:', error)
      toast.dismiss()
      toast.error('Failed to process order. Please try again.', {
        id: 'order-error'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const subtotal = getSubtotal()
  const shipping = 49
  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percentage) / 100 : 0
  const total = subtotal - discountAmount

  return (
    <>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(234, 40, 49, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(234, 40, 49, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(234, 40, 49, 0.7);
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
      <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="font-orbitron text-xl sm:text-2xl md:text-3xl font-bold tracking-wider bg-gradient-to-r from-[#EA2831] to-[#FF4655] bg-clip-text text-transparent px-4">
            Secure Checkout
          </h1>
          <p className="text-white/70 mt-2 text-xs sm:text-sm px-4">Just a few steps to complete your order</p>

          {/* Progress Steps - Mobile Optimized */}
          <div className="mt-4 sm:mt-6 px-4">
            <div className="flex items-center justify-between max-w-md mx-auto">
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#EA2831] flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg shadow-[#EA2831]/50">
                  1
                </div>
                <span className="mt-2 text-[10px] sm:text-xs font-medium text-center">Info</span>
              </div>
              <div className="flex-1 h-1 bg-[#EA2831] mx-2 rounded-full"></div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#EA2831] flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg shadow-[#EA2831]/50">
                  2
                </div>
                <span className="mt-2 text-[10px] sm:text-xs font-medium text-center">Payment</span>
              </div>
              <div className="flex-1 h-1 bg-[#EA2831]/30 mx-2 rounded-full"></div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#EA2831]/30 flex items-center justify-center text-white/50 font-bold text-sm sm:text-base">
                  3
                </div>
                <span className="mt-2 text-[10px] sm:text-xs text-white/50 text-center">Done</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Checkout Form (spans 2 columns on lg) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#111111] p-4 sm:p-6 rounded-xl border border-[#EA2831]/20 shadow-lg shadow-[#EA2831]/5">
              {/* Form Validation Summary */}
              {Object.keys(errors).length > 0 && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm animate-pulse">
                  <div className="flex items-center space-x-2 text-red-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm font-semibold">Please complete the following:</p>
                  </div>
                  <ul className="mt-3 text-xs text-red-300 space-y-1.5 ml-7">
                    {Object.entries(errors).map(([field, error]) => (
                      <li key={field}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                <svg className="w-5 h-5 text-[#EA2831]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <h2 className="font-orbitron text-base sm:text-lg font-bold text-white">Contact Information</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2 text-white/90">
                    Email Address <span className="text-[#EA2831]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      inputMode="email"
                      autoComplete="email"
                      className={`w-full px-4 py-3.5 sm:py-3 bg-black/50 border-2 rounded-xl focus:outline-none transition-all duration-200 text-base sm:text-sm backdrop-blur-sm ${
                        errors.email
                          ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
                          : 'border-[#EA2831]/30 focus:border-[#EA2831] focus:ring-2 focus:ring-[#EA2831]/20'
                      }`}
                      placeholder="your.email@example.com"
                      required
                    />
                    {!errors.email && formData.email && (
                      <svg className="absolute right-3 top-3.5 w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-2 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#111111] p-4 sm:p-6 rounded-xl border border-[#EA2831]/20 shadow-lg shadow-[#EA2831]/5">
              <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                <svg className="w-5 h-5 text-[#EA2831]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <h2 className="font-orbitron text-base sm:text-lg font-bold text-white">Shipping Address</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#111111] p-4 sm:p-6 rounded-xl border border-[#EA2831]/20 shadow-lg shadow-[#EA2831]/5">
              <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                <svg className="w-5 h-5 text-[#EA2831]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
                <h2 className="font-orbitron text-base sm:text-lg font-bold text-white">Payment Method</h2>
              </div>
              <div className="space-y-4">
                {/* Online Payment Option */}
                <div className={`relative flex items-center space-x-3 sm:space-x-4 p-4 sm:p-5 border-2 rounded-xl transition-all duration-200 cursor-pointer group active:scale-[0.98] ${
                  formData.paymentMethod === 'online'
                    ? 'border-[#EA2831] bg-[#EA2831]/10 shadow-lg shadow-[#EA2831]/20'
                    : 'border-[#EA2831]/20 bg-black/30 hover:bg-[#EA2831]/5 hover:border-[#EA2831]/40'
                }`} onClick={() => handleInputChange({ target: { name: 'paymentMethod', value: 'online', type: 'radio' }} as any)}>
                  <input
                    type="radio"
                    id="online"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === 'online'}
                    onChange={handleInputChange}
                    className="w-5 h-5 sm:w-6 sm:h-6 text-[#EA2831] bg-black border-[#EA2831]/30 focus:ring-[#EA2831] focus:ring-2"
                  />
                  <label htmlFor="online" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm sm:text-base">Online Payment</span>
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs bg-green-600 text-white px-2.5 py-1 rounded-full font-semibold">
                          Secure
                        </span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-xs text-white/60 mt-1 sm:mt-1.5">
                      Pay with card, UPI, or net banking
                    </p>
                  </label>
                  {formData.paymentMethod === 'online' && (
                    <div className="absolute -top-1 -right-1 bg-[#EA2831] rounded-full p-1">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Cash on Delivery Option */}
                <div className={`relative flex items-center space-x-3 sm:space-x-4 p-4 sm:p-5 border-2 rounded-xl transition-all duration-200 cursor-pointer group active:scale-[0.98] ${
                  formData.paymentMethod === 'cod'
                    ? 'border-[#EA2831] bg-[#EA2831]/10 shadow-lg shadow-[#EA2831]/20'
                    : 'border-[#EA2831]/20 bg-black/30 hover:bg-[#EA2831]/5 hover:border-[#EA2831]/40'
                }`} onClick={() => handleInputChange({ target: { name: 'paymentMethod', value: 'cod', type: 'radio' }} as any)}>
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    className="w-5 h-5 sm:w-6 sm:h-6 text-[#EA2831] bg-black border-[#EA2831]/30 focus:ring-[#EA2831] focus:ring-2"
                  />
                  <label htmlFor="cod" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm sm:text-base">Cash on Delivery</span>
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs bg-amber-600 text-white px-2.5 py-1 rounded-full font-semibold">
                          COD
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-white/60 mt-1 sm:mt-1.5">
                      Pay cash when delivered
                    </p>
                  </label>
                  {formData.paymentMethod === 'cod' && (
                    <div className="absolute -top-1 -right-1 bg-[#EA2831] rounded-full p-1">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
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
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#111111] p-4 sm:p-6 rounded-xl border border-[#EA2831]/20 shadow-xl shadow-[#EA2831]/10 lg:sticky lg:top-6">
              <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                <svg className="w-5 h-5 text-[#EA2831]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
                <h2 className="font-orbitron text-base sm:text-lg font-bold text-white">Order Summary</h2>
              </div>
              
              {/* Cart Items */}
              <div className="space-y-3 mb-4 sm:mb-6 max-h-60 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-black/30 rounded-lg hover:bg-black/50 transition-colors">
                    <div className="relative flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover border border-[#EA2831]/20"
                      />
                      <span className="absolute -top-1.5 -right-1.5 bg-[#EA2831] text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold shadow-lg">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-xs sm:text-sm truncate">{item.name}</h3>
                      <p className="text-white/60 text-[10px] sm:text-xs mt-0.5">Size: {item.size}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-sm sm:text-base text-[#EA2831]">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Discount Code Section */}
              <div className="border-t border-[#EA2831]/20 pt-4 mb-4">
                {!appliedDiscount ? (
                  <div className="space-y-3">
                    <label className="flex items-center text-xs sm:text-sm font-semibold text-white/90">
                      <svg className="w-4 h-4 mr-1.5 sm:mr-2 text-[#EA2831]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                      </svg>
                      Have a code?
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => {
                          setDiscountCode(e.target.value.toUpperCase())
                          setDiscountError('')
                        }}
                        placeholder="Enter code"
                        className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-black/50 border-2 border-[#EA2831]/30 rounded-lg focus:border-[#EA2831] focus:ring-2 focus:ring-[#EA2831]/20 focus:outline-none transition-all text-sm sm:text-base backdrop-blur-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleApplyDiscount()
                          }
                        }}
                      />
                      <Button
                        onClick={handleApplyDiscount}
                        className="bg-[#EA2831] hover:bg-[#EA2831]/90 text-white px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold rounded-lg transition-all active:scale-95"
                      >
                        Apply
                      </Button>
                    </div>
                    {discountError && (
                      <p className="text-red-400 text-xs flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {discountError}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-500/20 p-2 rounded-full">
                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-green-400">{appliedDiscount.code} Applied!</p>
                        <p className="text-xs text-green-300/80">{appliedDiscount.percentage}% off your order</p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveDiscount}
                      className="text-red-400 hover:text-red-300 text-xs font-medium underline transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Order Totals */}
              <div className="border-t border-[#EA2831]/20 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70 font-medium">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/70 font-medium">Shipping</span>
                  <div className="text-right">
                    <span className="line-through text-white/40 text-xs mr-2">₹{shipping.toFixed(2)}</span>
                    <span className="text-green-400 font-bold">FREE</span>
                  </div>
                </div>

                {appliedDiscount && (
                  <div className="flex justify-between text-sm bg-green-500/10 -mx-2 px-2 py-2 rounded-lg">
                    <span className="text-green-400 font-semibold">Discount ({appliedDiscount.code})</span>
                    <span className="text-green-400 font-bold">-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-3 border-t-2 border-[#EA2831]/30">
                  <span className="text-white">Total</span>
                  <span className="text-[#EA2831] text-2xl">₹{total.toFixed(2)}</span>
                </div>
                {appliedDiscount && (
                  <p className="text-xs text-green-400 text-center animate-pulse">
                    🎉 You saved ₹{discountAmount.toFixed(2)}!
                  </p>
                )}
              </div>

              {/* Complete Order Button */}
              <div className="mt-4 sm:mt-6">
                <Button
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="w-full relative group bg-gradient-to-r from-[#EA2831] to-[#FF4655] text-white font-bold py-4 sm:py-5 px-6 rounded-xl hover:shadow-2xl hover:shadow-[#EA2831]/50 transition-all duration-300 overflow-hidden text-base sm:text-lg tracking-wide disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transform active:scale-[0.98]"
                >
                  {!isProcessing && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  )}
                  <span className="relative z-10 flex items-center justify-center">
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="hidden sm:inline">Complete Order - </span>
                        <span className="sm:hidden">Pay </span>
                        ₹{total.toFixed(2)}
                      </>
                    )}
                  </span>
                </Button>
                <p className="text-[10px] sm:text-xs text-white/50 text-center mt-2 sm:mt-3 px-2">
                  🔒 Secure checkout • By completing your order, you agree to our Terms
                </p>
              </div>
            </div>

            {/* Security & Trust Badges */}
            <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-3 sm:p-4 rounded-xl border border-green-500/20">
                <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-green-400 font-medium">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>SSL Encrypted</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#1a1a1a]/50 p-2 sm:p-3 rounded-lg border border-[#EA2831]/10">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 text-[#EA2831]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                  </svg>
                  <p className="text-[10px] sm:text-xs text-white/70">Free Ship</p>
                </div>
                <div className="bg-[#1a1a1a]/50 p-2 sm:p-3 rounded-lg border border-[#EA2831]/10">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 text-[#EA2831]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-[10px] sm:text-xs text-white/70">Authentic</p>
                </div>
                <div className="bg-[#1a1a1a]/50 p-2 sm:p-3 rounded-lg border border-[#EA2831]/10">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 text-[#EA2831]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                  </svg>
                  <p className="text-[10px] sm:text-xs text-white/70">24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

export default CheckoutPage