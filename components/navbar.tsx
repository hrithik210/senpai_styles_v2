"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="relative w-full border-b border-gray-800/50">
      {/* Main navbar */}
      <div className="relative flex justify-between items-center px-6 py-4 lg:px-12 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <Link href={"/"} className="group">
            <span className="font-orbitron text-xl lg:text-2xl font-bold tracking-[0.15em] text-white group-hover:text-gray-300 transition-colors duration-300">
              SENPAI STYLES
            </span>
          </Link>
        </div>

        {/* Desktop Navigation - Centered */}
        <div className="hidden lg:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
          <button
            onClick={() => {
              const about = document.getElementById('about');
              if (about) {
                about.scrollIntoView({ behavior: 'smooth', block: 'start' });
              } else {
                window.location.href = '/#about';
              }
            }}
            className="group bg-transparent border-none outline-none p-0 m-0"
            style={{ background: 'none' }}
          >
            <span className="text-sm font-serif hover:text-gray-300 duration-300 cursor-pointer font-medium px-4 py-2 rounded-lg border border-transparent hover:border-gray-700 hover:bg-gray-900/50 transition-all">
              About
            </span>
          </button>
          <button
            onClick={() => {
              const contact = document.getElementById('contact');
              if (contact) {
                contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
              } else {
                window.location.href = '/#contact';
              }
            }}
            className="group bg-transparent border-none outline-none p-0 m-0"
            style={{ background: 'none' }}
          >
            <span className="text-sm font-serif hover:text-gray-300 duration-300 cursor-pointer font-medium px-4 py-2 rounded-lg border border-transparent hover:border-gray-700 hover:bg-gray-900/50 transition-all">
              Contact
            </span>
          </button>
        </div>

        {/* Desktop Icons & Mobile Menu Button */}
        <div className="flex items-center">
          {/* Desktop Icons */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="p-2 rounded-lg hover:bg-gray-900/50 transition-all duration-300 group">
              <Image
                src={"/user.svg"}
                alt="user"
                width={22}
                height={22}
                style={{ filter: "invert(1)" }}
                className="group-hover:scale-110 transition-transform duration-300 cursor-pointer"
              />
            </div>
            <Link href="/cart" className="p-2 rounded-lg hover:bg-gray-900/50 transition-all duration-300 group relative">
              <Image
                src={"/shopping-bag.png"}
                alt="shopping cart"
                width={22}
                height={22}
                style={{ filter: "invert(1)" }}
                className="group-hover:scale-110 transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="lg:hidden flex flex-col justify-center items-center w-6 h-6 space-y-1 p-2 rounded-lg hover:bg-gray-900/50 transition-all duration-300"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span
              className={`w-5 h-0.5 bg-white transition-all duration-300 ${
                isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            />
            <span
              className={`w-5 h-0.5 bg-white transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`w-5 h-0.5 bg-white transition-all duration-300 ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-sm border-t border-gray-800/50 transition-all duration-300 ease-in-out z-50 ${
          isMobileMenuOpen
            ? "opacity-100 visible transform translate-y-0"
            : "opacity-0 invisible transform -translate-y-2"
        }`}
      >
        <div className="flex flex-col px-6 py-6 space-y-4 max-w-7xl mx-auto">
          {/* Mobile Navigation Links */}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setTimeout(() => {
                const about = document.getElementById('about');
                if (about) {
                  about.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                  window.location.href = '/#about';
                }
              }, 100);
            }}
            className="group bg-transparent border-none outline-none p-0 m-0 w-full text-left"
            style={{ background: 'none' }}
          >
            <span className="block text-sm font-serif hover:text-gray-300 duration-300 cursor-pointer font-medium px-4 py-3 rounded-lg border border-transparent hover:border-gray-700 hover:bg-gray-900/50 transition-all">
              About
            </span>
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setTimeout(() => {
                const contact = document.getElementById('contact');
                if (contact) {
                  contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                  window.location.href = '/#contact';
                }
              }, 100);
            }}
            className="group bg-transparent border-none outline-none p-0 m-0 w-full text-left"
            style={{ background: 'none' }}
          >
            <span className="block text-sm font-serif hover:text-gray-300 duration-300 cursor-pointer font-medium px-4 py-3 rounded-lg border border-transparent hover:border-gray-700 hover:bg-gray-900/50 transition-all">
              Contact
            </span>
          </button>
          
          {/* Mobile Icons */}
          <div className="flex items-center gap-6 px-4 py-3 border-t border-gray-800/50 mt-4 pt-6">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-900/50 transition-all duration-300 cursor-pointer">
              <Image
                src={"/user.svg"}
                alt="user"
                width={20}
                height={20}
                style={{ filter: "invert(1)" }}
                className="hover:scale-110 transition-transform duration-300"
              />
              <span className="text-sm font-serif font-medium">Account</span>
            </div>
            <Link href="/cart" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-900/50 transition-all duration-300" onClick={() => setIsMobileMenuOpen(false)}>
              <Image
                src={"/shopping-bag.png"}
                alt="shopping cart"
                width={20}
                height={20}
                style={{ filter: "invert(1)" }}
                className="hover:scale-110 transition-transform duration-300"
              />
              <span className="text-sm font-serif font-medium">Cart</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
