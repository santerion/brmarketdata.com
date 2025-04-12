import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { getPublicPath } from "@/lib/path-utils"

export function Hero() {
  return (
    <div className="relative w-full min-h-[calc(100vh-44px)] flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={getPublicPath("/bg_violet.png")}
          alt="Blue skies background"
          fill
          priority
          className="object-cover"
        />
        {/* Lighter overlay for better text readability - reduced from 40% to 5% */}
        <div className="absolute inset-0 bg-violet-900/20 backdrop-brightness-150 backdrop-saturate-90" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto text-white">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-12 drop-shadow-md mt-[-120]">
          We develop software for you
        </h1>
        <p className="text-xl md:text-3xl text-gray-200 mb-8 max-w-lg drop-shadow-md">
          You tell us what you want and we deliver on Budget and on Time
        </p>
        {/* <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/contact">
              Let's do it!
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="border-white text-black hover:bg-white/20 hover:text-white">
            <Link href="/product">
              Learn More
            </Link>
          </Button>
        </div> */}
      </div>
    </div>
  )
} 