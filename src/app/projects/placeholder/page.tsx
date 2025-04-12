import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export default function PlaceholderProjectPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/projects" className="text-sm text-muted-foreground hover:underline">
              ← Back to Portfolio
            </Link>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">Project Placeholder</h1>
          <p className="text-xl text-muted-foreground mb-8">
            A sample project to demonstrate the projects structure.
          </p>
          
          <div className="mb-12 bg-muted h-[300px] rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Project Image Placeholder</p>
          </div>
          
          <h2 className="text-2xl font-semibold mb-4">About the Project</h2>
          <p className="mb-6">
            This is a placeholder for project details. When you create real projects, you can add detailed information about each project here, including the challenge, solution, technologies used, and results.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Technologies Used</h2>
          <div className="flex flex-wrap gap-2 mb-8">
            <Card className="inline-block">
              <CardContent className="py-2 px-4 text-sm">React</CardContent>
            </Card>
            <Card className="inline-block">
              <CardContent className="py-2 px-4 text-sm">Next.js</CardContent>
            </Card>
            <Card className="inline-block">
              <CardContent className="py-2 px-4 text-sm">Shadcn UI</CardContent>
            </Card>
          </div>
          
          <Button asChild variant="outline">
            <Link href="/contact">
              Discuss a Similar Project
            </Link>
          </Button>
        </div>
      </main>
      
      <footer className="py-6 px-6 border-t mt-16">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} BR Market Data. All rights reserved.
        </div>
      </footer>
    </div>
  )
} 