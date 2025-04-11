import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { getPublicPath } from "@/lib/path-utils"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        
        {/* How we work section */}
        <section className="pb-28 pt-28 px-6 bg-muted/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-6xl font-bold text-center mb-12 bg-gradient-to-r from-violet-700 to-violet-950 bg-clip-text text-transparent">How we work</h2>
            <div className="flex flex-col max-w-xl mx-auto space-y-6">
              <div>
                  <h3 className="text-4xl font-bold mt-8 mb-2">01. Contact us</h3>
                  <p className="text-muted-foreground">
                    We start with your vision: What do you want to build?
                  </p>
                  <p className="text-muted-foreground">
                    Text us about the project you are building.
                  </p>
              </div>
              
              <div>
                  <h3 className="text-4xl font-bold mt-8 mb-2">02. Get a consultation</h3>
                  <p className="text-muted-foreground">
                    Our team will contact you back to discuss the details and feasibility of your project.
                  </p>
              </div>
              
              <div>
                  <h3 className="text-4xl font-bold mt-8 mb-2">03. Get a project estimation</h3>
                  <p className="text-muted-foreground">
                    Santerion's enterprise software developers will ponder the most viable tech stack and team size to present you with the total cost.
                  </p>
              </div>
              
              <div>
                  <h3 className="text-4xl font-bold mt-8 mb-2">04. Start</h3>
                  <p className="text-muted-foreground">
                    Once we agreed on terms, we start building a custom software solution for your business right away.
                  </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Understand Users Better section */}
        <section 
          className="py-40 px-6 relative overflow-hidden backdrop-brightness-50 bg-violet-800"
          style={{
            backgroundImage: `url('${getPublicPath('/bg_users.avif')}')`,
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundBlendMode: "overlay"
          }}
        >
          {/* Add a semi-transparent overlay to ensure text readability */}
          <div className="absolute inset-0"></div>
          
          <div className="max-w-2xl mx-auto items-center text-center relative z-10 text-white">
            <div className="p-8 rounded-lg">
              <h2 className="text-6xl font-bold mb-6 text-white">Make something<br />people want</h2>
              <p className="text-2xl mb-8 font-semibold text-white">
                Happy users. Fast launches. <br /> That's how we build software.
              </p>
              <Button size="lg" className="ring-2 bg-transparent border-white font-semibold hover:cursor-pointer hover:ring-3 text-white hover:bg-white/10">
                <Link href="/contact">Contact us</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* About section */}
        <section className="py-16 px-6 bg-muted/0">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-6xl font-bold bg-gradient-to-r from-violet-700 to-violet-950 bg-clip-text text-transparent pl-16 mb-28 mt-20">About</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">5+</div>
                <p className="text-gray-800 dark:text-gray-300">Years in business</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">100%</div>
                <p className="text-gray-800 dark:text-gray-300">Projects on budget and on time</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">8 months</div>
                <p className="text-gray-800 dark:text-gray-300">of avg. project life-cycle</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-28">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">Flexibility</div>
                <p className="text-gray-800 dark:text-gray-300">Scale up or ramp down the team</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">Pricing</div>
                <p className="text-gray-800 dark:text-gray-300">Min. project U$25k total</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">Team</div>
                <p className="text-gray-800 dark:text-gray-300">60% senior engineers, from startups to FAANG</p>
              </div>
            </div>

          </div>
        </section>
        
        {/* Partners section */}
        <section className="pt-28 pb-36 px-6 bg-gradient-to-br from-violet-700 to-violet-950">
          <div className="max-w-4xl mx-auto">
            {/* Partners heading and logos */}
            <div className="flex items-center mb-10">
              <h2 className="text-6xl font-bold mr-6 text-white">Partners</h2>
              <div className="h-12 border-l-2 border-white mx-6"></div> {/* Vertical bar */}
              <div className="flex flex-1 justify-around">
                {/* Partner logos using Image components */}
                <Image 
                  src={getPublicPath("/partner1_light.avif")}
                  alt="Partner 1 Logo" 
                  width={180} 
                  height={80} 
                  className="object-contain p-4 rounded"
                />
                <Image 
                  src={getPublicPath("/partner2_light.avif")}
                  alt="Partner 2 Logo" 
                  width={180} 
                  height={80}
                  className="object-contain p-4 rounded"
                />
                <Image 
                  src={getPublicPath("/partner3_light.avif")}
                  alt="Partner 3 Logo" 
                  width={180} 
                  height={80}
                  className="object-contain p-4 rounded"
                />
              </div>
            </div>
            
            {/* Horizontal line */}
            <div className="border-t-2 border-white/90 mb-10"></div>
            
            {/* Testimonial */}
            <div className="mx-auto max-w-4xl">
              {/* Name and title with vertical bar */}
              <div className="flex mb-6">
                <div className="text-xl text-white">G. Dantas</div>
                <div className="h-6 border-l-2 border-white/70 mx-6"></div> {/* Vertical bar */}
                <div className="text-gray-100 text-xl">CTO at Catalunya</div>
              </div>
              
              {/* Testimonial text */}
              <p className="text-3xl italic max-w-2xl text-white font-semibold">
                "Santerion delivered an exceptional AI solution on time and within budget. Their expertise, passion, and hands-on approach showed true commitment to our success."
              </p>
            </div>
          </div>
        </section>
        
        {/* Contact CTA section */}
        <section className="py-64 px-6 bg-muted/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-6xl font-bold mb-4 bg-gradient-to-r from-violet-700 to-violet-950 bg-clip-text text-transparent">Let's do it!</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Let's have a call and discuss your custom solution
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-violet-700 to-violet-950 hover:bg-gradient-to-r hover:from-violet-600 text-white hover:to-violet-900 shadow-md shadow-violet-300 dark:shadow-violet-600">
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer/>
    </div>
  )
}
