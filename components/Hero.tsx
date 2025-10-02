import Image from "next/image";
import React from "react";
import { Spotlight } from "./ui/spotlight";
import { Button } from "./ui/button";
import Link from "next/link";
export const Hero = () => {
  return (
    <div id="hero" className="relative overflow-hidden min-h-screen text-center">
        <div className="relative max-w-6xl mx-auto z-0 inset-0">
         

          <Spotlight
            className="absolute -bottom-40 right-10 md:right-32"
            fill="white"
          />
       
            <Spotlight
              className="absolute -top-40 left-0 md:-top-20 md:left-60"
              fill="white"
            />
            <Spotlight
              className="absolute -top-40 -right-10 md:-top-20 md:-right-60"
              fill="white"
            />

             <Spotlight
            className="absolute -bottom-40 left-1/2 transform -translate-x-1/2 md:-bottom-20"
            fill="white"
          />

      
          <div>
            <Image
              src={"/product.png"}
              alt="product_image"
              width={0}
              height={0}
              sizes="90vw"
              className="w-full h-auto max-h-[70vh] object-contain rounded-lg block"
              style={{
                filter: "drop-shadow(0 20px 25px rgba(255,255,255,0.1))",
              }}
            />
          </div>
          <h1 className="font-orbitron text-4xl md:text-6xl font-bold mt-[-8] tracking-wider mb-2">
            The Forbidden Flame Tee
          </h1>
          <p className="text-lg md:text-xl mt-2 text-white/80 mb-5">
            One tee. Endless mystery.
          </p>
          <Link href={"/product"}>
            <Button 
            className="bg-red-600 hover:bg-red-500 font-sans tracking-wide text-md
             rounded-xl shadow-md hover:scale-110 transition-all duration-300 
              px-12 py-5">
              Buy Now
            </Button>
          </Link>
        </div>
    </div>
  );
};
