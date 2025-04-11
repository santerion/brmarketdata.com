import { Navbar } from "@/components/Navbar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PortfolioPage() {
  const projects = [
    {
      id: '1',
      title: 'TakePics.AI',
      description: 'Website that lets you create AI images of you and your friends',
      link: "/projects/takepics"
    },
    {
      id: '2',
      title: 'Fintz Bot',
      description: 'A WhatsApp bot that is truly smart and conversational, helping you track and manage your expenses',
      link: "/projects/fintzbot"
    },
    {
      id: '3',
      title: 'SmartZap',
      description: 'A WhatsApp bot that uses the best AI models to help you in any way',
      link: "/projects/smartzap"
    },
    // Adicione quantos projetos quiser aqui...
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Our Portfolio</h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl">
            Explore our recent projects and see how we've helped businesses achieve their goals.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...projects].reverse().map(project => (
              <Card key={project.id} className="flex flex-col">
                <CardContent className="flex-1 pt-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground mb-4">
                    {project.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="w-full">
                    <Link href={project.link}>
                      View Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      <footer className="py-6 px-6 border-t">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Santerion. All rights reserved.
        </div>
      </footer>
    </div>
  )
} 