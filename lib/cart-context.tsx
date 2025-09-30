"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  size: string
}

interface CartContextType {
  items: CartItem[]
  updateQuantity: (id: number, quantity: number) => void
  updateSize: (id: number, size: string) => void
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: number) => void
  getTotalItems: () => number
  getSubtotal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "The Forbidden Flame Tee",
      price: 899,
      quantity: 1,
      image: "/product.png",
      size: "M"
    }
  ])

  const updateQuantity = (id: number, quantity: number) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter(item => item.quantity > 0)
    )
  }

  const updateSize = (id: number, size: string) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, size } : item
      )
    )
  }

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.id === newItem.id)
      if (existingItem) {
        return prev.map(item =>
          item.id === newItem.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prev, { ...newItem, quantity: 1 }]
      }
    })
  }

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  return (
    <CartContext.Provider value={{
      items,
      updateQuantity,
      updateSize,
      addItem,
      removeItem,
      getTotalItems,
      getSubtotal
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}