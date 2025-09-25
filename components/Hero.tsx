import Image from 'next/image'
import React from 'react'
import { Spotlight } from './ui/spotlight'

export const Hero = () => {
  return (
    <div className="flex items-center justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">

      
      {/* Main product showcase container */}
      <div className='flex justify-center items-center relative'>
        <div className='relative z-20 w-[80vw] max-w-[80vw] max-h-[70vh] rounded-2xl overflow-hidden'>
          {/* Primary spotlight focused on the image */}
          <Spotlight
            className="absolute -top-40 left-10 md:left-32 md:-top-20"
            fill="rgba(255,255,255,0.5)"
          />
          
          {/* Secondary spotlight for enhanced lighting */}
          <Spotlight
            className="absolute top-28 left-80 hidden md:inline"
            fill="rgba(255,255,255,0.3)"
          />
          
          {/* Image container with enhanced styling */}
          <div className='relative bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent p-[2px] rounded-2xl'>
            <div className='bg-black rounded-2xl p-8'>
              <Image
                src={"/product.png"}
                alt='product_image'
                width={0}
                height={0}
                sizes="80vw"
                className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                style={{ 
                  filter: 'drop-shadow(0 20px 25px rgba(255,255,255,0.1))',
                }}
              />
            </div>
          </div>
          
          {/* Bottom accent spotlight */}
          <Spotlight
            className="absolute -bottom-40 right-10 md:right-32"
            fill="rgba(255,255,255,0.4)"
          />
        </div>
      </div>
    </div>
  )
}