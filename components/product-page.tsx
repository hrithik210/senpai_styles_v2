"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { useCart } from '@/lib/cart-context'
import SizeSelector from './ui/size-selector'
import { useRouter } from 'next/navigation'

interface ProductPageProps {
  product: {
    id: string
    name: string
    price: number
    description: string
    images: string[]
    category: string
    features: string[]
    materials: string[]
    careInstructions: string[]
  }
}

const ProductPage = ({ product }: ProductPageProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  
  const { addItem } = useCart()
  const router = useRouter()

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size before adding to cart')
      return
    }
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize
    })
    
    // Redirect to cart after adding item
    router.push('/cart')
  }

  const incrementQuantity = () => {
    if (quantity < 3) setQuantity(quantity + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-white/60">
            <li><button onClick={() => router.push('/')} className="hover:text-white transition-colors">Home</button></li>
            <li>/</li>
            <li><span className="capitalize">{product.category}</span></li>
            <li>/</li>
            <li className="text-white">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#EA2831]/20">
              <Image
                src={product.images[selectedImageIndex]}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index 
                        ? 'border-[#EA2831]' 
                        : 'border-[#EA2831]/20 hover:border-[#EA2831]/50'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <h1 className="font-orbitron text-3xl md:text-4xl font-bold tracking-wider mb-2">
                {product.name}
              </h1>
              <p className="text-[#EA2831] text-2xl md:text-3xl font-bold">
                ₹{product.price.toFixed(2)}
              </p>
              <p className="text-white/60 text-sm mt-1 capitalize">
                {product.category} • Premium Quality
              </p>
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-white/80">
                Size <span className="text-[#EA2831]">*</span>
              </label>
              <SizeSelector
                selectedSize={selectedSize}
                onSizeChange={setSelectedSize}
                variant="default"
              />
              {!selectedSize && (
                <p className="text-xs text-white/50">Please select a size</p>
              )}
            </div>

            {/* Quantity Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-white/80">Quantity</label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-[#EA2831]/30 rounded-lg">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-[#EA2831]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="px-6 py-3 font-medium">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= 3}
                    className="p-3 hover:bg-[#EA2831]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <span className="text-sm text-white/60">Max 3 per order</span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="pt-4">
              <Button
                onClick={handleAddToCart}
                className="w-full relative group bg-[#EA2831] text-white font-bold py-4 px-8 rounded-xl hover:scale-105 transition-all duration-300 overflow-hidden text-lg tracking-wide"
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01" />
                  </svg>
                  <span>Add to Cart</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#EA2831] to-[#b30000] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </div>

            {/* Product Tabs */}
            <div className="pt-8">
              {/* Tab Navigation */}
              <div className="flex border-b border-[#EA2831]/20 mb-6">
                {[
                  { id: 'description', label: 'Description' },
                  { id: 'features', label: 'Features' },
                  { id: 'materials', label: 'Materials' },
                  { id: 'care', label: 'Care Instructions' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                      activeTab === tab.id
                        ? 'text-[#EA2831] border-[#EA2831]'
                        : 'text-white/60 border-transparent hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="space-y-4">
                {activeTab === 'description' && (
                  <div>
                    <p className="text-white/80 leading-relaxed">{product.description}</p>
                  </div>
                )}

                {activeTab === 'features' && (
                  <div>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2 text-white/80">
                          <span className="text-[#EA2831] mt-1">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'materials' && (
                  <div>
                    <ul className="space-y-2">
                      {product.materials.map((material, index) => (
                        <li key={index} className="flex items-start space-x-2 text-white/80">
                          <span className="text-[#EA2831] mt-1">•</span>
                          <span>{material}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'care' && (
                  <div>
                    <ul className="space-y-2">
                      {product.careInstructions.map((instruction, index) => (
                        <li key={index} className="flex items-start space-x-2 text-white/80">
                          <span className="text-[#EA2831] mt-1">•</span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-[#EA2831]/20">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-white/60">
                  <svg className="w-4 h-4 text-[#EA2831]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center space-x-2 text-white/60">
                  <svg className="w-4 h-4 text-[#EA2831]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                  </svg>
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center space-x-2 text-white/60">
                  <svg className="w-4 h-4 text-[#EA2831]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  <span>Easy Returns</span>
                </div>
                <div className="flex items-center space-x-2 text-white/60">
                  <svg className="w-4 h-4 text-[#EA2831]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Quality Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage