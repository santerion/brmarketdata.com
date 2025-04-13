import React from 'react';
import Link from 'next/link';

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
  return (
    <div className={`${className} w-64 flex-shrink-0 border-r border-border`}>
      <div className="p-4 sticky top-20">
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
  );
} 