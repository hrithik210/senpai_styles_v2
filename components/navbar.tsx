import Image from "next/image";
import {Orbitron } from "next/font/google";

export const Navbar = () => {
  return (
    <div className="relative flex justify-between items-center text-center p-6">
      <div className="relative flex items-center">
        <span
          className="font-orbitron text-2xl font-bold tracking-wider p-4"
        >
          SENPAI STYLES
        </span>
      </div>

      <div className="relative flex items-center gap-4">
        <p className="text-sm gap-x-2 font-serif hover:text-gray-300 duration-300 cursor-pointer">About</p>
        <p className="text-sm font-serif hover:text-gray-300 duration-300 cursor-pointer">Contact</p>
      </div>

      <div className="relative flex text-center gap-4 p-4">
        <span className="gap-2 mr-2 ">
          <Image
            src={"/user.svg"}
            alt="user"
            width={20}
            height={10}
            style={{ filter: "invert(1)" }}
            className="hover:scale-110 transition-all duration-300"
          />
        </span>

        <span className="gap-2 mr-2 ">
            <Image
            src={"/shopping-bag.png"}
            alt="user"
            width={20}
            height={15}
            style={{ filter: "invert(1)" }}
            className="hover:scale-110 transition-all duration-300"
          />
        </span>
      </div>
    </div>
  );
};
