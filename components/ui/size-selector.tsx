"use client"
import React from 'react'

interface SizeSelectorProps {
  selectedSize: string
  onSizeChange: (size: string) => void
  availableSizes?: string[]
  className?: string
  variant?: 'default' | 'compact'
}

const SizeSelector: React.FC<SizeSelectorProps> = ({
  selectedSize,
  onSizeChange,
  availableSizes = ['S', 'M', 'L', 'XL', 'XXL'],
  className = '',
  variant = 'default'
}) => {
  const baseButtonClass = variant === 'compact'
    ? "px-2 py-1 text-xs border rounded transition-all duration-200"
    : "px-3 py-2 text-sm border rounded-lg transition-all duration-200"

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {availableSizes.map((size) => (
        <button
          key={size}
          onClick={() => onSizeChange(size)}
          className={`
            ${baseButtonClass}
            ${selectedSize === size
              ? 'bg-[#EA2831] border-[#EA2831] text-white'
              : 'bg-transparent border-[#EA2831]/30 text-white hover:border-[#EA2831] hover:bg-[#EA2831]/10'
            }
            font-medium
          `}
          aria-pressed={selectedSize === size}
        >
          {size}
        </button>
      ))}
    </div>
  )
}

export default SizeSelector