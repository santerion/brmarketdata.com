'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getPublicPath } from "@/lib/path-utils";

export default function NotFound() {
  const router = useRouter();
  
  useEffect(() => {
    // On GitHub Pages, the 404.html page is served for all missing routes
    // This script handles redirects to the correct route
    const pathname = window.location.pathname;
    const basePath = '/website'; // Your repository name
    
    // If current path starts with the base path, redirect to the path without it
    if (pathname.startsWith(basePath) && pathname !== basePath && pathname !== basePath + '/') {
      const newPath = pathname.slice(basePath.length);
      window.location.href = newPath; // Using window.location since router.replace doesn't work with external paths
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <Image 
            src={getPublicPath('/icon_violet.avif')}
            alt="Santerion Logo"
            width={80}
            height={80}
            className="mx-auto mb-6"
          />
          
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-violet-700 to-violet-950 bg-clip-text text-transparent">
            404
          </h1>
          
          <h2 className="text-3xl font-bold mb-4 text-violet-950">
            Page Not Found
          </h2>
          
          <p className="text-lg mb-8 text-muted-foreground">
            The page you are looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => router.push('/')}
              size="lg"
              className="bg-violet-800 hover:bg-violet-900"
            >
              Go to Homepage
            </Button>
            
            <Button 
              onClick={() => router.push('/contact')}
              variant="outline"
              size="lg"
              className="border-violet-800 text-violet-800 hover:bg-violet-50"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 