import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export function Footer() {
    return (
        <footer className="py-8 px-6 border-t bg-muted">
        <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
            <div className="text-lg font-bold mb-4 ">BR Market Data</div>
            <div className="">@brmarketdata.com</div>
            </div>
            <div>
            <div className="font-bold mb-4  text-lg">Links</div>
            <ul className="space-y-2  text-sm">
                <li><Link href="/docs" className="hover:text-foreground">Docs</Link></li>
                <li><Link href="/preco" className="hover:text-foreground">Preços</Link></li>
                <li><Link href="/contato" className="hover:text-foreground">Contato</Link></li>
                <li><Link href="/simulador" className="hover:text-foreground">Simulador de Aportes</Link></li>
                <li><Link href="/simulador-multiacoes" className="hover:text-foreground">Simulador de Aportes (multiações)</Link></li>
            </ul>
            </div>
            <div>
            <div className="text-lg font-bold mb-1 ">Theme</div>
            <ThemeToggle />
            </div>
        </div>
        <div className="text-center text-sm  pt-4 border-t">
            ©{new Date().getFullYear()} by BR Market Data.
        </div>
        </div>
        </footer>
    )
}