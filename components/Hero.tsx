import Image from "next/image";
import React from "react";
import { GridBeams } from "./ui/grid-beams";
import { Spotlight } from "./ui/spotlight";
import { Button } from "./ui/button";
export const Hero = () => {
  return (
    <div className="relative overflow-hidden min-h-screen text-center">
      <GridBeams>
        <div className="relative max-w-6xl mx-auto">
          <Spotlight
            className="absolute -top-40 -left-10 md:left-32 md:-top-20"
            fill="white"
          />

          <Spotlight
            className="absolute -bottom-40 right-10 md:right-32"
            fill="white"
          />
          <Spotlight
            className="absolute top-20 left-1/2 transform -translate-x-1/2"
            fill="white"
          />
          <div>
            <Image
              src={"/product.png"}
              alt="product_image"
              width={0}
              height={0}
              sizes="80vw"
              className="w-full h-auto max-h-[60vh] object-contain rounded-lg block"
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
          <Button className="bg-red-700 rounded-lg">Buy Now</Button>
        </div>
      </GridBeams>
    </div>
  );
};
