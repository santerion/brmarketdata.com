import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { TechnologiesSection } from "@/components/TechnologiesSection"

export default function FintzBotProjectPage() {
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
            <h1 className="text-4xl font-bold">Fintz Bot</h1>
            <p className="text-xl text-muted-foreground">
              A WhatsApp bot that is truly smart and conversational, helping you track and manage your expenses
            </p>
          </div>

          <div className="flex justify-center">
            <Image
              src="/projects/fintzbot.png"
              alt="Descrição da imagem"
              width={600}
              height={400}
              className="rounded-lg shadow-md"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">About the Project</h2>
            <p>
              Fintz Bot is a WhatsApp chatbot designed to help people record and manage their daily expenses in a practical way. 
              It aims to address the difficulty of financial organization by leveraging WhatsApp's widespread usage. The idea is that users can 
              submit details of their purchases and store them in seconds. The project includes features like listing expenses over a certain period 
              and exporting tables in Excel format.
              
              <br /><br /> Test the bot on WhatsApp clicking {" "}
                <a 
                  href="https://wa.me/message/OJWPPVDQ5ZTPD1" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-violet-800 hover:underline"
                  >
                    here
                </a>
            </p>
          </div>

          <TechnologiesSection 
            technologies={["Python", "OpenAI", "WhatsApp API"]} 
          />

          <div>
            <Button asChild variant="outline">
              <Link href="/contact">
                Discuss a Similar Project
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="mt-16 border-t px-6 py-6">
        <div className="mx-auto max-w-7xl text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} BR Market Data. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
