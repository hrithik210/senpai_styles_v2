// import { Hero } from "@/components/Hero";
import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <Hero />
      <AboutSection />
      <ContactSection />
    </div>
  )
}
