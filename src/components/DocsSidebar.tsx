"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocLink {
  id: string;
  title: string;
  href: string;
}

interface DocSection {
  title: string;
  links: DocLink[];
}

interface DocsSidebarProps {
  sections: DocSection[];
  className?: string;
}

export function DocsSidebar({ sections, className = '' }: DocsSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile toggle button - only visible on mobile */}
      <div className="lg:hidden fixed top-16 left-4 z-30">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleSidebar}
          className="bg-background border-border"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <div 
        className={`
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0
          fixed lg:static 
          top-0 left-0 
          h-full 
          w-64 lg:w-64 
          bg-background 
          z-20 
          transition-transform duration-300 ease-in-out
          lg:flex-shrink-0 
          border-r border-border
          shadow-lg lg:shadow-none
          pt-16 lg:pt-0
        `}
      >
        <div className="p-4 h-full overflow-y-auto">
          <div className="font-medium text-lg mb-4">Documentação</div>
          <nav className="space-y-6">
            {sections.map((section) => (
              <div key={section.title}>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">{section.title}</h4>
                <ul className="space-y-1">
                  {section.links.map((link) => (
                    <li key={link.id}>
                      <Link 
                        href={link.href} 
                        className="block text-sm hover:text-primary py-1.5 transition-colors"
                        onClick={closeSidebar}
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Overlay to close sidebar on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={closeSidebar}
        />
      )}
    </>
  );
} 