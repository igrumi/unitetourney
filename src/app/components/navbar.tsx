"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'INICIO', href: '/' },
    { name: 'REGISTRO', href: '/registro' },
    { name: 'EQUIPOS', href: '/equipos' }, // Por si decides crearla luego
  ];

  return (
    <nav className="fixed top-0 w-full z-[100] bg-unite-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO AREA */}
        <Link href="/" className="flex items-center gap-3 group">
          
          <Image 
            src="/giratina.png" // Ruta relativa a la carpeta public
            alt="Logo Platinum Unite"
            width={60}  // Ancho en pixeles
            height={60} // Alto en pixeles
            className="object-contain"
          />
          <div className="flex flex-col">
            <span className="font-black italic text-xl tracking-tighter leading-none">
              Asociación<span className="text-unite-blue text-sm ml-1">Platinum</span>
            </span>
            <span className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase">League</span>
          </div>
        </Link>

        {/* NAVEGACIÓN */}
        <div className="hidden md:flex gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs font-black tracking-[0.2em] transition-colors hover:text-unite-blue ${
                  isActive ? 'text-unite-accent' : 'text-gray-400'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* BOTÓN CTA RÁPIDO */}
        <div className="flex items-center">
           <Link href="/registro">
              <button className="bg-white text-black text-[10px] font-black px-4 py-2 hover:bg-unite-accent hover:text-white transition uppercase italic">
                Únete ahora
              </button>
           </Link>
        </div>
      </div>
    </nav>
  );
}