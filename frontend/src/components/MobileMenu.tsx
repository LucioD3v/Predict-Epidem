'use client';

import { useState } from 'react';
import { Menu, X, Home, Map, BarChart3, Settings } from 'lucide-react';
import Link from 'next/link';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Inicio', href: '/' },
    { icon: Map, label: 'Dashboard', href: '/dashboard' },
    { icon: BarChart3, label: 'Análisis', href: '#' },
    { icon: Settings, label: 'Configuración', href: '#' },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 bg-secondary hover:bg-tertiary border border-border rounded-lg text-text-secondary transition-all"
        aria-label="Menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 bg-card-bg border-b border-border shadow-xl z-50 lg:hidden">
            <nav className="p-4 space-y-2">
              {menuItems.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-hover-bg transition-colors"
                >
                  <item.icon size={20} className="text-text-secondary" />
                  <span className="text-text-primary font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
