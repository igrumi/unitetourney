"use client";
import { useState } from "react";
import NextLink from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'INICIO', href: '/' },
    { name: 'REGISTRO', href: '/registro' },
    { name: 'EQUIPOS', href: '/equipos' },
    { name: 'REGLAMENTO', href: '/reglamento' },
  ];

  return (
    <nav className="fixed top-0 w-full z-[100] bg-black border-b border-white/10 h-20">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        
        {/* LOGO - Z-110 para que siempre esté arriba */}
        <NextLink href="/" className="flex items-center gap-3 z-[110]">
          <Image 
            src="/giratina.png" 
            alt="Logo" 
            width={60} 
            height={60} 
            className="object-contain"
          />
          <span className="font-black italic text-lg tracking-tighter hidden xs:block">
            PLATINUM<span className="text-unite-blue">UNITE</span>
          </span>
        </NextLink>

        {/* NAVEGACIÓN DESKTOP (Se mantiene igual) */}
        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <NextLink
              key={link.name}
              href={link.href}
              className={`text-[10px] font-black tracking-[0.2em] hover:text-unite-blue transition-colors ${
                pathname === link.href ? 'text-unite-accent' : 'text-gray-400'
              }`}
            >
              {link.name}
            </NextLink>
          ))}
        </div>

        {/* BOTÓN HAMBURGUESA - Z-110 para que no lo tape el fondo negro */}
        <button 
          className="md:hidden text-white z-[110] p-2 bg-white/5 rounded-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* MENÚ MÓVIL - CORREGIDO */}
        <div className={`
          fixed inset-0 bg-black z-[105] flex flex-col items-center justify-center transition-all duration-300 ease-in-out
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
        `}>
          {/* Contenedor de links para asegurar que Inicio aparezca */}
          <div className="flex flex-col items-center gap-10">
            {navLinks.map((link) => (
              <NextLink
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-4xl font-black italic tracking-tighter hover:text-unite-blue transition-colors ${
                  pathname === link.href ? 'text-unite-accent' : 'text-white'
                }`}
              >
                {link.name}
              </NextLink>
            ))}
            
            <NextLink href="/registro" onClick={() => setIsOpen(false)} className="mt-4">
              <button className="bg-unite-accent text-white px-10 py-4 font-black italic shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                ÚNETE AHORA
              </button>
            </NextLink>
          </div>
        </div>

        {/* BOTÓN DESKTOP (Se oculta en móvil) */}
        <div className="hidden md:block">
          <NextLink href="/registro">
            <button className="bg-white text-black text-[10px] font-black px-5 py-2 hover:bg-unite-blue hover:text-white transition uppercase italic">
              Únete ahora
            </button>
          </NextLink>
        </div>
      </div>
    </nav>
  );
}