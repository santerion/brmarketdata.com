import { Footer } from "@/components/Footer"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4"> Vamos conversar! </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Dúvidas? Sugestões? Estamos disponíveis para ajudar.
          </p>
          
          <div className="mb-12">
            {/* Use this random-like string f454ad47ab9d29e33ddef2183689cc17 to replace your naked email address in the action attribute of your form. */}
            <form className="space-y-6" action="https://formsubmit.co/f454ad47ab9d29e33ddef2183689cc17" method="POST">
              <input type="text" name="_honey" style={{ display: 'none' }} />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_subject" value="Contato no BR Market Data" />
              <input type="hidden" name="_replyto" value="" />
              <input type="hidden" name="_next" value="https://brmarketdata.com/email-enviado" />
              <input type="hidden" name="_template" value="table" />
              <div>
                <label htmlFor="name" className="block mb-2 font-medium">
                  NOME*
                </label>
                <Input id="name" name="name" required />
              </div>
              
              <div>
                <label htmlFor="email" className="block mb-2 font-medium">
                  EMAIL*
                </label>
                <Input id="email" type="email" name="_replyto" required />
              </div>
              
              <div>
                <label htmlFor="company" className="block mb-2 font-medium">
                  EMPRESA
                </label>
                <Input id="company" name="company" />
              </div>
              
              <div>
                <label htmlFor="message" className="block mb-2 font-medium">
                  MENSAGEM*
                </label>
                <Textarea 
                  id="message" 
                  name="message"
                  placeholder="Tell us about the software you want to build" 
                  className="min-h-32"
                  required
                />
              </div>
              
              <Button type="submit" size="lg" className="w-full bg-primary cursor-pointer">
                Submit
              </Button>
            </form>
          </div>
        </div>
      </main>
      
      <Footer/>
    </div>
  )
} 