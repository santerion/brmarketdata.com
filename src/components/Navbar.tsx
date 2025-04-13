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
            src={getPublicPath('/icon_center.png')}
            alt="BR Market Data Logo"
            width={32}
            height={32}
          />
          <span className="text-lg font-bold ml-1">BR Market Data</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/#preco" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <span className="text-md font-semibold">Preço</span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link href="/docs" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <span className="text-md font-semibold">Docs</span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/contato" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <span className="text-md font-semibold">Contato</span>
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