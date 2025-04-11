"use client"

import Link from "next/link"
import Image from "next/image"
import { getPublicPath } from "@/lib/path-utils"
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  return (
    <header className="w-full py-1 px-4 md:px-20 border-b border-gray-300 dark:border-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-semibold flex items-center gap-1">
          <Image 
            src={getPublicPath('/icon_violet.avif')}
            alt="Santerion Logo"
            width={24}
            height={24}
          />
          <span className="text-lg font-bold text-violet-950 dark:text-violet-200">Santerion</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/projects" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <span className="text-md font-semibold text-violet-950 dark:text-violet-200">Portfolio</span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              {/* <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <span className="text-md font-semibold text-violet-950 dark:text-violet-200">About</span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link href="/partners" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <span className="text-md font-semibold text-violet-950 dark:text-violet-200">Partners</span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem> */}
              
              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <span className="text-md font-semibold text-violet-950 dark:text-violet-200">Contact us</span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  )
} 