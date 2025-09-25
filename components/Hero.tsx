import Image from 'next/image'
import React from 'react'
import { Spotlight } from './ui/spotlight'
import { GridBeams } from './ui/grid-beams'

export const Hero = () => {
  return (
    <div className="flex items-center justify-center relative overflow-hidden p-6">
      <div className='flex justify-center items-center relative'>
        <div className='relative z-20 w-[80vw] max-w-[80vw] max-h-[70vh] rounded-2xl overflow-hidden'>
          
          <GridBeams>

          <Spotlight
            className="absolute -top-40 -left-10 md:left-32 md:-top-20"
          fill="white"
            />
          
          <Spotlight
            className="absolute -top-32 -right-10 md:right-32 md:-top-16"
          fill="white"
            />
          
     
          <Spotlight
            className="absolute -bottom-40 right-10 md:right-32"
            fill="white"
          />
          

          <Spotlight
            className="absolute top-0 right-32 md:right-48 rotate-45"
            fill="white"
          />
          

          <Spotlight
            className="absolute top-20 left-1/2 transform -translate-x-1/2"
            fill="white"
          />
   
          <div className='relative  p-[2px] rounded-2xl'>
            <div className='rounded-2xl p-8 relative'>
              <Image
                src={"/product.png"}
                alt='product_image'
                width={0}
                height={0}
                sizes="80vw"
                className="relative w-full h-auto max-h-[60vh] object-contain rounded-lg z-10"
                style={{ 
                  filter: 'drop-shadow(0 20px 25px rgba(255,255,255,0.1))',
                }}
              />
            </div>
            
          </div>
          </GridBeams>
        </div>
        

      </div>
    </div>
  )
}