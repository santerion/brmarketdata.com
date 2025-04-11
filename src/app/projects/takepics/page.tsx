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
            <h1 className="text-4xl font-bold">TakePics.AI</h1>
            <p className="text-xl text-muted-foreground">
              Website that lets you create AI images of you and your friends
            </p>
          </div>

          <div className="flex justify-center">
            <Image
              src="/projects/takepics.webp"
              alt="Descrição da imagem"
              width={600}
              height={400}
              className="rounded-lg shadow-md border-1 border-gray-200"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">About the Project</h2>
            <p>
              TakePics.AI is a website/platform that lets you create your own virtual model/avatar by uploading your own photos. With this custom model, you can generate super-realistic images of yourself using a 
              variety of pre-made scenarios, costumes, and more.
            </p>
            <p>
              Powered by Replicate and the state-of-the-art Flux model, TakePics.AI delivers lifelike results, making it easy to experiment with new looks, create artistic avatars, 
              or simply generate your new profile picture.
            </p>
            <p>
              Check it out at {" "}
                <a 
                  href="https://takepics.ai" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-violet-700 hover:underline"
                  >
                    takepics.ai
                </a>              
            </p>
          </div>

          <TechnologiesSection
            technologies={["Nuxt", "Supabase", "Replicate API", "Flux"]} 
          />

          <div>
            <Button asChild variant="outline">
              <Link href="/contact" className="text-violet-700 bg-white hover:bg-violet-50 border-violet-700 border-1">
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
