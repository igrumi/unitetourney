"use client";
import { useState } from "react";
import { X, Users, Globe, Trophy } from "lucide-react"; // Iconos profesionales

const EQUIPOS_DUMMY = [
  {
    id: "1",
    nombre: "Dignitas",
    capitan: "Otter",
    logo: "/dignitas.png",
    nacionalidad: "USA",
    jugadores: [
      { username: "Inder", id: "U-123", rol: "Titular" },
      { username: "Otter", id: "U-456", rol: "Capitán" },
      { username: "ToonGotW", id: "U-789", rol: "Titular" },
      { username: "Zelot", id: "U-101", rol: "Titular" },
      { username: "Zugrug", id: "U-202", rol: "Titular" },
      { username: "Kidtanz", id: "U-202", rol: "Suplente" }
    ]
  },
  {
    id: "2",
    nombre: "T1",
    capitan: "Pisterio",
    logo: "/t1.png",
    nacionalidad: "Corea del Sur",
    jugadores: [
      { username: "Comi", id: "D-999", rol: "Titular" },
      { username: "ePe", id: "D-888", rol: "Titular" },
      { username: "Mule", id: "D-888", rol: "Titular" },
      { username: "Pisterio", id: "D-888", rol: "Capitán" },
      { username: "Seram", id: "D-888", rol: "Titular" }
    ]
  },
  {
    id: "3",
    nombre: "Cristalitos",
    capitan: "無慈悲な",
    logo: "/cristalitos.jpg",
    nacionalidad: "Chile",
    jugadores: [
      { username: "無慈悲な", id: "D-999", rol: "Capitán" },
      { username: "SkySaiyan", id: "D-888", rol: "Titular" },
      { username: "임나니", id: "D-888", rol: "Titular" },
      { username: "Kalm+", id: "D-888", rol: "Titular" },
      { username: "BOOGUL", id: "D-888", rol: "Titular" }
    ]
  }
];

export default function Equipos() {
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<typeof EQUIPOS_DUMMY[0] | null>(null);

  return (
    <div className="min-h-screen px-6 max-w-7xl mx-auto mb-20">
      <header className="mb-12">
        <h2 className="text-4xl font-black italic tracking-tighter uppercase">Equipos Inscritos</h2>
        <p className="text-gray-500 text-sm tracking-widest uppercase mt-2">Temporada 5 • Roster Oficial</p>
      </header>

      {/* GRID DE EQUIPOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {EQUIPOS_DUMMY.map((equipo) => (
          <div 
            key={equipo.id} 
            className="bg-unite-dark border border-white/10 p-6 rounded-sm hover:border-unite-blue/50 transition-all group cursor-pointer relative overflow-hidden"
            onClick={() => setEquipoSeleccionado(equipo)}
          >
            <div className="flex items-center gap-4 relative z-10">
              {/* Contenedor de Logo optimizado */}
              <div className="w-20 h-20 bg-black/50 border border-white/5 rounded-md p-2 flex items-center justify-center">
                <img 
                  src={equipo.logo} 
                  alt={equipo.nombre} 
                  className="max-w-full max-h-full object-contain" // Contain para no cortar el logo
                />
              </div>
              <div>
                <h3 className="text-xl font-black italic text-white group-hover:text-unite-blue transition-colors">
                  {equipo.nombre}
                </h3>
                <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase flex items-center gap-1">
                  <Users size={10} /> Capitán: <span className="text-gray-300">{equipo.capitan}</span>
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center border-t border-white/5 pt-4 relative z-10">
              <span className="text-[10px] text-unite-accent font-bold uppercase flex items-center gap-1">
                <Globe size={10} /> {equipo.nacionalidad}
              </span>
              <span className="text-[10px] text-gray-600 uppercase italic font-bold">Detalles +</span>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE DETALLES REFINADO */}
      {equipoSeleccionado && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className="bg-unite-dark border border-white/10 w-full max-w-2xl rounded-sm relative shadow-2xl overflow-hidden">
            
            {/* Botón Cerrar Estilizado */}
            <button 
              onClick={() => setEquipoSeleccionado(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all z-20"
            >
              <X size={24} />
            </button>

            {/* Header del Modal */}
            <div className="relative p-8 border-b border-white/10 bg-linear-to-r from-unite-blue/10 to-transparent">
              <div className="flex items-center gap-8">
                <div className="w-28 h-28 bg-black/60 p-4 border border-white/10 rounded-sm flex items-center justify-center">
                  <img src={equipoSeleccionado.logo} className="max-w-full max-h-full object-contain" />
                </div>
                <div>
                  <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white">
                    {equipoSeleccionado.nombre}
                  </h2>
                  <div className="flex gap-4 mt-2">
                    <p className="text-xs font-bold text-unite-blue uppercase tracking-widest">{equipoSeleccionado.nacionalidad}</p>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Capitán: {equipoSeleccionado.capitan}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cuerpo del Modal */}
            <div className="p-8">
              <div className="flex items-center gap-2 mb-6">
                <Trophy size={16} className="text-unite-accent" />
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Roster Oficial</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipoSeleccionado.jugadores.map((jugador, i) => (
                  <div 
                    key={i} 
                    className={`p-4 flex justify-between items-center border ${
                      jugador.rol === 'Capitán' ? 'border-unite-accent/50 bg-unite-accent/5' : 'border-white/5 bg-black/20'
                    }`}
                  >
                    <div>
                      <p className="font-black italic text-base tracking-tight">{jugador.username.toUpperCase()}</p>
                      <p className="text-[10px] text-gray-600 font-mono">ID: {jugador.id}</p>
                    </div>
                    <span className={`text-[9px] px-3 py-1 font-black uppercase tracking-tighter ${
                      jugador.rol === 'Capitán' ? 'bg-unite-accent text-white' : 'bg-white/10 text-gray-400'
                    }`}>
                      {jugador.rol}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}