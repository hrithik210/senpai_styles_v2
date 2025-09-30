"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import OrderDetailModal from '@/components/order-detail-modal'

interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  recentOrders: number
  ordersByStatus: Record<string, number>
  topProducts: Array<{
    productId: string
    _sum: { quantity: number }
    _count: { productId: number }
    product: {
      id: string
      name: string
      price: number
      image: string
    }
  }>
}

interface Order {
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
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderDetailLoading, setOrderDetailLoading] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [admin, setAdmin] = useState<{ id: string; email: string; name?: string } | null>(null)
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)
  const [updatingPaymentId, setUpdatingPaymentId] = useState<string | null>(null)

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
      })
      window.location.href = '/admin/login'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId)
    
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      const result = await response.json()
      
      if (result.success) {
        // Update the order in the local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, status: newStatus }
              : order
          )
        )
        
        // Also update the selected order if it's the same one
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null)
        }
      } else {
        console.error('Failed to update order status:', result.error)
        alert('Failed to update order status: ' + result.error)
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status. Please try again.')
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const updatePaymentStatus = async (orderId: string, newPaymentStatus: string) => {
    setUpdatingPaymentId(orderId)
    
    try {
      const response = await fetch(`/api/orders/${orderId}/payment-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ paymentStatus: newPaymentStatus })
      })

      const result = await response.json()
      
      if (result.success) {
        // Update the order in the local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, paymentStatus: newPaymentStatus, status: result.order.status }
              : order
          )
        )
        
        // Also update the selected order if it's the same one
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(prev => prev ? { 
            ...prev, 
            paymentStatus: newPaymentStatus,
            status: result.order.status 
          } : null)
        }
        
        alert(result.message)
      } else {
        console.error('Failed to update payment status:', result.error)
        alert('Failed to update payment status: ' + result.error)
      }
    } catch (error) {
      console.error('Error updating payment status:', error)
      alert('Failed to update payment status. Please try again.')
    } finally {
      setUpdatingPaymentId(null)
    }
  }

  const fetchOrderDetails = async (orderId: string) => {
    setOrderDetailLoading(true)
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      const result = await response.json()
      
      if (result.success) {
        setSelectedOrder(result.order)
        setShowOrderModal(true)
      }
    } catch (error) {
      console.error('Error fetching order details:', error)
    } finally {
      setOrderDetailLoading(false)
    }
  }

  const closeOrderModal = () => {
    setShowOrderModal(false)
    setSelectedOrder(null)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Verify admin session
        const adminResponse = await fetch('/api/admin/verify')
        const adminResult = await adminResponse.json()
        
        if (!adminResult.success) {
          window.location.href = '/admin/login'
          return
        }
        
        setAdmin(adminResult.admin)
        
        // Fetch dashboard statistics
        const statsResponse = await fetch('/api/dashboard/stats')
        const statsResult = await statsResponse.json()
        
        // Fetch recent orders
        const ordersResponse = await fetch('/api/orders')
        const ordersResult = await ordersResponse.json()
        
        if (statsResult.success) {
          setStats(statsResult.stats)
        }
        
        if (ordersResult.success) {
          setOrders(ordersResult.orders.slice(0, 10)) // Show only latest 10 orders
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#EA2831] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-orbitron text-3xl md:text-4xl lg:text-5xl font-bold tracking-wider">
                Dashboard
              </h1>
              <p className="text-white/70 mt-2">Business overview and analytics</p>
            </div>
            
            {admin && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-white/70">Welcome back,</p>
                  <p className="font-medium">{admin.name || admin.email}</p>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-[#EA2831]/50 text-[#EA2831] hover:bg-[#EA2831]/10"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#EA2831]/20">
            <h3 className="text-sm font-medium text-white/70">Total Orders</h3>
            <p className="text-2xl font-bold text-[#EA2831] mt-2">{stats?.totalOrders || 0}</p>
          </div>
          
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#EA2831]/20">
            <h3 className="text-sm font-medium text-white/70">Total Revenue</h3>
            <p className="text-2xl font-bold text-[#EA2831] mt-2">₹{stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
          </div>
          
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#EA2831]/20">
            <h3 className="text-sm font-medium text-white/70">Orders (30 days)</h3>
            <p className="text-2xl font-bold text-[#EA2831] mt-2">{stats?.recentOrders || 0}</p>
          </div>
          
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#EA2831]/20">
            <h3 className="text-sm font-medium text-white/70">Pending Orders</h3>
            <p className="text-2xl font-bold text-[#EA2831] mt-2">{stats?.ordersByStatus?.PENDING || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#EA2831]/20">
            <h2 className="font-orbitron text-xl font-bold mb-6 text-[#EA2831]">Recent Orders</h2>
            
            {orders.length === 0 ? (
              <p className="text-white/70 text-center py-8">No orders yet</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {orders.map((order) => (
                  <div 
                    key={order.id} 
                    className="flex items-center justify-between p-4 bg-black/30 rounded-lg hover:bg-black/50 transition-colors"
                  >
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => fetchOrderDetails(order.id)}
                    >
                      <p className="font-medium text-sm">#{String(order.id).padStart(6, '0')}</p>
                      <p className="text-xs text-white/70">{order.user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-white/50">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          order.paymentMethod === 'COD' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {order.paymentMethod === 'COD' ? 'COD' : 'Online'}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          order.paymentStatus === 'PAID' ? 'bg-green-500/20 text-green-300' :
                          order.paymentStatus === 'PENDING' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {order.paymentStatus}
                          {order.paymentMethod === 'ONLINE' && order.paymentStatus === 'PENDING' && (
                            <span className="ml-1 text-xs opacity-70">(Auto)</span>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="font-bold text-sm">₹{order.total.toFixed(2)}</p>
                      </div>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className={`text-xs px-2 py-1 rounded-full bg-black border-none outline-none cursor-pointer ${
                          order.status === 'PENDING' ? 'text-yellow-400' :
                          order.status === 'CONFIRMED' ? 'text-blue-400' :
                          order.status === 'PROCESSING' ? 'text-purple-400' :
                          order.status === 'SHIPPED' ? 'text-indigo-400' :
                          order.status === 'DELIVERED' ? 'text-green-400' :
                          order.status === 'CANCELLED' ? 'text-red-400' :
                          'text-gray-400'
                        }`}
                        disabled={updatingOrderId === order.id}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Products */}
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#EA2831]/20">
            <h2 className="font-orbitron text-xl font-bold mb-6 text-[#EA2831]">Top Products</h2>
            
            {!stats?.topProducts || stats.topProducts.length === 0 ? (
              <p className="text-white/70 text-center py-8">No product data yet</p>
            ) : (
              <div className="space-y-4">
                {stats.topProducts.map((item, index) => (
                  <div key={item.productId} className="flex items-center space-x-4 p-4 bg-black/30 rounded-lg">
                    <div className="w-8 h-8 bg-[#EA2831] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.product.name}</p>
                      <p className="text-xs text-white/70">₹{item.product.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{item._sum.quantity} sold</p>
                      <p className="text-xs text-white/70">{item._count.productId} orders</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Status Distribution */}
        {stats?.ordersByStatus && Object.keys(stats.ordersByStatus).length > 0 && (
          <div className="mt-8 bg-[#1a1a1a] p-6 rounded-lg border border-[#EA2831]/20">
            <h2 className="font-orbitron text-xl font-bold mb-6 text-[#EA2831]">Order Status Distribution</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(stats.ordersByStatus).map(([status, count]) => (
                <div key={status} className="text-center">
                  <p className="text-2xl font-bold text-[#EA2831]">{count}</p>
                  <p className="text-sm text-white/70 capitalize">{status.toLowerCase()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          isOpen={showOrderModal}
          onClose={closeOrderModal}
          onStatusUpdate={updateOrderStatus}
          onPaymentStatusUpdate={updatePaymentStatus}
        />
      )}
    </div>
  )
}

export default Dashboard