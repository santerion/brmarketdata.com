import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { TechnologiesSection } from "@/components/TechnologiesSection"

export default function SmartZapProjectPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 px-6 py-16">
        <div className="mx-auto max-w-4xl space-y-8">
          <div>
            <Link href="/projects" className="text-sm text-muted-foreground hover:underline">
              ← Back to Portfolio
            </Link>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold">SmartZap</h1>
            <p className="text-xl text-muted-foreground ">
              It's like ChatGPT, but inside WhatsApp.
            </p>
          </div>

          <div className="flex justify-center">
            <Image
              src="/projects/smartzap.png"
              alt="SmartZap"
              width={600}
              height={400}
              className="rounded-lg shadow-md border-1 border-gray-200"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">About the Project</h2>
            <p>
              SmartZap is a WhatsApp bot that uses the best AI models to help you in any way directly from your WhatsApp.
            </p>
          </div>

          <TechnologiesSection
            technologies={["WhatsApp API", "OpenAI API", "Google API", "RDS database", "Stripe"]} 
          />

          <div>
          <Button variant="outline">
            <Link href="/contact">
              Discuss a similar project
            </Link>
          </Button>
          </div>
        </div>
      </main>
      
      <footer className="mt-16 border-t px-6 py-6">
        <div className="mx-auto max-w-7xl text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Santerion. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
