"use client"
import React from 'react'

interface OrderDetailModalProps {
  isOpen: boolean
  onClose: () => void
  onStatusUpdate?: (orderId: string, newStatus: string) => Promise<void>
  order: {
    id: string
    status: string
    total: number
    subtotal: number
    shipping: number
    tax: number
    paymentMethod: string
    paymentStatus: string
    createdAt: string
    user: {
      email: string
      firstName: string
      lastName: string
      phone?: string
    }
    address: {
      firstName: string
      lastName: string
      address: string
      apartment?: string
      city: string
      state: string
      zipCode: string
      country: string
      phone?: string
    }
    orderItems: Array<{
      id: string
      quantity: number
      size: string
      price: number
      product: {
        id: string
        name: string
        image: string
      }
    }>
  } | null
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ isOpen, onClose, onStatusUpdate, order }) => {
  if (!isOpen || !order) return null

  const handleStatusChange = async (newStatus: string) => {
    if (onStatusUpdate) {
      try {
        await onStatusUpdate(order.id, newStatus)
      } catch (error) {
        console.error('Failed to update status:', error)
      }
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#1a1a1a] border border-[#EA2831]/20 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1a1a] border-b border-[#EA2831]/20 p-6 flex justify-between items-center">
          <div>
            <h2 className="font-orbitron text-xl font-bold text-[#EA2831]">Order Details</h2>
            <p className="text-sm text-white/70">Order #{String(order.id).padStart(6, '0')}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-2"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Status & Date */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                order.status === 'CONFIRMED' ? 'bg-blue-500/20 text-blue-400' :
                order.status === 'PROCESSING' ? 'bg-purple-500/20 text-purple-400' :
                order.status === 'SHIPPED' ? 'bg-orange-500/20 text-orange-400' :
                order.status === 'DELIVERED' ? 'bg-green-500/20 text-green-400' :
                order.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {order.status}
              </span>
              
              {onStatusUpdate && (
                <div>
                  <label className="text-xs text-white/50 block mb-1">Update Status</label>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="bg-black/50 border border-[#EA2831]/20 rounded px-3 py-1 text-sm text-white focus:outline-none focus:border-[#EA2831]/50"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              )}
            </div>
            <div className="text-sm text-white/70">
              Ordered on {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/30 p-4 rounded-lg">
              <h3 className="font-medium text-[#EA2831] mb-3">Customer Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-white/70">Name:</span> {order.user.firstName} {order.user.lastName}</p>
                <p><span className="text-white/70">Email:</span> {order.user.email}</p>
                {order.user.phone && (
                  <p><span className="text-white/70">Phone:</span> +91{order.user.phone}</p>
                )}
              </div>
            </div>

            <div className="bg-black/30 p-4 rounded-lg">
              <h3 className="font-medium text-[#EA2831] mb-3">Shipping Address</h3>
              <div className="text-sm">
                <p>{order.address.firstName} {order.address.lastName}</p>
                <p>{order.address.address}</p>
                {order.address.apartment && <p>{order.address.apartment}</p>}
                <p>{order.address.city}, {order.address.state} {order.address.zipCode}</p>
                <p>{order.address.country}</p>
                {order.address.phone && <p>+91{order.address.phone}</p>}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="font-medium text-[#EA2831] mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-3 bg-[#1a1a1a] rounded-lg">
                  <div className="w-16 h-16 bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.product.name}</h4>
                    <p className="text-xs text-white/70">Size: {item.size} • Qty: {item.quantity}</p>
                    <p className="text-xs text-white/70">₹{item.price} each</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="font-medium text-[#EA2831] mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Subtotal:</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Shipping:</span>
                <span>₹{order.shipping.toFixed(2)}</span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-white/70">Tax:</span>
                  <span>₹{order.tax.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-[#EA2831]/20 pt-2 mt-2">
                <div className="flex justify-between font-bold text-base">
                  <span>Total:</span>
                  <span className="text-[#EA2831]">₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="font-medium text-[#EA2831] mb-3">Payment Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Payment Method:</span>
                <span className="capitalize">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Payment Status:</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  order.paymentStatus === 'PAID' ? 'bg-green-500/20 text-green-400' :
                  order.paymentStatus === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailModal