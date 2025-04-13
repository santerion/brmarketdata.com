import { Footer } from "@/components/Footer"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function EmailEnviadoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-6 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="h-24 w-24 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Mensagem Enviada com Sucesso!</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Agradecemos pelo seu contato. Nossa equipe responderá em menos de 3 dias úteis.
          </p>
          <div className="flex justify-center">
            <Link href="/">
              <Button size="lg" className="bg-primary">
                Voltar para a página inicial
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 